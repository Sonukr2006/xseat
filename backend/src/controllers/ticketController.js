const Ticket = require("../models/Ticket");
const { parseTicketText } = require("../parsers/ticketParser");
const { parseTicketOcrText } = require("../parsers/ticketOcrParser");

const addTicket = async (req, res) => {
  const payload = { ...req.body, userId: req.user._id };
  payload.travelDate = new Date(payload.travelDate);
  const ticket = await Ticket.create(payload);
  res.json(ticket);
};

const listTickets = async (req, res) => {
  const tickets = await Ticket.find({ userId: req.user._id }).sort({ travelDate: 1 }).lean();
  res.json(tickets);
};

const updateTicket = async (req, res) => {
  const updates = { ...req.body };
  if (updates.travelDate) updates.travelDate = new Date(updates.travelDate);
  const ticket = await Ticket.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    updates,
    { new: true }
  );
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
};

const deleteTicket = async (req, res) => {
  const ticket = await Ticket.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json({ status: "deleted" });
};

const parseTicket = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });
  const parsed = parseTicketText(text);
  res.json({ parsed });
};

const importTicketFromOcr = async (req, res, next) => {
  try {
    const uploadedFileUrl = req.file ? `/uploads/tickets/${req.file.filename}` : null;
    const sourceText = (req.body.rawText || "").trim() || req.file?.originalname || "";

    if (!sourceText) {
      return res.status(400).json({ error: "Provide OCR text or upload a ticket screenshot" });
    }

    const parsed = parseTicketOcrText(sourceText);
    const mergedTicket = {
      ...parsed.extracted,
      trainNumber: req.body.trainNumber || parsed.extracted.trainNumber,
      trainName: req.body.trainName || parsed.extracted.trainName,
      travelDate: req.body.travelDate || parsed.extracted.travelDate,
      sourceStation: req.body.sourceStation || parsed.extracted.sourceStation,
      destinationStation: req.body.destinationStation || parsed.extracted.destinationStation,
      coachNumber: req.body.coachNumber || parsed.extracted.coachNumber,
      seatNumber: req.body.seatNumber || parsed.extracted.seatNumber,
      seatType: req.body.seatType || parsed.extracted.seatType,
      ticketStatus: req.body.ticketStatus || parsed.extracted.ticketStatus,
      currentWaitlistPosition:
        req.body.currentWaitlistPosition !== undefined && req.body.currentWaitlistPosition !== null
          ? Number(req.body.currentWaitlistPosition)
          : parsed.extracted.currentWaitlistPosition,
      pnr: req.body.pnr || parsed.extracted.pnr,
      ocrSourceUrl: uploadedFileUrl,
    };

    const shouldSave = String(req.body.save || "").toLowerCase() === "true";
    if (!shouldSave) {
      return res.json({
        ticket: mergedTicket,
        confidence: parsed.confidence,
        parserVersion: parsed.parserVersion,
        rawText: parsed.rawText,
      });
    }

    const requiredFields = [
      "trainNumber",
      "trainName",
      "travelDate",
      "sourceStation",
      "destinationStation",
      "coachNumber",
      "seatNumber",
      "seatType",
      "ticketStatus",
    ];
    const missing = requiredFields.filter((field) => !mergedTicket[field]);
    if (missing.length) {
      return res.status(400).json({
        error: "Unable to save OCR ticket. Some required fields still need manual correction.",
        details: missing,
      });
    }

    const travelDate = new Date(mergedTicket.travelDate);
    if (Number.isNaN(travelDate.getTime())) {
      return res.status(400).json({ error: "Invalid travelDate in OCR payload" });
    }

    const payload = {
      ...mergedTicket,
      userId: req.user._id,
      travelDate,
      ocrExtraction: {
        rawText: parsed.rawText,
        confidence: parsed.confidence,
        parserVersion: parsed.parserVersion,
      },
    };
    const ticket = await Ticket.create(payload);

    res.status(201).json({
      ticket,
      confidence: parsed.confidence,
      parserVersion: parsed.parserVersion,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addTicket, listTickets, updateTicket, deleteTicket, parseTicket, importTicketFromOcr };

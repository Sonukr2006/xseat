const express = require("express");
const { auth } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const { addTicket, listTickets, updateTicket, deleteTicket, parseTicket, importTicketFromOcr } = require("../controllers/ticketController");
const { ticketSchema, ticketUpdateSchema, ticketOcrImportSchema } = require("../validators/ticketValidators");
const { ticketUpload } = require("../middlewares/upload");

const router = express.Router();

router.post("/add", auth, validate(ticketSchema), addTicket);
router.get("/list", auth, listTickets);
router.post("/import-ocr", auth, ticketUpload.single("ticketImage"), validate(ticketOcrImportSchema), importTicketFromOcr);
router.post("/ocr", auth, parseTicket);
router.patch("/:id", auth, validate(ticketUpdateSchema), updateTicket);
router.delete("/:id", auth, deleteTicket);

module.exports = router;

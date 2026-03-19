const seatTypeMap = {
  lb: "lower",
  lower: "lower",
  mb: "middle",
  middle: "middle",
  ub: "upper",
  upper: "upper",
  sl: "side_lower",
  su: "side_upper",
};

const normalizeWhitespace = (value) => value.replace(/\r/g, "\n").replace(/[ \t]+/g, " ").trim();

const parseDate = (value) => {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00.000Z`);
  }
  const match = trimmed.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (!match) return null;
  const [, dd, mm, yyyyRaw] = match;
  const yyyy = yyyyRaw.length === 2 ? `20${yyyyRaw}` : yyyyRaw;
  const iso = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}T00:00:00.000Z`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

const pick = (regex, text, index = 1) => text.match(regex)?.[index]?.trim() || null;

const parseTicketOcrText = (rawText = "") => {
  const cleanedText = normalizeWhitespace(rawText);
  const compactText = cleanedText.replace(/\n/g, " ");
  const linePick = (regex) => pick(regex, cleanedText);

  const trainNumber =
    linePick(/(?:^|\n)\s*(?:train|trn)\s*(?:no|number)?[:\-\s]+(\d{4,5})/i) ||
    pick(/\b(\d{5})\b/, compactText);
  const trainName =
    linePick(/(?:^|\n)\s*train name[:\-\s]+([^\n]{4,})/i) ||
    linePick(/(?:^|\n)\s*train[:\-\s]+([^\n]{4,})/i) ||
    pick(/train name[:\-\s]+([a-z0-9 ()/-]{4,})/i, compactText);
  const pnr = linePick(/(?:^|\n)\s*pnr[:\-\s]+(\d{10})/i) || pick(/\bpnr[:\-\s]+(\d{10})\b/i, compactText);
  const travelDateText =
    linePick(/(?:^|\n)\s*(?:date of journey|journey date|travel date|doj)[:\-\s]+([0-9\/-]{8,10})/i) ||
    pick(/\b(\d{2}[\/-]\d{2}[\/-]\d{2,4})\b/, compactText);
  const sourceStation =
    linePick(/(?:^|\n)\s*(?:from|source)[:\-\s]+([^\n]{2,})/i) || pick(/(?:from|source)[:\-\s]+([a-z ]{2,})/i, compactText);
  const destinationStation =
    linePick(/(?:^|\n)\s*(?:to|destination)[:\-\s]+([^\n]{2,})/i) ||
    pick(/(?:to|destination)[:\-\s]+([a-z ]{2,})/i, compactText);
  const coachNumber =
    linePick(/(?:^|\n)\s*(?:coach|coach no)[:\-\s]+([a-z0-9]{1,4})/i) ||
    pick(/(?:coach|coach no)[:\-\s]+([a-z0-9]{1,4})/i, compactText);
  const seatNumber =
    linePick(/(?:^|\n)\s*(?:seat|berth|seat no|berth no)[:\-\s]+([a-z0-9]{1,4})/i) ||
    pick(/(?:seat|berth|seat no|berth no)[:\-\s]+([a-z0-9]{1,4})/i, compactText);
  const seatTypeRaw =
    linePick(/(?:^|\n)\s*(?:berth|seat) type[:\-\s]+([^\n]{2,20})/i) || pick(/\b(lb|mb|ub|sl|su|lower|middle|upper)\b/i, compactText);
  const ticketStatus = pick(/\b(cnf|rac|wl)\b/i, compactText)?.toUpperCase() || null;
  const waitlistRaw = pick(/\bwl[:\-\s]*(\d{1,3})\b/i, compactText);

  const seatType = seatTypeRaw
    ? seatTypeMap[seatTypeRaw.toLowerCase().replace(/\s+/g, "_")] || seatTypeMap[seatTypeRaw.toLowerCase()] || null
    : null;
  const travelDate = travelDateText ? parseDate(travelDateText) : null;

  const extracted = {
    pnr,
    trainNumber,
    trainName,
    travelDate: travelDate ? travelDate.toISOString() : null,
    sourceStation,
    destinationStation,
    coachNumber,
    seatNumber,
    seatType,
    ticketStatus,
    currentWaitlistPosition: waitlistRaw ? Number(waitlistRaw) : null,
  };

  const populatedFieldCount = Object.values(extracted).filter((value) => value !== null && value !== "").length;
  const confidence = Number(Math.min(0.97, Math.max(0.2, populatedFieldCount / 10)).toFixed(2));

  return {
    rawText: cleanedText,
    extracted,
    confidence,
    parserVersion: "v1-regex",
  };
};

module.exports = { parseTicketOcrText };

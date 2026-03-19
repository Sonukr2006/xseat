const parseTicketText = (text = "") => {
  const lines = text.split(/\n|\r/).map((line) => line.trim());
  const data = {};
  for (const line of lines) {
    if (!data.trainNumber) {
      const match = line.match(/Train\s*No\.?\s*[:\-]?\s*(\d+)/i);
      if (match) data.trainNumber = match[1];
    }
    if (!data.trainName) {
      const match = line.match(/Train\s*Name\s*[:\-]?\s*([A-Za-z\s]+)/i);
      if (match) data.trainName = match[1].trim();
    }
    if (!data.travelDate) {
      const match = line.match(/Date\s*[:\-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i);
      if (match) data.travelDate = match[1];
    }
    if (!data.sourceStation) {
      const match = line.match(/From\s*[:\-]?\s*([A-Za-z\s]+)/i);
      if (match) data.sourceStation = match[1].trim();
    }
    if (!data.destinationStation) {
      const match = line.match(/To\s*[:\-]?\s*([A-Za-z\s]+)/i);
      if (match) data.destinationStation = match[1].trim();
    }
    if (!data.coachNumber) {
      const match = line.match(/Coach\s*[:\-]?\s*([A-Za-z0-9]+)/i);
      if (match) data.coachNumber = match[1];
    }
    if (!data.seatNumber) {
      const match = line.match(/Seat\s*[:\-]?\s*([A-Za-z0-9]+)/i);
      if (match) data.seatNumber = match[1];
    }
  }
  return data;
};

module.exports = { parseTicketText };

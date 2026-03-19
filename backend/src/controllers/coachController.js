const seatTypeForNumber = (num) => {
  const mod = ((num - 1) % 8) + 1;
  switch (mod) {
    case 1:
    case 4:
      return "LB";
    case 2:
    case 5:
      return "MB";
    case 3:
    case 6:
      return "UB";
    case 7:
      return "SL";
    case 8:
      return "SU";
    default:
      return "";
  }
};

const coachMap = async (req, res) => {
  const seatNumber = Number(req.query.seatNumber || 1);
  const coachNumber = req.query.coachNumber || "S1";
  const seats = Array.from({ length: 72 }, (_, i) => {
    const number = i + 1;
    return {
      number,
      seatType: seatTypeForNumber(number),
      isUserSeat: number === seatNumber,
    };
  });
  res.json({ coachNumber, seats });
};

module.exports = { coachMap };

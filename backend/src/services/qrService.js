const QRCode = require("qrcode");

const buildQr = async (payload) => {
  const text = typeof payload === "string" ? payload : JSON.stringify(payload);
  const dataUrl = await QRCode.toDataURL(text, { margin: 1, width: 320 });
  return { text, dataUrl };
};

module.exports = { buildQr };

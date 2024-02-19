const getNearbyPublicServices = require("../utils/getNearbyPublicServices");

async function nearby(req, res, next) {
  try {
    const nearbyPublicServices = await getNearbyPublicServices({
      type: "police",
      currentPosition: req.body.currentPosition,
    });
    res.status(200).json({
      message: "success",
      data: nearbyPublicServices,
    });
  } catch (err) {
    res.status(500).json({ message: `error: ${err}` });
  }
}

module.exports = {
  nearby,
};

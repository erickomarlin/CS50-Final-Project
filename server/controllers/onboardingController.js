const User = require("../models/User");

exports.savePreferences = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { preference: req.body },
      { new: true, runValidators: true },
    );
    res.json({ preferences: user.preferences });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

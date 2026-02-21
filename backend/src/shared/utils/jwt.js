const jwt = require('jsonwebtoken');

exports.generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '1d' } //15 minutes validity
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } //7 days validity
  );

  return { accessToken, refreshToken };
};

exports.verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
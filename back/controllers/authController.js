const User = require('../models/userModel');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Faltan username o password' });
  }

  const user = await User.getByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  res.json({ id: user.id, username: user.username, role: user.role, token: 'aqui_tu_token' });
};

const db = require('../db');

// Obtener todos los usuarios
const getAll = async () => {
  const { rows } = await db.query('SELECT * FROM users');
  return rows;
};

// Obtener usuario por ID
const getById = async (id) => {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
};

// Crear nuevo usuario
const create = async (user) => {
  const { username, email, password, role } = user;
  const result = await db.query(
    'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, email, password, role]
  );
  return result.rows[0];
};

// Actualizar usuario
const update = async (id, user) => {
  const { username, email, password, role } = user;
  const result = await db.query(
    'UPDATE users SET username = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING *',
    [username, email, password, role, id]
  );
  return result.rows[0];
};

// Eliminar usuario
const remove = async (id) => {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
};

// Buscar usuario por username (nuevo: consulta en DB)
const getByUsername = async (username) => {
  const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  return rows[0]; // Retorna el primer usuario que coincida o undefined si no existe
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getByUsername,  // **exporta esta función también**
};

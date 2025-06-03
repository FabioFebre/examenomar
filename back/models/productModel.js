const db = require('../db');

const getAll = async () => {
  const { rows } = await db.query('SELECT * FROM products');
  return rows;
};

const getById = async (id) => {
  const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return rows[0];
};

const create = async (product) => {
  const { name, description, price, stock, image_url } = product;
  const result = await db.query(
    'INSERT INTO products (name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, price, stock, image_url]
  );
  return result.rows[0];
};

const update = async (id, product) => {
  const { name, description, price, stock } = product;
  const result = await db.query(
    'UPDATE products SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *',
    [name, description, price, stock, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  await db.query('DELETE FROM products WHERE id = $1', [id]);
};

module.exports = { getAll, getById, create, update, remove };

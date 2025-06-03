const fetchImage = require('../utils/fetchImage');
const Product = require('../models/productModel')

exports.create = async (req, res) => {
  try {
    const imageUrl = await fetchImage();

    // Crear el producto con la imagen obtenida
    const productData = {
      ...req.body,
      image_url: imageUrl,  
    };

    console.log('Datos recibidos para crear producto:', productData);

    const newProduct = await Product.create(productData);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getAll = async (req, res) => {
  const products = await Product.getAll();
  res.json(products);
};

exports.getById = async (req, res) => {
  const product = await Product.getById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
};

exports.update = async (req, res) => {
  const updated = await Product.update(req.params.id, req.body);
  res.json(updated);
};

exports.remove = async (req, res) => {
  await Product.remove(req.params.id);
  res.status(204).send();
};

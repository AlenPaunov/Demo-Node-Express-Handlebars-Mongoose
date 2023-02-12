import express from 'express';
import Product from '../models/Product.js';
const productController = express.Router();


// get all products with price above 10
productController.get('/', async (req, res) => {
  const products = await Product.find({ price: { $gt: 10 } }).lean();
  res.render("products", { products });

})

// renders create form
productController.get('/create', (req, res) => {
  res.render("createProduct");
})

// create new product
productController.post('/create', async (req, res) => {
  let data = req.body;
  console.log(data);
  await Product.create(data);
  res.redirect('/products');
})

// VIEW PRODUCT BY ID
productController.get('/:id', async (req, res) => {
  const id = req.params.id;
  let product = await Product.findById(id).lean();
  res.render("viewProduct", { ...product, editMode: true });
})

// EDIT PRODUCT BY ID
productController.post('/:id', async (req, res) => {
  let data = req.body;
  const id = req.params.id;
  let product = await Product.findByIdAndUpdate(id, data, { returnOriginal: false });

  console.log(product);
  res.redirect('/products');
})

// DELETE PRODUCT BY ID 
// TODO Fix wrong method type
productController.get('/delete/:id', async (req, res) => {
  const id = req.params.id;
  await Product.findByIdAndDelete(id);
  res.redirect('/products');
})

export default productController;
import express from 'express';
import Product from '../models/Product.js';
const productController = express.Router();


productController.get('/', async (req, res) => {
  const products = await Product.find({ price: { $gt: 10 } }).lean();
  res.render("products", { products });

})

productController.get('/create', (req, res) => {
  res.render("createProduct");
})

productController.post('/create', async (req, res) => {
  let data = req.body;
  console.log(data);
  await Product.create(data);
  res.redirect('/products');
})


productController.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  let product = await Product.findById(id).lean();
  res.render("viewProduct", { ...product, editMode: true });
})

productController.post('/edit/:id', async (req, res) => {
  let data = req.body;
  const id = req.params.id;
  let product = await Product.findByIdAndUpdate(id, data, { returnOriginal: false });

  console.log(product);
  res.redirect('/products');
})

productController.get('/delete/:id', async (req, res) => {
  const id = req.params.id;
  await Product.findByIdAndDelete(id);
  res.redirect('/products');
})

export default productController;
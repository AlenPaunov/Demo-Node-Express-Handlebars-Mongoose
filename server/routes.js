import express from 'express';
import productController from './controllers/productController.js';
import authController from './controllers/authController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
})

router.get('/about', (req, res) => {
  res.send("About page");
})

router.use('/products', productController);
router.use('/auth', authController);
// router.use('/auth', authController);
// router.use('/payment', paymentController);


export default router;

import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import upload from '../multer_uploader/upload_file.js';
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controller/ProductController.js';


const router = express.Router();

//routes


// Create Product
router.post('/create-product', requireSignIn, isAdmin, upload.array("photo"), createProductController);


// Update Product
router.put('/update-product/:pid', requireSignIn, isAdmin, upload.array("photo"), updateProductController)


// Get All Product
router.get('/get-product', getProductController);


// Get Single Product
router.get('/get-single-product/:pid', getSingleProductController);

// get photo
router.get('/product-photo/:pid', productPhotoController);

// delete product
router.delete('/delete-product/:pid', requireSignIn, isAdmin, deleteProductController);

// filter product
router.post('/product-filters', productFilterController);

// get total product count 
router.get('/product-count', productCountController);

// product per page
router.get('/product-list/:page', productListController);

// search product 
router.get('/search/:keyword', searchProductController);

// similar product
router.get('/related-product/:pid/:cid', relatedProductController);

// category wise product 
router.get('/product-category/:slug', productCategoryController);

// payment gateway 
// token 
router.get('/braintree/token', braintreeTokenController)

// payment 
router.post('/braintree/payment', requireSignIn, braintreePaymentController)


export default router;
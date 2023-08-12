import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { CategoryController, CreateCategoryController, SingleCategorycontroller, deleteCategoryController, updateCategoryController } from "../controller/categoryController.js";


const router = express.Router();

// routes 

// create category
router.post('/create-category', requireSignIn, isAdmin, CreateCategoryController);


// update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

// get all category
router.get('/get-category', CategoryController);

// single category
router.get('/single-category/:slug', SingleCategorycontroller);

// deltet category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);



export default router;
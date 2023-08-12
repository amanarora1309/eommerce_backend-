import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

// create category
export const CreateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).sned({ success: false, message: "Name is required" });
        }

        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({ success: true, message: "Category Already Exisits" })
        }

        const category = await categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({ success: true, message: "new category created", category })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error in Category', error })
    }
}

// update category
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        res.status(200).send({ success: true, message: "Updated Successfully", category });

    } catch (error) {
        console.log(error);
        req.status(500).send({ success: false, message: "Error in updating category", error });

    }
}

// get all category
export const CategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({ success: true, message: "All Categories List", category })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting all categories" })
    }
}

// single category
export const SingleCategorycontroller = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        res.status(200).send({ success: true, message: "Get Single Category Successfully", category });
    } catch (error) {
        console.lot(error);
        res.status(500).send({ success: false, message: "Error while getting single category" });
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({ success: true, message: "Deleted Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while delete category", error })
    }
}
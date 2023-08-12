import productModel from '../models/productModel.js';
import categoryModel from "../models/categoryModel.js";
import orderModel from '../models/orderModel.js';
import slugify from "slugify";


import braintree from 'braintree';
import dotenv from 'dotenv';

dotenv.config();


// Payment gateway 
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.body;
        const photo = req.file_name;
        const url = "http://localhost:8000/static/";

        // validation
        switch (true) {
            case !name:
                return res.status(401).send({ success: false, error: "Name is Required" })
            case !description:
                return res.status(401).send({ success: false, error: "Description is Required" })
            case !price:
                return res.status(401).send({ success: false, error: "Price is Required" })
            case !category:
                return res.status(401).send({ success: false, error: "Category is Required" })
            case !quantity:
                return res.status(401).send({ success: false, error: "Quantity is Required" })
            case !photo:
                return res.status(401).send({ success: false, error: "Photo is Required" })
        }

        const product = await productModel({ name, slug: slugify(name), description, price, category, quantity, shipping, photo: `${url}${photo}` }).save();

        res.status(200).send({ success: true, message: "Product is Created Successfully", product });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error, message: "Error in creating product" });
    }
}

// get all product

export const getProductController = async (req, res) => {
    try {
        // const products = await productModel.find({}).select("-photo").limit(12).populate("category").sort({ createAt: -1 });
        const products = await productModel.find({}).populate("category").sort({ createAt: -1 });
        res.status(200).send({ success: true, countTotal: products.length, message: "All Products", products });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error in getting products", error });
    }
}

// get single product

export const getSingleProductController = async (req, res) => {
    try {

        const product = await productModel.findById(req.params.pid).populate("category");
        res.status(200).send({
            success: true, message: "Single Product Fetched", product
        });
    } catch (error) {

        console.log(error);
        res.status(500).send({ success: false, message: "Error in getting products", error });
    }
}


// get photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        console.log(product.photo);

        if (product.photo) {
            res.set("Content-type", "image/png");
            return res.status(200).send(product.photo);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting product photo", error })
    }
}


// deltet product
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({ success: true, message: "Product Deleted Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error, message: "Error while deleting a product" });
    }
}

// update product
export const updateProductController = async (req, res) => {
    try {

        const { name, description, price, category, quantity, shipping } = req.body;
        const photo = req.file_name;
        const url = "http://localhost:8000/static/";

        // validation
        switch (true) {
            case !name:
                return res.status(401).send({ success: false, error: "Name is Required" })
            case !description:
                return res.status(401).send({ success: false, error: "Description is Required" })
            case !price:
                return res.status(401).send({ success: false, error: "Price is Required" })
            case !category:
                return res.status(401).send({ success: false, error: "Category is Required" })
            case !quantity:
                return res.status(401).send({ success: false, error: "Quantity is Required" })
            case !photo:
                return res.status(401).send({ success: false, error: "Photo is Required" })
        }

        const product = await productModel.findByIdAndUpdate(req.params.pid, { name, slug: slugify(name), description, price, category, quantity, shipping, photo: `${url}${photo}` });
        res.status(200).send({ success: true, message: "Product is Updated Successfully", product });
    } catch (error) {
        console.log(error);
        res.status(200).send({ success: false, error, message: "Error while updateing a product" })
    }
}

// filter product 
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);

        res.status(200).send({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: "Error While Filtering Products", error });
    }
}

// get total product count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({ success: true, total });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: "Error in getting product count", error });
    }
}

// product list based on page  

export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(200).send({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: "Error in getting product list", error })
    }
}

// search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await productModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ],
            });
        res.status(200).send({ success: true, results });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: "Error in Searching Products", error });
    }
}


// Similar products 
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid },
        }).limit(3).populate("category");

        res.status(200).send({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: "error while geting related product", error });
    }
}

// get product by category 
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        res.status(200).send({ success: true, category, products });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: "Error while getting products", error });
    }
}

// payment gateway api 
// token 
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// payment 
export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => {
            total = total + i.price;
        });

        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (err, result) {
                if (result) {
                    const order = new orderModel({

                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save()
                    res.json({ ok: true });
                } else {
                    res.status(500).send(err)
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
}



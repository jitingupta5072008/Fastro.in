// import express from "express";
// import isAuthenticate from "../middlewares/isAuthenticated.js";
// import {  addproduct, products, singleProducts } from "../controllers/seller.controller.js";
// import upload from "../middlewares/multer.js";

// const router = express.Router()

// router.route('/add-product').post(isAuthenticate,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1},{name:'image5',maxCount:1},{name:'image6',maxCount:1}]),addproduct)
// router.route('/products').get(products)
// router.route('/product/:id').get(singleProducts)

// export default router;
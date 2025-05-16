// import dotenv from 'dotenv';
// import { v2 as cloudinary } from 'cloudinary';
// import { Product } from '../models/product.model.js';
// import { Seller } from '../models/seller.model.js';

// // Load environment variables
// dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// export const addproduct = async (req, res) => {
//     try {
//         const { name, description, category, price, discountPercentage, rating, stock,shippingInformation, availabilityStatus, returnPolicy, minimumOrderQuantity} = req.body;
//         const image1 = req.files.image1 && req.files.image1[0];
//         const image2 = req.files.image2 && req.files.image2[0];
//         const image3 = req.files.image3 && req.files.image3[0];
//         const image4 = req.files.image4 && req.files.image4[0];
//         const image5 = req.files.image5 && req.files.image5[0];
//         const image6 = req.files.image6 && req.files.image6[0];

//         const images = [image1, image2, image3, image4, image5, image6].filter((item) => item !== undefined);
//         console.log(images);

//         const uploadedImages = await Promise.all(
//             images.map((file) =>
//                 cloudinary.uploader.upload(file.path, {
//                     folder: 'myecoom/',
//                     public_id: `product_${Date.now()}`,
//                 })
//             )
//         );

//         console.log(uploadedImages);
//         // Store the URLs

//         const imageUrls = uploadedImages.map(image => image.secure_url);

//         const productData = {
//             name, description, category, price, discountPercentage, rating, stock,shippingInformation, availabilityStatus, returnPolicy, minimumOrderQuantity,
//             images: imageUrls,
//             seller: req.user
//         };

//         console.log(productData);
//         const product = new Product(productData);
//         await product.save();
//         const seller = await Seller.findById(req.user)
//         seller.products.push(product._id) 
//         await seller.save()

//         res.json({ message: "Product Added Successfully" });
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ message: err.message });
//     }
// };

// export const products = async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json({ products });
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ message: error.message });
//     }
// }

// export const singleProducts = async (req, res) => {
//     try {
//         const productId = req.params.id;
//             const products = await Product.findById(productId)
//             .populate('seller')
//             .populate('category', 'name'); 
//             // const seller = await Seller.findOne(products.seller)

//         res.json({ products});
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ message: err.message });
//     }
// }


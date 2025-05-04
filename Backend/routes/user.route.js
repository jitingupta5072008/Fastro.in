import express from "express";
import {address, addReview,  getRelatedProducts,  addWishlist,   categoryWiseProduct,   deleteReview,   getCategories,   getReview,   getUserOrders,  loginwithemail, placeOrder, profile, register,   searchProduct,   sendOtp,  verifyOtp, getSlider, getProductBySingleCategory, getWishlistProduct, products, singleProducts, cancelOrder, addToCart, getCart, updateCartItem, removeFromCart, cartCheckout, buyCheckout} from '../controllers/user.controller.js'
import isAuthenticate from "../middlewares/isAuthenticated.js";

const router = express.Router()


router.route('/register').post(register)
router.route('/login/email').post(loginwithemail)
router.route('/login/send-otp').post(sendOtp)
router.route('/login/otp').post(verifyOtp)

router.route('/profile').get(isAuthenticate,profile)
router.route('/add/address').post(isAuthenticate,address)

router.route('/placeorder').post(placeOrder)

router.route('/orders').get(isAuthenticate,getUserOrders)
router.route('/searchproducts').get(searchProduct)
router.route('/products').get(categoryWiseProduct)
router.route('/categories').get(getCategories)

router.route('/products/related/:id').get(getRelatedProducts);
router.route('/get/sliders').get(getSlider);

router.route('/products/category/:slug').get(getProductBySingleCategory);


router.route('/reviews/:productId').get(getReview)
router.route('/add-reviews').post(addReview)
router.route('/review/:productId/:reviewId').delete(deleteReview)

router.route('/product/wishlist').post(isAuthenticate,addWishlist)
router.route('/wishlist/products').get(isAuthenticate,getWishlistProduct)


router.route('/allproducts').get(products)
router.route('/product/:id').get(singleProducts)


router.route('/cancel-order').post(cancelOrder)


router.route('/cart/checkout').post(isAuthenticate,cartCheckout)
router.route('/buy/checkout').post(isAuthenticate,buyCheckout)


router.route('/add-to-cart').post(isAuthenticate,addToCart)
router.route('/cart').get(isAuthenticate,getCart)
router.route('/update').put(isAuthenticate,updateCartItem)
router.route('/remove/:productId').delete(isAuthenticate,removeFromCart)


// router.post('/add', isAuthenticated, addToCart);
// router.get('/', isAuthenticated, getCart);
// router.put('/update', isAuthenticated, updateCartItem);
// router.delete('/remove/:productId', isAuthenticated, removeFromCart);

export default router;
import { Product } from '../models/product.model.js';
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import twilio from 'twilio'
import { Order } from "../models/order.model.js";
import { Seller } from '../models/seller.model.js';
import { FRONTEND_URL } from '../middlewares/url.js';
import Category from '../models/category.model.js';
import Review from '../models/review.model.js';
import mongoose from 'mongoose';
import Slider from '../models/slider.model.js';
import client from '../middlewares/whatsappClient.js';

// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body
   
        if (!phone) {
            return res.status(400).json({
                message: "All fields reuired",
                success: false
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 5 * 60000); // OTP valid for 5 minutes

        let user = await User.findOne({ phone });
        if (user) {
            user.otp = otp;
            user.otpExpire = otpExpire;
        } else {
            user = new User({ phone, otp, otpExpire });
        }
      
        await user.save();

        // Send OTP via Twilio
        client.messages.create({
            body: `\n ${otp} is your login OTP. It is valid for next 5 minutes. Do not share your OTP with anyone.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phone}`
        }).then(() => res.json({ message: 'OTP Sent Successfully' }))
            .catch(err => res.status(500).json({ error: err.toString() }));


    } catch (error) {
        return res.status(500).json({ message: error });

    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await User.findOne({ phone, otp });

        if (!user || user.otpExpire < new Date()) {
            return res.status(400).json({ message: 'Invalid or Expired OTP' });
        }
        const token = jwt.sign({ userId: user._id, username: user.name }, process.env.SECRET_KEY, { expiresIn: '1d' });

        res.json({ message: 'OTP Verified Successfully', success: true, token });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate if email and password are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new user
        const newUser = new User({
            name: username,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Send a success response
        return res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
}

export const loginwithemail = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const userExists = await User.findOne({ email });

        if (!userExists) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        // Compare the entered password with the stored hashed password using bcrypt
        const isMatch = await bcrypt.compare(password, userExists.password);

        if (isMatch) {
            const token = jwt.sign({ userId: userExists._id, username: userExists.name }, process.env.SECRET_KEY, { expiresIn: '1d' });
            // Send token back to client
            return res.json({ message: "Login successful!", success: true, token, userId: userExists._id });
        } else {
            return res.status(400).json({ message: "Invalid email or password!" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('name email cart address');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
      address: user.address,
      cartLength: user.cart.length
    });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const address = async (req, res) => {
    try {
        const { fullname, email, phone, fulladdress, state, city, pincode, addressType, defaultAddress } = req.body;
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's address
        user.address = { fullname, email, phone, fulladdress, state, city, pincode, addressType, defaultAddress };
        // Save the updated user
        await user.save();
        res.status(201).json({ message: 'Address Added successfully', user });
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
}


export const sendWhatsAppMessage = async (phone, message) => {
    const state = await client.getState();
    if (state === 'CONNECTED') {
        await client.sendMessage(phone, message);
        // console.log('✅ WhatsApp message sent!');
    } else {
        // console.warn('❌ WhatsApp client not connected. Message not sent.');
        throw new Error('WhatsApp client not ready');
    }
};

export const placeOrder = async (req, res) => {
    const { userId, cartItems, payment, amount,qty, sellerPhone, address,DeliveryTime } = req.body;
    try {
        const newOrder = new Order({
            userId,
            items: cartItems,
            qty:qty,
            totalAmount: amount,
            paymentMethod: payment,
            status: "Pending",
            DeliveryTime:DeliveryTime,
            shippingAddress: {
                fullname: address.fullname,
                email: address.email,
                phone: address.phone,
                pincode: address.pincode,
                state: address.state,
                city: address.city,
                fulladdress: address.fulladdress,
                addressType: address.addressType,
                defaultAddress: address.defaultAddress,
            },

        });

        await newOrder.save();
        const user = await User.findById(userId)
        const sellerId = cartItems.map(item => item.seller);
        const seller = await Seller.findById(sellerId);
        user.orders.push(newOrder)
        seller.orders.push(newOrder);
        await user.save()
        await seller.save()

        const frontendBaseUrl = FRONTEND_URL;
        const productName = cartItems.map(item => item.name).join(',');
        const productId = cartItems.map(item => item._id).join(',');

        // Twilio message send karne ka wait karein
        // try {
        //     await client.messages.create({
        //         body: `\n Dear ${seller.name},\n New Order Received!. Product: ${productName}: \n click on it ${frontendBaseUrl}${productId}, \n Qty: ${qty} \n Delivery Time: ${DeliveryTime}`,
        //         from: process.env.TWILIO_PHONE_NUMBER,
        //         to: `+91${sellerPhone}`
        //     });

        //     res.json({ message: "Order placed successfully!", order: newOrder });
        // } catch (twilioError) {
        //     res.status(500).json({ message: "Order placed, but OTP failed", error: twilioError.toString() });
        // }

        const phone = `91${sellerPhone}@c.us`
        const message = `Dear ${seller.name},\n New Order Received!. Product: ${productName}: \n click on it ${frontendBaseUrl}${productId}, \n Qty: ${qty} \n Delivery Time: ${DeliveryTime}`;

        await sendWhatsAppMessage(phone, message);
        
        res.json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};


export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user }).populate('items');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
}
export const cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.body;
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      if (order.status === "Cancelled") {
        return res.status(400).json({ message: "Order already cancelled" });
      }
  
      order.status = "Cancelled";
      await order.save();
  
      res.status(200).json(order);
    } catch (error) {
      console.error("Cancel order error:", error);
      res.status(500).json({ message: "Error cancelling order" });
    }
  };
  
export const searchProduct = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Case-insensitive search
        const products = await Product.find({ name: { $regex: query, $options: "i" } });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const categoryWiseProduct = async (req, res) => {
    try {
        const { category } = req.query;

        let filter = {};

        if (category) {
            filter = {
                $or: [
                    { category: category },  // Match category
                    { subCategory: category } // Match subCategory
                ]
            };
        }

        const products = await Product.find(filter).populate("category subCategory");
        res.json(products);

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getCategories = async (req, res) => {
    try {
        const { parentCategory } = req.query;
        let filter = {};
        if (parentCategory) {
            filter.parentCategory = parentCategory;  // ✅ Subcategories Fetch Karne Ke Liye
        } else {
            filter.parentCategory = null;  // ✅ Sirf Main Categories Fetch Karne Ke Liye
        }

        const categories = await Category.find(filter);
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getReview = async (req, res) => {
    try {
        const comments = await Review.find({ productId: req.params.productId })
        .sort({ date: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error })
    }
}

export const addReview = async (req, res) => {
  const { rating, productId, userId, comment } = req.body;

  try {
   

    // Validate if the productId and userId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid productId or userId format' });
    }

    // Fetch Product and User from DB
    const currentProduct = await Product.findById(productId);
    const currentUser = await User.findById(userId);

    
    // Check if Product exists
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if User exists
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new review object
    const newReview = new Review({
      comment,
      rating,
      userId:currentUser._id,
      reviewerName: currentUser.name, // Assuming the User model has a `name` field
      reviewerEmail: currentUser.email, // Assuming the User model has an `email` field
      productId, // Reference to the Product
    });

    // Log the new review object
    // console.log('New Review:', newReview);

    // Save the review
    await newReview.save();

    // Add the review to the product's reviews array
    currentProduct.reviews.push(newReview);
    await currentProduct.save();

    // Respond with the new review object
    return res.status(201).json(newReview);

  } catch (error) {
    return res.status(500).json({ message: 'Error saving review' });
  }
};

export const deleteReview = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.productId); // Find post by ID
        const { reviewId } = req.params; // Comment ID to delete

        if (!product) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const review = await Review.findByIdAndDelete(reviewId);
        // Filter out the comment by its ID
        // product.reviews = product.reviews.filter(comment => comment._id.toString() !== reviewId);
        await Product.findByIdAndUpdate(req.params.productId,{
            $pull:{reviews: reviewId}
        })
        await product.save();

        res.json({ product, message: 'Comment Deleted successfully!' }); // Return the updated post with the remaining comments
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting comment' });
    }
}

export const getRelatedProducts = async (req, res) => {
    try {
      const currentProduct = await Product.findById(req.params.id);
      if (!currentProduct) return res.status(404).json({ error: 'Product not found' });
  
      const related = await Product.find({
        category: currentProduct.category, // or tag/subcategory
        _id: { $ne: currentProduct._id }, // exclude current product
      })
        .limit(5); // only 1 to 5 products
  
      res.json({related});
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };

export const addWishlist = async (req, res) => {
    try {
      const { productId } = req.body;

      const user = await User.findById(req.user);
      const product = await Product.findById(productId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const index = user.wishlist.indexOf(product._id);
  
      if (index > -1) {
        // If product already in wishlist → remove it
        user.wishlist.splice(index, 1);
        await user.save();
        return res.json({ message: 'Product removed from wishlist' });
      } else {
        // Else → add to wishlist
        user.wishlist.push(product._id);
        await user.save();
        return res.json({ message: 'Product added to wishlist successfully!' });
      }
  
    } catch (error) {
      console.error('Wishlist Error:', error);
      res.status(500).json({ message: 'Error toggling product in wishlist' });
    }
  };
  
export const getWishlistProduct = async (req, res) => {
    try {
      const user = await User.findById(req.user).populate("wishlist");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ wishlist: user.wishlist });
    } catch (error) {
    //   console.log(error);
      res.status(400).json({ message: error.message });
    }
  };
  

export const getSlider = async(req,res)=>{
    try {
        const sliders = await Slider.find().populate("category");
        res.json({sliders});
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch sliders" });
      }
}

export const getProductBySingleCategory = async(req,res)=>{
    try {
        // Example route on backend to get products by category
        const category = await Category.findOne({ slug: req.params.slug });
        const products = await Product.find({ category: category._id });
        res.json({products});
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Product" });
    }
}

export const products = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (error) {
        // console.log(error);
        res.status(400).json({ message: error.message });
    }
}

export const singleProducts = async (req, res) => {
    try {
        const productId = req.params.id;
            const products = await Product.findById(productId)
            .populate('seller')
            .populate('category', 'name'); 
            // const seller = await Seller.findOne(products.seller)

        res.json({ products});
    } catch (err) {
        // console.log(err);
        res.status(400).json({ message: err.message });
    }
}


export const addToCart = async (req, res) => {
    try {
        const userId = req.user;
        const { productId, quantity } = req.body;

        const user = await User.findById(userId);
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const existingItem = user.cart.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        res.status(200).json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user).populate({
            path: 'cart.product',
            populate: {
                path: 'seller',
                model: 'Seller'
            }
        });

        res.status(200).json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



export const updateCartItem = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        const { productId, quantity } = req.body;

        const item = user.cart.find(item => item.product.toString() === productId);
        if (!item) return res.status(404).json({ message: "Cart item not found" });

        item.quantity = quantity;
        await user.save();

        res.status(200).json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        const { productId } = req.params;

        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();

        res.status(200).json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const cartCheckout = async (req, res) => {
    try {
      const user = await User.findById(req.user).populate({
        path: "cart.product",
        populate: { path: "seller" }
      });
  
      if (!user.cart.length) {
        return res.status(400).json({ message: "Cart is empty." });
      }
  
      const orders = [];
  
      for (let cartItem of user.cart) {
        const { product, quantity } = cartItem;
  
        // ✅ Correct discounted price calculation
        const discount = product.discountPercentage || 0;
        const discountedPrice = product.price - (product.price * discount) / 100;
  
        // ✅ Total based on quantity
        const total = discountedPrice * quantity;
  
        const newOrder = new Order({
          userId: req.user,
          items: [product._id],
          qty: quantity.toString(), // you can keep it string if your model needs it that way
          totalAmount: total,
          paymentMethod: req.body.paymentMethod,
          DeliveryTime: req.body.DeliveryTime,
          shippingAddress: user.address
        });
  
        await newOrder.save();
        orders.push(newOrder);
  
        if (product.seller && product.seller.phone) {
          const phone = `91${product.seller.phone}@c.us`;
          const message = `Dear ${product.seller.name},\nNew Order Received!\nProduct: ${product.name}\nClick to view: ${FRONTEND_URL}/product/${product._id}\nQty: ${quantity}\nDelivery Time: ${req.body.DeliveryTime}`;
          await sendWhatsAppMessage(phone, message);
        }
      }
  
      user.cart = [];
      await user.save();
  
      res.status(200).json({ message: "Order placed successfully", orders });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
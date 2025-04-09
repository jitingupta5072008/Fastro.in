// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ArrowLeft, ChevronRight, Dot, ShoppingCart, Trash, X } from 'lucide-react'
// import toast from 'react-hot-toast';
// import CartItem from './CartItem';
// import axios from 'axios';
// import { USER_API_END_POINT } from '../../utils/api';
// const Cart = () => {
//   const navigate = useNavigate();
//   const userId = localStorage.getItem('userId')

//   const [cart, setCart] = useState([]);
//   const [discountprice, setDiscountPrice] = useState(0);
//   const [totalPrice, setTotalPrice] = useState(0);

//   useEffect(() => {
//     const fetchCartData = async () => {
//       const token = localStorage.getItem('token');

//       try {
//         const res = await axios.get(`${USER_API_END_POINT}/cart/${userId}`, {
//           headers: { Authorization: token },
//         });

//         if (res.status === 403) {
//           toast.error(res.data.message, {
//             icon: '⚠️',
//           });
//           handleLogout();
//         } else {
//           const cartData = res.data.cart.products;
//           setCart(cartData);
//           setTotalPrice(res.data.cart.totalPrice) // discount hone ke baad ka price hai
//           setDiscountPrice(res.data.cart.discountPrice)

//           console.log('Cart Data:', cartData);
//           console.log('Cart :', res.data.cart.discountPrice);

//         }
//       } catch (err) {
//         console.log(err);
//         toast.error(err.response?.data?.message || 'Something went wrong!');
//       }
//     };
//       fetchCartData(); 
//   }, [userId]);


//   const removeFromCart = async(productId)=>{
//     try {
//       const res = await axios.post(`${USER_API_END_POINT}/cart/remove/${productId}`,{userId})
//       console.log(res)

//       // setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
//       setCart(prevCart=> prevCart.filter(item => item._id !== productId ))
//       console.log(cart)
//     } catch (error) {
//       console.log(error);
//     }
//   }


//   return (

//     <div className="flex flex-col min-h-screen bg-gray-50">

//       {/* Header */}
//       <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
//         <Link onClick={() => navigate(-1)} className="mr-4">
//           <ArrowLeft className="w-6 h-6 text-gray-700" />
//         </Link>
//         <h1 className="text-lg font-semibold text-gray-800">SHOPPING CART</h1>
//       </header>

//       {/* Checkout Steps */}
//       <div class="flex py-4 px-32 items-center justify-center space-x-6 text-gray-500">
//         {/* <!-- Cart --> */}
//         <div class="flex items-center space-x-2">
//           <span class="font-bold text-black">
//             Cart
//           </span>
//           <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_109_982)"><path opacity="0.2" d="M8.5 14.875C12.0208 14.875 14.875 12.0208 14.875 8.5C14.875 4.97918 12.0208 2.125 8.5 2.125C4.97918 2.125 2.125 4.97918 2.125 8.5C2.125 12.0208 4.97918 14.875 8.5 14.875Z" fill="#FFDD00"></path><path d="M5.84375 9.03125L7.4375 10.625L11.1562 6.90625" stroke="#212121" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.5 14.875C12.0208 14.875 14.875 12.0208 14.875 8.5C14.875 4.97918 12.0208 2.125 8.5 2.125C4.97918 2.125 2.125 4.97918 2.125 8.5C2.125 12.0208 4.97918 14.875 8.5 14.875Z" stroke="#212121" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_109_982"><rect width="17" height="17" fill="white"></rect></clipPath></defs></svg>
//         </div>

//         <div class="flex-1 border-t border-dashed border-gray-400"></div>

//         <div class="font-semibold text-gray-600">Address</div>

//         <div class="flex-1 border-t border-dashed border-gray-400"></div>

//         <div class="font-semibold text-gray-600">payment</div>

//       </div>

//       {/* Cart Items */}

//       <div className=" grid w-full grid-cols-1 gap-6 pb-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
// ">
//         {cart.length == 0 ? (
//           <div className="flex justify-center items-center" style={{ height: '400px' }}>
//             <div className="text-center rounded-lg">
//               <div className="text-6xl text-gray-500 flex items-center justify-center">
//                 <ShoppingCart className='text-pink-500' height={130} width={130} />
//               </div>
//               <h2 className="text-2xl font-semibold text-gray-800 mt-4">
//                 Your bag is empty
//               </h2>
//               <p className="text-gray-500 mt-2">
//                 It seems like you haven't added any items to your cart yet.
//               </p>
//               <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
//                 Continue Shopping
//               </button>
//             </div>
//           </div>
//         ) : (
//           cart.slice().reverse().map((item) => (
//             <div key={item._id} className='m-2 md:m-4'>

//               <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
//                 <div className="text-sm text-gray-600">Sold by: VIVIDH CREATIONSS</div>
//                 <div className="text-sm text-green-600">Free Delivery</div>
//               </div>

//               <div className="bg-white p-2 border-b border-gray-200">
//                 <div className="flex">
//                   <div className="mr-4 relative">
//                     <img
//                       src={item.productId.images[0]}
//                       alt={item.productId}
//                       width={100}
//                       height={100}
//                       className="rounded-md object-cover"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between">
//                       <h3 className="font-medium text-gray-800">{item.productId.title}</h3>
//                       <ChevronRight className="w-5 h-5 text-gray-500" />
//                     </div>
//                     <div className="text-xl font-semibold mt-1">
//                       ₹{parseInt(item.productId.price - (item.productId.price * item.productId.discountPercentage) / 100)}
//                     </div>
//                     <div className="text-sm text-gray-500 mt-1">All issue easy returns</div>

//                   </div>
//                 </div>
//                 <div className='ml-4 flex items-center justify-between'>
//                   <div className="flex items-center mt-2 p-2 text-sm text-gray-700">
//                     <span>Size: L</span>
//                     <span className="mx-2 text-gray-300"> <Dot /> </span>
//                     <div className="flex items-center">
//                       <div className="flex items-center rounded-md overflow-hidden">
//                         <button
//                           onClick={() => decreaseQuantity(item.productId._id)}
//                           className="px-3 py-1 text-gray-600 bg-gray-200 hover:bg-gray-300"
//                         >
//                           -
//                         </button>
//                         <span className="px-2 py-1 text-gray-800">{item.quantity}</span>
//                         <button
//                           onClick={() => increaseQuantity(item.productId._id)}
//                           className="px-3 py-1 text-gray-600 bg-gray-200 hover:bg-gray-300"
//                         >
//                           +
//                         </button>
//                       </div>
//                       <span className="ml-4 text-lg font-semibold text-gray-800">
//                         ₹{parseInt(item.productId.price - (item.productId.price * item.productId.discountPercentage) / 100) * item.quantity}

//                       </span>
//                     </div>
//                   </div>

//                   <button onClick={() => removeFromCart(item._id)} className="flex items-center mt-3 text-gray-600">
//                     <Trash className="w-5 h-5 mr-1 text-red-600" />
//                     {/* <span>Remove</span> */}
//                   </button>
//                 </div>
//               </div>

//             </div>
//           ))
//         )}
//       </div>

//       {/* Wishlist */}

//       <div className="flex justify-between items-center px-4 py-4 bg-white border-b border-gray-200">
//         <div className="font-medium text-gray-800">Wishlist</div>
//         <ChevronRight className="w-5 h-5 text-gray-500" />
//       </div>

//       {/* Price Details */}
//       <div className="bg-white p-4 border-b border-gray-200">
//         <div className='flex justify-between items-center'>
//           <h3 className="font-medium text-gray-800 mb-4">Price ( {cart.length} Items)</h3>
//           <h3 className="font-medium text-gray-800 mb-4"> ₹{discountprice}</h3>
//         </div>
//         <div className='flex justify-between items-center'>
//           <h3 className="font-medium text-gray-800 mb-4">Discount</h3>
//           <h3 className="font-medium text-gray-800 mb-4 text-green-700"> -₹{discountprice - totalPrice}</h3>
//         </div>

//         <div className="flex justify-between items-center">
//           <div className="text-gray-800 font-medium">Order Total</div>
//           <div className="text-gray-800 text-xl font-bold">₹{discountprice - (discountprice - totalPrice)}</div>
//         </div>
//         <div class="border-t border-dashed border-gray-300 py-3 text-base flex justify-between text-green-700 font-medium">
//           You will save ₹{discountprice - totalPrice} on this order
//         </div>

//       </div>

//       <div className="bg-white p-4 text-center text-sm text-gray-500">
//         Clicking on 'Continue' will not deduct any money
//       </div>

//       {/* Bottom Bar */}
//       <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
//         <div>
//           <div className="text-2xl font-bold">₹{totalPrice}</div>
//           <button className="text-pink-500 text-sm font-medium">VIEW PRICE DETAILS</button>
//         </div>
//         <button onClick={() => navigate('/address')} className="bg-pink-500 text-white font-medium py-3 px-8 rounded-md">Continue</button>
//       </div>

//     </div>

//   );
// };

// export default Cart;

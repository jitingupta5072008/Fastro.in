// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { USER_API_END_POINT } from '../../utils/api';
// import toast from 'react-hot-toast';
// import { ChevronRight, ShoppingCart, X } from 'lucide-react'
// const CartItem = ({ userId }) => {
//   const [totalProduct, setTotalProduct] = useState(0);
//   const [totalPrice, setTotalPrice] = useState(0);
  
//   // const [cart, setCart] = useState([]);
//   // useEffect(() => {
//   //   const fetchCartData = async () => {
//   //     const token = localStorage.getItem('token');

//   //     try {
//   //       const res = await axios.get(`${USER_API_END_POINT}/cart/${userId}`, {
//   //         headers: { Authorization: token },
//   //       });

//   //       if (res.status === 403) {
//   //         toast.error(res.data.message, {
//   //           icon: '⚠️',
//   //         });
//   //         handleLogout();  // Assuming handleLogout is defined elsewhere
//   //       } else {
//   //         const cartData = res.data.cart.products; // Ensure cartData is always an array

//   //         setCart(cartData);
//   //         setTotalPrice(res.data.cart.totalPrice)
//   //         setTotalProduct(res.data.cart.totalProduct)
//   //         console.log('Cart Data:', cartData);  // This should be logged correctly after state update

//   //       }
//   //     } catch (err) {
//   //       console.log(err);
//   //       toast.error(err.response?.data?.message || 'Something went wrong!');
//   //     }
//   //   };

//   //   if (userId) {
//   //     fetchCartData(); // Fetch cart data only if userId is available
//   //   }
//   // }, []);  // Re-run effect if userId changes

//   const increaseQty = async(productId) => {
//     // console.log(productId);
//     const token = localStorage.getItem('token')
//     const response = await axios.put(`${USER_API_END_POINT}/cart/increase`, { productId }, {
//       headers: {
//         Authorization: token,
//       }
//     });
//     setCart(response.data.cart)
//   };

//   return (
//     <div>
//       <h1>Your Cart</h1>
//       <div>
//         <p>Total Products: {totalProduct}</p>
//         <p>Total Price: ₹{totalPrice}</p>
//       </div>


//       <div className="mt-6 grid w-full grid-cols-1 gap-6 pb-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
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


//               <div className="bg-white mb-2 p-2 border-b border-gray-200">
//                 <div className="flex">
//                   <div className="mr-4 relative">
//                     <img
//                       src={item.productId.images[0]}
//                       alt={item.productId}
//                       width={160}
//                       height={160}
//                       className="rounded-md object-cover"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between">
//                       <h3 className="font-medium text-gray-800">{item.productId.title}</h3>
//                       <ChevronRight className="w-5 h-5 text-gray-500" />
//                     </div>
//                     <div className="text-xl font-semibold mt-1">₹{(item.productId.price)}</div>
//                     <div className="text-sm text-gray-500 mt-1">All issue easy returns</div>


//                   </div>
//                 </div>
//                 <div className='ml-6'>
//                   <div className="flex items-center mt-2 text-sm text-gray-700">
//                     <span>Size: L</span>
//                     <span className="mx-2 text-gray-300">•</span>

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
//                           onClick={() => increaseQty(item.productId)}
//                           className="px-3 py-1 text-gray-600 bg-gray-200 hover:bg-gray-300"
//                         >
//                           +
//                         </button>
//                       </div>
//                       <span className="ml-4 text-lg font-semibold text-gray-800">
//                         ₹{(item.productId.price * item.quantity)}
//                       </span>
//                     </div>



//                   </div>
//                   <button onClick={() => removeFromCart(item._id)} className="flex items-center mt-3 text-gray-600">
//                     <X className="w-4 h-4 mr-1" />
//                     <span>Remove</span>
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
//         <h3 className="font-medium text-gray-800 mb-4">Price Details ( {cart.length} Items)</h3>

//         <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
//           <div className="text-gray-600">Total Product Price</div>
//           <div className="flex items-center">
//             <span className="text-gray-800 font-medium">+ ₹{totalPrice}</span>
//           </div>
//         </div>

//         <div className="flex justify-between items-center py-4">
//           <div className="text-gray-800 font-medium">Order Total</div>
//           <div className="text-gray-800 font-medium">₹{totalPrice}</div>
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

// export default CartItem;


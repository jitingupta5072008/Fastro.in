// import React from "react";
// import {useCart} from '../../context/CartContext'

// const CartPage = () => {
//   const { cart, updateQuantity, removeFromCart } = useCart();

//   const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
//       {cart.length === 0 ? (
//         <p>Your cart is empty</p>
//       ) : (
//         <div>
//           {cart.map((item) => (
//             <div key={item._id} className="flex justify-between items-center border-b py-2">
//               <div>
//                 <h3 className="font-semibold">{item.name}</h3>
//                 <p>${item.price.toFixed(2)}</p>
//               </div>
//               <div className="flex items-center">
//                 <button
//                   className="px-2 py-1 border rounded"
//                   onClick={() => updateQuantity(item._id, item.quantity - 1)}
//                 >
//                   -
//                 </button>
//                 <span className="px-4">{item.quantity}</span>
//                 <button
//                   className="px-2 py-1 border rounded"
//                   onClick={() => updateQuantity(item._id, item.quantity + 1)}
//                 >
//                   +
//                 </button>
//               </div>
//               <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => removeFromCart(item._id)}>
//                 Remove
//               </button>
//             </div>
//           ))}
//           <h3 className="text-xl font-bold mt-4">Total: ${totalPrice.toFixed(2)}</h3>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;

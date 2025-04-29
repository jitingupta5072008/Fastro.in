import { CircleCheck, Truck, PackageCheck, LocateFixed } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import OrderTracking from './OrderTracking';

const OrderDetail = () => {
  const location = useLocation();
  const product = location.state?.product;
  console.log(product);
  const productItem = product.items[0];
  const address = product.shippingAddress;

  // For now hardcode status. In future, use product.status like "Shipped", "Delivered", etc.
//   const orderStatus = "Order Placed"; // or "Shipped", "OutForDelivery", "Placed"

//   const trackingSteps = [
//     { label: "Order Placed", icon: <CircleCheck className="w-4 h-4" /> },
//     { label: "Shipped", icon: <PackageCheck className="w-4 h-4" /> },
//     { label: "Out for Delivery", icon: <Truck className="w-4 h-4" /> },
//     { label: "Delivered", icon: <LocateFixed className="w-4 h-4" /> },
//   ];
  
  // Simulate current order status index (Replace with product.status logic)
//   const currentStepIndex = 3; // 0 = Placed, 1 = Shipped, etc.
  

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 text-gray-800 bg-white rounded-xl shadow-md mt-4">
      {/* Confirmation */}
      <div className="flex items-center gap-3 text-green-600">
        <CircleCheck className="w-7 h-7" />
        <div>
          {/* <h2 className="text-lg font-semibold">Order Confirmed!</h2> */}
          <p className="text-md text-gray-500">Thanks for shopping with us</p>
          <p className="text-sm text-gray-400">Order ID: #{productItem._id}</p>
        </div>
      </div>

      {/* Delivery ETA */}
      <div className="flex items-center gap-2 text-gray-700 bg-gray-100 p-3 rounded-md">
        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 9h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">
          Estimated delivery by <span className="font-semibold">{product.DeliveryTime}</span>
        </p>
      </div>

      {/* Product */}
      <div className="flex gap-4 border rounded-xl p-3">
        <img src={productItem.images[0]} alt="Product" className="w-24 h-28 rounded-lg object-cover border" />
        <div className="flex-1">
          <p className="font-semibold">{productItem.name}</p>
          <p className="text-sm text-gray-500 mt-1">Qty: {product.qty} | Basic Return</p>
          <p className="font-semibold text-pink-600 mt-1">
            ₹{product.totalAmount}
            {/* ₹{order.items[0].price - (order.items[0].price * order.items[0].discountPercentage) / 100} */}
            </p>
          <p className="text-xs text-gray-400 mt-1">Sold by: Fab Ethnic Sarees</p>
        </div>
      </div>

      {/* 📦 Order Tracking */}

      <OrderTracking status={product.status} />


      {/* Address */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-1 text-sm text-gray-700">Delivery Address</p>
        <p>{address.fullname} - <span className="text-gray-600">{address.phone}</span></p>
        <p className="text-sm text-gray-600">{address.fulladdress}, {address.city}, {address.state} - {address.pincode}</p>
      </div>

      {/* Payment */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-1 text-sm text-gray-700">Payment Method</p>
        <p className="text-sm text-gray-600 capitalize">{product.paymentMethod}</p>
      </div>

      {/* CTA */}
      <Link to='/'>
      <button className="w-full bg-pink-500 text-white py-2 rounded-md font-semibold mt-4 hover:bg-pink-600 transition">
        Continue Shopping
      </button>
      </Link>
    </div>
  );
};

export default OrderDetail;

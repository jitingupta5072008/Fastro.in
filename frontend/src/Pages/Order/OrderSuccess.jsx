import { CircleCheck } from 'lucide-react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const location = useLocation();
    const order = location.state?.order;
    const navigate = useNavigate()
  return (
    <>
          <div class="max-w-md mx-auto p-4 space-y-4 text-gray-700">
                <h2 class="text-lg font-semibold text-center">ORDER CONFIRMATION</h2>

                <div class="flex items-center gap-2 text-green-600">
                    <CircleCheck class="w-5 h-5" />
                    <div>
                        <p>Thank you for shopping with us</p>
                        <p class="text-sm text-gray-500">ID: #{order._id}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 9h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Estimated delivery by <strong>
                    {order.createdAt && new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                        </strong></p>
                </div>

                <div class="flex gap-4 border rounded-xl p-3">
                    <img src="https://images.meesho.com/images/products/17255130/pgzwt_512.jpg" alt="Product" class="w-16 h-16 rounded-lg object-cover"/>
                        <div>
                            <p class="font-semibold">{order?.items?.length > 0 ? order.items[0].name : "N/A"}</p>
                            <p class="text-sm text-gray-500">Size: Freesize &nbsp; | &nbsp; Qty: {order?.qty} &nbsp; | &nbsp; Basic Return</p>
                            <p class="font-semibold mt-1">₹{order?.items?.length > 0
                        ? (
                          (order.items[0].price -
                            (order.items[0].price * order.items[0].discountPercentage) / 100) *
                          (order.qty || 1)
                        )
                        : "N/A"}</p>
                        </div>
                </div>

                <div>
                    <p class="font-semibold mb-1">Delivery Address</p>
                    <p>{order?.shippingAddress?.fullname} - <span class="text-gray-500">+91{order?.shippingAddress?.phone}</span></p>
                    <p class="text-gray-600 text-sm">{order?.shippingAddress?.fulladdress}, {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pincode}</p>
                </div>

                <div>
                    <p class="font-semibold mb-1">Payment Method</p>
                    <p class="text-gray-600">{order?.shippingAddress?.paymentMethod}</p>
                </div>

                <div>
                    <p class="font-semibold mb-1">How would you rate your shopping experience on Meesho App?</p>
                    <div class="flex justify-between gap-1">
                        <button class="bg-gray-100 w-10 h-10 rounded-full text-xs text-gray-700">1<br /><span class="text-[10px] block">Very Poor</span></button>
                        <button class="bg-gray-100 w-10 h-10 rounded-full text-xs text-gray-700">2<br /><span class="text-[10px] block">Poor</span></button>
                        <button class="bg-yellow-200 w-10 h-10 rounded-full text-xs text-yellow-800">3<br /><span class="text-[10px] block">Average</span></button>
                        <button class="bg-green-200 w-10 h-10 rounded-full text-xs text-green-800">4<br /><span class="text-[10px] block">Good</span></button>
                        <button class="bg-green-300 w-10 h-10 rounded-full text-xs text-green-900">5<br /><span class="text-[10px] block">Great</span></button>
                    </div>
                </div>

                <button onClick={()=> navigate('/')} class="w-full bg-pink-500 text-white py-2 rounded-full text-center font-semibold mt-4 hover:bg-pink-600 transition">
                    Continue Shopping
                </button>
            </div>
    </>
  )
}

export default OrderSuccess
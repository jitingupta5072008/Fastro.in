import { CircleCheck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';
const OrderSuccess = () => {
  const {orderId} = useParams()
  const [order,setOrder] = useState(null)
  const [loading,setLoading] = useState(true)


  useEffect(()=>{
    const fetchOrder = async ()=>{
      try {
        const res = await axios.get(`${USER_API_END_POINT}/orders_detail/${orderId}`);
        setOrder(res.data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        toast.error(error || 'failed to fetch order')
      }
    }
    fetchOrder()
  },[orderId])

  if(loading) return <p>Loading...</p>

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to right, #ffe4f1, #ffffff)'}}>

      <div className="bg-white/80 backdrop-blur-md border border-pink-200 rounded-2xl shadow-xl w-full max-w-2xl p-6 text-center transition-all">

        {/* <!-- Success Animation GIF --> */}
        <div className="flex justify-center">
          <iframe className="h-56 object-contain" src="https://lottie.host/embed/211e8660-bf0a-4cdb-a12d-41d83f211218/EwOvvLLJ7C.lottie"></iframe>
        </div> 

        {/* <!-- Headline with Pink Color --> */}
        <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">Order Confirmed!</h1>

        {/* <!-- Paragraph --> */}
        <p className="text-gray-700 text-lg mb-6">
          Your order has been successfully placed and will be delivered via Cash on Delivery.
        </p>

        {/* <!-- Order Summary --> */}
        <div className="bg-pink-50 rounded-xl p-4 text-left mb-6 border border-pink-100">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Order ID:</span>
            <span className="text-gray-900 font-semibold">#{order._id}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium text-gray-700">Estimated Delivery:</span>
            <span className="text-gray-900">{order.createdAt && new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}</span>
          </div>
        </div>

        {/* <!-- Product Section --> */}
        <div className="bg-pink-50 rounded-xl p-4 text-left mb-6 border border-pink-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Products</h2>
          <div className="space-y-4">
            {order.items && order.items.map((product, index) => (
              <div key={index} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium text-gray-700">{product.name}</p>
                  <p className="text-gray-500">Quantity: {product.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 font-semibold">₹{order.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <!-- Action Buttons with Pink Theme --> */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="/" className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition">
            Continue Shopping
          </a>
          <a href="/orders" className="px-6 py-3 border border-pink-300 hover:bg-pink-50 text-pink-700 font-semibold rounded-lg transition">
            View Order
          </a>
        </div>
      </div>

    </div>
  )
}

export default OrderSuccess;

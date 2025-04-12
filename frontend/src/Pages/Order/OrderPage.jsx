import React, { useEffect, useState } from "react";
import { USER_API_END_POINT } from "../../utils/api";
import toast from "react-hot-toast";
import { LucideLoader } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate()
 const [loading, setLoading] = useState(true);

 const token = localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch Orders
    const fetchOrders = async () => {
      setLoading(true)
      if(!token){
        toast.error('Please Login First.')
        setTimeout(() => {
          navigate('/login')
      }, 2000);
      }

      try {
        const response = await fetch(`${USER_API_END_POINT}/orders`, {
          headers: {
            Authorization: token,
          },
        });

        const data = await response.json();

        // Ensure data is an array before setting it to state
        if (Array.isArray(data)) {
          setOrders(data);
          setLoading(false);
        } else{

          // toast.error(data.message)
          setOrders([]); // Set to empty array if the data is not an array
        }
        
      } catch (error) {

        setOrders([]);
      }finally{
        setLoading(false)
      }
    };

    fetchOrders();
  }, [token]);


  const handleCancelOrder = async (e, orderId) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
  
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/cancel-order`,
        { orderId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      const updatedOrder = res.data;
  
      // Update status of the specific order in local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
  
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel the order"
      );
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {loading ? 
       <div class="animate-pulse rounded-lg  h-90 w-90 mx-auto">
       <div class="border border-gray-300 mb-3">
     
         <div class="w-full max-w-4xl bg-white p-4 pb-0 flex items-center gap-4">
           <div class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded">
             <div class="w-full h-full bg-gray-300"></div>
           </div>
           <div class="flex-1">
             <div class="h-4 bg-gray-200 rounded w-1/2"></div>
             <div class="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
           </div>
           <div class="text-sm text-gray-600">
             <div class="h-4 bg-gray-200 rounded w-1/3"></div>
             <div class="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
           </div>
         </div>
     
         <div class="mt-2 flex justify-between items-center px-4 py-2 bg-white border-t border-gray-200">
           <div class="text-sm text-gray-200 bg-gray-200 rounded w-2/5"></div>
           <div class="text-sm h-4 bg-red-200 rounded w-1/5"></div>
         </div>
     
       </div>
     </div>
       
       :

      orders.length === 0 ? (
        <>
        <img src="./src/assets/empty.gif" className="h-90 w-90 mx-auto" alt="" />
        </>
      ) : (
        <div className=" rounded-lg shadow-md">
          {orders.slice().reverse().map((order) => (<div key={order._id} className="border border-orange-300 mb-3 ">
            <div className="w-full max-w-4xl bg-white p-4 pb-0 flex items-center gap-4">

              {/* <!-- Icon --> */}
              <div className="flex items-center justify-center w-12 h-12 bg-orange-200 rounded">
                <img src={order.items[0].images[0]} className="w-full" alt="" />
              </div>

              {/* <!-- Order Details --> */}
              <div className="flex-1">
                <p className="text-gray-700 text-sm">
                  <strong>{order.items[0].name}</strong>
                </p>
                <p className="text-gray-900 font-semibold mt-1">₹{order.totalAmount}</p>
              </div>

              {/* <!-- Items & Status --> */}
              <div className="text-sm text-gray-600">
                <p><strong>Items:</strong> {order.qty} </p>
                <p className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span> <strong>{order.status}</strong>
                </p>
              </div>

              
            </div>

            <div className="flex justify-between items-center px-4 py-2 bg-white border-t border-gray-200">
                <div className="text-sm text-gray-600">Deliverd at: {order.DeliveryTime} </div>


                <div
  className={`text-sm cursor-pointer ${
    order.status === "Cancelled"
      ? "text-gray-400 pointer-events-none"
      : "text-red-600"
  }`}
  onClick={(e) => order.status !== "Cancelled" && handleCancelOrder(e, order._id)}
>
  {order.status === "Cancelled" ? "Cancelled" : "Cancel"}
</div>



            </div>

          </div>))}
        </div> 
      )
    }

    </div>
  );
};

export default OrderPage;

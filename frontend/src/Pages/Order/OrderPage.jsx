import React, { useEffect, useState } from "react";
import { USER_API_END_POINT } from "../../utils/api";
import toast from "react-hot-toast";
import { LucideLoader } from "lucide-react";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId');
 const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch Orders
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${USER_API_END_POINT}/orders/${userId}`, {
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
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
        <div className='flex items-center justify-center mt-4'>
            <LucideLoader /> Loading...
        </div>
    );
}

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {orders.length === 0 ? (
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
                <div className="text-sm text-red-600">Cancel</div>
            </div>

          </div>))}
        </div>

      )}
    </div>
  );
};

export default OrderPage;

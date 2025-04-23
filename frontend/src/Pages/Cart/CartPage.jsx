import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, ChevronRight, Dot, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null); // holds productId being removed
    const [updatingQty, setUpdatingQty] = useState(null); // holds productId being updated
    const token = localStorage.getItem('token');
    const navigate = useNavigate()
    const [addresses, setAddresses] = useState([]);


    const fetchCart = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/cart`, {
                headers: { Authorization: token },
            });
            setCart(res.data.cart);
        } catch (error) {
            if (error.status == 403) navigate('/login')
            console.error(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            setUpdatingQty(productId);
            await axios.put(
                `${USER_API_END_POINT}/update`,
                { productId, quantity },
                { headers: { Authorization: token } }
            );
            toast.success('Cart Updated');
            fetchCart();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update quantity');
        } finally {
            setUpdatingQty(null);
        }
    };

    const removeItem = async (productId) => {
        try {
            setRemoving(productId);
            await axios.delete(`${USER_API_END_POINT}/remove/${productId}`, {
                headers: { Authorization: token },
            });
            toast.success('Product removed from your cart');
            fetchCart();
        } catch (err) {
            console.error(err);
            toast.error('Failed to remove product');
        } finally {
            setRemoving(null);
        }
    };

    const fetchUserAddress = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${USER_API_END_POINT}/profile`, {
                headers: { Authorization: token }
            });

            setAddresses(res.data.address);

        } catch (err) {
            toast(err.response.data.message, {
                icon: '⚠️',
            });
            handleLogout()
        }
    };
    useEffect(() => {
        fetchCart();
        fetchUserAddress();
    }, []);



    console.log(addresses)

    const { total, totalDiscount, finalAmount } = useMemo(() => {
        let total = 0;
        let totalDiscount = 0;

        cart.forEach((item) => {
            const price = item.product.price;
            const minQty = item.product.minimumOrderQuantity || 1;
            const quantity = Math.max(item.quantity, minQty); // ✅ Ensure min quantity
            const discountPercentage = item.product.discountPercentage || 0;

            const itemTotal = price * quantity;
            const discountAmount = (price * discountPercentage / 100) * quantity;

            total += itemTotal;
            totalDiscount += discountAmount;
        });

        return {
            total,
            totalDiscount,
            finalAmount: total - totalDiscount,
        };
    }, [cart]);

    const handleCheckout = async () => {
        navigate('/address', { state: { order: cart, finalAmount: finalAmount } })
    }

    if (loading) return <p>Loading cart...</p>;

    return (
        // <div className="max-w-4xl mx-auto">
        //         <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        //             <Link onClick={() => navigate(-1)} className="mr-2">
        //                 <ArrowLeft className="w-6 h-6 text-gray-700" />
        //             </Link>
        //             <h1 className="text-lg font-semibold text-gray-800">Cart </h1>
        //         </header>
        //        {/* Checkout Steps */}
        //        <div className="flex py-4 px-32 items-center justify-center space-x-6 text-gray-500">
        //             {/* <!-- Cart --> */}
        //             <div className="flex items-center space-x-2">
        //                 <span className="font-bold text-black">
        //                     Cart
        //                 </span>

        //                 <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_982)"><path opacity="0.2" d="M8.5 14.875C12.0208 14.875 14.875 12.0208 14.875 8.5C14.875 4.97918 12.0208 2.125 8.5 2.125C4.97918 2.125 2.125 4.97918 2.125 8.5C2.125 12.0208 4.97918 14.875 8.5 14.875Z" fill="#FFDD00"></path><path d="M5.84375 9.03125L7.4375 10.625L11.1562 6.90625" stroke="#212121" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.5 14.875C12.0208 14.875 14.875 12.0208 14.875 8.5C14.875 4.97918 12.0208 2.125 8.5 2.125C4.97918 2.125 2.125 4.97918 2.125 8.5C2.125 12.0208 4.97918 14.875 8.5 14.875Z" stroke="#212121" strokeLinecap="round" strokeLinejoin="round"></path></g><defs><clipPath id="clip0_109_982"><rect width="17" height="17" fill="white"></rect></clipPath></defs></svg>

        //             </div>

        //             <div className="flex-1 border-t border-dashed border-gray-400"></div>

        //             <div className="flex items-center space-x-2">
        //                 <span className="font-bold text-black">
        //                     Address
        //                 </span>



        //             </div>

        //             <div className="flex-1 border-t border-dashed border-gray-400"></div>

        //             <div className="font-semibold text-gray-600">payment</div>

        //         </div>
        //     {cart.length === 0 ? (
        //         <p>Your cart is empty.</p>
        //     ) : (
        //         <div className="space-y-6">
        //             <div className="grid w-full grid-cols-1 gap-6 pb-14 sm:grid-cols-2  lg:grid-cols-2">
        //                 {cart.map((item) => (
        //                     <div key={item.product._id} className='m-2 md:m-4 cursor-pointer '>



        //                         <div className="bg-white p-2 border-b border-gray-200">
        //                             <div className="flex">
        //                                 <div className="mr-4 relative">
        //                                     <img
        //                                         src={item.product.images[0] || "/placeholder.svg"}

        //                                         alt={item.product.name}
        //                                         width={100}
        //                                         height={100}
        //                                         className="rounded-md object-cover"
        //                                     />
        //                                 </div>
        //                                 <div className="flex-1">
        //                                     <div className="flex justify-between" onClick={() => navigate(`/product/${item.product._id}`)} >
        //                                         <h3 className="font-medium text-gray-800">{item.product.name.split(" ").slice(0, 9).join(" ") + "..."}</h3>
        //                                         <ChevronRight className="w-5 h-5 text-gray-500" />
        //                                     </div>
        //                                     <div className="text-2xl flex items-center gap-2 font-semibold mt-1">

        //                                         ₹ {item.product.price - (item.product.price * item.product.discountPercentage / 100)}


        //                                         {item.product.discountPercentage > 0 && (
        //                                             <p className="text-sm line-through text-gray-500">₹{item.product.price}</p>
        //                                         )}

        //                                     </div>
        //                                     <div className="text-sm text-gray-500 mt-1">All issue easy returns</div>
        //                                     <div className="text-sm text-gray-500 mt-1">min Order Qty  {item.product.minimumOrderQuantity}</div>

        //                                     <select
        //                                         value={item.quantity < item.product.minimumOrderQuantity
        //                                             ? item.product.minimumOrderQuantity
        //                                             : item.quantity}
        //                                         onChange={(e) =>
        //                                             updateQuantity(item.product._id, parseInt(e.target.value))
        //                                         }
        //                                         className="w-20 border rounded px-2 mt-2"
        //                                         disabled={updatingQty === item.product._id}
        //                                     >
        //                                         {[...Array(10).keys()]
        //                                             .map((num) => num + 1)
        //                                             .filter(num => num >= item.product.minimumOrderQuantity)
        //                                             .map((num) => (
        //                                                 <option key={num} value={num}>
        //                                                     {num}
        //                                                 </option>
        //                                             ))}
        //                                     </select>

        //                                 </div>
        //                             </div>
        //                             <div className='ml-4 flex items-center justify-between'>

        //                                 <div className="flex items-center mt-2 p-2 text-sm text-gray-700">
        //                                     <span>Size: L</span>
        //                                     <span className="mx-2 text-gray-300"> <Dot /> </span>
        //                                     <div className="flex items-center">
        //                                         <span className="ml-4 text-lg font-semibold text-gray-800">
        //                                             {item.product.discountPercentage > 0 ? <>

        //                                                 {item.quantity < item.product.minimumOrderQuantity
        //                                                     ? item.product.minimumOrderQuantity
        //                                                     : item.quantity} x {item.product.price - (item.product.price * item.product.discountPercentage) / 100} = {''}

        //                                                 {(item.product.price - (item.product.price * item.product.discountPercentage) / 100) * (item.quantity < item.product.minimumOrderQuantity ? item.product.minimumOrderQuantity : item.quantity)}
        //                                             </>
        //                                                 :
        //                                                 <>
        //                                                     {item.quantity < item.product.minimumOrderQuantity
        //                                                         ? item.product.minimumOrderQuantity
        //                                                         : item.quantity} x {item.product.price} = {''} ₹{parseInt(item.product.price * item.quantity)}
        //                                                 </>
        //                                             }

        //                                             {/* {item.quantity} x {parseInt(item.product.price)} = {''}

        //                                             ₹{parseInt(item.product.price - (item.product.price * item.product.discountPercentage) / 100) * item.product.minimumOrderQuantity}

        //                                          */}

        //                                             {/* ₹{parseInt(item.product.price * item.quantity)} */}
        //                                         </span>
        //                                     </div>
        //                                 </div>

        //                                 <button
        //                                     onClick={() => removeItem(item.product._id)}
        //                                     className={`text-red-500 hover:underline flex items-center gap-1 disabled:opacity-50`}
        //                                     disabled={removing === item.product._id}
        //                                 >
        //                                     <Trash size={18} className='w-5 h-5 mr-1 text-red-600' />
        //                                     {removing === item.product._id ? 'Removing...' : 'Remove'}
        //                                 </button>

        //                             </div>
        //                         </div>

        //                     </div>
        //                 ))}
        //             </div>

        //             <div className="text-right text-lg font-bold mt-6">
        //                 Total: ₹{total.toFixed(2)}
        //             </div>

        //             <div className="bg-white p-4 rounded shadow mt-4">
        //                 <h2 className="text-xl font-bold mb-2">Cart Summary ({cart.length}) </h2>

        //                 <div className="flex justify-between">
        //                     <span>Total Price:</span>
        //                     <span>₹{total.toFixed(2)}</span>
        //                 </div>
        //                 {
        //                     totalDiscount > 0 && (
        //                         <div className="flex justify-between text-green-600">
        //                             <span>Discount:</span>
        //                             <span>- ₹{totalDiscount.toFixed(2)}</span>
        //                         </div>
        //                     )
        //                 }

        //                 <div className="flex justify-between font-semibold mt-2 border-t pt-2">
        //                     <span>Final Amount:</span>
        //                     <span>₹{finalAmount.toFixed(2)}</span>
        //                 </div>
        //             </div>

        //             <div className="flex items-center justify-between mt-4">
        //                 {totalDiscount > 0 && (
        //                     <p className="text-lg text-green-600">
        //                         You save ₹{totalDiscount.toFixed(2)}
        //                     </p>
        //                 )}
        //                 <button onClick={handleCheckout} className="w-32 rounded-xl bg-pink-500 py-3 cursor-pointer text-white transition hover:bg-pink-600">
        //                     CheckOut
        //                 </button>
        //             </div>
        //         </div>
        //     )}
        // </div>

        <div className="px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="mt-16 flex flex-col md:flex-row">
                <div className="max-w-4xl flex-1">
                    <h1 className="mb-6 text-3xl font-medium">
                        Shopping Cart <span className="text-pink-700 text-sm">{cart.length} Items</span>
                    </h1>
                    <div className="grid grid-cols-[2fr_1fr_1fr] pb-3 text-base font-medium text-gray-500">
                        <p className="text-left">Product Details</p>
                        <p className="text-center">Subtotal</p>
                        <p className="text-center">Action</p>
                    </div>

                    {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item.product._id} className="grid grid-cols-[2fr_1fr_1fr] items-center pt-3 text-sm font-medium text-gray-500 md:text-base">
                                <div className="flex items-center gap-3 md:gap-6">
                                    <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded border border-gray-300 bg-pink-200">
                                        <img
                                            className="h-full max-w-full object-cover"
                                            alt="Carrot 500g"
                                            src={item.product.images[0] || "/placeholder.svg"}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.product.name} {item.product.discountPercentage > 0 ? `${item.product.discountPercentage}% Off` : null}</p>
                                        <div className="font-normal text-gray-500/70">
                                            <p>
                                                Weight: <span>N/A</span>
                                            </p>
                                            <div className="flex items-center">
                                                <p>Qty:</p>
                                                {/* <select className="outline-none">
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select> */}
                                                <select
                                                    value={item.quantity < item.product.minimumOrderQuantity
                                                        ? item.product.minimumOrderQuantity
                                                        : item.quantity}
                                                    onChange={(e) =>
                                                        updateQuantity(item.product._id, parseInt(e.target.value))
                                                    }
                                                    className="w-20 border rounded px-2 mt-2"
                                                    disabled={updatingQty === item.product._id}
                                                >
                                                    {[...Array(10).keys()]
                                                        .map((num) => num + 1)
                                                        .filter(num => num >= item.product.minimumOrderQuantity)
                                                        .map((num) => (
                                                            <option key={num} value={num}>
                                                                {num}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center">
                                    ₹ {(item.product.price - (item.product.price * item.product.discountPercentage / 100)) * item.quantity}
                                </p>
                                <button className="cursor-pointer">
                                    <img
                                        onClick={() => removeItem(item.product._id)}
                                        disabled={removing === item.product._id}
                                        className="inline-block h-6 w-6 disabled:opacity-50"
                                        alt="Remove item"
                                        src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_3523_924)'%3e%3cpath%20d='M12.4993%207.50033L7.49935%2012.5003M7.49935%207.50033L12.4993%2012.5003M18.3327%2010.0003C18.3327%2014.6027%2014.6017%2018.3337%209.99935%2018.3337C5.39698%2018.3337%201.66602%2014.6027%201.66602%2010.0003C1.66602%205.39795%205.39698%201.66699%209.99935%201.66699C14.6017%201.66699%2018.3327%205.39795%2018.3327%2010.0003Z'%20stroke='%23FF532E'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_3523_924'%3e%3crect%20width='20'%20height='20'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                                    />
                                    {removing === item.product._id ? '...' : null}
                                </button>
                            </div>
                        ))
                    )}

                    <button className="group text-primary mt-8 flex cursor-pointer items-center gap-2 font-medium">
                        <img
                            className="transition group-hover:-translate-x-1"
                            alt="arrow"
                            src="data:image/svg+xml,%3csvg%20width='15'%20height='11'%20viewBox='0%200%2015%2011'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M14.0909%205.5H1'%20stroke='%234FBF8B'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M6.14286%2010L1%205.5L6.14286%201'%20stroke='%234FBF8B'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e"
                        />
                        Continue Shopping
                    </button>
                </div>

                <div className="w-full my-8 mx-auto max-w-90 bg-gray-100 p-5 max-md:mt-16">
                    <h2 className="text-xl font-medium md:text-2xl">Order Summary</h2>
                    <hr className="my-5 border-gray-300" />

                    <div className="mb-6">
                        <p className="text-base font-medium uppercase">Delivery Address</p>
                        <div className="relative mt-2 flex items-start justify-between">
                            <p className="text-gray-500">No address found</p>
                            {addresses ?
                                <button onClick={() => navigate('/add-address', { state: { address: addresses } })} className="text-primary cursor-pointer hover:underline">Change</button>
                                :
                                <button className="text-primary cursor-pointer hover:underline">Add</button>

                            }
                        </div>

                        <ul className="mt-6 space-y-3">
                            {addresses && addresses.map((addr, i) => (
                                <li key={i} className="p-4 border rounded-xl shadow-sm">
                                    <p><strong>{addr.fullname}</strong></p>
                                    <p>{addr.fulladdress}, {addr.city}</p>
                                    <p>{addr.state} - {addr.pincode}</p>
                                </li>
                            ))}
                        </ul>



                        <p className="mt-6 text-base font-medium uppercase">Payment Method</p>
                        {/* <select className="mt-2 w-full border border-gray-300 bg-white px-3 py-2 outline-none">
                            <option value="COD">Cash On Delivery</option>
                            <option value="Online">Online Payment</option>
                        </select> */}
                        <select
                            name="category"
                            className="mt-2 w-full px-4 py-3 shadow-sm border border-gray-300 bg-white outline-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
                        >
                            <option value="" disabled>💳 Select Payment Method</option>
                            <option value="Cash on Delivery">🚚 Cash on Delivery</option>
                            <option value="" disabled>📱 UPI</option>
                            <option value="" disabled>💳 Credit/Debit Card</option>
                        </select>
                    </div>

                    <hr className="border-gray-300" />

                    <div className="mt-4 space-y-2 text-gray-500">
                        <p className="flex justify-between">
                            <span>Price</span>
                            <span> ₹{total}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Discount</span>
                            <span>-₹{totalDiscount.toFixed(2)}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Shipping Fee</span>
                            <span className="text-green-600">Free</span>
                        </p>
                        <p className="mt-3 flex justify-between text-lg font-medium">
                            <span>Total Amount:</span>
                            <span> ₹{finalAmount}</span>
                        </p>
                    </div>

                    <button className="bg-pink-500 hover:bg-pink-600 mt-6 w-full cursor-pointer py-3 font-medium text-white transition">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

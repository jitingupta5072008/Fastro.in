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
            toast.success('Product quantity updated successfully');
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

    useEffect(() => {
        fetchCart();
    }, []);

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
        <div className="max-w-4xl mx-auto mt-2 p-4">
                <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
                    <Link onClick={() => navigate(-1)} className="mr-4">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-800">Your Cart </h1>
                </header>
               {/* Checkout Steps */}
               <div className="flex py-4 px-32 items-center justify-center space-x-6 text-gray-500">
                    {/* <!-- Cart --> */}
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-black">
                            Cart
                        </span>

                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_982)"><path opacity="0.2" d="M8.5 14.875C12.0208 14.875 14.875 12.0208 14.875 8.5C14.875 4.97918 12.0208 2.125 8.5 2.125C4.97918 2.125 2.125 4.97918 2.125 8.5C2.125 12.0208 4.97918 14.875 8.5 14.875Z" fill="#FFDD00"></path><path d="M5.84375 9.03125L7.4375 10.625L11.1562 6.90625" stroke="#212121" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.5 14.875C12.0208 14.875 14.875 12.0208 14.875 8.5C14.875 4.97918 12.0208 2.125 8.5 2.125C4.97918 2.125 2.125 4.97918 2.125 8.5C2.125 12.0208 4.97918 14.875 8.5 14.875Z" stroke="#212121" strokeLinecap="round" strokeLinejoin="round"></path></g><defs><clipPath id="clip0_109_982"><rect width="17" height="17" fill="white"></rect></clipPath></defs></svg>

                    </div>

                    <div className="flex-1 border-t border-dashed border-gray-400"></div>

                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-black">
                            Address
                        </span>
                        


                    </div>

                    <div className="flex-1 border-t border-dashed border-gray-400"></div>

                    <div className="font-semibold text-gray-600">payment</div>

                </div>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-6">
                    <div className="grid w-full grid-cols-1 gap-6 pb-14 sm:grid-cols-2  lg:grid-cols-2">
                        {cart.map((item) => (
                            <div key={item.product._id} className='m-2 md:m-4 cursor-pointer '>



                                <div className="bg-white p-2 border-b border-gray-200">
                                    <div className="flex">
                                        <div className="mr-4 relative">
                                            <img
                                                src={item.product.images[0] || "/placeholder.svg"}

                                                alt={item.product.name}
                                                width={100}
                                                height={100}
                                                className="rounded-md object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between" onClick={() => navigate(`/product/${item.product._id}`)} >
                                                <h3 className="font-medium text-gray-800">{item.product.name.split(" ").slice(0, 9).join(" ") + "..."}</h3>
                                                <ChevronRight className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <div className="text-2xl flex items-center gap-2 font-semibold mt-1">

                                                ₹ {item.product.price - (item.product.price * item.product.discountPercentage / 100)}


                                                {item.product.discountPercentage > 0 && (
                                                    <p className="text-sm line-through text-gray-500">₹{item.product.price}</p>
                                                )}

                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">All issue easy returns</div>
                                            <div className="text-sm text-gray-500 mt-1">min Order Qty  {item.product.minimumOrderQuantity}</div>

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
                                    <div className='ml-4 flex items-center justify-between'>

                                        <div className="flex items-center mt-2 p-2 text-sm text-gray-700">
                                            <span>Size: L</span>
                                            <span className="mx-2 text-gray-300"> <Dot /> </span>
                                            <div className="flex items-center">
                                                <span className="ml-4 text-lg font-semibold text-gray-800">
                                                    {item.product.discountPercentage > 0 ? <>

                                                        {item.quantity < item.product.minimumOrderQuantity
                                                            ? item.product.minimumOrderQuantity
                                                            : item.quantity} x {item.product.price - (item.product.price * item.product.discountPercentage) / 100} = {''}

                                                        {(item.product.price - (item.product.price * item.product.discountPercentage) / 100) * (item.quantity < item.product.minimumOrderQuantity ? item.product.minimumOrderQuantity : item.quantity)}
                                                    </>
                                                        :
                                                        <>
                                                            {item.quantity < item.product.minimumOrderQuantity
                                                                ? item.product.minimumOrderQuantity
                                                                : item.quantity} x {item.product.price} = {''} ₹{parseInt(item.product.price * item.quantity)}
                                                        </>
                                                    }

                                                    {/* {item.quantity} x {parseInt(item.product.price)} = {''}

                                                    ₹{parseInt(item.product.price - (item.product.price * item.product.discountPercentage) / 100) * item.product.minimumOrderQuantity}

                                                 */}

                                                    {/* ₹{parseInt(item.product.price * item.quantity)} */}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.product._id)}
                                            className={`text-red-500 hover:underline flex items-center gap-1 disabled:opacity-50`}
                                            disabled={removing === item.product._id}
                                        >
                                            <Trash size={18} className='w-5 h-5 mr-1 text-red-600' />
                                            {removing === item.product._id ? 'Removing...' : 'Remove'}
                                        </button>

                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div className="text-right text-lg font-bold mt-6">
                        Total: ₹{total.toFixed(2)}
                    </div>

                    <div className="bg-white p-4 rounded shadow mt-4">
                        <h2 className="text-xl font-bold mb-2">Cart Summary ({cart.length}) </h2>

                        <div className="flex justify-between">
                            <span>Total Price:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        {
                            totalDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount:</span>
                                    <span>- ₹{totalDiscount.toFixed(2)}</span>
                                </div>
                            )
                        }

                        <div className="flex justify-between font-semibold mt-2 border-t pt-2">
                            <span>Final Amount:</span>
                            <span>₹{finalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        {totalDiscount > 0 && (
                            <p className="text-lg text-green-600">
                                You save ₹{totalDiscount.toFixed(2)}
                            </p>
                        )}
                        <button onClick={handleCheckout} className="w-32 rounded-xl bg-pink-500 py-3 cursor-pointer text-white transition hover:bg-pink-600">
                            CheckOut
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;

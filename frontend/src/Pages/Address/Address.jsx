import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Dot, LucideLoader, ShoppingCart, Trash } from 'lucide-react';
import axios from 'axios';
import { SELLER_API_END_POINT, USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';
import { useOrder } from '../../context/OrderContext';

const Address = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        pincode: '',
        state: '',
        city: '',
        fulladdress: '',
        addressType: '',
        defaultAddress: false,
    });


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        const fetchUserAddress = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${USER_API_END_POINT}/profile`, {
                    headers: { Authorization: token }
                });
                if (res.status === 403) {
                    handleLogout()
                } else {
                    setUser(res.data.user);
                }
            } catch (err) {
                toast(err.response.data.message, {
                    icon: '⚠️',
                });
                handleLogout()
            }
        };
        fetchUserAddress();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token")
        if(!formData) return toast.error('Add Address before place order')
        try {
            const res = await axios.post(
                `${USER_API_END_POINT}/add/address`,
                formData,
                {
                    headers: {
                        Authorization: token,
                    }
                }
            );
            setIsEditMode(false)
            setUser(res.data.user);
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const { id } = useParams()
    const [product, setProduct] = useState([]);
    const [payment, setpayment] = useState('');
    const [DeliveryTime, setDeliveryTime] = useState('');
    const [sellerPhone, setSellerPhone] = useState('');
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { placeOrder } = useOrder()

    const [selectedImage, setSelectedImage] = useState(0)
    const [totalAmount, setTotalAmount] = useState('')
    const [productImages, setProductImages] = useState([])

    const url = `${SELLER_API_END_POINT}/product/${id}`;

    const userId = localStorage.getItem("userId")


    useEffect(() => {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data.products);
                setSellerPhone(data.seller.phone)
                setTags(data.products.tags)
                setProductImages(data.products.images[0])
                setLoading(false); // Update loading state
                setTotalAmount(data.products.price)
            })
            .catch((error) => {
                setError(error.message); // Set error state
                setLoading(false); // Update loading state
            });
    }, [id]);

    const handlePlaceOrder = async () => {
        try {
            if(!DeliveryTime) return toast.error('Please select a delivery time.')
            await placeOrder(userId, [product], payment, parseInt((product.price - (product.price * product.discountPercentage) / 100) * product.minimumOrderQuantity), product.minimumOrderQuantity, product.seller.phone, user.address,DeliveryTime);
            // if(response.status === 200){
            // }
            // navigate('/orders');

        } catch (error) {
            toast.error("Failed to place order. Try again.");
        }
    };


    // Conditional rendering based on loading and error states
    if (loading) {
        return <div className='flex items-center justify-center'> <LucideLoader /> Loading...</div>;
    }

    if (!product) {
        return <div>No product data available.</div>;
    }

    return (
        <>
            <div className='min-h-screen bg-gray-50'>
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
                    <Link onClick={() => navigate(-1)} className="mr-4">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-800">ADDRESS </h1>
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
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_982)"><path opacity="0.2" d="M8.5 14.875C12.0208 14.875 14.875 12.0208 14.875 8.5C14.875 4.97918 12.0208 2.125 8.5 2.125C4.97918 2.125 2.125 4.97918 2.125 8.5C2.125 12.0208 4.97918 14.875 8.5 14.875Z" fill="#FFDD00"></path><path d="M5.84375 9.03125L7.4375 10.625L11.1562 6.90625" stroke="#212121" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.5 14.875C12.0208 14.875 14.875 12.0208 14.875 8.5C14.875 4.97918 12.0208 2.125 8.5 2.125C4.97918 2.125 2.125 4.97918 2.125 8.5C2.125 12.0208 4.97918 14.875 8.5 14.875Z" stroke="#212121" strokeLinecap="round" strokeLinejoin="round"></path></g><defs><clipPath id="clip0_109_982"><rect width="17" height="17" fill="white"></rect></clipPath></defs></svg>


                    </div>

                    <div className="flex-1 border-t border-dashed border-gray-400"></div>

                    <div className="font-semibold text-gray-600">payment</div>

                </div>


                {user && user.address && user.address.fullname ? (
                    // Existing Address UI
                    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input type="radio" checked className="w-4 h-4 text-blue-600" />
                                <span className="text-lg font-semibold">{user.address.fullname}</span>
                                <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded">
                                    {user.address.addressType}
                                </span>
                            </div>
                            <button
                                className="px-3 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                                onClick={() => setIsEditMode(true)}
                            >
                                Edit
                            </button>
                        </div>
                        <p className="mt-2 text-gray-700">{user.address.fulladdress}</p>
                        <p className="mt-1 text-gray-500">{user.address.phone}</p>
                    </div>
                ) : (
                    // If no address is found, show Add Address button
                    <div className="flex justify-center mt-6">
                        <button
                            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600"
                            onClick={() => setIsEditMode(true)}
                        >
                            Add Address
                        </button>
                    </div>
                )}

                {(isEditMode || !user || !user.address) && (
                    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Add New Address</h2>

                        <form onSubmit={handleSubmit}>

                            {/* Full Name */}
                            <div className="mb-4">
                                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" id="fullname" name="fullname" required className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Email */}
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="text" id="email" name="email" required className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input type="tel" id="phone" name="phone" required className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. +91 123 456 7890"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Full Address */}
                            <div className="mb-4">
                                <label htmlFor="fulladdress" className="block text-sm font-medium text-gray-700">Full Address</label>
                                <input type="text" id="fulladdress" name="fulladdress" required className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="House number, Street name"
                                    value={formData.fulladdress}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* City */}
                            <div className="mb-4">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" id="city" name="city" required className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* State */}
                            <div className="mb-4">
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                <input type="text" id="state" name="state" required className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* PIN Code */}
                            <div className="mb-4">
                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">PIN Code</label>
                                <input type="text" id="pincode" name="pincode" required className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" maxlength="6" placeholder="e.g. 123456"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Default Address */}
                            <div className="flex items-center mb-4">
                                <input type="checkbox" id="default_address" name="defaultAddress" className="h-5 w-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                                    checked={formData.defaultAddress}
                                    onChange={handleChange}
                                />
                                <label htmlFor="default_address" className="ml-2 text-sm font-medium text-gray-700">Set as Default Address</label>
                            </div>

                            {/* Address Type */}
                            <div className="p-4 bg-white shadow-md rounded-md">
                                <p className="text-lg font-semibold mb-2">Address Type</p>
                                <div className="flex flex-col sm:flex-row gap-2">

                                    <label htmlFor="Home" className="flex items-center gap-2 border rounded-md p-3 cursor-pointer w-full sm:w-auto hover:bg-gray-100">
                                        <input type="radio" className="w-5 h-5" id="Home" name="addressType" value="Home" checked={formData.addressType === 'Home'}
                                            onChange={handleChange} />
                                        <span className="text-gray-700 font-medium">Home <br /> <span className="text-sm text-gray-500">(7AM-9PM)</span> </span>
                                    </label>

                                    <label htmlFor="Office" className="flex items-center gap-2 border rounded-md p-3 cursor-pointer w-full sm:w-auto hover:bg-gray-100">
                                        <input type="radio" className="w-5 h-5" id="Office" name="addressType" value="Office" checked={formData.addressType === 'Office'}
                                            onChange={handleChange} />
                                        <span className="text-gray-700 font-medium">Office <br /> <span className="text-sm text-gray-500">(9AM-5PM)</span> </span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6">
                                <button type="submit" className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                                    Add Address
                                </button>
                            </div>

                        </form>
                    </div>
                )}

                {/* Cart Items */}


                <div className=" grid w-full grid-cols-1 gap-6 pb-14 sm:grid-cols-2  lg:grid-cols-4
">
                    <div key={product._id} className='m-2 md:m-4 cursor-pointer '>

                        <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
                            <div className="text-sm text-gray-600">Sold by: {product.seller.shopName} </div>
                            <div className="text-sm text-green-600">Free Delivery</div>
                        </div>

                        <div className="bg-white p-2 border-b border-gray-200">
                            <div className="flex">
                                <div className="mr-4 relative">
                                    <img
                                        src={product.images[0] || "/placeholder.svg"}

                                        alt={product}
                                        width={100}
                                        height={100}
                                        className="rounded-md object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between" onClick={() => navigate(`/product/${product._id}`)} >
                                        <h3 className="font-medium text-gray-800">{product.name}</h3>
                                        <ChevronRight className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div className="text-xl font-semibold mt-1">
                                        ₹{parseInt(product.price)}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">All issue easy returns</div>
                                    <div className="text-sm text-gray-500 mt-1">min Order Qty  {product.minimumOrderQuantity}</div>

                                </div>
                            </div>
                            <div className='ml-4 flex items-center justify-between'>
                                <div className="flex items-center mt-2 p-2 text-sm text-gray-700">
                                    <span>Size: L</span>
                                    <span className="mx-2 text-gray-300"> <Dot /> </span>
                                    <div className="flex items-center">
                                        <span className="ml-4 text-lg font-semibold text-gray-800">
                                            {product.minimumOrderQuantity} x {parseInt(product.price)} = {''}
                                            {/* ₹{parseInt(product.price - (product.price * product.discountPercentage) / 100) * product.minimumOrderQuantity} */}
                                            ₹{parseInt(product.price * product.minimumOrderQuantity)}
                                        </span>
                                    </div>
                                </div>

                                <button onClick={() => removeFromCart(product._id)} className="flex items-center mt-3 text-gray-600">
                                    <Trash className="w-5 h-5 mr-1 text-red-600" />
                                    {/* <span>Remove</span> */}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <select
                    name="category"
                    className="border p-2 rounded mx-auto "
                    value={payment}
                    onChange={(e) => setpayment(e.target.value)}
                >
                    <option value="">Select Payment Methode</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>

                </select>

                {/* Address Type */}
                <div className="p-4 bg-white shadow-md rounded-md">
                    <p className="text-lg font-semibold mb-2">Delivery Time</p>
                    <div className="flex sm:flex-row gap-2">

                        <label htmlFor="Home" className="flex items-center gap-2 border rounded-md p-3 cursor-pointer w-full sm:w-auto hover:bg-gray-100">
                            <input type="radio" className="w-5 h-5" id="Home" name="addressType" value={'Morning (8AM-11AM)'} 
                                onChange={(e)=> setDeliveryTime(e.target.value)} />
                            <span className="text-gray-700 font-medium">Morning <br /> <span className="text-sm text-gray-500">(8AM-11AM)</span> </span>
                        </label>

                        <label htmlFor="Office" className="flex items-center gap-2 border rounded-md p-3 cursor-pointer w-full sm:w-auto hover:bg-gray-100">
                            <input type="radio" className="w-5 h-5" id="Office" name="addressType" value={'Evening (4PM-8PM)'} 
                                onChange={(e)=> setDeliveryTime(e.target.value)} />
                            <span className="text-gray-700 font-medium">Evening <br /> <span className="text-sm text-gray-500">(4PM-8PM) </span> </span>
                        </label>

                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
                <div>
                    <div className="text-2xl font-bold">
                        {/* ₹{parseInt(product.price - (product.price * product.discountPercentage) / 100) * product.minimumOrderQuantity} */}
                        ₹{parseInt(product.price * product.minimumOrderQuantity)}
                    </div>
                    <button className="text-pink-500 text-sm font-medium">VIEW PRICE DETAILS</button>
                </div>

                <button onClick={handlePlaceOrder} className="bg-pink-500 text-white font-medium py-3 px-8 rounded-md">Place Order</button>

            </div>
        </>
    );
};

export default Address;

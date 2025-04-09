import React, { useEffect, useState } from 'react'
import { USER_API_END_POINT } from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { LucideLoader, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Wishlist = () => {
    const [allproducts, setAllproducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleLogout = () => {
        console.log('logout');
        // localStorage.clear()        
        // navigate('/login');       
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get(`${USER_API_END_POINT}/wishlist/products`, {
                    headers: { Authorization: token }
                });

                if (res.status === 403) {
                    toast(err.response.data.message, {
                        icon: '⚠️',
                    });
                    handleLogout();
                } else {
                    setAllproducts(res.data.wishlist);
                    setLoading(false);
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'An error occurred');
                handleLogout();
            }
        };

        fetchUserData();
    }, []);

    // const handleWishlist = async (productId) => {
    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         toast.error("Please login first.");
    //         return;
    //     }
    
    //     try {
    //         const res = await axios.post(
    //             `${USER_API_END_POINT}/product/wishlist`,
    //             { productId },
    //             {
    //                 headers: {
    //                     Authorization: token,
    //                 }
    //             }
    //         );
    //         toast.success(res?.data?.message || "Wishlist updated");
    //     } catch (error) {
    //         console.error("Wishlist error:", error);
    //         toast.error(error?.response?.data?.message || "Something went wrong");
    //     }
    // };

    const handleWishlist = async (productId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first.");
            return;
        }
    
        try {
            const res = await axios.post(
                `${USER_API_END_POINT}/product/wishlist`,
                { productId },
                {
                    headers: {
                        Authorization: token,
                    }
                }
            );
    
            toast.success(res?.data?.message || "Wishlist updated");
    
            // ✅ Real-time UI update
            setAllproducts((prev) =>
                prev.filter((product) => product._id !== productId)
            );
        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };
    

    if (loading) {
        return (
            <div className='flex items-center justify-center mt-4'>
                <LucideLoader /> Loading...
            </div>
        );
    }
    return (
        <div className='px-6 md:px-16 lg:px-32'>
            <h1 className='text-3xl font-bold'>My Wishlist Product</h1>


            <div className="mt-6 grid w-full grid-cols-2 flex-col items-center gap-6 pb-14 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.isArray(allproducts) && allproducts.length > 0 ? (
                    allproducts.map((product) => (
                        <div key={product._id} className="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">

                            <div className="group relative flex h-52 w-full items-center justify-center rounded-lg bg-gray-500/10 overflow-hidden">

                                <Link to={`/product/${product._id}`} className="w-full h-full absolute z-10">
                                    <img
                                        alt={product.title}
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        width="800"
                                        height="800"
                                        src={product.images[0]}
                                    />
                                </Link>

                                {product.discountPercentage > 0 && (
                                    <span className="absolute rounded-br-2xl rounded-tr-2xl top-2 left-0 px-2 py-1 text-xs font-semibold text-white bg-red-500">
                                        {product.discountPercentage}% Off
                                    </span>
                                )}

                                <button
                                    onClick={() => handleWishlist(product._id)}
                                    className="absolute top-2 right-2 z-20 rounded-full bg-white p-2 shadow-md"
                                >
                                    {/* <img
                                        alt="heart_icon"
                                        width="10"
                                        height="10"
                                        className="h-3 w-3"
                                        src="https://quickcart-gs.vercel.app/_next/static/media/heart_icon.392ca0e2.svg"
                                    /> */}
                                    <X className='h-4 w-4 text-red-600' />
                                </button>
                            </div>

                            <Link to={`/product/${product._id}`} className="w-full">
                                <p className="w-full truncate pt-2 font-medium md:text-base">{product.name}</p>
                                <p className="w-full truncate text-xs text-gray-500/70 max-sm:hidden">{product.description}</p>
                            </Link>

                            <div className="flex items-center gap-2">
                                <p className="text-xs">{product.rating}</p>
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, index) => (
                                        <img
                                            key={index}
                                            alt="star_icon"
                                            width="18"
                                            height="17"
                                            className="h-3 w-3"
                                            src="https://quickcart-gs.vercel.app/_next/static/media/star_icon.f42949da.svg"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-1 w-full items-end justify-between">
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-medium text-black-500">
                                        ₹{parseInt(product.price)}
                                    </p>

                                    {product.discountPercentage > 0 && (
                                        <p className="text-xs line-through text-gray-500">₹{product.price}</p>
                                    )}
                                </div>

                                <button className="rounded-full mt-2 w-full border border-gray-500/20 px-4 py-1.5 text-xs text-gray-500 transition hover:bg-slate-50 max-sm:hidden">
                                    Buy now
                                </button>
                            </div>
                        </div>

                    ))
                ) : (
                    <div>No products found.</div>
                )}
            </div>

        </div>
    )
}

export default Wishlist
import React, { useEffect, useState } from 'react'
import { USER_API_END_POINT } from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { LucideLoader, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useOrder } from '../../context/OrderContext';

const Wishlist = () => {
    const [allproducts, setAllproducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { handleWishlist, wishlistLoading } = useOrder();

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login');
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

    if (loading) {
        return <>
            <div class="px-6 md:px-16 lg:px-32 mb-8 bg-white flex flex-col items-center mt-4">


                <div class="mt-6 w-full flex-col items-center gap-6 pb-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">

                    {[...Array(8)].map((_, index) => (
                        <div key={index} class="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">
                            <div class="group relative flex h-52 w-full items-center justify-center rounded-lg bg-gray-300 animate-pulse overflow-hidden">
                                <a class="w-full h-full absolute z-10" href="#" aria-label="Loading product link"></a>
                                <div class="h-full w-full bg-gray-200 animate-pulse"></div>
                                <button class="absolute top-2 right-2 z-20 rounded-full bg-white p-2">
                                    <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                                </button>
                            </div>
                            <a class="w-full" href="#" aria-label="Loading product link">
                                <p class="w-full h-4 bg-gray-300 animate-pulse pt-2"></p>
                                <p class="w-full h-3 bg-gray-200 animate-pulse text-xs"></p>
                            </a>
                            <div class="flex items-center gap-2">
                                <p class="text-xs h-3 bg-gray-200 animate-pulse"></p>
                                <div class="flex items-center gap-0.5">
                                    <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                                    <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                                    <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                                    <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                                    <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                                </div>
                            </div>
                            <div class="mt-1 w-full items-end justify-between">
                                <div class="flex items-center gap-2">
                                    <p class="text-lg font-medium h-4 bg-gray-300 animate-pulse"></p>
                                </div>
                                <button class="rounded-full mt-2 w-full border border-gray-500/20 px-4 py-1.5 text-xs text-gray-500 transition hover:bg-slate-50">
                                    <div class="h-4 bg-gray-300 animate-pulse"></div>
                                </button>
                            </div>
                        </div>
                    ))}



                </div>

            </div>
        </>
    }


    return (
        <div className='px-6 md:px-16 lg:px-32'>
            <h1 className='text-3xl font-bold mt-4'>My Wishlist Product</h1>


            <div className={allproducts.length === 0 ? null : `mt-6  w-full  flex-col items-center gap-4 pb-14  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5`}>
                {Array.isArray(allproducts) && allproducts.length > 0 ? (
                    allproducts.map((product) => (
                        <div key={product._id} className="flex w-full max-w-[200px] [z-index:1] cursor-pointer flex-col items-start gap-0.5">

                            <div className="group relative flex h-52 w-full items-center justify-center rounded-lg bg-gray-500/10 overflow-hidden">

                                <Link to={`/product/${product._id}`} className="w-full h-full absolute z-10">

                                    <img
                                        src={product.images[0].replace("/upload/", "/upload/w_400,f_auto,q_auto/")}
                                        srcSet={`
                                   ${product.images[0].replace("/upload/", "/upload/w_300,f_auto,q_auto/")} 300w,
                                   ${product.images[0].replace("/upload/", "/upload/w_600,f_auto,q_auto/")} 600w,
                                   ${product.images[0].replace("/upload/", "/upload/w_1000,f_auto,q_auto/")} 1000w
                                 `}
                                        sizes="(max-width: 640px) 300px,
                                        (max-width: 1024px) 600px,
                                        1000px"
                                        alt={product.name}
                                        title={product.name}
                                        loading="lazy"
                                        width="400"
                                        height="400"
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => { e.target.src = '/fallback.png' }}
                                    />
                                </Link>


                                {product.discountPercentage > 0 && (
                                    <span className="z-[99] absolute rounded-br-2xl rounded-tr-2xl top-2 left-0 px-2 py-1 text-xs font-semibold text-white bg-red-500">
                                        {product.discountPercentage}% Off
                                    </span>
                                )}


                                <button
                                    onClick={() => handleWishlist(product._id, setAllproducts)} // ✅ Already context se linked
                                    disabled={wishlistLoading[product._id]}
                                    className={`${wishlistLoading[product._id] ? 'opacity-50 cursor-not-allowed' : ''} absolute top-2 right-2 z-20 rounded-full bg-white p-2 shadow-md`}
                                >
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
                                        ₹ {Math.floor(product.price - (product.price * product.discountPercentage / 100))}
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
                    <img src="https://res.cloudinary.com/dfdenma4g/image/upload/v1745485919/myecoom/vroxqf53dp9c1qgnmied.gif" className="h-90 w-90 mx-auto" alt="" />
                )}
            </div>

        </div>
    )
}

export default Wishlist
import React, { useEffect, useState } from 'react'
import { USER_API_END_POINT } from '../../utils/api';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Search = () => {

    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (query.length > 2) {
            axios.get(`${USER_API_END_POINT}/searchproducts?q=${query}`,{
                headers: {
                    Authorization: token,
                  },
            })
                .then(response => setProducts(response.data))
                .catch(error => console.error(error));
        } else {
            setProducts([]); // Clear when query is short
        }
    }, [query]);

  return (
    <>
        <div class="mb-16">
    <div class="dark:bg-transparent">
        <div class="mx-auto flex flex-col items-center py-12 sm:py-24">
            <div class="w-11/12 sm:w-2/3 lg:flex justify-center items-center flex-col mb-5 sm:mb-10">
                <h1
                    class="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl text-center text-white  dark:text-black font-black leading-10">
                    Find It,
                    <span class="text-pink-800 dark:text-pink-500"> Love It, </span>
                    Buy It!
                </h1>
                <p class="mt-5 sm:mt-10 lg:w-10/12 text-gray-800 dark:text-gray-800 font-normal text-center text-xl">
                Your Shopping Assistant is Just a Search Away
                </p>
            </div>
            <div class="flex w-11/12 md:w-8/12 xl:w-6/12">
                <div class="flex rounded-md w-full">
                    <input type="text" name="q"
                        class="w-full p-3 rounded-md rounded-r-none border border-2 border-gray-300 placeholder-current dark:bg-gray-200  dark:text-pink dark:border-none "
                        placeholder="T-shirt"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                         />
                    {/* <button
                        class="inline-flex items-center gap-2 bg-violet-700 text-white text-lg font-semibold py-3 px-6 rounded-r-md">
                        <span>Find</span>
                        <svg class="text-gray-200 h-5 w-5 p-0 fill-current" xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px"
                            viewBox="0 0 56.966 56.966" style={ {enableBackground:'new 0 0 56.966 56.966'}}
                            xmlSpace="preserve">
                            <path
                                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                </button> */}
                </div>
            </div>
                <div className="mt-4">
                {products.length === 0 && query.length > 2 ? (
                    <p>No products found.</p>
                ) : (
                    products.map((product) => (
                        <Link to={`/product/${product._id}`} key={product._id}>
                            <div className="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">
                                <div className="group relative flex h-52 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-500/10 overflow-hidden">


                                    <img alt={product.title}
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        width="800" height="800"
                                        src={product.images[0]} />
                                
                                    {product.discountPercentage > 0 && (
                                        <span
                                            className="absolute rounded-br-2xl rounded-tr-2xl top-2 left-0 px-2 py-1 text-xs font-semibold text-white bg-red-500"
                                        >
                                            {product.discountPercentage}% Off
                                        </span>
                                    )}
                                  
                                    <button className="absolute top-2 right-2 rounded-full bg-white p-2 shadow-md">
                                        <img alt="heart_icon" width="10" height="10" className="h-3 w-3"
                                            src="https://quickcart-gs.vercel.app/_next/static/media/heart_icon.392ca0e2.svg" />
                                    </button>
                                </div>

                                <p className="w-full truncate pt-2 font-medium md:text-base">{product.name}</p>
                                <p className="w-full truncate text-xs text-gray-500/70 max-sm:hidden">{product.description}</p>
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
                                                src={`https://quickcart-gs.vercel.app/_next/static/media/star_icon.f42949da.svg`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-1 w-full items-end justify-between">
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-medium text-black-500">
                                            {/* ₹{parseInt(product.price - (product.price * product.discountPercentage) / 100)} */}
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
                        </Link>
                    ))
                )}
            </div>
        </div>
    </div>
</div>
    </>
  )
}

export default Search
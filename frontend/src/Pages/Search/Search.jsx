import React, { useEffect, useState } from 'react'
import { USER_API_END_POINT } from '../../utils/api';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { Heart } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { handleWishlist, wishlistLoading, wishlist } = useOrder();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (query.length > 2) {
      axios
        .get(`${USER_API_END_POINT}/searchproducts?q=${query}`, {
          headers: { Authorization: token },
        })
        .then(response => setProducts(response.data))
        .catch(error => console.error(error));
    } else {
      setProducts([]); // Clear when query is short
    }
  }, [query]);

  return (
    <>
      <div className="mb-16">
        <div className="dark:bg-transparent">
          <div className="mx-auto flex flex-col items-center py-12 sm:py-24">
            <div className="w-11/12 sm:w-2/3 lg:flex justify-center items-center flex-col mb-5 sm:mb-10">
              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl text-center text-white dark:text-black font-black leading-10">
                Find It,
                <span className="text-pink-800 dark:text-pink-500"> Love It, </span>
                Buy It!
              </h1>
              <p className="mt-5 sm:mt-10 lg:w-10/12 text-gray-800 dark:text-gray-800 font-normal text-center text-xl">
                Your Shopping Assistant is Just a Search Away
              </p>
            </div>

            <div className="flex w-11/12 md:w-8/12 xl:w-6/12">
              <div className="flex rounded-md w-full">
                <input
                  type="text"
                  name="q"
                  className="w-full p-3 rounded-md rounded-r-none border border-2 border-gray-300 placeholder-current dark:bg-gray-200 dark:text-pink dark:border-none"
                  placeholder="T-shirt"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 w-full">
              {products.length === 0 && query.length > 2 ? (
                <p className="text-center">No products found.</p>
              ) : (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full px-4">
                  {products.map((product) => (
                    <div key={product._id} className="flex flex-col items-start gap-0.5">
                      <div className="group relative flex h-52 w-full items-center justify-center rounded-lg bg-gray-500/10 overflow-hidden">
                        <Link to={`/product/${product._id}`} className="w-full h-full absolute z-10">
                          <img
                            src={product.images[0].replace("/upload/", "/upload/w_400,f_auto,q_auto/")}
                            srcSet={`
                              ${product.images[0].replace("/upload/", "/upload/w_300,f_auto,q_auto/")} 300w,
                              ${product.images[0].replace("/upload/", "/upload/w_600,f_auto,q_auto/")} 600w,
                              ${product.images[0].replace("/upload/", "/upload/w_1000,f_auto,q_auto/")} 1000w
                            `}
                            sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 1000px"
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
                          onClick={() => handleWishlist(product._id)}
                          disabled={wishlistLoading[product._id]}
                          className={`${wishlistLoading[product._id] ? 'opacity-50 cursor-not-allowed' : ''} absolute top-2 right-2 z-20 rounded-full bg-white p-2 shadow-md`}
                        >
                          <Heart className={`h-4 w-4 ${wishlist.includes(product._id) ? "text-red-600 fill-red-600" : "text-gray-400"}`} />
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;

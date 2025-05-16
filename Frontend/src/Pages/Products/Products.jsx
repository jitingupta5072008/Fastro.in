import { Heart, LucideLoader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useOrder } from '../../context/OrderContext';

const Products = () => {
  const [allproducts, setAllproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const { handleWishlist, wishlistLoading, wishlist } = useOrder();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${USER_API_END_POINT}/allproducts`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllproducts(data.products);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();

  }, [])



if (loading) {
  return (
    <div className="bg-white flex flex-col items-center mt-4 w-full">
      <h2 className="text-xl font-semibold text-left w-full mb-4">
        Loading products...
      </h2>
      <div className="mt-6 w-full flex-col items-center pb-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex flex-col w-full max-w-[200px] gap-1 animate-pulse">
            <div className="relative h-52 w-full rounded-lg bg-gray-300 overflow-hidden">
              <div className="absolute inset-0 bg-gray-200"></div>
              <button className="absolute top-2 right-2 rounded-full bg-white p-2">
                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
              </button>
            </div>
            <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
            <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-3 w-6 bg-gray-300 rounded"></div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-3 w-3 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
            <div className="mt-2 w-full">
              <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <h2 className="hd w-full text-left font-semibold">Popular products</h2>

      {/* <div className="mt-6  w-full flex-col items-center gap-6 pb-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Array.isArray(allproducts) && allproducts.length > 0 ? (
          allproducts.map((product) => (
            <div key={product._id} className="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">

              <div className="group relative flex h-52 w-full items-center justify-center rounded-lg bg-gray-500/10 overflow-hidden">

                <Link to={`/product/${product._id}`} className="w-full h-auto absolute z-10">

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
                  <span className="z-[99] absolute rounded-br-2xl z-[999] rounded-tr-2xl top-2 left-0 px-2 py-1 text-xs font-semibold text-white bg-red-500">
                    {product.discountPercentage}% Off
                  </span>
                )}

                <button
                  onClick={() => handleWishlist(product._id)}
                  disabled={wishlistLoading[product._id]}
                  className={`${wishlistLoading[product._id] ? 'opacity-50 cursor-not-allowed' : ''} absolute top-2 right-2 z-20 rounded-full bg-white p-2 shadow-md`}
                >
                 <Heart className={`h-4 w-4 ${ wishlist.includes(product._id) ? "text-red-600 fill-red-600" : "text-gray-400"} `} />
                   
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
                    ₹ {product.price - (product.price * product.discountPercentage / 100)}

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
      </div> */}

      <div className="mt-6 w-full flex-col items-center pb-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

        {allproducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (

          allproducts.map(product => (

            <div key={product._id} className="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">
              <div className="group relative flex h-52 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-500/10 overflow-hidden">


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
                  <span
                    className="absolute z-[99] rounded-br-2xl rounded-tr-2xl top-2 left-0 px-2 py-1 text-xs font-semibold text-white bg-red-500"
                  >
                    {product.discountPercentage}% Off
                  </span>
                )}


                <button
                  onClick={() => handleWishlist(product._id)}
                  disabled={wishlistLoading[product._id]}
                  className={`${wishlistLoading[product._id] ? 'opacity-50 cursor-not-allowed' : ''} absolute top-2 right-2 z-20 rounded-full bg-white p-2 shadow-md`}
                >
                  <Heart className={`h-4 w-4 ${wishlist.includes(product._id) ? "text-red-600 fill-red-600" : "text-gray-400"} `} />

                </button>



              </div>

              <Link to={`/product/${product._id}`} className="w-full">
                <p className="w-full truncate pt-2 font-medium md:text-base">{product.name}</p>
                <p className="w-full truncate text-xs text-gray-500/70 max-sm:hidden">{product.description}</p>
              </Link>

              <div className="flex items-center gap-2">
                <p className="text-xs">5k</p>
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
                    ₹ {Math.floor(product.price - (product.price * product.discountPercentage / 100))}
                  </p>

                  {product.discountPercentage > 0 && (
                    <p className="text-xs line-through text-gray-500">₹{product.price}</p>
                  )}

                </div>

                <button
                  disabled={product.availabilityStatus === "Out of Stock"}
                  className={`rounded-full mt-2 w-full px-4 py-1.5 text-xs transition max-sm:hidden
    ${product.availabilityStatus === "In Stock"
                      ? "border border-gray-500/20 text-gray-500"
                      : product.availabilityStatus === "Low Stock"
                        ? "focus:ring-4 border focus:outline-none transition bg-yellow-100 text-yellow-800 ring-yellow-400 animate-pulse"
                        : "border border-gray-400 text-gray-400 bg-gray-100 cursor-not-allowed"
                    }`}
                >
                  {product.availabilityStatus === "In Stock"
                    ? "Buy Now"
                    : product.availabilityStatus === "Low Stock"
                      ? "⚠️ Low Stock - Hurry!"
                      : "Out of Stock"}
                </button>

              </div>
            </div>

          ))
        )}
      </div>

      <button className="rounded border px-12 py-2.5 text-gray-500/70 transition hover:bg-slate-50/90">See more</button>
    </div>
  );
};

export default Products;

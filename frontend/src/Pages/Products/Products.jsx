import { Heart, LucideLoader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useOrder } from '../../context/OrderContext';

const Products = () => {
  const [allproducts, setAllproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleWishlist, wishlistLoading,wishlist  } = useOrder();
  
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
    return (<>
      <div class="bg-white flex flex-col items-center mt-4">

        <div class="mt-6 grid w-full grid-cols-2 flex-col items-center gap-6 pb-14 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

          <div class="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">
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

          <div class="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">
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
        </div>
      </div>

    </>);
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <h2 className="hd w-full text-left">Popular products</h2>

      <div className="mt-6 grid w-full grid-cols-2 flex-col items-center gap-6 pb-14 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.isArray(allproducts) && allproducts.length > 0 ? (
          allproducts.map((product) => (
            <div key={product._id} className="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">

              <div className="group relative flex h-52 w-full items-center justify-center rounded-lg bg-gray-500/10 overflow-hidden">

                <Link to={`/product/${product._id}`} className="w-full h-auto absolute z-10">
                  <img
                    alt={product.title}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    width="800"
                    height="800"
                    src={product.images[0]}
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
      </div>

      <button className="rounded border px-12 py-2.5 text-gray-500/70 transition hover:bg-slate-50/90">See more</button>
    </div>
  );
};

export default Products;

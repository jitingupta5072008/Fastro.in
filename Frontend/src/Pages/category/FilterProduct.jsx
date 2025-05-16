import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/api';
import { Link, useParams } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { Heart } from 'lucide-react';

const FilterProduct = () => {
  const id = useParams().name
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category
  const [recivedCat, setRecivedCat] = useState(id); // Track selected category
  const [loading, setLoading] = useState(true)
  const { handleWishlist, wishlistLoading, wishlist } = useOrder();

  // Fetch all categories
  useEffect(() => {
    axios.get(`${USER_API_END_POINT}/categories`)
      .then(res => setCategories(res.data.categories))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Fetch products based on selected category
  const fetchProducts = (category = "") => {
    setSelectedCategory(category); // Update selected category
    axios.get(`${USER_API_END_POINT}/products`, { params: { category } })
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching products:", err)
        setLoading(false)
      });
  };

  const fetchRecivedCatProducts = (recivedCat) => {
    // setSelectedCategory(id); // Update selected category
    axios.get(`${USER_API_END_POINT}/products`, { params: { category: recivedCat } })
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(err => console.error("Error fetching products:", err));
  };

  // Fetch all products initially
  useEffect(() => {
    fetchRecivedCatProducts(recivedCat);
    fetchProducts();
  }, []);

  const Wishlist = async (productId) => {
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    try {
      await handleWishlist(productId);
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };


  if (loading) {
    return <>

      <div className="flex  w-full p-2 bg-white mt-4 border overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="h-8 w-20 rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>

      <div class="w-full p-6 flex-grow">

        <div class="mt-6  w-full  flex-col items-center gap-6 pb-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} class="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">
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
    <div className="p-4 mb-8">

      {/* Category Filter Buttons */}


      {/* Categories: Horizontal Scroll Bar */}
      <div className="items-center justify-center sm:justify-center w-full p-2 bg-white [scrollbar-width:none] mt-4 border overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg whitespace-nowrap 
                      ${selectedCategory === '' ? "active" : "bg-gray-200 "}`}
            onClick={() => fetchProducts("")}
          >
            All
          </button>

          {categories.map(cat => (
            <button key={cat._id}
              className={`${selectedCategory === cat._id ? "active" : "bg-gray-200"} px-4 py-2 bg-gray-200 rounded-lg whitespace-nowrap `}
              onClick={() => fetchProducts(cat._id)} // Fetch products on click
            >
              {cat.name}
            </button>
          ))}

        </div>
      </div>

      {/* Product List */}
      <div className="w-full p-2 flex-grow">
        <h2 className="text-2xl font-bold mb-4">Products</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

          {products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (

            products.map(product => (

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

                  <button className="rounded-full mt-2 w-full border border-gray-500/20 px-4 py-1.5 text-xs text-gray-500 transition hover:bg-slate-50 max-sm:hidden">
                    Buy now
                  </button>
                </div>
              </div>

            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterProduct;

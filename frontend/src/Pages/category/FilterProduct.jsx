import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/api';
import { Link, useParams } from 'react-router-dom';

const FilterProduct = () => {
  const id = useParams().name
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category
  const [recivedCat,setRecivedCat ] = useState(id); // Track selected category

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
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  };

  const fetchRecivedCatProducts = (recivedCat) => {
    // setSelectedCategory(id); // Update selected category
    axios.get(`${USER_API_END_POINT}/products`, { params: { category:recivedCat } })
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  };

  // Fetch all products initially
  useEffect(() => {
    fetchRecivedCatProducts(recivedCat);
    fetchProducts();
  }, []);

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
      <div className="w-full p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

          {products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (

            products.map(product => (
              <Link key={product._id}>
                <div className="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">
                  <div className="group relative flex h-52 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-500/10 overflow-hidden">


                    <img alt='Fastro'
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      width="800" height="800"
                      src={product.images[0]} />

                    {/* {product.discountPercentage > 0 && (
                    <span
                    className="absolute rounded-br-2xl rounded-tr-2xl top-2 left-0 px-2 py-1 text-xs font-semibold text-white bg-red-500"
                    >
                      {product.discountPercentage}% Off
                      </span>
                      )} */}

                    <button className="absolute top-2 right-2 rounded-full bg-white p-2 shadow-md">
                      <img alt="heart_icon" width="10" height="10" className="h-3 w-3"
                        src="https://quickcart-gs.vercel.app/_next/static/media/heart_icon.392ca0e2.svg" />
                    </button>
                  </div>

                  <p className="w-full truncate pt-2 font-medium md:text-base">{product.name}</p>
                  <p className="w-full truncate text-xs text-gray-500/70 max-sm:hidden">{product.description}</p>
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
                        {/* ₹{parseInt(product.price - (product.price * product.discountPercentage) / 100)} */}
                        ₹{parseInt(product.price)}
                      </p>

                      {/* {product.discountPercentage > 0 && (
                      <p className="text-xs line-through text-gray-500">₹{product.price}</p>
                    )} */}

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
  );
};

export default FilterProduct;

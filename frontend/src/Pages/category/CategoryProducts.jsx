import React, { useEffect, useState } from 'react'
import { USER_API_END_POINT } from '../../utils/api';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../../component/breadCrumbs/Breadcrumbs';

const CategoryProducts = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState([]);


  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/products/category/${slug}`);
        setProduct(res.data.products); // Array of { image, category }
      } catch (err) {
        console.error("Error fetching slider data", err);
      }
    };
    fetchSliderData();
  }, []);
  return (
    <>
     <Breadcrumbs slug={slug} />

      <div className="px-6 md:px-16 lg:px-32 mb-8 flex flex-col items-center mt-4">
        <h2 className="hd w-full text-left">Popular products</h2>

        <div className="mt-6 grid w-full grid-cols-2 flex-col items-center gap-6 pb-14 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.isArray(product) && product.length > 0 ? (
            product.map((product) => (
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
          ) : (
            <div>No products found.</div>
          )}
        </div>

        <button className="rounded border px-12 py-2.5 text-gray-500/70 transition hover:bg-slate-50/90">See more</button>
      </div>
    </>
  )
}

export default CategoryProducts
import React, { useEffect, useState } from 'react'
import { Pizza } from 'lucide-react'
import { USER_API_END_POINT } from '../../utils/api'
import { Link } from 'react-router-dom'

import './category.css'
const HomeCategoryIcon = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    fetch(`${USER_API_END_POINT}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setLoading(false); // ✅ Correct place
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false); // ❗Even on error, stop loading
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <div className='flex [gap:15px]'>
       {[1,2,3,4,5].map((_,index)=>(
      <div className="flex flex-col items-center animate-pulse space-y-2">
        <div className="w-16 h-16 bg-gray-300 rounded-full" />
        <div className="w-20 h-4 bg-gray-300 rounded" />
      </div>
       ))}
    </div>;
  }

  return (
    <div className="catSliderSection mt-8">
      <div className="container-fluid">
        <h2 className="hd">Featured Categories</h2>
        <div className="slick-slider cat_slider_Main slick-initialized">
          <div className="slick-list">
            <div className="slick-track gap-4 md:gap-12 " style={{ display: 'flex', gap: '15px', opacity: 1, transform: "translate3d(0px, 0px, 0px)", width: 672 }}>

              {categories && categories.length > 0 ? (
                categories.map((cat, index) => (

                  <div data-index={0} key={index} className="slick-slide slick-active slick-current" tabIndex={-1} aria-hidden="false" style={{ outline: "none" }}>
                    <div>
                      <div
                        className="item"
                        tabIndex={-1}
                        style={{ width: "100%", display: "inline-block" }}
                      >
                        <Link to={`/products/category/${cat.slug}`}>
                          <div
                            className="info"
                            style={{ background: `${cat.bgColor}` }}
                          >
                            <img
                              src={cat.imageUrl}
                              width={80}
                            />
                          </div>
                          <h5 className="text-capitalize">{cat.name}</h5>
                        </Link>
                      </div>
                    </div>
                  </div>

                ))
              ) : (
                <p>Not found Category</p>
              )}




            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default HomeCategoryIcon
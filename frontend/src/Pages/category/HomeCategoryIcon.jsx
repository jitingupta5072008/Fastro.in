import React, { useEffect, useState } from 'react';
import { USER_API_END_POINT } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import './category.css';
import { Link } from 'react-router-dom';

const HomeCategoryIcon = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [subCategories, setSubCategories] = useState([]);

  const handleCategoryClick = async (cat) => {
    setSelectedCategory(cat);
    try {
      const res = await fetch(`${USER_API_END_POINT}/categories/subcategories/${cat._id}`);
      const data = await res.json();
      setSubCategories(data.subCategories);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubCategories([]);
    }
  };

  // console.log(selectedCategory)

  useEffect(() => {
    fetch(`${USER_API_END_POINT}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="flex flex-col items-center animate-pulse space-y-2">
            <div className="w-16 h-16 bg-gray-300 rounded-full" />
            <div className="w-20 h-4 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (<>

    {/* // <div className="catSliderSection mt-8">
    //   <div className="container-fluid">
    //     <h2 className="hd">Featured Categories</h2>

    //     <div className="flex flex-wrap gap-4 md:gap-8">
    //       {categories.length > 0 ? (
    //         categories.map((cat, index) => (
    //           <div key={index} className="item cursor-pointer" onClick={() => handleCategoryClick(cat)}>
    //             <div className="info" style={{ background: cat.bgColor }}>
    //               <img src={cat.imageUrl} alt={cat.name} width={80} className="mx-auto" />
    //             </div>
    //             <h5 className="text-center mt-2 capitalize">{cat.name}</h5>
    //           </div>
    //         ))
    //       ) : (
    //         <p>No categories found.</p>
    //       )}
    //     </div>

    //   </div>
    // </div> */}


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
                        <Link to={'/'} onClick={() => handleCategoryClick(cat)} >
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


   {/* Bottom Popup for Subcategories */}

   <AnimatePresence>
  {selectedCategory && (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-[60px] md:bottom-[0px] lg:bottom-[0px] h-[45vh] left-0 right-0 bg-white rounded-t-3xl shadow-lg z-[100]"
    >
      {/* Fixed Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-xl font-semibold">{selectedCategory.name}</h2>
          <p className="text-sm text-gray-500">Explore Subcategories</p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSubCategories([]);
          }}
          className="text-gray-500 hover:text-black text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="h-[calc(45vh-80px)] overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {subCategories.map((sub, idx) => (
            <div
              key={idx} onClick={() => handleCategoryClick(sub)}
              className="flex flex-col items-center p-3 rounded-xl border hover:shadow-md transition"
            >
              <img
                src={sub.imageUrl}
                alt={sub.name}
                className="w-14 h-14 object-contain mb-2"
              />
              <p className="text-sm font-medium text-gray-700">{sub.name}</p>
            </div>
         ))}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>



    </>
  );
};

export default HomeCategoryIcon;

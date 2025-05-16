import React, { useEffect, useState } from 'react';
import { USER_API_END_POINT } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import './category.css';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const HomeCategoryIcon = () => {
  const navigate = useNavigate();
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
      <div className="catSliderSection mt-8">
        <div className="flex gap-4 overflow-x-auto px-4 pb-2">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex flex-col items-center animate-pulse space-y-2"
            >
              <div className="rounded-full bg-gray-300 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
              <div className="bg-gray-300 rounded h-3 w-16 sm:w-20 md:w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="catSliderSection mt-8">
        <div className="container-fluid">
          <h2 className="hd font-semibold">Featured Categories</h2>

          {/* Horizontally scrollable list */}
          <div className="overflow-x-auto hide-scrollbar">
           <div className="flex gap-4 md:gap-6 px-4 py-2 whitespace-nowrap">
  {categories && categories.length > 0 ? (
    categories.map((cat, index) => (
      <div key={index} className="flex-shrink-0">
        <div
          onClick={() => handleCategoryClick(cat)}
          className="group cursor-pointer flex flex-col items-center transition-transform duration-300 transform hover:scale-105"
        >
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-md border-2 border-white"
            style={{ background: cat.bgColor }}
          >
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="w-12 sm:w-14 md:w-16 h-auto object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <p className="mt-2 text-sm sm:text-base font-semibold text-gray-800 capitalize text-center">
            {cat.name}
          </p>
        </div>
      </div>
    ))
  ) : (
    <p>No categories found.</p>
  )}
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
            className="fixed bottom-[60px] md:bottom-0 h-[45vh] left-0 right-0 bg-white rounded-t-3xl shadow-lg z-[100]"
          >
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

            <div className="h-[calc(45vh-80px)] overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {subCategories.length === 0 ? (
                  <div className="flex items-center justify-center my-8 col-span-full">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                  </div>
                ) : (
                  subCategories.map((sub, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate(`/products/category/${sub.name}`)}
                      className="flex flex-col items-center p-3 rounded-xl border hover:shadow-md transition cursor-pointer"
                    >
                      <img
                        src={sub.imageUrl}
                        alt={sub.name}
                        className="w-14 h-14 object-contain mb-2"
                      />
                      <p className="text-sm font-medium text-gray-700">{sub.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomeCategoryIcon;

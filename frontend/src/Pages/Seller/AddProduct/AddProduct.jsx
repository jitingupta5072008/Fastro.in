import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom';
// import { SELLER_API_END_POINT } from '../../utils/api';
import { SELLER_API_END_POINT } from '../../../utils/api';
import axios from 'axios';

const AddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [stock, setStock] = useState(0);
  const [shippingInformation, setShippingInformation] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("In Stock");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState(1);

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [image5, setImage5] = useState(false);
  const [image6, setImage6] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setUser(null);
    navigate('/login');

  };
  const handleChange = (e, setter) => {
    setter(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const seller = localStorage.getItem("seller")
    try {
      const formData = new FormData();
      formData.append("name",name)
      formData.append("description",description)
      formData.append("category",category)
      formData.append("price",price)
      formData.append("discountPercentage",discountPercentage)    
      formData.append("stock",stock)
      formData.append("shippingInformation",shippingInformation)
      formData.append("availabilityStatus",availabilityStatus)
      formData.append("returnPolicy",returnPolicy)
      formData.append("minimumOrderQuantity",minimumOrderQuantity)
      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)
      image5 && formData.append("image5",image5)
      image6 && formData.append("image6",image6)

        const res = await axios.post(`${SELLER_API_END_POINT}/add-product`,formData,
            {
                headers: {
                    Authorization: seller,
                }
            }
        );
        if (res.status === 403) {
          handleLogout();
        }
        console.log(res);
        toast.success(res.data.message);
    } catch (error) {
      console.log(error);
        toast.error(error.response.data.message);
    }
};
  

  return (

    <div className="flex flex-col min-h-screen bg-gray-50 mb-20">

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <form action="" onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className='mb-4'>
          <p class="text-base font-medium">Product Image</p>

           <div class="mt-2 flex flex-wrap items-center gap-3">
         
          <label htmlFor="image1">
            <img src={!image1 ? 'https://images.vexels.com/media/users/3/144131/isolated/preview/29576a7e0442960346703d3ecd6bac04-picture-doodle-icon.png' : URL.createObjectURL(image1)} alt="" className="w-20" />
            <input onChange={(e)=> setImage1(e.target.files[0])} type="file" id='image1' hidden />
          </label>
          <label htmlFor="image2">
            <img src={!image2 ? 'https://images.vexels.com/media/users/3/144131/isolated/preview/29576a7e0442960346703d3ecd6bac04-picture-doodle-icon.png' : URL.createObjectURL(image2)} alt="" className="w-20" />
            <input onChange={(e)=> setImage2(e.target.files[0])} type="file" id='image2' hidden />
          </label>
          <label htmlFor="image3">
            <img src={!image3 ? 'https://images.vexels.com/media/users/3/144131/isolated/preview/29576a7e0442960346703d3ecd6bac04-picture-doodle-icon.png' : URL.createObjectURL(image3)} alt="" className="w-20" />
            <input onChange={(e)=> setImage3(e.target.files[0])} type="file" id='image3' hidden />
          </label>
          <label htmlFor="image4">
            <img src={!image4 ? 'https://images.vexels.com/media/users/3/144131/isolated/preview/29576a7e0442960346703d3ecd6bac04-picture-doodle-icon.png' : URL.createObjectURL(image4)} alt="" className="w-20" />
            <input onChange={(e)=> setImage4(e.target.files[0])} type="file" id='image4' hidden />
          </label>
          <label htmlFor="image5">
            <img src={!image5 ? 'https://images.vexels.com/media/users/3/144131/isolated/preview/29576a7e0442960346703d3ecd6bac04-picture-doodle-icon.png' : URL.createObjectURL(image5)} alt="" className="w-20" />
            <input onChange={(e)=> setImage5(e.target.files[0])} type="file" id='image5' hidden />
          </label>
          <label htmlFor="image6">
            <img src={!image6 ? 'https://images.vexels.com/media/users/3/144131/isolated/preview/29576a7e0442960346703d3ecd6bac04-picture-doodle-icon.png' : URL.createObjectURL(image6)} alt="" className="w-20" />
            <input onChange={(e)=> setImage6(e.target.files[0])} type="file" id='image6' hidden />
          </label>
          
            

           
          </div>
        </div>

        {/* Product Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        className="border p-2 rounded w-full"
        value={name}
        onChange={(e) => handleChange(e, setName)}
      />
      <textarea
        name="description"
        placeholder="Product Description"
        className="border p-2 rounded w-full"
        rows="2"
        value={description}
        onChange={(e) => handleChange(e, setDescription)}
      ></textarea>

       <select
        name="category"
        className="border p-2 rounded w-full"
        value={category}
        onChange={(e) => handleChange(e, setCategory)}
      >
        <option value="">Select Category</option>
        <option value="Earphone">Earphone</option>
        <option value="Mobile">Mobile</option>
        <option value="Laptop">Laptop</option>
        <option value="T-shirt">T-shirt</option>
      </select>

      <input
        type="number"
        name="price"
        placeholder="Product Price"
        className="border p-2 rounded w-full"
        value={price}
        onChange={(e) => handleChange(e, setPrice)}
      />
      <input
        type="number"
        name="discountPercentage"
        placeholder="Offer Price"
        className="border p-2 rounded w-full"
        value={discountPercentage}
        onChange={(e) => handleChange(e, setDiscountPercentage)}
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        className="border p-2 rounded w-full"
        value={stock}
        onChange={(e) => handleChange(e, setStock)}
      />
      {/* <input
        type="text"
        name="brand"
        placeholder="Brand"
        className="border p-2 rounded w-full"
        value={brand}
        onChange={(e) => handleChange(e, setBrand)}
      /> */}
      {/* <input
        type="text"
        name="sku"
        placeholder="SKU"
        className="border p-2 rounded w-full"
        value={sku}
        onChange={(e) => handleChange(e, setSku)}
      /> */}

      {/* <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        className="border p-2 rounded w-full"
        value={weight}
        onChange={(e) => handleChange(e, setWeight)}
      /> */}

   
      <div className="flex space-x-2">
        {/* <input
          type="number"
          name="dimensions.length"
          placeholder="Length"
          className="border p-2 rounded w-full"
          value={length}
          onChange={(e) => handleChange(e, setLength)}
        />
        <input
          type="number"
          name="dimensions.width"
          placeholder="Width"
          className="border p-2 rounded w-full"
          value={width}
          onChange={(e) => handleChange(e, setWidth)}
        />
        <input
          type="number"
          name="dimensions.height"
          placeholder="Height"
          className="border p-2 rounded w-full"
          value={height}
          onChange={(e) => handleChange(e, setHeight)}
        /> */}
      </div>

      {/* <input
        type="text"
        name="warrantyInformation"
        placeholder="Warranty Info"
        className="border p-2 rounded w-full"
        value={warrantyInformation}
        onChange={(e) => handleChange(e, setWarrantyInformation)}
      /> */}
      <input
        type="text"
        name="shippingInformation"
        placeholder="Shipping Info"
        className="border p-2 rounded w-full"
        value={shippingInformation}
        onChange={(e) => handleChange(e, setShippingInformation)}
      />

      <select
        name="availabilityStatus"
        className="border p-2 rounded w-full"
        value={availabilityStatus}
        onChange={(e) => handleChange(e, setAvailabilityStatus)}
      >
        <option value="In Stock">In Stock</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>

      <input
        type="text"
        name="returnPolicy"
        placeholder="Return Policy"
        className="border p-2 rounded w-full"
        value={returnPolicy}
        onChange={(e) => handleChange(e, setReturnPolicy)}
      />
      <input
        type="number"
        name="minimumOrderQuantity"
        placeholder="Min Order Quantity"
        className="border p-2 rounded w-full"
        value={minimumOrderQuantity}
        onChange={(e) => handleChange(e, setMinimumOrderQuantity)}
      />

      {/* <input
        type="text"
        name="barcode"
        placeholder="Barcode"
        className="border p-2 rounded w-full"
        value={barcode}
        onChange={(e) => handleChange(e, setBarcode)}
      />
      <input
        type="text"
        name="qrCode"
        placeholder="QR Code"
        className="border p-2 rounded w-full"
        value={qrCode}
        onChange={(e) => handleChange(e, setQrCode)}
      /> */}

      {/* <input
        type="text"
        name="thumbnail"
        placeholder="Thumbnail URL"
        className="border p-2 rounded w-full"
        value={thumbnail}
        onChange={(e) => handleChange(e, setThumbnail)}
      /> */}
    </div> 

        {/* Submit Button */}
        <button className="mt-4 bg-orange-500 text-white p-2 w-full rounded" type='submit' >Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

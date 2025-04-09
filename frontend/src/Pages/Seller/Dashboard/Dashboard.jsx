import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("add-product");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left Panel - Content Display */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg">
        {activeTab === "add-product" && <AddProduct />}
        {activeTab === "products-list" && <ProductsList />}
        {activeTab === "orders" && <Orders />}
      </div>

      {/* Right Panel - Navigation Buttons */}
      <div className="md:w-64 text-white flex md:flex-col p-4 gap-2 md:space-y-2 fixed bottom-0 md:static w-full">
        <button
          className={`flex-1 md:flex-none p-3 rounded-lg ${activeTab === "add-product" ? "bg-pink-500" : "bg-gray-700"}`}
          onClick={() => setActiveTab("add-product")}
        >
          Add Product
        </button>
        <button
          className={`flex-1 md:flex-none p-3 rounded-lg ${activeTab === "products-list" ? "bg-pink-500" : "bg-gray-700"}`}
          onClick={() => setActiveTab("products-list")}
        >
          Products List
        </button>
        <button
          className={`flex-1 md:flex-none p-3 rounded-lg ${activeTab === "orders" ? "bg-pink-500" : "bg-gray-700"}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>
    </div>
  );
}

function AddProduct() {
  return <div>Add Product Form yahan aayega.</div>;
}

function ProductsList() {
  return <div>Products ki list yahan dikhegi.</div>;
}

function Orders() {
  return <div>Orders yahan dikhenge.</div>;
}

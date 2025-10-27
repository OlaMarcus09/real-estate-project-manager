import React from 'react';

const Inventory = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Dashboard</h1>
      
      {/* Inventory summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Items</h3>
          <p className="text-2xl">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Low Stock</h3>
          <p className="text-2xl text-red-500">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Categories</h3>
          <p className="text-2xl">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Value</h3>
          <p className="text-2xl">$0</p>
        </div>
      </div>

      {/* Inventory table placeholder */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Inventory Items</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          Inventory management coming soon...
        </div>
      </div>
    </div>
  );
};

export default Inventory;

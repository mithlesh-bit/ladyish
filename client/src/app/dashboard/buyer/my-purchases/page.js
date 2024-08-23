"use client";

import Inform from "@/components/icons/Inform";
import Dashboard from "@/components/shared/layouts/Dashboard";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const user = useSelector((state) => state.auth.user);

  console.log(11,user);
// Assume 'targetOrderId' is the ID of the purchase you want to highlight
const targetOrderId = "order_OhKGtComRw8Irt";

return (
  <Dashboard>
    {user && user.purchases ? (
      user.purchases.length > 0 ? (
        <section className="w-full p-4 bg-gray-100">
          {user.purchases.map((purchase) => (
            <div key={purchase._id} className="bg-white rounded-lg shadow-lg mb-5 overflow-hidden">
              <div className="px-4 py-3 text-white" style={{ backgroundColor:  '#EDDC91' }}>
                <h3 className="text-lg font-bold">Order ID: {purchase.orderId}</h3>
                <p>Status:
                  <span className={`ml-2 px-3 py-1 rounded-lg text-sm text-white font-semibold ${purchase.status === "Delivered" ? "bg-green-600" : "bg-red-600"}`}>
                    {purchase.status}
                  </span>
                </p>
              </div>
              {purchase.products.map((productInfo, index) => (
                <div key={index} className="border-t border-gray-200 last:border-b flex items-center p-4 hover:bg-gray-50 transition-colors">
                  <img
                    src={productInfo.product?.gallery?.[0]?.url || 'https://via.placeholder.com/80'}
                    alt={productInfo.product?.title}
                    className="h-24 w-24 flex-shrink-0 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900">{productInfo.product?.title}</h4>
                    <p className="text-sm text-gray-600">Quantity: {productInfo.quantity}</p>
                    <p className="text-sm text-gray-600">Size: {productInfo.product?.variations?.sizes?.join(', ')}</p>
                    <p className="text-sm text-gray-600">Colors: {productInfo.product?.variations?.colors?.map(color => (
                      <span key={color} className="inline-block w-4 h-4" style={{ backgroundColor: `#${color}` }}></span>
                    ))}</p>
                    <p className="text-sm font-semibold">Price: ₹{productInfo.product.price * productInfo.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
      ) : (
        <p className="text-center text-sm py-4">No Purchases Found</p>
      )
    ) : (
      <p className="text-center text-sm py-4">Loading purchases...</p>
    )}
  </Dashboard>
);







  
};

export default Page;

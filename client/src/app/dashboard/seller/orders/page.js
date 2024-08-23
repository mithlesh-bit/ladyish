"use client";

import Inform from "@/components/icons/Inform";
import Pencil from "@/components/icons/Pencil";
import Trash from "@/components/icons/Trash";
import User from "@/components/icons/User";
import Modal from "@/components/shared/Modal";
import Dashboard from "@/components/shared/layouts/Dashboard";
import tag from "../../../../../public/tag.svg";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const OrderDetailsPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDialogId, setActiveDialogId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleDialog = (orderId) => {
    setActiveDialogId(orderId === activeDialogId ? null : orderId);
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch( `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/orders`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      console.log("API Response:", json);

      const detailedOrders = await Promise.all(
        json.data.map(async (order) => {
          const customerResponse = await fetch(
             `${process.env.NEXT_PUBLIC_BASE_URL}/user/get-user-details/${order.customer}`
          );
          const customerJson = await customerResponse.json();
          const customer = customerJson.acknowledgement
            ? customerJson.data
            : null;

          const address = order.address
            ? await fetch(
                `process.env.NEXT_PUBLIC_BASE_URLaddress/adress-details/${order.address}`
              )
                .then((res) => res.json())
                .catch((err) => console.error("Fetch address failed:", err))
            : null;

          const products = await Promise.all(
            order.products.map(async (prod) => {
              const productDetails = await fetch(
                 `${process.env.NEXT_PUBLIC_BASE_URL}/product/get-product/${prod.product}`
              )
                .then((res) => res.json())
                .catch((err) => console.error("Fetch product failed:", err));

              return {
                ...productDetails.data,
                quantity: prod.quantity,
              };
            })
          );

          return {
            ...order,
            customer,
            address,
            products,
          };
        })
      );

      setOrders(detailedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    const response = await fetch(
       `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/update-purchase-status/${orderId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (response.ok) {
      toast.success("Status updated successfully");
      setActiveDialogId(null);
      fetchOrders();
    } else {
      console.error("Failed to update status");
    }
  };

  // if (isLoading) return <p>Loading...</p>;
  // if (!orders.length) return <p>No orders found!</p>;

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <Dashboard>
      <div className="mx-5 container px-5 py-5 overflow-x-hidden">
        <h1 className="text-2xl font-bold text-center mb-6">Order Details</h1>
        <select
          className="mb-4 p-4 border rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Ordered">Ordered</option>
          <option value="In Progress">In Progress</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
        </select>
        <div className="grid gap-y-4 gap-x-8">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="mb-8 p-4 border rounded-lg shadow-lg relative"
            >
              <div className="flex items-center gap-x-4">
                <h2 className="text-lg font-semibold">
                  Order ID: {order.orderId}
                </h2>

                <span
                  className={`px-3 border text-s uppercase rounded-secondary ${
                    order.status === "Delivered"
                      ? "bg-green-50 border-green-900 text-green-900"
                      : "bg-red-50 border-red-900 text-red-900"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="absolute top-0 right-5 p-5">
                <Image
                  src={tag}
                  alt="Brand Logo"
                  width={22}
                  height={22}
                  className="mx-auto"
                  onClick={() => toggleDialog(order.orderId)}
                />

                {activeDialogId === order.orderId && (
                  <div className="absolute top-0 right-0 mt-12 mr-4 bg-white border rounded shadow-lg p-4 z-10">
                    <ul>
                      <li
                        className="cursor-pointer hover:bg-gray-100 p-2"
                        onClick={() => updateStatus(order._id, "Ordered")}
                      >
                        Ordered
                      </li>
                      <li
                        className="cursor-pointer hover:bg-gray-100 p-2"
                        onClick={() => updateStatus(order._id, "In Progress")}
                      >
                        In Progress
                      </li>
                      <li
                        className="cursor-pointer hover:bg-gray-100 p-2"
                        onClick={() => updateStatus(order._id, "Dispatched")}
                      >
                        Dispatched
                      </li>
                      <li
                        className="cursor-pointer hover:bg-gray-100 p-2"
                        onClick={() => updateStatus(order._id, "Delivered")}
                      >
                        Delivered
                      </li>
                      <li
                        className="cursor-pointer hover:bg-gray-100 p-2"
                        onClick={() => updateStatus(order._id, "Completed")}
                      >
                        Completed
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <strong>Customer:</strong>
                {order.customer
                  ? ` ${order.customer.name} - (${order.customer.email}, ${order.customer.phone})`
                  : "Customer data not available"}
              </div>
              <div>
                <strong>Address:</strong>
                {order.address
                  ? ` ${order.address.name} - (${order.address.house}, ${order.address.address}, ${order.address.city}, ${order.address.state}, ${order.address.pincode}) (${order.address.number})`
                  : "Address not provided"}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">Products:</h3>
                {order.products.map((product, idx) => (
                  <Link
                    key={idx} // Move the key prop here
                    href={`/product?product_id=${product._id}&product_title=${product.title}`}
                    target="_blank"
                  >
                    <div className="flex items-center gap-4 mt-2">
                      <img
                        src={product.thumbnail.url}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <div>
                          {product.title} - ${product.price.toFixed(2)}
                        </div>
                        <div>Quantity: {product.quantity}</div>
                        <div>
                          Colors: {product.variations.colors.join(", ")}
                        </div>
                        <div>Sizes: {product.variations.sizes.join(", ")}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-2">
                <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}{" "}
                <strong>Status:</strong> {order.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dashboard>
  );
};

export default OrderDetailsPage;

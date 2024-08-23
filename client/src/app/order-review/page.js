"use client";

import Cart from "@/components/icons/Cart";
import React, { useEffect, useState } from "react";
const axios = require("axios");
const Razorpay = require("razorpay");
import Image from "next/image";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPhone,
  faMapPin,
  faCity,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import Trash from "@/components/icons/Trash";
import { useDeleteFromCartMutation } from "@/services/cart/cartApi";
import { toast } from "react-hot-toast";
import Inform from "@/components/icons/Inform";
import { useCreatePaymentMutation } from "@/services/payment/paymentApi";

const OrderReview = () => {
  const { user } = useSelector((state) => state.auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const [removeFromCart, { isLoading, data, error }] =
    useDeleteFromCartMutation();

  const [selectedAddressId, setSelectedAddressId] = useState("");

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  useEffect(() => {
    if (isLoading) {
      toast.loading("Removing item from cart...", { id: "removeFromCart" });
    }

    if (data) {
      toast.success(data?.description, { id: "removeFromCart" });
    }

    if (error?.data) {
      toast.error(error?.data?.description, { id: "removeFromCart" });
    }

    if (addresses.length > 0) {
      setSelectedAddressId(addresses[0]._id);
    }

    if (user._id) {
      fetchAllAddresses();
    } else {
      setLoading(false);
    }
  }, [isLoading, data, error, user, addresses]);

  const fetchAllAddresses = async () => {
    setLoading(true);
    //console.log(user);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/address/user/${user._id}/addresses`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setAddresses(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load addresses: " + error.message);
      setLoading(false);
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const makePayment = () => {
    if (!user?.cart?.length) {
      // Checks if the cart is empty or not initialized
      toast.error("Your cart is empty.");
      return;
    }

    console.log(522, selectedAddressId);

    if (addresses.length == 0) {
      // Checks if the address list is empty or not initialized
      toast.error("Please add an address.");
      toggleDialog(); // Assume toggleDialog is defined elsewhere to handle dialog visibility
      return;
    }

    paymentHandler(); // Proceed with payment if the above conditions are met
  };

  const paymentHandler = async (e) => {
    if (e) e.preventDefault();

    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const totalAmount = user.cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0 // Starting with an initial value of 40
    );

    const finalTotalAmount =
      totalAmount < 2000 ? totalAmount + 50 : totalAmount;

    //const totalAmount = 1000;
    const amountInPaise = finalTotalAmount * 100;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/order`,
      {
        method: "POST",
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: "qwsaq1",
        }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const order = await response.json();

    var options = {
      key: "rzp_live_iJ3q2gfD23AzDs",
      amount: amountInPaise,
      currency: "INR",
      name: "Ladyish",
      description: "Product Purchase Transaction",
      image:
        "https://res.cloudinary.com/dxaey2vvg/image/upload/v1722103344/ladyish_eddcd4_ermjov.png",
      order_id: order.id,
      handler: async function (response) {
        const userToken = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage

        // Dynamically create the products array from the cart
        const products = user.cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        }));

        // const totalAmount = user.cart.reduce(
        //   (total, item) => total + item.product.price * item.quantity,
        //   0
        // ); // Calculate total dynamically

        const validateRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payment/order/validate`,
          {
            method: "POST",
            body: JSON.stringify({
              ...response,
              userToken: userToken,
              products: products, // Send dynamic product list
              address: selectedAddressId, // Use the dynamically selected address ID
              amount: finalTotalAmount,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const validationResponse = await validateRes.json();
        if (validationResponse.status == "success") {
          toast.success("Payment successful! Your order is confirmed.");
          router.push("/dashboard/buyer/my-purchases");
        } else {
          toast.error(
            "Payment verification failed. You can retry your payment"
          );
        }
      },

      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      // Handle the payment failure here
      toast.error(`Payment Failed: ${response.error.description}`);
    });
    rzp1.open();
  };

  const deleteAddress = async (addressId) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/address/delete-address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status === 404) {
        toast.error("Address not found");
      } else if (response.status === 200) {
        toast.success("Address deleted successfully");
        // Update the local state to remove the deleted address from the UI
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => address._id !== addressId)
        );
      } else {
        throw new Error(data.message || "Error deleting the address");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete the address");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-5 mt-10">
        <div className="flex flex-col md:flex-row gap-x-8">
          {/* Scrollable Products List */}
          <div className="flex flex-col w-full md:w-3/5 h-screen overflow-y-auto  scrollbar-hide">
            <div className="flex flex-col gap-y-4">
              <div className="relative mb-10 border-2 border-gray-200 p-10">
                <h2 className="text-xl mb-7 flex justify-between items-center">
                  Address Details
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={toggleDialog}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487a1.875 1.875 0 012.651 2.651l-9.193 9.193a4.5 4.5 0 01-2.122 1.19l-2.703.676a.75.75 0 01-.927-.927l.676-2.703a4.5 4.5 0 011.19-2.122l9.193-9.193z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 7.5l-3-3"
                      />
                    </svg>
                  </button>
                </h2>

                <div className="p-2">
                  {addresses
                    .slice(0, showAll ? addresses.length : 1)
                    .map((address, index) => (
                      <div
                        key={index}
                        className="flex flex-column gap-x-1 transition-all mb-3 border border-stone-400 p-2 rounded hover:border-black group relative"
                      >
                        <input
                          name="connected"
                          id={`address-${address._id}`}
                          type="radio"
                          className="mt-2 radio-black" // Apply the custom class here
                          value={address._id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          checked={selectedAddressId === address._id}
                        />
                        <div className="flex flex-col ml-3">
                          <h3 className="text-lg font-bold mb-1">
                            {address.name}
                          </h3>
                          <p className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faHome} className="mr-2" />
                            {address.house} {address.address}
                          </p>
                          <p className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faMapPin} className="mr-2" />
                            {address.pincode}
                          </p>
                          <p className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faCity} className="mr-2" />
                            {address.city}, {address.state}
                          </p>
                          <p className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faPhone} className="mr-2" />
                            {address.number}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="opacity-0 transition-opacity group-hover:opacity-100 absolute top-2 right-2 border p-1 rounded bg-red-100 text-red-900 border-red-900"
                          onClick={() => deleteAddress(address._id)}
                        >
                          <Trash />
                        </button>
                      </div>
                    ))}
                  {addresses.length > 1 && (
                    <button
                      onClick={toggleShowAll}
                      className="bg-black hover:bg-black/90 text-white py-2 px-4 rounded"
                    >
                      {showAll ? "Show Less" : "View All"}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="mb-10 border-2 border-gray-200 p-10">
                <h2 className="text-xl mb-7">Order Items</h2>
                {user?.cart?.map(({ product, quantity, _id }) => (
                  <div
                    key={product?._id}
                    className="flex flex-row gap-x-2 transition-all mb-3 border border-transparent p-2 rounded hover:border-black group relative"
                  >
                    <Image
                      src={product?.thumbnail?.url}
                      alt={product?.thumbnail?.public_id}
                      width={200}
                      height={200}
                      className="rounded h-[100px] w-[100px] object-cover"
                    />
                    <article className="flex flex-col gap-y-2">
                      <div className="flex flex-col gap-y-0.5">
                        <h1 className="text-lg">{product?.title}</h1>
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <p className="flex justify-between items-baseline">
                          <span className="text-[15px]">
                            ₹
                            <span className="text-[15px] text-black">
                              {product?.price}.00
                            </span>
                          </span>
                          <span className="whitespace-nowrap text-[12px] bg-indigo-300/50 text-indigo-500 border border-indigo-500 px-1.5 rounded">
                            QTY
                            <span className="text-sm text-black ml-1">
                              {quantity}
                            </span>
                          </span>
                        </p>
                      </div>
                    </article>
                    <button
                      type="button"
                      className="opacity-0 transition-opacity group-hover:opacity-100 absolute top-2 right-2 border p-1 rounded bg-red-100 text-red-900 border-red-900"
                      onClick={() => removeFromCart(_id)}
                    >
                      <Trash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Static Pricing Summary */}
          <div className="w-full md:w-2/5 bg-white p-6 shadow rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <span className="text-sm font-medium bg-yellow-200 text-yellow-800 py-1 px-2 rounded-full">
                Free Shipping over ₹2000
              </span>
            </div>
            <div className="flex justify-between border-b pb-3 pt-3">
              <span>Subtotal</span>
              <span>{user?.cart?.length} items</span>
              <span>
                ₹{" "}
                {user?.cart
                  ?.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            {/* Calculate total to decide fee waiver */}
            {user && (
              <>
                <div
                  className={`flex justify-between border-b py-3 ${
                    user?.cart?.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    ) > 2000
                      ? "line-through"
                      : ""
                  }`}
                >
                  <span>Packaging Fee</span>
                  <span>
                    ₹{" "}
                    {user?.cart?.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    ) > 2000
                      ? "0.00"
                      : "10.00"}
                  </span>
                </div>
                <div
                  className={`flex justify-between border-b py-3 ${
                    user?.cart?.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    ) > 2000
                      ? "line-through"
                      : ""
                  }`}
                >
                  <span>Delivery Charges</span>
                  <span>
                    ₹{" "}
                    {user?.cart?.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    ) > 2000
                      ? "0.00"
                      : "40.00"}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between pt-3">
              <span>Total Amount</span>
              <span>
                ₹{" "}
                {user?.cart
                  ?.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    user?.cart?.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    ) > 2000
                      ? 0
                      : 50 // Include packaging and delivery fees conditionally
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="text-sm mt-6">
              Review your order and if you have any query or facing any problem
              do contact us.
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={makePayment}
                className="flex-1 bg-black hover:bg-black/90 text-white py-2 px-4 rounded "
              >
                Make payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div>
            <a
              href="/cancellation"
              className="text-sm text-gray-600 hover:text-gray-900 mr-5"
            >
              Cancellation Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-600 hover:text-gray-900 mr-5"
            >
              Terms of use
            </a>
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Privacy
            </a>
          </div>
          <div className="mt-4 sm:mt-0">
            <a
              href="/contact-us"
              className="text-sm text-blue-600 hover:text-gray-900"
            >
              Need help? Contact Us
            </a>
          </div>
        </div>
      </div>

      {isDialogOpen && user && (
        <FormDialog
          onClose={toggleDialog}
          user={user}
          fetchAllAddresses={fetchAllAddresses}
        />
      )}
    </>
  );
};

const FormDialog = ({ onClose, user, fetchAllAddresses }) => {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const fetchPincodeDetails = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      if (data[0].Status === "Success") {
        setState(data[0].PostOffice[0].State);
        setCity(data[0].PostOffice[0].Division);
      } else {
        console.error("Failed to fetch pincode details");
        setState("");
        setCity("");
      }
    } catch (error) {
      console.error("Error:", error);
      setState("");
      setCity("");
    }
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    if (pincode.length === 6) {
      fetchPincodeDetails(pincode);
    }
  };
  const handleAddAddress = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const addressData = {
      name: formData.get("name"),
      number: formData.get("number"),
      house: formData.get("house"),
      address: formData.get("address"),
      pincode: formData.get("pincode"),
      state: formData.get("state"),
      city: formData.get("city"),
    };

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/address/add-address`,
        addressData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Address added successfully!");
        fetchAllAddresses();
        onClose(); // Close the dialog
      })
      .catch((error) => {
        toast.error("Failed to add address: " + error.message);
      });
  };

  // Implementation of closePopup function
  function closePopup() {
    // Assuming you are using a simple CSS style to control visibility
    document.getElementById("dialogContainer").style.display = "none";
  }

  return (
    <div
      id="dialogContainer"
      onClick={onClose} // This attempts to close the dialog when the overlay is clicked
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to the overlay
        className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg z-50 relative"
      >
        <button
          onClick={onClose}
          className="mb-4 p-1 bg-black hover:bg-black/90 text-white rounded flex items-center justify-center"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <form
          className="w-full flex flex-col gap-y-4"
          onSubmit={handleAddAddress}
          id="handleAddAddress"
        >
          <div className="w-fit flex flex-col gap-y-4 p-4 border rounded">
            <div className="flex flex-row">
              <label
                htmlFor="name"
                className="w-full flex flex-col gap-y-1 pe-3"
              >
                <span className="text-sm">Name*</span>
                <input type="text" name="name" id="name" required />
              </label>

              <label
                htmlFor="number"
                className="w-full flex flex-col gap-y-1 ps-3"
              >
                <span className="text-sm">Number*</span>
                <input
                  type="number"
                  name="number"
                  id="number"
                  maxlength="10"
                  required
                />
              </label>
            </div>

            <label
              htmlFor="main address"
              className="w-full flex flex-col gap-y-1"
            >
              <span className="text-sm">Delivery Address*</span>
              <input type="text" name="address" id="address" required />
            </label>
            <div className="flex flex-row">
              <label
                htmlFor="house"
                className="w-full flex flex-col gap-y-1 pe-3"
              >
                <span className="text-sm">House Number</span>
                <input type="text" name="house" id="house" length="15" />
              </label>

              <label
                htmlFor="pincode"
                className="w-full flex flex-col gap-y-1 ps-3"
              >
                <span className="text-sm">Pincode*</span>
                <input
                  type="number"
                  name="pincode"
                  id="pincode"
                  length="5"
                  required
                  onChange={handlePincodeChange}
                />
              </label>
            </div>
            <div className="flex flex-row">
              <label
                htmlFor="state"
                className="w-full flex flex-col gap-y-1 pe-3"
              >
                <span className="text-sm">State*</span>
                <input
                  type="text"
                  name="state"
                  id="state"
                  required
                  value={state}
                  readOnly
                />
              </label>
              <label
                htmlFor="city"
                className="w-full flex flex-col gap-y-1 ps-3"
              >
                <span className="text-sm">City*</span>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)} // This line allows users to edit the field
                />
              </label>
            </div>
          </div>
          <input
            type="submit"
            value="Save"
            className="py-2 border border-black rounded bg-black hover:bg-black/90 text-white transition-colors drop-shadow cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};

export default OrderReview;

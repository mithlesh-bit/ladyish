import Cart from "@/components/icons/Cart";
import React, { useEffect, useState } from "react";
import OutsideClick from "../OutsideClick";
import Image from "next/image";
import { useSelector } from "react-redux";
import Trash from "@/components/icons/Trash";
import { useDeleteFromCartMutation } from "@/services/cart/cartApi";
import { toast } from "react-hot-toast";
import Inform from "@/components/icons/Inform";
import { useCreatePaymentMutation } from "@/services/payment/paymentApi";

// Define your API key and other parameters here
const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzA2Y2YwYjBlYTU3MGJjZWZkOWRmYSIsIm5hbWUiOiJIb3VzaW5nIENhcnQiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjU3MDZjZjBiMGVhNTcwYmNlZmQ5ZGY1IiwiYWN0aXZlUGxhbiI6Ik5PTkUiLCJpYXQiOjE3MDE4NjY3MzZ9.7TmsPPPs3SYSQ2183EI4FJxXHDFXBVzuO_8s5B-pb3U";
const campaignName = "ladyish";
var destination = "916264714906";
const userName = "Nikhil";
const source = "whatsapp";
const mediaUrl = "";
const filename = "";
const tags = "";
const attribute_name = "";
const callToActionUrl = "917084570845"; // URL for the 'Call Us' button
const websiteUrl = "https://housingcart.in";

const MyCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [removeFromCart, { isLoading, data, error }] =
    useDeleteFromCartMutation();

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
  }, [isLoading, data, error]);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="p-2 rounded-secondary hover:bg-slate-100 transition-colors relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Cart className="h-6 w-6" />

        {user?.cart?.length > 0 && (
          <span className="h-2 w-2 bg-red-500 rounded-secondary absolute top-1 right-1"></span>
        )}
      </button>

      {isOpen && (
        <OutsideClick
          onOutsideClick={() => setIsOpen(false)}
          className="absolute top-full right-0 w-80 h-96 overflow-y-auto bg-white border rounded p-4 flex flex-col gap-y-2.5"
        >
          <div className="w-full h-full flex flex-col gap-y-8">
            {Object.keys(user).length === 0 || user?.cart?.length === 0 ? (
              <p className="text-sm flex flex-row gap-x-1 items-center justify-center h-full w-full">
                <Inform /> No Products in Cart!
              </p>
            ) : (
              <div className="h-full w-full flex flex-col gap-y-4">
                <div className="h-full overflow-y-auto scrollbar-hide">
                  {user?.cart?.map(({ product, quantity, _id }) => (
                    <div
                      key={product?._id}
                      className="flex flex-row gap-x-2 transition-all border border-transparent p-2 rounded hover:border-black group relative"
                    >
                      <Image
                        src={product?.thumbnail?.url}
                        alt={product?.thumbnail?.public_id}
                        width={50}
                        height={50}
                        className="rounded h-[50px] w-[50px] object-cover"
                      />
                      <article className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-0.5">
                          <h2 className="text-base line-clamp-1">
                            {product?.title}
                          </h2>
                          <p className="text-xs line-clamp-2">
                            {product?.summary}
                          </p>
                        </div>
                        <div className="flex flex-col gap-y-1">
                          <p className="flex flex-row justify-between">
                            <span className="text-xs flex flex-row gap-x-0.5 items-baseline">
                              ₹
                              <span className="text-sm text-black">
                                {product?.price * quantity}.00
                              </span>
                            </span>
                            <span className="text-xs flex flex-row gap-x-0.5 items-baseline">
                              QTY
                              <span className="text-sm text-black">
                                {quantity}
                              </span>
                            </span>
                          </p>
                          <div className="flex flex-row gap-x-1">
                            {/* <span className="whitespace-nowrap text-[10px] bg-purple-300/50 text-purple-500 border border-purple-500 px-1.5 rounded">
                              {product?.store?.title}
                            </span> */}
                            <span className="whitespace-nowrap text-[10px] bg-indigo-300/50 text-indigo-500 border border-indigo-500 px-1.5 rounded">
                              {product?.category?.title}
                            </span>
                            {/* <span className="whitespace-nowrap text-[10px] bg-blue-300/50 text-[#d18971] border border-blue-500 px-1.5 rounded">
                              {product?.category.quantity}
                            </span> */}
                          </div>
                        </div>
                      </article>

                      <button
                        type="button"
                        className="opacity-0 transition-opacity group-hover:opacity-100 absolute top-2 right-2 border p-1 rounded-secondary bg-red-100 text-red-900 border-red-900"
                        onClick={() => removeFromCart(_id)}
                      >
                        <Trash />
                      </button>
                    </div>
                  ))}
                </div>
                <Purchase cart={user?.cart} user={user} setIsOpen={setIsOpen} />
              </div>
            )}
          </div>
        </OutsideClick>
      )}
    </>
  );
};

// Function to send message using WhatsApp API

function Purchase({ cart, user, setIsOpen }) {
  // Function to send message and enquiry
  const sendMessageAndEnquiry = (name, details, number, total) => {
    const stringParams = [
      String(name),
      String(details),
      String(number),
      String(total),
    ];

    const enquiryRequestBody = {
      buyer: String(name),
      products: String(details),
      phone: String(number),
      price: String(total),
    };

    const requestBody = {
      apiKey: apiKey,
      campaignName: campaignName,
      destination: destination,
      userName: userName,
      source: source,
      media: {
        url: mediaUrl,
        filename: filename,
      },
      templateParams: stringParams,
      tags: tags,
      attributes: {
        attribute_name: attribute_name,
      },
      template: {
        namespace: "ladyishfinal",
        name: "enquiry",
        language: {
          policy: "deterministic",
          code: "en",
        },
        components: [
          {
            type: "body",
            parameters: stringParams.map((param) => ({
              type: "text",
              text: param,
            })),
          },
        ],
      },
    };

    // Array to store both fetch promises
    const fetchPromises = [];

    // First fetch call to send message
    fetchPromises.push(
      fetch("https://backend.api-wa.co/campaign/neodove/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
    );

    // Second fetch call to send enquiry
    fetchPromises.push(
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquiry/purchase-enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enquiryRequestBody),
      })
    );

    // Execute both fetch calls simultaneously
    Promise.all(fetchPromises)
      .then((responses) => {
        // Check if both responses are successful
        const successResponses = responses.filter((response) => response.ok);

        if (successResponses.length === fetchPromises.length) {
          // Both fetch calls were successful
          toast.success("Messages sent and enquiry submitted successfully");
          setIsOpen(false); // Assuming onClose() is defined elsewhere to close the form dialog
        } else {
          // At least one fetch call failed
          toast.error("Some error occurred while sending messages and enquiry");
        }
      })
      .catch((error) => {
        // Error occurred during fetch calls
        console.error("Fetch error:", error);
        toast.error("Some error occurred", { id: "createPayment" });
      });
  };

  const result = cart.map(
    ({
      product: { title, thumbnail, price, summary, _id: pid },
      quantity,
      _id: cid,
    }) => ({
      name: title,
      quantity,
      price,
      thumbnail: thumbnail?.url,
      description: summary,
      pid,
      cid,
    })
  );

  const PhoneNumber = user?.phone + "";
  const itemDetails = result
    .map((item) => `${item.name} (${item.quantity})`)
    .join(", ");

  const itemPrices = result
    .map((item) => `₹ ${item.price * item.quantity}`)
    .join(", ");
  const buyerName = "*" + user?.name + "*";
  return (
    <>
      <a
        href="/order-review"
        className="px-8 py-2 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow flex flex-row gap-x-2 items-center justify-center"
      >
        Purchase
      </a>
    </>
  );
}

export default MyCart;

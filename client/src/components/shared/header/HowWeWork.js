/**
 * Title: Write a program using JavaScript on Work Precedure
 * Author: Hasibul Islam
 * Portfolio: https://devhasibulislam.vercel.app
 * Linkedin: https://linkedin.com/in/devhasibulislam
 * GitHub: https://github.com/in/devhasibulislam
 * Facebook: https://facebook.com/in/devhasibulislam
 * Instagram: https://instagram.com/in/devhasibulislam
 * Twitter: https://twitter.com/in/devhasibulislam
 * Pinterest: https://pinterest.com/in/devhasibulislam
 * WhatsApp: https://wa.me/8801906315901
 * Telegram: devhasibulislam
 * Date: 29, July 2023
 */

// import Main from "@/components/layouts/main/main";
// import Meta from "@/components/shared/meta";
import Main from "../layouts/Main";
import Meta from "@/components/icons/Cart";
import React, { useEffect, useState } from "react";

const WorkProcedure = () => {
  const steps = [
    {
      title: "Step 1: Sign Up",
      description:
        "Create an account on our website by providing your details and choosing a username and password.",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="sm:w-16 sm:h-16 w-10 h-10"
          viewBox="0 0 24 24"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      title: "Step 2: Explore",
      description:
        "Browse through our wide range of products or services and find what interests you.",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="sm:w-16 sm:h-16 w-10 h-10"
          viewBox="0 0 24 24"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      ),
    },
    {
      title: "Step 3: Place an Order",
      description:
        " Add items to your cart and proceed to checkout to place an order. Provide your shipping details and make the payment.",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="sm:w-16 sm:h-16 w-10 h-10"
          viewBox="0 0 24 24"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
    },
    {
      title: "Step 4: Order Processing",
      description:
        "Once your order is placed, our team will process it and prepare it for shipping.",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="sm:w-16 sm:h-16 w-10 h-10"
          viewBox="0 0 24 24"
        >
          <circle cx="6" cy="6" r="3"></circle>
          <circle cx="6" cy="18" r="3"></circle>
          <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
        </svg>
      ),
    },
    {
      title: "Step 5: Shipping",
      description:
        "We will ship your order to the provided address within the estimated delivery timeframe.",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="sm:w-16 sm:h-16 w-10 h-10"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
        </svg>
      ),
    },
    {
      title: "Step 6: Enjoy!",
      description:
        "Receive your order and enjoy the product or service you purchased from our website.",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="sm:w-16 sm:h-16 w-10 h-10"
          viewBox="0 0 24 24"
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"></path>
        </svg>
      ),
    },
  ];

  return (
    <Main>
      <Meta title={"Work Procedure"} />
      <section className="lg:w-3/5 mx-auto">
        <div className="my-12 lg:px-0 md:px-8 px-4">
          {steps.map(({ title, description, icon }, index) => (
            <div
              key={index}
              className={`flex items-center mx-auto sm:flex-row flex-col ${
                Number(index) === steps?.length - 1
                  ? ""
                  : "border-gray-200 pb-10 mb-10 border-b"
              }`}
            >
              <div
                className={`sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-primary text-secondary flex-shrink-0 ${
                  Number(index) % 2 === 0 ? "md:order-2" : "md:order-1"
                }`}
              >
                {icon}
              </div>
              <div
                className={`flex-grow sm:text-left text-center mt-6 sm:mt-0 ${
                  Number(index) % 2 === 0 ? "md:order-1" : "md:order-2"
                }`}
              >
                <h2 className="text-gray-900 text-lg title-font font-semibold mb-2">
                  {title}
                </h2>
                <p className="leading-relaxed text-base">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Main>
  );
};

export default WorkProcedure;

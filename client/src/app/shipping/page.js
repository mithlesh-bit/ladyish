import React from "react";
import Head from "next/head";
import {
  FaShippingFast,
  FaEnvelope,
  FaPhoneAlt,
  FaInstagram,
} from "react-icons/fa";

const ShippingAndDelivery = () => {
  return (
    <div className="max-w-4xl mx-auto p-5 mt-10">
      <Head>
        <title>Shipping and Delivery</title>
      </Head>
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">Shipping and Delivery</h1>
      </header>
      <main>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaShippingFast className="text-[#d18971] text-3xl float-left mr-4" />

          <h2 className="text-2xl font-semibold">
            Third-Party Delivery Services
          </h2>
          <p className="mt-2 clear-both">
            We rely on third-party courier and delivery partners to ship our
            handmade crochet products. Delivery times may vary based on their
            schedules and service areas.
          </p>
        </section>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaEnvelope className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">Email Updates</h2>
          <p className="mt-2 clear-both">
            We will keep you updated on your order status via email. Please
            ensure that your email address is correct to receive timely
            notifications.
          </p>
        </section>
      </main>
      <footer className="text-center text-gray-600 text-sm p-5 mt-10">
        <p>This policy is effective as of 28/06/24.</p>
        <p>
          If you have any questions, feel free to contact us at{" "}
          <a href="mailto:laadyish@gmail.com" className="text-blue-500">
            laadyish@gmail.com
          </a>
        </p>
        <a
          href="https://www.instagram.com/direct/t/17842553655072685"
          className="inline-flex items-center px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="mr-2" /> Instagram
        </a>
      </footer>
    </div>
  );
};

export default ShippingAndDelivery;

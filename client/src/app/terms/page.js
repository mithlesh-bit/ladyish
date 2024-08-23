import React from "react";
import Head from "next/head";
import {
  FaFileContract,
  FaShippingFast,
  FaRedoAlt,
  FaMoneyCheckAlt,
  FaInstagram,
  FaEdit,
} from "react-icons/fa";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-5 mt-10">
      <Head>
        <title>Terms and Conditions</title>
      </Head>
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">Terms and Conditions</h1>
      </header>
      <main>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaFileContract className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="mt-2 clear-both">
            Welcome to our eCommerce website. By accessing and using our
            website, you agree to comply with and be bound by the following
            terms and conditions...
          </p>
        </section>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaShippingFast className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">2. Shipping and Delivery</h2>
          <p className="mt-2 clear-both">
            We strive to ensure that your products are delivered in a timely
            manner. Shipping times may vary based on the location and product
            availability...
          </p>
        </section>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaRedoAlt className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">3. Returns and Refunds</h2>
          <p className="mt-2 clear-both">
            We do not accept return requests for customized products unless the
            product was not received or it was damaged during shipping...
          </p>
        </section>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaMoneyCheckAlt className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">4. Payments</h2>
          <p className="mt-2 clear-both">
            All payments made through our website are processed securely. We
            accept various payment methods including credit/debit cards and
            online payment gateways...
          </p>
        </section>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaEdit className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">5. Changes to Terms</h2>
          <p className="mt-2 clear-both">
            We reserve the right to update our Terms and Conditions from time to
            time. Any changes will be posted on this page...
          </p>
        </section>
      </main>
      <footer className="text-center text-gray-600 text-sm p-5 mt-10">
        <p>These terms are effective as of 28/06/24</p>
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

export default TermsAndConditions;

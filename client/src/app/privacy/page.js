import React from "react";
import Head from "next/head";
import {
  FaLock,
  FaUserShield,
  FaInfoCircle,
  FaRegHandshake,
  FaInstagram,
  FaRegEdit,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-5 mt-10">
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
      </header>
      <main>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaUserShield className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">1. Information we collect</h2>
          <p className="mt-2 clear-both">
            We only ask for personal information when we truly need it to
            provide a service to you...
          </p>
        </section>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaLock className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">2. How we use information</h2>
          <p className="mt-2 clear-both">
            We only retain collected information for as long as necessary to
            provide you with your requested service...
          </p>
        </section>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaInfoCircle className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">3. Sharing information</h2>
          <p className="mt-2 clear-both">
            We don’t share any personally identifying information publicly or
            with third parties, except when required to by law.
          </p>
        </section>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaRegHandshake className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">4. Your rights</h2>
          <p className="mt-2 clear-both">
            You are free to refuse our request for your personal information...
          </p>
        </section>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaRegEdit className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">5. Changes to this policy</h2>
          <p className="mt-2 clear-both">
            We may update our Privacy Policy from time to time...
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

export default PrivacyPolicy;

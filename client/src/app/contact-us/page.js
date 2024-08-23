import React from "react";
import Head from "next/head";
import { FaEnvelope, FaPhoneAlt, FaInstagram } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto p-5 mt-10">
      <Head>
        <title>Contact Us</title>
      </Head>
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">Contact Us</h1>
      </header>
      <main>
        <section className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <FaEnvelope className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">Email</h2>
          <p className="mt-2 clear-both">
            Feel free to send us an email at{" "}
            <a href="mailto:laadyish@gmail.com" className="text-blue-500">
              laadyish@gmail.com
            </a>{" "}
            for any inquiries or support.
          </p>
        </section>
        <section className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <FaPhoneAlt className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">Phone</h2>
          <p className="mt-2 clear-both">
            You can reach us by phone at{" "}
            <a href="tel:+916264714906" className="text-blue-500">
              +91 6264714906
            </a>
            . We are available from 9am to 6pm, Monday to Friday.
          </p>
        </section>
        <section className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <FaInstagram className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">Instagram</h2>
          <p className="mt-2 clear-both">
            Follow us on Instagram for the latest updates and to reach out to us
            directly.
          </p>
          <a
            href="https://www.instagram.com/lady.ish_/"
            className="inline-flex items-center px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="mr-2" /> Instagram
          </a>
        </section>
      </main>
      <footer className="text-center text-gray-600 text-sm p-5 mt-10">
        <p>This information is effective as of 28/06/24.</p>
        <p>
          If you have any questions, feel free to contact us through the
          provided email, phone number, or Instagram link.
        </p>
      </footer>
    </div>
  );
};

export default ContactUs;

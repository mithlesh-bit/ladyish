import React from "react";
import Head from "next/head";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { FaInstagram } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto p-5 mt-10">
      <Head>
        <title>About Us</title>
      </Head>
      <header className="text-center mb-10">
        <Image
          src={logo}
          alt="Brand Logo"
          width={150}
          height={150}
          className="mx-auto"
        />
        <h1 className="text-3xl font-bold mt-4">Ladyish</h1>
      </header>
      <main>
        <section className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="mt-2">
            Welcome to Ladyish, your number one source for all things crochet.
            We&apos;re dedicated to giving you the very best of handmade crochet
            products, with a focus on quality, uniqueness, and customer service.
          </p>
        </section>
        <section className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="mt-2">
            At Ladyish, we create beautifully handcrafted crochet items ranging
            from clothing to home decor. Each piece is meticulously made with
            love and attention to detail, ensuring that you receive a product
            that is not only beautiful but also unique. Our mission is to bring
            joy and warmth into your home through our crochet creations.
          </p>
        </section>
      </main>
      <footer className="text-center text-gray-600 text-sm p-5 mt-10">
        <p>
          Thank you for visiting our page. We hope you enjoy our products as
          much as we enjoy making them for you.
        </p>

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

export default AboutUs;

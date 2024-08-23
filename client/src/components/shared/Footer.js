"use client";

import React from "react";
import Container from "./Container";
import { IoAccessibilityOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const router = useRouter();
  const year = new Date().getFullYear();

  const sitemaps = [
    // {
    //   name: "Features",
    //   paths: [
    //     {
    //       name: "Cool stuff",
    //       path: "/",
    //     },
    //     {
    //       name: "Random feature",
    //       path: "/",
    //     },
    //     {
    //       name: "Team feature",
    //       path: "/",
    //     },
    //     {
    //       name: "Stuff for developers",
    //       path: "/",
    //     },
    //     {
    //       name: "Another one",
    //       path: "/",
    //     },
    //     {
    //       name: "Last time",
    //       path: "/",
    //     },
    //   ],
    // },
    // {
    //   name: "Resources",
    //   paths: [
    //     {
    //       name: "Resource",
    //       path: "/",
    //     },
    //     {
    //       name: "Resource name",
    //       path: "/",
    //     },
    //     {
    //       name: "Another resource",
    //       path: "/",
    //     },
    //     {
    //       name: "Final resource",
    //       path: "/",
    //     },
    //   ],
    // },
    {
      name: "About",
      paths: [
        {
          name: "Contact Us",
          path: "/contact-us",
        },
        {
          name: "About Us",
          path: "/about-us",
        },
      ],
    },
    {
      name: "Contact",
      paths: [
        {
          name: "Payments",
          path: "/",
        },
        {
          name: "Shipping",
          path: "/shipping",
        },
        {
          name: "Cancellation & Refund",
          path: "/cancellation",
        },
      ],
    },
    {
      name: "Legal",
      paths: [
        {
          name: "About Us",
          path: "/about-us",
        },
        {
          name: "Terms of Services",
          path: "/terms",
        },
        {
          name: "Privacy & Policy",
          path: "/privacy",
        },
      ],
    },
    {},
    {
      name: "Stay Connected",
      paths: [
        {
          name: "Instagram",
          path: "https://www.instagram.com/lady.ish_/",
        },
        {
          name: "LinkedIn",
          path: "https://www.linkedin.com/in/devhasibulislam/",
        },
        {
          name: "GitHub",
          path: "https://github.com/devhasibulislam/",
        },
      ],
    },
  ];

  return (
    <footer className="footer-1 bg-gray-100 py-8 sm:py-12 m-6 p-6 rounded-xl">
      <div className="container mx-auto px-4 flex flex-col gap-y-10">
        <div className="flex md:flex-row md:flex-wrap md:justify-between flex-col gap-x-4 gap-y-8">
          {sitemaps?.map((sitemap, index) => (
            <div key={index} className="flex flex-col gap-y-3">
              <h2 className="text-2xl">{sitemap.name}</h2>
              <div className="flex flex-col gap-y-1.5">
                {sitemap?.paths?.map((path, index) => (
                  <Link key={index} href={path?.path} className="text-base">
                    {path?.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <hr />
        <p className="text-center">
          &copy; {year} Ladyish. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

"use client";
import Inform from "@/components/icons/Inform";
import Minus from "@/components/icons/Minus";
import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";
import Modal from "@/components/shared/Modal";
import Dashboard from "@/components/shared/layouts/Dashboard";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Page = () => {
  const userInfo = useSelector((state) => state.auth.user);

  // return (
  //   <Dashboard>
  //     <AddCorousel />
  //   </Dashboard>
  // );
};

function AddCorousel() {
  const [image, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  /* for logo preview */
  const handleThumbnailPreview = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBrand = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("link", e.target.link.value);
    formData.append("title", e.target.title.value);
    formData.append("summary", e.target.summary.value);

    // Call the API
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/corousel/corousel-post`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Carousel added successfully!", { id: "addCorousel" });
        console.log("Success:", data);
      })
      .catch((error) => {
        toast.error(`Error adding carousel: ${error.message}`, {
          id: "addCorousel",
        });
        console.error("Error:", error);
      });

    e.target.reset();
    setThumbnailPreview(null);
  };

  return (
    <Dashboard>
      <form className="w-full flex flex-col gap-y-4" onSubmit={handleAddBrand}>
        {/* Thumbnail Upload */}
        <div className="w-fit flex flex-col gap-y-4 p-4 border rounded">
          {thumbnailPreview && (
            <Image
              src={thumbnailPreview}
              alt={"Thumbnail Preview"}
              width={96}
              height={96}
              className="w-full h-24 object-cover rounded"
            />
          )}
          <label
            htmlFor="thumbnail"
            className="w-full flex flex-col gap-y-1 relative"
          >
            <span className="text-sm cursor-pointer">Choose Corousel Image*</span>
            <input
              type="file"
              name="image"
              id="image"
              className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer z-50"
              accept=".jpg, .jpeg, .png"
              multiple={false}
              onChange={handleThumbnailPreview}
              required
            />
          </label>
        </div>

        {/* Title and Description */}
        <div className="w-full flex flex-col gap-y-4 p-4 border rounded">
          <label htmlFor="title" className="w-full flex flex-col gap-y-1">
            <span className="text-sm">Title*</span>
            <input
              type="text"
              name="title"
              id="title"
              maxLength="100"
              required
            />
          </label>
          <label htmlFor="summary" className="w-full flex flex-col gap-y-1">
            <span className="text-sm">Description*</span>
            <textarea
              name="summary"
              id="summary"
              rows="4"
              maxLength="500"
              required
            />
          </label>

          <label htmlFor="link" className="w-full flex flex-col gap-y-1">
          <span className="text-sm">Link*</span>
            <input
              type="text"
              name="link"
              id="link"
              maxLength="100"
              required
            />
          </label>
         
        </div>

        {/* Submit Button */}
        <input
          type="submit"
          value="Create Carousel"
          className="py-2 border border-black rounded bg-black hover:bg-black/90 text-white transition-colors drop-shadow cursor-pointer"
        />
      </form>
    </Dashboard>
  );
}
export default AddCorousel;

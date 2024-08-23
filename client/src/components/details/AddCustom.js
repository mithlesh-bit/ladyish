import React, { useState } from "react";
import Ellipsis from "../icons/View";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const AddCustom = () => {
  const user = useSelector((state) => state.auth.user);
  // State to manage the visibility of the form dialog

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to toggle the dialog visibility
  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  return (
    <div>
      <section className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div
          onClick={toggleDialog} // Toggle dialog on click
          className={`flex flex-col gap-y-3 bg-blue-50 p-5 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-300`}
          style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }} // Add shadow for depth
        >
          <Ellipsis className="text-blue-400" />{" "}
          {/* Use a shade of blue for the icon */}
          <article className="flex flex-col gap-y-0.5">
            <h2 className="text-lg font-semibold">Upload your design</h2>{" "}
            {/* Use blue for heading */}
            <p className="text-sm text-gray-600">
              You can simply click and fill out a form with a reference image{" "}
              {/* Adjust text color */}
            </p>
          </article>
        </div>
      </section>

      {isDialogOpen && <FormDialog onClose={toggleDialog} user={user} />}
    </div>
  );
};

// Simple form dialog component
const FormDialog = ({ onClose, user }) => {
  const handleDialogContentClick = (e) => {
    e.stopPropagation(); // Prevent click from closing the dialog
  };

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  /* handle thumbnail preview */
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

  function handleAddProduct(event) {
    event.preventDefault();

    const formData = new FormData(event.target); // Initialize FormData with the form
    const phoneNumber = user.phone; // Assuming user is defined somewhere
    //console.log(phoneNumber + " 222222222222222222222");
    // Append the phone number to the FormData object
    formData.append("phone", phoneNumber);

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/custom/custom`, {
      method: "POST",
      body: formData, // Send formData directly
      // Do not set Content-Type header, the browser will set it correctly with the boundary
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        toast.success("Sucess", data);
        onClose(); // Assuming onClose() is defined elsewhere to close the form dialog
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    event.target.reset(); // Consider resetting the form only on successful submission
  }

  // Integrate this function in your form's onSubmit like so:
  // <form onSubmit={handleAddProduct}>

  return (
    <div
      onClick={onClose} // This attempts to close the dialog when the overlay is clicked
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to the overlay
        className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg"
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
          action=""
          className="w-full flex flex-col gap-y-4"
          encType="multipart/form-data"
          onSubmit={handleAddProduct}
        >
          {/* thumbnail & gallery */}
          <div className="w-full flex flex-col md:flex-row md:gap-x-4">
            {/* thumbnail */}
            <div className="w-full md:w-1/2 flex flex-col gap-y-4 p-4 border rounded">
              {thumbnailPreview && (
                <Image
                  src={thumbnailPreview}
                  alt={"logo"}
                  width={96}
                  height={96}
                  className="w-full h-24 object-cover rounded"
                />
              )}

              <label
                htmlFor="thumbnail"
                className="w-full flex flex-col gap-y-1 relative"
              >
                <span className="text-sm cursor-pointer line-clamp-1">
                  Choose Thumbnail*
                </span>
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer z-50"
                  accept=".jpg, .jpeg, .png"
                  multiple={false}
                  onChange={handleThumbnailPreview}
                  required
                />
              </label>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-y-4 p-4 border rounded">
              {/* title */}
              <label
                htmlFor="productTitle"
                className="w-full flex flex-col gap-y-1"
              >
                <span className="text-sm">Title of the product*</span>
                <input type="text" name="title" id="title" required />
              </label>

              {/* summary */}
              <label htmlFor="summary" className="w-full flex flex-col gap-y-1">
                <span className="text-sm">Summary*</span>
                <textarea
                  name="summary"
                  id="summary"
                  rows="5"
                  maxLength="500"
                  required
                />
              </label>
            </div>
          </div>
          <input
            type="submit"
            value="Share this product"
            className="py-2 border border-black rounded bg-black hover:bg-black/90 text-white transition-colors drop-shadow cursor-pointer"
          />
        </form>
        {/* Your form elements go here */}
      </div>
    </div>
  );
};

export default AddCustom;

import React, { useState } from "react";
import Container from "../shared/Container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Ellipsis from "../icons/View";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Banner3 = ({ className }) => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  // State to manage the visibility of the form dialog

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to toggle the dialog visibility
  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Container className={className ? className : ""}>
      <div
        className="bg-gray-50 h-full w-full rounded-primary relative flex flex-col gap-y-8 lg:p-24 p-8"
        style={{ backgroundImage: "url(/assets/home/banner/dots.svg)" }}
      >
        <Image
          src="/assets/home/banner/model3.png"
          alt="model"
          height={450}
          width={450}
          className="lg:absolute bottom-0 right-20 order-2"
        />
        <article className="flex flex-col justify-start items-end order-1">
          <div className="flex flex-col gap-y-4 max-w-lg z-20 lg:mr-auto lg:mr-0 mr-auto">
            <h1 className="md:text-6xl text-4xl">
              Make a Custom Crochet Product
            </h1>
            <p className="flex flex-row gap-x-0.5 items-center text-lg text-slate-500">
              You can upload a custom design or product image and we will
              contact you soon for the confirmation.
            </p>
            <button
              className="px-8 py-4 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow w-fit mt-4"
              onClick={toggleDialog}
            >
              Upload your Image
            </button>
          </div>
        </article>
      </div>
      {isDialogOpen && <FormDialog onClose={toggleDialog} user={user} />}
    </Container>
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
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to the overlay
        className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg z-50 relative"
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

export default Banner3;

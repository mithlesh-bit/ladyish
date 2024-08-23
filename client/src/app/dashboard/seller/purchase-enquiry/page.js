"use client";

import Inform from "@/components/icons/Inform";
import Pencil from "@/components/icons/Pencil";
import Trash from "@/components/icons/Trash";
import User from "@/components/icons/User";
import Modal from "@/components/shared/Modal";
import Dashboard from "@/components/shared/layouts/Dashboard";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Page = () => {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}enquiry/get-enquiry`
        ); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch enquiries");
          toast.error("Failed to fetch enquiries");
        }
        const data = await response.json();
        setEnquiries(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEnquiries();
  }, []);

  // const {
  //   isLoading: fetchingProducts,
  //   data: fetchProductsData,
  //   error: fetchProductsError,
  // } = useGetProductsQuery();
  // const products = useMemo(
  //   () => fetchProductsData?.data || [],
  //   [fetchProductsData]
  // );
  // const user = useSelector((state) => state?.auth?.user);

  // useEffect(() => {
  //   if (fetchProductsError) {
  //     toast.error(fetchProductsError?.data?.description, {
  //       id: "fetchProducts",
  //     });
  //   }

  //   if (fetchingProducts) {
  //     toast.loading("Fetching Products...", { id: "fetchProducts" });
  //   }

  //   if (fetchProductsData) {
  //     toast.success(fetchProductsData?.description, {
  //       id: "fetchProducts",
  //     });
  //   }
  // }, [fetchProductsError, fetchingProducts, fetchProductsData]);

  return (
    <Dashboard>
      {enquiries?.length === 0 ? (
        <p className="text-sm flex flex-row gap-x-1 items-center justify-center">
          <Inform /> No Products Added!
        </p>
      ) : (
        <section className="w-full h-full">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Checkbox
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Buyer Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Contact
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Product Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Price
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Date
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr
                    key={enquiry?._id}
                    className="odd:bg-white even:bg-gray-100 hover:odd:bg-gray-100"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap w-60 overflow-x-auto block scrollbar-hide text-sm">
                        {enquiry?.buyer}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap scrollbar-hide text-sm">
                        {enquiry?.phone}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap scrollbar-hide text-sm">
                        {enquiry?.products}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap scrollbar-hide text-sm">
                        {enquiry?.price}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap scrollbar-hide text-sm">
                        {enquiry?.date}
                      </span>
                    </td>

                    <DeleteProduct id={enquiry?._id} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </Dashboard>
  );
};

function DeleteProduct({ id }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/enquiry/delete-enquiry/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
        toast.error(response.message);
      }
      toast.success("Deleted Successfully");
      console.log(`Product with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="bg-red-50 border border-red-900 p-0.5 rounded-secondary text-red-900"
        onClick={handleDelete}
      >
        <Trash />
      </button>
    </>
  );
}

export default Page;

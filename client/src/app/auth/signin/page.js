"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Spinner from "@/components/shared/Spinner";
import { useSignInMutation } from "@/services/auth/authApi";
import { toast } from "react-hot-toast";

const Signin = () => {
  const router = useRouter();
  const [signin, { isLoading, isSuccess, data, error }] = useSignInMutation();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isLoading) {
      toast.loading("Processing...", { id: "signin" });
    }
    if (isSuccess && data && data.description && !showOtpInput) {
      toast.success(data.description, { id: "signin" });
      localStorage.setItem("email", email); // Store email in localStorage for subsequent requests
      setShowOtpInput(true);
    }

    if (error?.data) {
      toast.error(error.data.description, { id: "signin" });
    }
  }, [isLoading, isSuccess, data, error, showOtpInput, email]);

  const handleSignin = async (e) => {
    e.preventDefault();
    const inputEmail = e.target.email?.value;
    const inputOtp = e.target.otp?.value;

    if (!showOtpInput) {
      setEmail(inputEmail);
      signin({ email: inputEmail });
      e.target.reset();
    } else {
      verifyOtp(email, inputOtp); // use the email stored in state
    }
    e.target.reset();
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/otp-verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json(); // Always parse JSON first to check for response body

      if (response.ok) {
        toast.success("OTP Verified Successfully!");
        localStorage.removeItem("email");
        localStorage.setItem("accessToken", data.accessToken);
        // open new tab
        setTimeout(() => {
          window.open("/", "_self");
        }, 1000);
      } else {
        toast.error(data.description || "Failed to verify OTP");
      }
    } catch (error) {
      // This will handle network issues or cases where the server is unreachable
      console.error("Fetch error:", error); // Log detailed error
      toast.error("Network error or server not responding");
    }
  };

  return (
    <section className="w-screen h-screen flex justify-center items-center px-4">
      <div className="max-w-md w-full flex flex-col gap-y-4 border p-8 rounded-primary">
        <div className="flex flex-row items-center gap-x-2">
          <hr className="w-full" />
          <Image
            src="/logo.png"
            alt="logo"
            width={141}
            height={40}
            className="max-w-full cursor-pointer"
            onClick={() => router.push("/")}
          />
          <hr className="w-full" />
        </div>
        <form className="w-full flex flex-col gap-y-4" onSubmit={handleSignin}>
          {!showOtpInput ? (
            <label htmlFor="email" className="flex flex-col gap-y-1">
              <span className="text-sm">Enter Your Email</span>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="i.e. example@gmail.com"
                className=""
                required
              />
            </label>
          ) : (
            <label htmlFor="otp" className="flex flex-col gap-y-1">
              <span className="text-sm">Enter OTP</span>
              <input
                type="text"
                name="otp"
                id="otp"
                placeholder="Enter OTP"
                className=""
                required
              />
            </label>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black/50 disabled:cursor-not-allowed flex flex-row justify-center items-center text-sm"
          >
            {isLoading ? <Spinner /> : showOtpInput ? "Verify OTP" : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Signin;

"use client";

import Trash from "@/components/icons/Trash";
import Upload from "@/components/icons/Upload";
import Spinner from "@/components/shared/Spinner";
import { useSignUpMutation } from "@/services/auth/authApi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Signup = () => {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [emailUsedForSignup, setEmailUsedForSignup] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [signup, { isLoading, data, error }] = useSignUpMutation();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Signing up...", { id: "signup" });
    }
    if (data) {
      toast.success(data?.description, { id: "signup" });
      setEmailUsedForSignup(data?.email); // Assuming the API returns the email
      setOtpRequired(true);
    }
    if (error?.data) {
      toast.error(error?.data?.description, { id: "signup" });
    }

    setAvatarPreview(null);
  }, [isLoading, data, error]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    if (!avatarPreview) {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("name", e.target.name.value);
    formData.append("email", e.target.email.value);
    formData.append("phone", e.target.phone.value);
    // formData.append("password", e.target.password.value);
    localStorage.setItem("email", e.target.email.value);
    signup(formData);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;
    verifyOtp(emailUsedForSignup, otp);
  };

  const verifyOtp = async (email, otp) => {
    try {
      const email = localStorage.getItem("email");
      console.log(545645213, email, otp);

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
      const data = await response.json();
      console.log(2222,data);
      if (response.ok) {
        toast.success("OTP Verified Successfully!");
        localStorage.removeItem("email");
        localStorage.setItem("accessToken", data?.accessToken);
        setTimeout(() => {
          window.open("/", "_self");
        }, 1000);
        // router.push("/dashboard");
        // Navigate to dashboard or another page
      } else {
        toast.error(data.description || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Network error or server not responding");
    }
  };

  return (
    <section className="min-w-full min-h-screen flex justify-center items-center p-4">
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
        {!otpRequired ? (
          <form
            className="w-full flex flex-col gap-y-4"
            onSubmit={handleSignup}
          >
            <label
              htmlFor="avatar"
              className="flex flex-col gap-y-1 w-fit mx-auto items-center"
            >
              <div
                className={
                  "h-[100px] w-[100px] rounded transition-colors flex flex-row justify-center items-center relative" +
                  " " +
                  (avatarPreview
                    ? ""
                    : "border-2 border-dashed hover:border-black")
                }
              >
                {avatarPreview ? (
                  <div className="relative">
                    <Image
                      src={avatarPreview}
                      alt="avatar"
                      height={100}
                      width={100}
                      className="rounded h-[100px] w-[100px] object-cover"
                    />
                    <button
                      className="absolute bottom-0 -right-10 p-1 rounded bg-red-500 text-white shadow-2xl"
                      onClick={() => setAvatarPreview(null)}
                    >
                      <Trash />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-xs flex flex-col justify-center items-center gap-y-2 text-center">
                      <Upload />
                      Add Avatar <br /> 300x300
                    </span>

                    <input
                      type="file"
                      name="avatar"
                      id="avatar"
                      title="Dimension: 300x300"
                      accept=".jpg, .jpeg, .png"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleAvatarChange}
                    />
                  </>
                )}
              </div>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
            {/* <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            /> */}
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form
            className="w-full flex flex-col gap-y-4"
            onSubmit={handleVerifyOtp}
          >
            <input type="text" name="otp" placeholder="Enter OTP" required />
            <button type="submit">Verify OTP</button>
          </form>
        )}
        <div className="flex flex-row justify-center items-center gap-x-2 text-xs">
          <Link href="/auth/signin/otp">Sign In</Link>
          <span className="h-4 border-l"></span>
          {/* <Link href="/auth/forgot-password">Forgot Password</Link> */}
        </div>
      </div>
    </section>
  );
};

export default Signup;

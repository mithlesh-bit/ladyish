"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Assuming this is correct for your setup
import { toast } from "react-hot-toast";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Fetch email from localStorage when component mounts
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("No email found. Please start the process again.");
      router.push("/auth/signup"); // Corrected to match your directory structure
    }
  }, [router]);

  const handleVerifyOtp = async () => {
    setLoading(true);

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

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("OTP Verified Successfully!");
        localStorage.removeItem("email");
        toast.success(data?.description, { id: "signin" });
        localStorage.setItem("accessToken", data?.accessToken);
        setTimeout(() => {
          window.open("/", "_self");
        }, 1000);
      } else {
        toast.error(data.description || "Failed to verify OTP");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Network error or server not responding");
    }
  };

  return (
    <div className="container">
      <h1>OTP Verification</h1>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
      />
      <button onClick={handleVerifyOtp} disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
};

export default OtpVerification;

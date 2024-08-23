import React, { useEffect, useState } from "react";
import DetailCard from "./DetailCard";
import Modal from "../shared/Modal";
import Image from "next/image";
import { useAddReviewMutation } from "@/services/review/reviewApi";
import { toast } from "react-hot-toast";
import Inform from "../icons/Inform";
import { useSelector } from "react-redux";

const CustomCard = ({ imageUrl, title, summary }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <Image className="w-full" src={imageUrl} alt="Card image" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{summary}</p>
      </div>
    </div>
  );
};

export default CustomCard;

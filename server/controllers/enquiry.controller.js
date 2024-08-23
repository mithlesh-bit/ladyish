const express = require("express");
const EnquirySchema = require("../models/enquiry.model");

exports.enquiryController = async (req, res) => {
  try {
    const { buyer, products, phone, price } = req.body;

    // Input validation
    if (!buyer || !products || !phone || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete data provided" });
    }

    // Date formatting
    const currentDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const parts = currentDate.split(" ");
    const indianDate = parts.slice(0, 4).join(" ");

    // Create new enquiry
    const enquirySchema = new EnquirySchema({
      buyer,
      products,
      date: indianDate,
      phone,
      price,
    });

    const contact = await enquirySchema.save();
    return res.status(200).json({
      success: true,
      message: "We will contact you soon",
      contact,
    });
  } catch (error) {
    console.error("Error in enquiryController:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while saving to database",
    });
  }
};

exports.getAllData = async (req, res) => {
  try {
    const data = await EnquirySchema.find();
    return res.json(data.reverse());
  } catch (error) {
    console.error("Error in getAllData:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving data",
    });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEnquiry = await EnquirySchema.findByIdAndDelete(id);
    if (!deletedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

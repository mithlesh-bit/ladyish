const express = require("express");
const cloudinary = require("../cloudinary"); // Ensure this path is correct
const customDesignSchema = require("../models/customDesign.model");

exports.customController = async (req, res) => {
  try {
    const { title, summary, phone } = req.body;
    console.log(req.body); // Log for debugging, consider removing in production

    const currentDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const parts = currentDate.split(" ");
    const indianDate = parts.slice(0, 4).join(" ");

    // Check for file in the request
    if (req.file) {
      // Use Cloudinary to upload the file
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error uploading image");
        }

        try {
          const customDesign = new customDesignSchema({
            title,
            summary,
            date: indianDate,
            phone,
            image: result.secure_url,
          });

          const contact = await customDesign.save();
          return res.status(200).json({
            success: true,
            message: "We will contact you soon",
            contact,
          });
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .send("An error occurred while saving to database");
        }
      });
    } else {
      // Handle case where no file is uploaded
      return res.status(400).send("No image file provided.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

exports.getAllData = async (req, res) => {
  try {
    const data = await customDesignSchema.find();
    res.json(data.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDesign = await customDesignSchema.findByIdAndDelete(id);
    if (!deletedDesign) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

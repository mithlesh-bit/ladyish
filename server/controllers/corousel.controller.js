const express = require("express");
const cloudinary = require("../cloudinary"); // Ensure this path is correct
const corouselSchema = require("../models/corousel.model");

exports.corouselController = async (req, res) => {
  //console.log(111, req);
  try {
    const { title, summary, link } = req.body;
    //console.log(111, req.body); // Log for debugging, consider removing in production

    // Check for file in the request
    if (req.file) {
      // Use Cloudinary to upload the file
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error uploading image");
        }

        try {
          const corouselDesign = new corouselSchema({
            title,
            summary,
            link,
            image: result.secure_url,
          });

          const contact = await corouselDesign.save();
          return res.status(200).json({
            success: true,
            message: "Corousel Updated Successfully",
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
    const data = await corouselSchema.find();
    res.json(data.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteCorousel = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteCorousel = await corouselSchema.findByIdAndDelete(id);
    if (!deleteCorousel) {
      return res.status(404).json({ message: "Corousel not found" });
    }
    res.json({ message: "Corousel deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

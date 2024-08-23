const mongoose = require("mongoose");
const Address = require("../models/address.model"); // Ensure you import your models correctly
const User = require("../models/user.model"); // Ensure you import your models correctly

exports.addAddress = async (req, res) => {
  try {
    // console.log(24566589, req.user);
    const userId = req.user._id; // Assuming userID is correctly populated from authentication middleware

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Construct the address from request body
    const addressData = {
      ...req.body,
      user: userId, // Optionally link user directly in address for easier lookup
    };

    // Create the new address
    console.log(4566, addressData);
    const newAddress = new Address(addressData);
    await newAddress.save();

    // Update the user's address list
    user.addresses.push(newAddress._id);
    await user.save();

    // Send success response with the new address data
    res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    console.error("Add Address Error:", error); // Better error logging
    res.status(400).json({
      success: false,
      message: "Failed to add address: " + error.message,
    });
  }
};

exports.getAdressDetails = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    console.error("Server Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("addresses"); // Ensure 'addresses' is correctly set up to reference Address documents in your User model
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const reversedAddresses = user.addresses.reverse();

    res.json(reversedAddresses);
  } catch (error) {
    console.error("Server Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Log the incoming ID for debugging purposes

    // Attempt to delete the address document
    const deleteAddress = await Address.findByIdAndDelete(id);
    
    if (!deleteAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Log the successful deletion

    // Find users that have the address and log them before updating
    const affectedUsers = await User.find({ addresses: id });

    // Remove the address reference from the user's addresses array
    const updateResult = await User.updateMany(
      { addresses: id },
      { $pull: { addresses: id } }
    );

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error during address deletion:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


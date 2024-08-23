/* external imports */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

/* create purchase schema */
const purchaseSchema = new mongoose.Schema(
  {
    // for customer
    customer: {
      type: ObjectId,
      ref: "User",
    },

    // for products
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    // for customer ID
    customerId: {
      type: String,
      required: true,
    },

    // for order ID
    orderId: {
      type: String,
      required: true,
    },

    // for total amount
    totalAmount: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    // order status
    status: {
      type: String,
      enum: ["Ordered", "In Progress", "Dispatched", "Delivered", "Completed"],
      default: "Ordered",
    },

    // for user account time stamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* create purchase model */
const Purchase = mongoose.model("Purchase", purchaseSchema);

/* export purchase model */
module.exports = Purchase;

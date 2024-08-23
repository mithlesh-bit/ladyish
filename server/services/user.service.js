/* internal imports */
const Brand = require("../models/brand.model");
const Cart = require("../models/cart.model");
const Category = require("../models/category.model");
const Favorite = require("../models/favorite.model");
const Product = require("../models/product.model");
const Purchase = require("../models/purchase.model");
const Review = require("../models/review.model");
const Store = require("../models/store.model");
const User = require("../models/user.model");
const remove = require("../utils/remove.util");
const token = require("../utils/token.util");
const nodemailer = require("nodemailer");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
};

// const otp = generateOTP();
// Creating a transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "ladyishcrochet@gmail.com",
    pass: "iutq grpj fqjq chbu",
  },
});

// Function to send mail with dynamic OTP
const sendMail = async (transporter, nam, to, from, otp) => {
  // Generate a new OTP each time this function is called

  const mailOptions = {
    from: { name: from.name, address: from.address },
    to: to,
    subject: `Here's your verification code ${otp}`, // Subject line with dynamic OTP
    text: `Hey! ${nam} please, enter the 6-digit code below to verify your identity and gain access to your Ladyish account ${otp}. Thanks for helping us keep your account secure. The Ladyish Team`, // Plain text body with dynamic OTP
    html: `
            <p>Hey! ${nam} please, enter the 6-digit code below to verify your identity and gain access to your Ladyish account.</p>
            <h2>${otp}</h2>
            <p>The Ladyish Team</p>
        `, // HTML body with dynamic OTP
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/* sign up an user */
const tempUsers=require("../models/tempUser.model")
exports.signUp = async (req, res) => {
  try {
    const { body, file } = req;
    const otp = generateOTP();

    // Check if the user already exists
    let user = await tempUsers.findOne({ email: body.email });

    if (user) {
      // User exists, update their details
      user.name = body.name;
      user.phone = body.phone;
      user.otp = otp;

      if (file) {
        user.avatar = {
          url: file.path,
          public_id: file.filename,
        };
      }
    } else {
      // Create a new user instance
      user = new tempUsers({
        name: body.name,
        email: body.email,
        phone: body.phone,
        otp: otp,
      });

      if (file) {
        user.avatar = {
          url: file.path,
          public_id: file.filename,
        };
      }
    }

    // Save changes or new user
    await user.save();
    await sendMail(
      transporter,
      body.name,
      body.email,
      {
        name: "Ladyish",
        address: "ladyishcrochet@gmail.com",
      },
      otp
    );
    console.log("User created or updated successfully");
    res.status(201).json({
      acknowledgement: true,
      message: "Created",
      description: "User created or updated successfully",
    });
  } catch (error) {
    console.error("SignUp Error:", error);
    res.status(500).json({
      acknowledgement: false,
      message: "Error",
      description: "An error occurred during the sign-up process",
    });
  }
};


/* sign in an user */
exports.signIn = async (req, res) => {
  const otp = await generateOTP();
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404).json({
      acknowledgement: false,
      message: "Not Found",
      description: "User not found",
    });
  } else {
    
    await User.updateOne(
      { _id: user._id },
      { $set: { otp: otp, otpExpires: new Date(Date.now() + 300000) } }
    );
    await sendMail(
      transporter,
      user.name,
      req.body.email,
      {
        name: "Ladyish",
        address: "ladyishcrochet@gmail.com",
      
      },
      otp
    );
    res.status(200).json({
      acknowledgement: true,
      message: "OK",
      description: "OTP successfuly send to your email",
      accessToken,
    });
  }
};

exports.otp = async (req, res) => {
  let tempUserHai, realUser;

  try {
    console.log(111, req.body);
    tempUserHai = await tempUsers.findOne({ email: req.body.email });
    realUser = await User.findOne({ email: req.body.email });

    const user = tempUserHai || realUser;
    console.log(654987, user);

    if (!user) {
      return res.status(404).json({
        acknowledgement: false,
        message: "Not Found",
        description: "User not found",
      });
    }

    if (user.otp !== req.body.otp) {
      console.log(654);
      return res.status(401).json({
        acknowledgement: false,
        message: "Unauthorized",
        description: "Invalid OTP",
      });
    }

    if (user.status === "inactive") {
      return res.status(401).json({
        acknowledgement: false,
        message: "Unauthorized",
        description: "Your account is in a review state",
      });
    }

    if (tempUserHai) {
      const userCreated = new User({
        name: user.name,
        email: user.email,
        phone: user.phone,
        otp: user.otp,
      });
      console.log(2222222, userCreated);
      await userCreated.save();

      // Delete temporary user only after the new user is successfully created
      await tempUsers.deleteOne({ email: req.body.email })
        .then(() => {
          console.log("Temporary user deleted successfully");
        })
        .catch(err => {
          console.error("Error deleting temporary user:", err);
        });

      // Generate access token after the new user is created and saved
      const accessToken = token({
        _id: userCreated._id,
        name: userCreated.name,
        email: userCreated.email,
        role: userCreated.role,
        status: userCreated.status,
      });

      return res.status(200).json({
        acknowledgement: true,
        message: "OK",
        description: "Login successful",
        accessToken,
      });
    } else {
      // If no tempUserHai, then directly generate the token for realUser
      const accessToken = token({
        _id: realUser._id,
        name: realUser.name,
        email: realUser.email,
        role: realUser.role,
        status: realUser.status,
      });

      return res.status(200).json({
        acknowledgement: true,
        message: "OK",
        description: "Login successful",
        accessToken,
      });
    }
  } catch (error) {
    console.log(333333, error);
    if (tempUserHai) {
      await tempUsers.deleteOne({ email: req.body.email });
    }
    return res.status(500).json({
      acknowledgement: false,
      message: "Internal Server Error",
      description: error.message,
    });
  }
};


/* reset user password */
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404).json({
      acknowledgement: false,
      message: "Not Found",
      description: "User not found",
    });
  } else {
    const hashedPassword = user.encryptedPassword(req.body.password);

    await User.findOneAndUpdate(
      { email: req.body.email },
      { password: hashedPassword },
      { runValidators: false, returnOriginal: false }
    );

    res.status(200).json({
      acknowledgement: true,
      message: "OK",
      description: "Password reset successful",
    });
  }
};

/* login persistance */
exports.persistLogin = async (req, res) => {
  console.log("me call11111 ",req.user, req.body);
  try {
    const user = await User.findById(req.user._id).populate([
      {
        path: "cart",
        populate: [
          { path: "product", populate: ["brand", "category", "store"] },
          "user",
        ],
      },
      {
        path: "reviews",
        populate: ["product", "reviewer"],
      },
      {
        path: "favorites",
        populate: [
          {
            path: "product",
            populate: ["brand", "category", "store"],
          },
          "user",
        ],
      },
      {
        path: "purchases",
        populate: [
          "customer",
          {
            path: "products",
            populate: {
              path: "product",
              populate: ["brand", "category", "store"],
            },
          },
          {
            path: "address",  // Ensure this matches exactly with how the model is defined in your Mongoose setup
            populate: { path: "address" }  // Populating address details from the Address model
          },
        ],
      },
      "store",
      "brand",
      "category",
      "products",
    ]);

    if (!user) {
      console.log(12365);
      return res.status(404).json({
        acknowledgement: false,
        message: "Not Found",
        description: "User not found",
      });
    }

    console.log("User details fetched:", user);

    res.status(200).json({
      acknowledgement: true,
      message: "OK",
      description: "Login successful",
      data: user,
    });
  } catch (error) {
    console.error("Error during persistence login:", error);
    res.status(500).json({
      acknowledgement: false,
      message: "Internal Server Error",
      description: "An error occurred while fetching the user details",
      error: error.message,
    });
  }
};



/* get all users */
exports.getUsers = async (res) => {
  console.log(111);
  const users = await User.find()
    .populate("store")
    .populate(["brand", "category", "store"]);

  res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: "Users retrieved successfully",
    data: users,
  });
};

/* get single user */
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate("store");

  res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: `${user.name}'s information retrieved successfully`,
    data: user,
  });
};

/* update user information */
exports.updateUser = async (req, res) => {
  const existingUser = await User.findById(req.user._id);
  const user = req.body;

  if (!req.body.avatar && req.file) {
    await remove(existingUser.avatar?.public_id);

    user.avatar = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    existingUser._id,
    { $set: user },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: `${updatedUser.name}'s information updated successfully`,
  });
};

/* update user information */
exports.updateUserInfo = async (req, res) => {
  console.log(987);
  const existingUser = await User.findById(req.params.id);
  const user = req.body;

  if (!req.body.avatar && req.file) {
    await remove(existingUser.avatar?.public_id);

    user.avatar = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    existingUser._id,
    { $set: user },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: `${updatedUser.name}'s information updated successfully`,
  });
};

/* delete user information */
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  // remove user avatar
  await remove(user.avatar?.public_id);

  // remove user cart
  if (user.cart.length > 0) {
    user.cart.forEach(async (cart) => {
      await Cart.findByIdAndDelete(cart._id);
    });
  }

  // remove user favorites
  if (user.favorites.length > 0) {
    user.favorites.forEach(async (favorite) => {
      await Favorite.findByIdAndDelete(favorite._id);
    });
  }

  // remove user reviews
  if (user.reviews.length > 0) {
    user.reviews.forEach(async (review) => {
      await Review.findByIdAndDelete(review._id);
    });
  }

  // remove user purchases
  if (user.purchases.length > 0) {
    user.purchases.forEach(async (purchase) => {
      await Purchase.findByIdAndDelete(purchase._id);
    });
  }

  // remove store
  if (user.store) {
    const store = await Store.findByIdAndDelete(user.store);

    // remove store thumbnail
    await remove(store?.thumbnail?.public_id);

    // remove store products
    store.products.forEach(async (prod) => {
      const product = await Product.findByIdAndDelete(prod);

      // remove product thumbnail
      await remove(product?.thumbnail?.public_id);

      // remove product gallery
      product.gallery.forEach(async (gallery) => {
        await remove(gallery?.public_id);
      });

      // remove product reviews
      product.reviews.forEach(async (review) => {
        await Review.findByIdAndDelete(review._id);
      });
    });
  }

  // remove category
  if (user.category) {
    const category = await Category.findByIdAndDelete(user.category);

    // remove category thumbnail
    await remove(category?.thumbnail?.public_id);

    // remove category products
    category.products.forEach(async (prod) => {
      const product = await Product.findByIdAndDelete(prod);

      // remove product thumbnail
      await remove(product?.thumbnail?.public_id);

      // remove product gallery
      product.gallery.forEach(async (gallery) => {
        await remove(gallery?.public_id);
      });

      // remove product reviews
      product.reviews.forEach(async (review) => {
        await Review.findByIdAndDelete(review._id);
      });
    });
  }

  // remove brand
  if (user.brand) {
    const brand = await Brand.findByIdAndDelete(user.brand);

    // remove brand logo
    await remove(brand?.logo?.public_id);

    // remove brand products
    brand.products.forEach(async (prod) => {
      const product = await Product.findByIdAndDelete(prod);

      // remove product thumbnail
      await remove(product?.thumbnail?.public_id);

      // remove product gallery
      product.gallery.forEach(async (gallery) => {
        await remove(gallery?.public_id);
      });

      // remove product reviews
      product.reviews.forEach(async (review) => {
        await Review.findByIdAndDelete(review._id);
      });
    });
  }

  // remove user from product's buyers array
  if (user.products.length > 0) {
    await Product.updateMany(
      {},
      {
        $pull: {
          buyers: user._id,
        },
      }
    );
  }

  res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: `${user.name}'s information deleted successfully`,
  });
};

// seller request & approve
exports.getSellers = async (res) => {
  const users = await User.find({
    role: "seller",
    status: "inactive",
  }).populate(["brand", "category", "store"]);

  res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: "Sellers retrieved successfully",
    data: users,
  });
};

exports.reviewSeller = async (req, res) => {
  await User.findByIdAndUpdate(req.query.id, {
    $set: req.body,
  });

  res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: "Seller reviewed successfully",
  });
};

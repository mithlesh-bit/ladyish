/* internal import */
const productService = require("../services/product.service");

/* add new product */
exports.addProduct = async (req, res, next) => {
  try {
    // Log the req.user object
    // console.log("User:", req.user);
    // console.log(req.user + "1111111111111111111111111111111111111");

    // Call the productService.addProduct function
    await productService.addProduct(req, res);

    // Log req.body
    // console.log("Request Body:", req.body);
  } catch (error) {
    // Forward the error to the error handling middleware
    next(error);
  } finally {
    // Log the route and method
    console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* get all products */
exports.getProducts = async (req, res, next) => {
  try {
    await productService.getProducts(res);
  } catch (error) {
    next(error);
  } finally {
    console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* update product */
exports.updateProduct = async (req, res, next) => {
  try {
    await productService.updateProduct(req, res);
  } catch (error) {
    next(error);
  } finally {
    console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* get a single product */
exports.getProduct = async (req, res, next) => {
  try {
    await productService.getProduct(req, res);
  } catch (error) {
    next(error);
  } finally {
    console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* filtered products */
exports.getFilteredProducts = async (req, res, next) => {
  try {
    await productService.getFilteredProducts(req, res);
  } catch (error) {
    next(error);
  } finally {
    console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* delete product */
exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req, res);
  } catch (error) {
    next(error);
  } finally {
    console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};


// exports.addProduct = async (req, res, next) => {
//   const { userId } = req.params;
//   const { productId, quantity, price } = req.body;

//   try {
//     const newPurchase = new Purchase({
//       productId,
//       quantity,
//       price,
//       user: userId,
//     });

//     await newPurchase.save();

//     const user = await User.findById(userId);
//     user.purchases.push(newPurchase);
//     await user.save();

//     res
//       .status(201)
//       .send({ message: "Purchase added successfully", data: newPurchase });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to add purchase", error: error.message });
//   }
// };

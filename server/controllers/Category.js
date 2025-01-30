const { Mongoose } = require("mongoose");

const Category = require("../models/Category");

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // created entry in Category in DB;
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    });

    return res
      .status(400)
      .json({ success: true, message: "Category Created Successfully" });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find({}); // it find all Category from DB;

    return res.status(200).json({ success: true, data: allCategorys });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

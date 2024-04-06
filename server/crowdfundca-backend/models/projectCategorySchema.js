const mongoose = require("mongoose");

const projectCategorySchema = new mongoose.Schema(
    {
        categoryid: String,
        categoryname: String,
        categorydescription: String,
    },
    {timestamps: true},
);

const ProjectCategory = mongoose.model("Category", projectCategorySchema, "project_category_info");

module.exports = ProjectCategory;

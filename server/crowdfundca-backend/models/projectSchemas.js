const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    pid: String,
    token: String,
    projectname: String,
    projectsdescription: String,
    categoryid: String,
    images: [],
    userId: String,
    targetmoney: String,
    currentmoney: String,
    statue: Boolean,
    enddate: Date,
    startdate: Date,
    participateduser: [],
    rewardlevel: [],
    rewardprice: [],
    rewardcontent: [],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema, "project_info");

module.exports = Project;

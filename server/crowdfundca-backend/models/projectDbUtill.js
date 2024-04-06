const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { GridFSBucket } = require("mongodb");
const ProjectCategory = require("../models/projectCategorySchema");
// const url = "mongodb://localhost:27017/kickStarter";

const isTestEnvironment = process.env.NODE_ENV === 'test';
const localUrl = `mongodb://localhost:27017/TestDB`;
const atlasUrl = "mongodb+srv://tomwang:rootroot@crowdfundca.ymbout5.mongodb.net/?retryWrites=true&w=majority";
const url = isTestEnvironment ? localUrl : atlasUrl;

let gfs;
const connectProjectDB = async () => {
  try {
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB project");

    // Init gfs
    gfs = await new GridFSBucket(conn.connection.db, {
      bucketName: "projectUpload",
    });

    // setUpCategory();

    return conn.connection.db;
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  }
};
const setUpCategory = async () => {
  let phone = new ProjectCategory({
    categoryid: "1",
    categoryname: "phone",
    categorydescription: "smart phone", //
  });
  let keyBoard = new ProjectCategory({
    categoryid: "2",
    categoryname: "keyBoard",
    categorydescription: "mechanical keyboard",
  });
  await phone.save();
  await keyBoard.save();
  console.log("set up the category");
};
// GridFS Storage setup
const storage = new GridFsStorage({
  url: url,
  file: (req, file) => {
    // if (req.body.userId) {
    return {
      bucketName: "projectUpload",
      filename: `${Date.now()}_${file.originalname}`,
      metadata: {
        userId: req.body.userId,
        name: req.body.projectname,
        token: req.body.token,
      },
    };
    // }
  },
});
const getGFSFile = () => {
  return mongoose.connection.db.collection("projectUpload.files");
};

const upload = multer({ storage });

const getGfs = () => gfs;
module.exports = {
  connectProjectDB,
  upload,
  getGfs,
  setUpCategory,
  getGFSFile,
};

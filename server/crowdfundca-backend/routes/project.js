var express = require("express");
var router = express.Router();
const Project = require("../models/projectSchemas");
const ProjectReward = require("../models/projectRewaredSchema");
const ProjectCategory = require("../models/projectCategorySchema");
const crypto = require("crypto");
const multer = require("multer");
const i = multer();
const {upload, getGfs} = require("../models/projectDbUtill");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// zzk: Update project reward in user profile
const axios = require('axios');

const API_BASE_URL_PROFILE = 'http://localhost:3001/api/profile'; //path for profile handlers

const JWT_SECRET =
    "e5e8ad63c79951b93ba44ae33ffa8395f64c048793fd2a4c1ba38cb051987378";

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) {
        return res.status(401).send("Access Denied: No token provided!");
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next(); // Continue to the next middleware/route handler
    } catch (error) {
        console.log(error)
        res.status(400).send("Invalid Token");
    }
};

router.post("/showUserProject", verifyToken, async (req, res) => {
    const {token} = req.body;
    const userId = req.user.userId;
    if (!token)
        return res.status(500).json({success: false, message: "User not login"});
    try {
        let projects = await Project.find({userId});
        if (projects.length === 0) {
            return res
                .status(404)
                .json({success: false, message: "User does not upload any project"});
        } else {
            const modifiedProjects = projects.map((project) => {
                const projectObj = project.toObject();

                const modifiedImages = projectObj.images.map((filename) => {
                    return `${req.protocol}://${req.get(
                        "host"
                    )}/project/image/${filename}`;
                });

                return {
                    ...projectObj,
                    images: modifiedImages,
                };
            });

            return res
                .status(200)
                .json({success: true, projectInfo: modifiedProjects});
        }
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({success: false, message: "Something went wrong"});
    }
});

router.post("/showUserProjectAdmin", verifyToken, async (req, res) => {
    const {token} = req.body;
    const userId = req.user.userId;
    if (!token)
        return res.status(500).json({success: false, message: "User not login"});
    try {
        let projects = await Project.find({});
        if (projects.length === 0) {
            return res
                .status(404)
                .json({success: false, message: "User does not upload any project"});
        } else {
            const modifiedProjects = projects.map((project) => {
                const projectObj = project.toObject();

                const modifiedImages = projectObj.images.map((filename) => {
                    return `${req.protocol}://${req.get(
                        "host"
                    )}/project/image/${filename}`;
                });

                return {
                    ...projectObj,
                    images: modifiedImages,
                };
            });
            console.log(modifiedProjects);
            return res
                .status(200)
                .json({success: true, projectInfo: modifiedProjects});
        }
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({success: false, message: "Something went wrong"});
    }
});

router.post("/showUserDonateProject", verifyToken, async (req, res) => {
    const {token} = req.body;
    const userId = req.user.userId;
    if (!token) {
        return res
            .status(401)
            .json({success: false, message: "Authentication token is missing"});
    }

    try {
        let projects = await Project.find({participateduser: userId});
        if (projects.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No projects found where the user has participated",
            });
        } else {
            const modifiedProjects = projects.map((project) => {
                const projectObj = project.toObject();
                const modifiedImages =
                    projectObj.images && projectObj.images.length > 0
                        ? projectObj.images.map(
                            (filename) =>
                                `${req.protocol}://${req.get(
                                    "host"
                                )}/project/image/${filename}`
                        )
                        : [];

                return {
                    ...projectObj,
                    images: modifiedImages,
                };
            });

            return res
                .status(200)
                .json({success: true, projectInfo: modifiedProjects});
        }
    } catch (e) {
        console.error(e); // Log the error for debugging purposes
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing your request",
        });
    }
});

router.get("/image/:filename", async (req, res) => {
    try {
        const file = await getGfs()
            .find({filename: req.params.filename})
            .toArray();
        if (!file[0] || file.length === 0) {
            return res.status(404).send("No file exists");
        }

        if (
            file[0].contentType === "image/jpeg" ||
            file[0].contentType === "image/png"
        ) {
            // 设置正确的内容类型
            res.setHeader("Content-Type", file[0].contentType);
            const gfs = getGfs();
            const readStream = gfs.openDownloadStream(file[0]._id);
            readStream.pipe(res);
        } else {
            res.status(404).send("Not an image");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Error occurred while retrieving file");
    }
});

router.get("/showProjectBy", async (req, res) => {
    const {queryKey, value} = req.query;
    try {
        let projects;
        if (queryKey === "categoryid")
            projects = await Project.find({categoryid: value});
        if (queryKey === "projectname")
            projects = await Project.find({projectname: value});
        if (queryKey === "pid") projects = await Project.find({pid: value});

        if (projects.length === 0) {
            return res
                .status(404)
                .json({success: false, message: "User does not upload any project"});
        } else {
            const modifiedProjects = projects.map((project) => {
                const projectObj = project.toObject();

                const modifiedImages = projectObj.images.map((filename) => {
                    return `${req.protocol}://${req.get(
                        "host"
                    )}/api/project/image/${filename}`;
                });

                return {
                    ...projectObj,
                    images: modifiedImages,
                };
            });
            console.log(modifiedProjects);
            return res
                .status(200)
                .json({success: true, projectInfo: modifiedProjects});
        }
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({success: false, message: "Something went wrong"});
    }
});

router.post("/deleteproject", async (req, res) => {
    const {pid, token} = req.query;

    try {
        // if (!token || token.length === 0)
        //     return res
        //         .status(400)
        //         .json({success: false, message: "User not login"});

        let project = await Project.findOne({pid});
        if (project.length === 0) {
            return res
                .status(404)
                .json({success: false, message: "project does not exit"});
        } else {
            let deleteResult = await project.deleteOne();
            if (deleteResult.deletedCount === 0) {
                return res
                    .status(404)
                    .json({success: false, message: "No project found to delete"});
            } else {
                return res
                    .status(200)
                    .json({success: true, message: "Delete successful"});
            }
        }
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({success: false, message: "Something went wrong"});
    }
});


router.get("/getCategoryInfoById", async (req, res) => {
    const {queryKey, value} = req.query;
    try {
        if (queryKey === "categoryid") {
            let category = await ProjectCategory.findOne({categoryid: value});

            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: "There is no category for this id",
                });
            } else {
                return res.status(200).json({success: true, projectInfo: category});
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message,
        });
    }
});
router.get("/getCategorys", async (req, res) => {
    try {
        let categories = await ProjectCategory.find({});
        return res.status(200).json({success: true, categories});
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message,
        });
    }
});
router.post("/uploadProject", verifyToken, upload.any(), async (req, res) => {
    const {
        projectname,
        projectsdescription,
        targetmoney,
        currentmoney,
        enddate,
        categoryid,
        token,
        rewardprice,
        rewardcontent,
    } = req.body;
    const userId = req.user.userId;
    console.log("req.body ", req.body);
    if (!token || token.length === 0)
        return res.status(500).json({success: false, message: "User not login"});
    if (
        !projectname ||
        !projectsdescription ||
        !categoryid ||
        !targetmoney ||
        !currentmoney ||
        !enddate ||
        !userId ||
        !rewardcontent.length === 0 ||
        !rewardprice.length === 0 ||
        (req.files && req.files.length === 0)
    ) {
        return res
            .status(400)
            .json({success: false, message: "Upload section not filled"});
    }
    let startdate = new Date();
    let tag = await ProjectCategory.findOne({categoryid});
    console.log("tag", tag);
    let pid = crypto
        .createHash("sha256")
        .update(projectname + tag.name + userId)
        .digest("hex");
    try {
        let tmpProject = await Project.findOne({pid: pid});
        if (tmpProject !== null)
            return res
                .status(500)
                .json({success: false, message: "Already uploaded this file"});

        const imageFiles = req.files.map((file) => file.filename);

        let newProject = new Project({
            pid,
            projectname,
            projectsdescription,
            targetmoney,
            currentmoney,
            enddate,
            startdate,
            categoryid,
            userId,
            token,
            rewardprice,
            rewardcontent,
        });
        if (req.files && req.files.length !== 0) {
            newProject.images = req.files.map((file) => file.filename);
        }

        await newProject.save();
        return res.status(201).json({
            success: true,
            message: "Project saved to database",
            project: newProject,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Unable to save to database due to an error",
        });
    }
});

router.post("/updateProjectPrice", verifyToken, async (req, res) => {
    const {pid, selectedPrice, token} = req.body;
    const userId = req.user.userId;
    if (!token || token.length === 0)
        return res.status(400).json({success: false, message: "User not login"});
    try {
        let project = await Project.findOne({pid});
        if (!project) {
            return res
                .status(404)
                .json({success: false, message: "Project not found"});
        }
        if (!project.participateduser.includes(userId)) {
            project.participateduser.push(userId);
        }
        project.token = token;
        project.currentmoney =
            selectedPrice.length > 0
                ? parseInt(project.currentmoney) + parseInt(selectedPrice)
                : parseInt(project.currentmoney);
        console.log("parseInt(project.currentmoney) >= parseInt(project.targetmoney): ", parseInt(project.currentmoney) >= parseInt(project.targetmoney))
        if (parseInt(project.currentmoney) >= parseInt(project.targetmoney)) {
            project.currentmoney = project.targetmoney;
        }
        await project.save();

        // zzk: Update project reward in user profile
        const selectedRewardLevel = project.rewardprice.indexOf(selectedPrice);
        if (selectedRewardLevel === -1) {
            return res
                .status(404)
                .json({success: false, message: "wrong select price"});
        }
        const newProjectStr = pid + ":" + selectedRewardLevel;
        const response = await axios.put(`${API_BASE_URL_PROFILE}/updateProfileProject?userId=${userId}&newProjectStr=${newProjectStr}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.status(200).json({
            success: true,
            message: "Project price updated successfully",
            project: project,
        });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({success: false, message: "Something went wrong"});
    }
});

router.post("/updateProject", verifyToken, upload.any(), async (req, res) => {
    const {
        pid,
        projectname,
        projectsdescription,
        targetmoney,
        enddate,
        categoryid,
        token,
        rewardlevel,
        rewardprice,
        rewardcontent,
    } = req.body;
    const userId = req.user.userId;
    if (!token)
        return res.status(500).json({success: false, message: "User not login"});
    try {
        let project = await Project.findOne({pid});
        if (!project) {
            return res.status(404).json("Project not found");
        }
        if (project.userId !== userId) {
            return res.status(403).json("Unauthorized to update this project");
        }
        if (targetmoney) project.targetmoney = targetmoney;
        if (projectname) project.projectname = projectname;
        if (enddate) project.enddate = enddate;
        if (projectsdescription) project.projectsdescription = projectsdescription;
        if (categoryid) project.categoryid = categoryid;
        if (rewardlevel && rewardlevel.length !== 0)
            project.rewardlevel = rewardlevel;
        if (rewardprice && rewardprice.length !== 0)
            project.rewardprice = rewardprice;
        if (rewardcontent && rewardcontent.length !== 0)
            project.rewardcontent = rewardcontent;

        console.log(req.files);
        // if (images) project.images = images;
        if (req.files && req.files.length !== 0) {
            project.images = req.files.map((file) => file.filename);
        }
        let tag = await ProjectCategory.findOne({categoryid});
        console.log("tag", tag);
        project.pid = crypto
            .createHash("sha256")
            .update(projectname + tag.name + userId)
            .digest("hex");

        console.log(project);
        await project.save();
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project: project,
        });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({success: false, message: "Something went wrong"});
    }
});

module.exports = {router, verifyToken}


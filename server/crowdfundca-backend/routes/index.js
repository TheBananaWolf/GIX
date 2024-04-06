var express = require('express');
var router = express.Router();

// Model
const Project = require("../models/projectSchemas");
const Category = require("../models/projectCategorySchema")
const path = require('path');

// Utils
function modifyProjects(projects, req) {
  return projects.map((project) => {
    // const projectObj = project.toObject();

    let modifiedImages = project.images;
    if (project.images && project.images.length > 0) {
      modifiedImages = project.images.map((filename) => {
        return `${req.protocol}://${req.get("host")}/project/image/${filename}`;
      });
    }
    else {modifiedImages = null}
    // const modifiedImages = project.images.map((filename) => {
    //   return `${req.protocol}://${req.get("host")}/project/image/${filename}`;
    // });

    return {
      ...project,
      images: modifiedImages,
    };
  });
}

// Middleware to verify token
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
//   if (!token) {
//       return res.status(401).send('Access Denied: No token provided!');
//   }
  
//   next();
//   try {
//       req.user = jwt.verify(token, JWT_SECRET);// Add user info to request
//       next(); // Continue to the next middleware/route handler
//   } catch (error) {
//       res.status(400).send('Invalid Token');
//   }
// };

/* GET all projects for home page. */
router.get('/showAllProjects', async (req, res) => {
  // const { userId, token } = req.body;
  const { token } = req.body;

  try {
    const projects = await Project.find({}); // Find all projects and convert to JSON-serializable format
    if (!token) {
      // res.sendFile("index");
      const modifiedProjects = modifyProjects(projects, req);
      console.log(modifiedProjects);
      return res.status(200).json({ success: true, projectInfo: modifiedProjects, message: "User not login" });
    }
    else {
      // res.sendFile("index");
      const modifiedProjects = modifyProjects(projects, req);
      console.log(modifiedProjects);
      return res.status(200).json({ success: true, projectInfo: modifiedProjects, message: `User {userId} logged in` });
    }
  } catch (e) {
    res.status(500).send({ success: false, message: "Error retrieving projects", error: e });
  }
});

/* GET top viewing projects. */
router.get('/showTopProjects', async (req, res) => {
    try {
      const n = req.query.numOfProjects || 10; // Nums of top projects (Default by 10)
      
      // Desending by ratio of currentmoney / targetmoney
      let topProjects = await Project.aggregate([
        {
          $project: {
            ratio: { $divide: [{ $toDouble: "$currentmoney" }, { $toDouble: "$targetmoney" }] },
            _id: 1, // Include _id field by default
            // Include other fields you want to project
            pid: 1,
            projectname: 1,
            projectsdescription: 1,
            images: 1,
            currentmoney: 1,
            targetmoney: 1,
            backers: 1,
            duedays: 1,
            category: 1,
            author: 1,
            createtime: 1,
            updatetime: 1
          }
        },
        { $sort: { ratio: -1 } }, // Sort projects in descending order by ratio
        { $limit: parseInt(n) } // Limit to top n projects
      ]);

      // let topProjects = await Project.find({})
        // .sort({ targetmoney: -1 }) // Sort projects in descending order by targetmoney
        // .limit(n); // Limit to top n projects
  
      if (topProjects.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No projects found" });
      } else {
        const modifiedProjects = modifyProjects(topProjects, req);
        console.log(modifiedProjects);
        return res.status(200).json({ success: true, projectInfo: modifiedProjects });
      }
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
});

/* Search projects. */
router.get('/searchProjects', async (req, res) => {
  const { userId, token } = req.body;

  try {
    // Get the query string
    const queryStr = req.query.q || "";
    const cId = req.query.cId || 0;
    let searchQuery;
    let categoryIds = [];
    let projectsInCategories = [];

    // Split the query string into keywords
    if (queryStr != "") {
      const keywords = queryStr.split(' ');

      // Get the category from the keywords
      const categories = await Category.find({ categoryname: { $regex: keywords.join('|'), $options: 'i' } });
      // const categories = await Category.find({ categoryname: { $in: keywords } });
      categoryIds = categories.map(category => category.categoryid);

      // Build the search query
      searchQuery = {
        $or: [
          { projectname: { $regex: keywords.join('|'), $options: 'i' } },
          { projectsdescription: { $regex: keywords.join('|'), $options: 'i' } }
        ]
      };
    }
    
    let projects;
    if (searchQuery) {
      projects = await Project.find(searchQuery);
    } else {
      projects = [];
    }
    

    // Search
    if (cId) {
      // searchQuery.categoryid = { category: cId };
      projectsInCategories = await Project.find({ categoryid: cId });
      // console.log(cId);
    }
    else if (categoryIds.length > 0) {  // If any category matches the keywords, add a filter for the categories
      // searchQuery.categorykd = { $in: categoryIds };
      projectsInCategories = await Project.find({ categoryid: { $in: categoryIds } });
      // console.log(categoryIds);
    }

    // Merge the two arrays without duplicates
    projects = [...new Set([...projectsInCategories, ...projects])];

    // Response
    if (!token) {
      // res.sendFile("index");
      const modifiedProjects = modifyProjects(projects, req);
      // console.log(modifiedProjects);
      return res.status(200).json({ success: true, projectInfo: modifiedProjects, message: "User not login" });
    }
    else {
      // res.sendFile("index");
      const modifiedProjects = modifyProjects(projects, req);
      // console.log(modifiedProjects);
      return res.status(200).json({ success: true, projectInfo: modifiedProjects, message: `User {userId} logged in` });
    }
  } catch (e) {
    res.status(500).send({ success: false, message: "Error retrieving projects", error: e });
  }
});

// router.post("/showUserProject", verifyToken, async (req, res) => {
//   // const { token } = req.body;

//   // const userId = req.user.userId;
//   // if (!token)
//   //   return res.status(500).json({ success: false, message: "User not login" });
//   try {
//     let projects = await Project.find({});
//     if (projects.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User does not upload any project" });
//     } else {
//       const modifiedProjects = projects.map((project) => {
//         const projectObj = project.toObject();

//         const modifiedImages = projectObj.images.map((filename) => {
//           return `${req.protocol}://${req.get(
//             "host"
//           )}/project/image/${filename}`;
//         });

//         return {
//           ...projectObj,
//           images: modifiedImages,
//         };
//       });
//       console.log(modifiedProjects);
//       return res
//         .status(200)
//         .json({ success: true, projectInfo: modifiedProjects });
//     }
//   } catch (e) {
//     console.log(e);
//     return res
//       .status(500)
//       .json({ success: false, message: "Something went wrong" });
//   }
// });

module.exports = router;

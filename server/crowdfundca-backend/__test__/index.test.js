const fs = require('fs');
const path = require('path');

const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../routes/index'); // 注意：可能需要根据实际路径调整
const app = require('../app'); // Ensure this path points to your Express app

const {getGfs, upload, connectProjectDB} = require('../models/projectDbUtill'); // Adjust the import path
const request = require('supertest');

const Project = require('../models/projectSchemas');
const Category = require('../models/projectCategorySchema');

jest.mock('axios');

// Inside your test or beforeEach
const mockedAxios = require('axios');

mockedAxios.put.mockResolvedValue({
    data: {
        // Mock the expected response from your external API call
        success: true,
        message: 'Profile updated successfully',
    },
});
// Directly mock Mongoose's find method on the Project model
Project.find = jest.fn();
Project.findOne = jest.fn();
Category.find = jest.fn();
Category.findOne = jest.fn();
jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'), // Preserve other jwt methods
    verify: jest.fn((token, secret, callback) => {
        console.log(token)
        if (token === "validToken") {
            // Simulating successful verification
            return {userId: '1'}; // Ensure the userId matches the expected value in your test
        } else {
            // Simulating verification failure
            return {success: false, message: "User does not upload any project"};
        }
    }),
}));

jest.mock('../models/projectSchemas', () => ({
  aggregate: jest.fn(), // Mock aggregate without implementation
  find: jest.fn()
  // find: jest.fn().mockImplementation((query) => {
  //   // Simplified mock implementation based on query
  //   if (query.categoryid) {
  //     return Promise.resolve([{ _id: 'proj1', projectname: 'Cool Tech Project', categoryid: '1' }]);
  //   }
  //   return Promise.resolve([]);
  // })
}));

jest.mock('../models/projectCategorySchema', () => ({
  find: jest.fn()
  // find: jest.fn().mockImplementation(() => Promise.resolve([{ categoryid: '1', categoryname: 'Technology' }]))
}));

describe('GET /showAllProjects', () => {
  let mockProjects;

  beforeAll(() => {
    const dataPath = path.join(__dirname, './data/test.all_projects.json'); // 确保路径是正确的
    const jsonData = fs.readFileSync(dataPath);
    mockProjects = JSON.parse(jsonData);
  });
  beforeEach(() => {
      Project.find.mockClear();

  });
  
  it('should respond with user projects if present', async () => {
    Project.find.mockResolvedValue(mockProjects.map(project => project.toObject ? project.toObject() : project));

    const response = await request(app)
        .get('/api/showAllProjects');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.projectInfo).toHaveLength(mockProjects.length);
  });

  it('should respond with 200 if User not login', async () => {
      const response = await request(app)
          .get('/api/showAllProjects')
          .send({}); // No token

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User not login");
  });

});


describe('GET /showTopProjects', () => {
  let mockProjects;

  beforeAll(() => {
    mockProjects = [{
      "_id": "65fe04142fd513140711bf0c",
      "pid": "926f7095adcffc57cd750c2a798fd857a6b87c4db9c7d35f2382f7b0db116880",
      "projectname": "Flaked Light Tuna",
      "projectsdescription": "<h1>Technical Details</h1><table style=\"minWidth: 50px\"><colgroup><col><col></colgroup><tbody><tr><th colspan=\"1\" rowspan=\"1\"><p>Special Feature</p></th><td colspan=\"1\" rowspan=\"1\"><p>‎kosher</p></td></tr><tr><th colspan=\"1\" rowspan=\"1\"><p>Brand</p></th><td colspan=\"1\" rowspan=\"1\"><p>‎Clover Leaf</p></td></tr><tr><th colspan=\"1\" rowspan=\"1\"><p>Form</p></th><td colspan=\"1\" rowspan=\"1\"><p>‎Tuna</p></td></tr><tr><th colspan=\"1\" rowspan=\"1\"><p>Package Information</p></th><td colspan=\"1\" rowspan=\"1\"><p>‎Can</p></td></tr><tr><th colspan=\"1\" rowspan=\"1\"><p>Manufacturer</p></th><td colspan=\"1\" rowspan=\"1\"><p>‎Clover Leaf</p></td></tr><tr><th colspan=\"1\" rowspan=\"1\"><p>Units</p></th><td colspan=\"1\" rowspan=\"1\"><p>‎1020 gram</p></td></tr><tr><th colspan=\"1\" rowspan=\"1\"><p>Parcel Dimensions</p></th><td colspan=\"1\" rowspan=\"1\"><p>‎17.39 x 11.1 x 8.17 cm; 170 Grams</p></td></tr><tr><th colspan=\"1\" rowspan=\"1\"><p>Ingredients</p></th><td colspan=\"1\" rowspan=\"1\"><p>‎Skipjack Tuna, Water, Sea Salt</p></td></tr><tr><th colspan=\"1\" rowspan=\"1\"><p>Serving size</p></th><td colspan=\"1\" rowspan=\"1\"><p>‎0</p></td></tr><tr><th colspan=\"1\" rowspan=\"1\"><p>Item Weight</p></th><td colspan=\"1\" rowspan=\"1\"><p>‎170 g</p></td></tr></tbody></table>",
      "images": [
          "http://127.0.0.1:3001/project/image/1711146002302_WX20240322-181918@2x.png",
          "http://127.0.0.1:3001/project/image/1711146002308_WX20240322-181931@2x.png",
          "http://127.0.0.1:3001/project/image/1711146002311_WX20240322-181925@2x.png"
      ],
      "targetmoney": "100",
      "currentmoney": "110",
      "ratio": 1.1
  },
  {
      "_id": "65fe01bd2fd513140711be52",
      "pid": "d5f68511c20c10dec3bd3407a30361fb590f94b4489a9768c8c821834d91cbc7",
      "projectname": "Transformers",
      "projectsdescription": "<p>THE TRANSFORMERS JOIN THE ENERGON UNIVERSE!<br><br>Optimus Prime was supposed to have led the Autobots to victory. Instead, the fate of Cybertron is unknown, and his allies have crash-landed far from home, alongside their enemies—the Decepticons. As these titanic forces renew their war on Earth, one thing is immediately clear: the planet will never be the same. New alliances are struck. Battle lines are redrawn. And humanity’s only hope of survival is Optimus Prime.<br><br>Superstar creator Daniel Warren Johnson (Do a Powerbomb, Wonder Woman: Dead Earth), alongside showrunner Robert Kirkman (The Walking Dead, Invincible), reimagines Hasbro’s robots in disguise for a brand-new generation.<br><br>Collects TRANSFORMERS #1-6</p>",
      "images": [
          "http://127.0.0.1:3001/project/image/1711145404339_WX20240322-180839@2x.png"
      ],
      "targetmoney": "200",
      "currentmoney": "60",
      "ratio": 0.3
  },
  {
      "_id": "65fdf6ec061bb0572f80d5de",
      "pid": "88b78737e87bd1ede6dc8e17c162eb93ed89f04fe93a1c30ba275842b8dc26de",
      "projectname": "Bright Evening",
      "projectsdescription": "<ul><li><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://www.artfinder.com/art/product_category-painting-oil/\">Oil painting</a> on Canvas</p></li><li><p>One of a kind artwork</p></li><li><p>Size: 35 x 45 x 2cm (unframed) / 35 x 45cm (actual image size)</p></li><li><p>Ready to hang</p></li><li><p>Signed on the front</p></li><li><p>Style: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://www.artfinder.com/art/style-impressionistic/\">Impressionistic</a></p></li><li><p>Subject: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://www.artfinder.com/art/subject-architecture-cityscapes/\">Architecture and cityscapes</a></p><p><br><strong>Original artwork description:</strong></p><p>Walking in Paris at night is always an exciting adventure. You are literally intoxicated by the atmosphere of the holiday and some kind of fun peculiar only to this city.<br>Every time you find something insanely interesting and picturesque.<br>The roll call of colored lights in Paris at night creates a unique, patterned mosaic.<br>The night windows of Paris create a truly fabulous pattern similar to an oriental carpet.<br>This artwork is made by traditional technology. Oil paints, canvas and linseed oil. I love to write etudes from life in a bright impressionistic manner. Small colorful strokes form a rainbow palette. I will try to convey the movement of air masses and the difference between illuminated and shady places.</p><p><strong>Materials used:</strong></p><p>Oil paints.</p></li></ul>",
      "images": [
          "http://127.0.0.1:3001/project/image/1711142629764_WX20240322-171932@2x.png",
          "http://127.0.0.1:3001/project/image/1711142629779_WX20240322-171946@2x.png",
          "http://127.0.0.1:3001/project/image/1711142629785_WX20240322-171955@2x.png"
      ],
      "targetmoney": "3200",
      "currentmoney": "351",
      "ratio": 0.1096875
  }];
  });
  beforeEach(() => {
      // Project.find.mockClear();
      jest.spyOn(Project, 'aggregate').mockResolvedValue(mockProjects);
  });

  it('should return top viewing projects correctly', async () => {
    // Project.find.mockResolvedValue(mockProjects.map(project => project.toObject ? project.toObject() : project));
    // Project.aggregate.mockResolvedValue(mockProjects);

    const response = await request(app)
          .get('/api/showTopProjects?numOfProjects=3');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.projectInfo).toHaveLength(mockProjects.length);
  }, 30000);

  // 添加更多测试用例...
  it('should respond with 404 if No projects found', async () => {
    jest.spyOn(Project, 'aggregate').mockResolvedValue([]);
    // Project.aggregate([
    //   {
    //     $project: {
    //       ratio: { $divide: [{ $toDouble: "$currentmoney" }, { $toDouble: "$targetmoney" }] },
    //       _id: 1, // Include _id field by default
    //       // Include other fields you want to project
    //       pid: 1,
    //       projectname: 1,
    //       projectsdescription: 1,
    //       images: 1,
    //       currentmoney: 1,
    //       targetmoney: 1,
    //       backers: 1,
    //       duedays: 1,
    //       category: 1,
    //       author: 1,
    //       createtime: 1,
    //       updatetime: 1
    //     }
    //   }
    // ]).mockResolvedValue([]);
    const response = await request(app)
        .get('/api/showTopProjects')
        // .set('Authorization', 'Bearer 111111')
        // .send({token: "11111"});
    // console.log(response.body);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("No projects found");
});
});


// describe('GET /searchProjects', () => {
//   const mockCategories = [
//     { _id: 'cat1', categoryname: 'Technology', categoryid: '1' },
//     { _id: 'cat2', categoryname: 'Art', categoryid: '2' }
//   ];
  
//   const mockProjects = [
//     { _id: 'proj1', projectname: 'Cool Tech Project', categoryid: '1', projectsdescription: 'A project about cool technology.' },
//     { _id: 'proj2', projectname: 'Art in Motion', categoryid: '2', projectsdescription: 'Exploring the movement in art.' }
//   ];

//   beforeEach(() => {
//     // Setup mock response for Category.find based on regex query
//     Category.find.mockImplementation(({ categoryname }) => {
//       if (categoryname.$regex.includes('Technology')) {
//         return Promise.resolve([{ _id: 'cat1', categoryname: 'Technology', categoryid: '1' }]);
//       } else if (categoryname.$regex.includes('Art')) {
//         return Promise.resolve([{ _id: 'cat2', categoryname: 'Art', categoryid: '2' }]);
//       }
//       return Promise.resolve([]);
//     });

//     // Setup mock response for Project.find
//     Project.find.mockImplementation((query) => {
//       if (query.$or) {
//         return Promise.resolve([
//           { _id: 'proj1', projectname: 'Cool Tech Project', categoryid: '1', projectsdescription: 'A project about cool technology.' }
//         ]);
//       } else if (query.categoryid) {
//         const categoryid = query.categoryid.$in ? query.categoryid.$in[0] : query.categoryid;
//         if (categoryid === '1') {
//           return Promise.resolve([
//             { _id: 'proj1', projectname: 'Cool Tech Project', categoryid: '1', projectsdescription: 'A project about cool technology.' }
//           ]);
//         }
//       }
//       return Promise.resolve([]);
//     });
//   });

//   it('should return projects matching the search keyword', async () => {
//     const response = await request(app).get('/api/searchProjects?q=Technology');
    
//     expect(Category.find).toHaveBeenCalled();
//     expect(Project.find).toHaveBeenCalled();
//     expect(response.statusCode).toBe(200);
//     expect(response.body.projectInfo).toHaveLength(1);
//     expect(response.body.projectInfo[0].projectname).toContain('Cool');
//   });

//   it('should return projects filtered by category ID', async () => {
//     const response = await request(app).get('/api/searchProjects?cId=1');
  
//     expect(Project.find).toHaveBeenCalledWith({ categoryid: '1' });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.projectInfo).toHaveLength(1);
//     expect(response.body.projectInfo[0].categoryid).toBe('1');
//   });

//   it('should indicate user is not logged in if no token provided', async () => {
//     const response = await request(app).get('/api/searchProjects');
  
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toBe('User not login');
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

  
// });

// Mock Mongoose's find method on the Project model
Project.find = jest.fn();
Project.findOne = jest.fn();
Category.find = jest.fn().mockImplementation((query) => {
    // Simulate regex search by checking if query matches any mock categories
    const regex = new RegExp(query.categoryname.$regex, query.categoryname.$options);
    const mockCategories = [
        { categoryid: 'category1', categoryname: 'Test Category 1' },
        { categoryid: 'category2', categoryname: 'Test Category 2' }
    ];

    // Filter mock categories based on regex
    const filteredCategories = mockCategories.filter(category => regex.test(category.categoryname));
    return Promise.resolve(filteredCategories);
});

Category.findOne = jest.fn();

// Mock jsonwebtoken's verify method
jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'), // Preserve other jwt methods
    verify: jest.fn((token, secret, callback) => {
        if (token === 'validToken') {
            // Simulating successful verification
            return { userId: '1' }; // Ensure the userId matches the expected value in your test
        } else {
            // Simulating verification failure
            return { success: false, message: 'User does not upload any project' };
        }
    }),
}));

describe('searchProjects API', () => {
    beforeEach(() => {
        // Clear mock implementations before each test
        Project.find.mockClear();
        Project.findOne.mockClear();
        Category.find.mockClear();
        Category.findOne.mockClear();
        jwt.verify.mockClear();
    });

    describe('GET /searchProjects', () => {
        it('should return an empty array if no projects match the query', async () => {
            Project.find.mockResolvedValue([]);

            const res = await request(app).get('/api/searchProjects?q=nonexistentquery');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.projectInfo).toHaveLength(0);
        });

        it('should return projects that match the query string', async () => {
            const project1 = {
                projectname: 'Test Project 1',
                projectsdescription: 'This is a test project',
                categoryid: 'category1',
            };
            const project2 = {
                projectname: 'Test Project 2',
                projectsdescription: 'Another test project',
                categoryid: 'category2',
            };
            Project.find.mockResolvedValue([project1, project2]);

            const res = await request(app).get('/api/searchProjects?q=test');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.projectInfo).toHaveLength(2);
        });

        it('should return projects that match the category ID', async () => {
            const category1 = {
                categoryid: 'category1',
                categoryname: 'Test Category 1',
            };
            const category2 = {
                categoryid: 'category2',
                categoryname: 'Test Category 2',
            };
            Category.findOne.mockResolvedValueOnce(category1).mockResolvedValueOnce(category2);

            const project1 = {
                projectname: 'Test Project 1',
                projectsdescription: 'This is a test project',
                categoryid: 'category1',
            };
            const project2 = {
                projectname: 'Test Project 2',
                projectsdescription: 'Another test project',
                categoryid: 'category2',
            };
            Project.find.mockResolvedValue([project1]);

            const res = await request(app).get('/api/searchProjects?cId=category1');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.projectInfo).toHaveLength(1);
            expect(res.body.projectInfo[0].categoryid).toBe('category1');
        });
    });
});
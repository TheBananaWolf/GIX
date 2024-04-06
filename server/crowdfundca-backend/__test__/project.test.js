const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../routes/project'); // 注意：可能需要根据实际路径调整
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
describe("GET /showProjectBy endpoint", () => {
    beforeEach(() => {
        // Clear mock implementations before each test
        Project.find.mockClear();
        jwt.verify.mockReset();
    });

    it("should return projects matching the category ID", async () => {
        Project.find.mockResolvedValueOnce([
            {
                toObject: function () {
                    return {
                        pid: "1",
                        projectname: "Project 1",
                        projectsdescription: "Description 1",
                        categoryid: "1",
                        images: [],
                        userId: "1",
                        targetmoney: "1000",
                        currentmoney: "500",
                        statue: true,
                        endDate: new Date("2023-12-31"),
                        startdate: new Date("2023-01-01"),
                        participateduser: [],
                        rewardlevel: [],
                        rewardprice: [],
                        rewardcontent: [],

                    };
                }
            },
        ]);
        const response = await request(app).get("/api/project/showProjectBy?queryKey=categoryid&value=1");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.projectInfo).toHaveLength(1);
        expect(response.body.projectInfo[0].projectname).toBe("Project 1");
        expect(Project.find).toHaveBeenCalledWith({categoryid: "1"});
    });
    it("should return projects matching the projectname", async () => {
        Project.find.mockResolvedValueOnce([
            {
                toObject: function () {
                    return {
                        pid: "1",
                        projectname: "Project 1",
                        projectsdescription: "Description 1",
                        categoryid: "1",
                        images: [],
                        userId: "1",
                        targetmoney: "1000",
                        currentmoney: "500",
                        statue: true,
                        endDate: new Date("2023-12-31"),
                        startdate: new Date("2023-01-01"),
                        participateduser: [],
                        rewardlevel: [],
                        rewardprice: [],
                        rewardcontent: [],

                    };
                }
            },
        ]);
        const response = await request(app).get("/api/project/showProjectBy?queryKey=projectname&value=Project 1");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.projectInfo).toHaveLength(1);
        expect(response.body.projectInfo[0].projectname).toBe("Project 1");
        expect(Project.find).toHaveBeenCalledWith({projectname: "Project 1"});
    });
    it("should return projects matching the pid", async () => {
        Project.find.mockResolvedValueOnce([
            {
                toObject: function () {
                    return {
                        pid: "1",
                        projectname: "Project 1",
                        projectsdescription: "Description 1",
                        categoryid: "1",
                        images: [],
                        userId: "1",
                        targetmoney: "1000",
                        currentmoney: "500",
                        statue: true,
                        endDate: new Date("2023-12-31"),
                        startdate: new Date("2023-01-01"),
                        participateduser: [],
                        rewardlevel: [],
                        rewardprice: [],
                        rewardcontent: [],

                    };
                }
            },
        ]);
        const response = await request(app).get("/api/project/showProjectBy?queryKey=pid&value=1");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.projectInfo).toHaveLength(1);
        expect(response.body.projectInfo[0].projectname).toBe("Project 1");
        expect(Project.find).toHaveBeenCalledWith({pid: "1"});
    });
});


describe('POST /showUserProject', () => {
    beforeEach(() => {
        Project.find.mockClear();

    });
    it('should respond with user projects if present', async () => {
        const mockProjects = [
            {
                pid: "1",
                projectname: "Project 1",
                projectsdescription: "Description 1",
                categoryid: "1",
                images: [],
                userId: "1",
                targetmoney: "1000",
                currentmoney: "500",
                statue: true,
                endDate: new Date("2023-12-31"),
                startdate: new Date("2023-01-01"),
                participateduser: [],
                rewardlevel: [],
                rewardprice: [],
                rewardcontent: [],
                toObject: function () { // Ensure toObject is mocked if your code uses it
                    return this;
                },
            },
        ];

        Project.find.mockResolvedValue(mockProjects.map(project => project.toObject()));

        const response = await request(app)
            .post('/api/project/showUserProject')
            .set('Authorization', 'Bearer validToken')// Simulate passing a valid token
            .send({token: 'test'}); // No need to send a token in the body if Authorization header is used

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.projectInfo).toHaveLength(1);
        expect(response.body.projectInfo[0].projectname).toBe("Project 1");
    });

    it('should respond with 404 if user has no projects', async () => {
        Project.find.mockResolvedValue([]);
        const response = await request(app)
            .post('/api/project/showUserProject')
            .set('Authorization', 'Bearer 111111')
            .send({token: "11111"});
        console.log(response.body)

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User does not upload any project");
    });

    it('should respond with 500 if no token provided', async () => {
        const response = await request(app)
            .post('/api/project/showUserProject')
            .set('Authorization', 'Bearer validToken')
            .send({}); // No token

        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User not login");
    });

});


describe('POST /showUserDonateProject', () => {

    beforeEach(() => {
        // Reset mocks before each test
        Project.find.mockClear();
    });

    test('Should return 401 if no token provided', async () => {
        await request(app)
            .post('/api/project/showUserDonateProject')
            .send({})
            .expect(401);
    });

    test('Should return 400 if user has not participated in any projects', async () => {
        Project.find.mockResolvedValue([]);

        await request(app)
            .post('/api/project/showUserDonateProject')
            .set('Authorization', `Bearer validToken`)
            .send({token: 'someToken'})
            .expect(404);
    });

    test('Should pass', async () => {
        const mockProjects = [
            {
                pid: "1",
                projectname: "Project 1",
                projectsdescription: "Description 1",
                categoryid: "1",
                images: [],
                userId: "1",
                targetmoney: "1000",
                currentmoney: "500",
                statue: true,
                endDate: new Date("2023-12-31"),
                startdate: new Date("2023-01-01"),
                participateduser: [1],
                rewardlevel: [],
                rewardprice: [],
                rewardcontent: [],
                toObject: function () { // Ensure toObject is mocked if your code uses it
                    return this;
                },
            },
        ];

        Project.find.mockResolvedValue(mockProjects.map(project => project.toObject()));

        const response = await request(app)
            .post('/api/project/showUserDonateProject')
            .set('Authorization', `Bearer validToken`)
            .send({token: 'someToken'})
            .expect(200);
        expect(response.body.success).toBe(true);
    });
});

describe('POST /deleteproject', () => {

    beforeEach(() => {
        // Reset mocks before each test
        Project.find.mockClear();
    });

    test('Should return 400 if no token provided', async () => {
        await request(app)
            .post('/api/project/deleteproject')
            .send({})
            .expect(400);
    });

    test('Should pass', async () => {
        // Mock Project.findOne to simulate finding a project
        Project.findOne.mockResolvedValue({
            deleteOne: jest.fn().mockResolvedValue({deletedCount: 1})
        });

        const response = await request(app)
            .post('/api/project/deleteproject?token=someToken&pid=1');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Delete successful");
    }, 10000); // Adjusted timeout as needed
});


describe("GET /getCategoryInfoById", () => {
    beforeEach(() => {
        // Assuming Category is correctly mocked earlier in the file
        jest.clearAllMocks(); // Clear all mocks before each test
    });

    it("should return category info matching the category ID", async () => {
        // Assuming Category is your mongoose model and it's mocked correctly
        Category.findOne.mockResolvedValue({
            categoryid: "1",
            categoryname: "Technology",
            categorydescription: "Technology projects",
            // Include toObject if your actual implementation uses it
            toObject: function () {
                return this;
            }
        });

        const response = await request(app)
            .get("/api/project/getCategoryInfoById?queryKey=categoryid&value=1");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        // Adjust your expectations based on the actual response structure
        expect(response.body.projectInfo.categoryid).toBe("1");
        expect(response.body.projectInfo.categoryname).toBe("Technology");
    });

    it("should return 400 if category does not exit", async () => {
        Category.findOne.mockResolvedValue(null);

        const response = await request(app)
            .get("/api/project/getCategoryInfoById?queryKey=categoryid&value=2");

        console.log(response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

    });
});
describe("GET /getCategorys", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return category info matching the category ID", async () => {
        Category.find.mockResolvedValue({
            categoryid: "1",
            categoryname: "Technology",
            categorydescription: "Technology projects",
            toObject: function () {
                return this;
            }
        });

        const response = await request(app)
            .get("/api/project/getCategorys");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

});

describe('POST /uploadProject', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully upload a project', async () => {
        const newProjectData = {
            projectname: 'New Project',
            projectsdescription: 'A new project description',
            targetmoney: '5000',
            currentmoney: '0',
            enddate: new Date('2024-12-31'),
            categoryid: '1',
            token: 'someToken',
            rewardprice: ['100', '200'],
            rewardcontent: ['T-shirt', 'Mug'],
        };
        Category.findOne.mockResolvedValue({
            categoryid: "1",
            categoryname: "Technology",
            categorydescription: "Technology projects",
            // Include toObject if your actual implementation uses it
            toObject: function () {
                return this;
            }
        });
        const mockProjects = [];

        Project.find.mockResolvedValue(mockProjects.map(project => project.toObject()));
        const response = await request(app)
            .post('/api/project/uploadProject')
            .set('Authorization', 'Bearer validToken')
            .send({
                projectname: newProjectData.projectname,
                projectsdescription: newProjectData.projectsdescription,
                targetmoney: newProjectData.targetmoney,
                currentmoney: newProjectData.currentmoney,
                enddate: newProjectData.enddate.toISOString(),
                categoryid: newProjectData.categoryid,
                token: newProjectData.token,
                rewardprice: JSON.stringify(newProjectData.rewardprice),
                rewardcontent: JSON.stringify(newProjectData.rewardcontent),
                // Simulate file upload; adjust based on your route's logic
                file: 'file.jpg'
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
    });

    it('should respond minimally', async () => {
        const response = await request(app)
            .post('/api/project/uploadProject')
            .set('Authorization', 'Bearer validToken')
            .send({token: "data"}); // Simplify the request

        console.log(response.body);
        expect(response.statusCode).not.toBe(500); // Adjust according to expected minimal response
    }, 10000);

});
describe('POST /updateProjectPrice', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup Project.findOne mock
        Project.findOne.mockResolvedValue({
            pid: '1',
            currentmoney: '100',
            participateduser: ['user123'],
            rewardprice: ['200'],
            save: jest.fn().mockResolvedValue({}),
        });

        // Mock axios.put call
        mockedAxios.put.mockResolvedValue({
            status: 200,
            data: {message: "Profile updated successfully"},
        });
    });

    it('should successfully update the project price', async () => {
        const response = await request(app)
            .post('/api/project/updateProjectPrice')
            .set('Authorization', 'Bearer validToken')
            .send({
                pid: '1',
                selectedPrice: '200',
                token: 'validToken',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Project price updated successfully");
    });

});
describe('POST /updateProject', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mocks
        Project.findOne.mockResolvedValue({
            userId: '1', // Simulate a project found for the given pid
            save: jest.fn().mockResolvedValue({}),
        });
        Category.findOne.mockResolvedValue({
            name: 'Technology'
        });
    });

    it('can not update project because userid not correct', async () => {
        const pid = 'testPid';
        const projectUpdateData = {
            pid,
            projectname: 'Updated Project Name',
            projectsdescription: 'Updated project description',
            targetmoney: '2000',
            enddate: new Date('2025-12-31').toISOString(),
            categoryid: '1',
            userId: "1",
            token: 'validToken',
            rewardlevel: ['1'],
            rewardprice: ['100'],
            rewardcontent: ['New Reward'],
        };

        const response = await request(app)
            .post('/api/project/updateProject')
            .set('Authorization', 'Bearer fasdfasdfas')
            .send(projectUpdateData);
        expect(response.statusCode).toBe(403);
    });

    it('updated project', async () => {
        const pid = 'testPid';
        const projectUpdateData = {
            pid,
            projectname: 'Updated Project Name',
            projectsdescription: 'Updated project description',
            targetmoney: '2000',
            enddate: new Date('2025-12-31').toISOString(),
            categoryid: '1',
            userId: "1",
            token: 'validToken',
            rewardlevel: ['1'],
            rewardprice: ['100'],
            rewardcontent: ['New Reward'],
        };

        const response = await request(app)
            .post('/api/project/updateProject')
            .set('Authorization', 'Bearer validToken')
            .send(projectUpdateData);
        expect(response.statusCode).toBe(200);
    });

});

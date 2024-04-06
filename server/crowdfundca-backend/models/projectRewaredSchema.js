const mongoose = require("mongoose");

const projectRewardSchema = new mongoose.Schema(
    {
        pid: String,
        name: String,
        token: String,
        rewardDes: [],
        rewarePrice: [],
        rewardContent: []

    },
    {timestamps: true},
);

const ProjectReward = mongoose.model("ProjectReward", projectRewardSchema, "project_reward_info");

module.exports = ProjectReward;

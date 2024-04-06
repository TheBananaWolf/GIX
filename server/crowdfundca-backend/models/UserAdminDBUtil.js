const mongoose = require('mongoose');

// Your MongoDB Atlas connection string
const url = 'yourMongoDBConnectionURL';

const connectUserAdminDB = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = {connectUserAdminDB};

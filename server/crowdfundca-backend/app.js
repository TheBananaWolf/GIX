var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const {connectProjectDB, setUpCategory} = require("./models/projectDbUtill");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const authRoutes = require("./routes/auth");
const {router: profileRoutes} = require("./routes/profile");
const { router: projectRoutes } = require("./routes/project");
const adminRoutes = require("./routes/admin");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const createError = require('http-errors');

var app = express();
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// 设置JSON body的大小限制为10mb
app.use(bodyParser.json({ limit: '100mb' }));
// app.use(express.static(path.join(__dirname, "public")));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/admin", adminRoutes);


//establish connection to MongoDB
connectProjectDB();
// setUpCategory();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler

module.exports = app;

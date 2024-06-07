const express = require("express");
const app = express();

const UserRoutes = require("./routes/userRoutes");
const PaymentRoutes = require("./routes/PaymentRoutes");
const ProfileRoutes = require("./routes/ProfileRoutes");
const CourseRoutes = require("./routes/CourseRoutes");

const database  = require("./config/database");
const cookieParser = require("cookie-parser");
const course = 
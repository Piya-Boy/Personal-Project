require("dotenv").config();
const express = require("express");
const cors = require('cors')
// const multer = require("multer");
const cookieParser = require("cookie-parser");
const notFound = require('./middlewares/notFound')
const errorMiddleware = require('./middlewares/error')
const authRoute = require('./routes/auth.js')
const usersRoute = require('./routes/users.js')
const postRoute = require('./routes/posts.js')
const commentRoute = require('./routes/comments.js')
const likeRoute = require('./routes/likes.js')
const ralationshipRoute = require('./routes/relationships.js')

const app = express();

app.use(express.json());

app.use(cors());

app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/likes", likeRoute);
app.use("/api/relationships", ralationshipRoute);
// not found
app.use(notFound)
// error
app.use(errorMiddleware)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
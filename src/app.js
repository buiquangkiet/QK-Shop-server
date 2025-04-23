const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute");    // Gọi route đăng ký đăng nhập

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000'
}));                                      // Cho phép CORS
app.use(express.json());                              // Middleware để parse JSON body

// Sử dụng route có prefix /api/auth
app.use("/api/user", userRoute);

module.exports = app;                                 // Xuất app để dùng ở server.js

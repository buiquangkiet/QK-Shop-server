require("dotenv").config();                           // Đọc biến môi trường từ .env
const mongoose = require("mongoose");                 // Kết nối MongoDB
const app = require("./src/app");                     // Gọi app Express

mongoose.connect(process.env.MONGO_URI)               // Kết nối tới MongoDB
  .then(() => {
    console.log("MongoDB connected");                 // Thành công thì log ra
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`); // Server chạy thành công
    });
  })
  .catch(err => console.error(err));                  // Nếu lỗi thì in lỗi ra

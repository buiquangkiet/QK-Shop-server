const jwt = require('jsonwebtoken');
const User = require('../models/User')

// kiểm tra quyền xác thực người dùng
exports.protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];  // lấy token từ header
    if(!token){
        return res.status(400).json({
            message:'Token không tồn tại',
            success: false
        })
    }
     try {
        console.log('Token received:', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Token không hợp lệ!", success: false });
        }
        req.user = user;
        next();
     } catch (error) {
        console.log('Error:', error);
        return res.status(400).json({
            message:'Token sai hoặc hết hạn',
            success: false
        })
     }

};

exports.adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {                              // Nếu không phải admin
      return res.status(400).json({ 
        message:'Từ chối đăng nhập',
        success: false
       });
    }
    next();                                                       // Nếu là admin thì cho đi tiếp
  };
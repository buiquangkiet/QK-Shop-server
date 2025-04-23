const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req,res) =>{
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            message : 'Lấy thông tin tất cả user thành công',
            success : true,
            users,
        })
    } catch (error) {
        res.status(400).json({
            message : 'Lấy thông tin tất cả user thất bại',
            success : false
        })
    }
} ;

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.status(200).json({
            message : 'Lấy thông tin user thành công',
            success : true,
            user,
        })
    } catch (error) {
        res.status(400).json({
            message : 'Lấy thông tin user thất bại',
            success : false
        })
    }
};

exports.updateUser = async (req,res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        ).select("-password");
        if(!this.updateUser){
            return res.status(400).json({
                message : 'Không tìm thấy user',
                success : false
            })
        }
        res.status(200).json({
            message : 'Update thông tin user thành công',
            success : true,
            user,
        })
    } catch (error) {
        res.status(400).json({
            message : 'Update thông tin user thấy bại ',
            success : false
        })
    }
};

exports.deleteUser = async (req,res) => {
    try {
        const user = await User.findById(
            req.params.id,
        ).select("-password");
        if(!deleteUser){
            return res.status(400).json({
                message : 'Không tìm thấy user',
                success : false
            })
        }
        await user.softDelete();
        res.status(200).json({
            message : 'Xóa user thành công',
            success : true,
            user: user,
        })
    } catch (error) {
        res.status(400).json({
            message : 'Xóa user thất bại ',
            success : false
        })
    }
};

exports.register = async (req, res) => {
     try {
        const { email, firstName, lastName, password } = req.body;
        if (!email || !firstName || !lastName || !password) {
          return res.status(400).json({
            message: 'Vui lòng điền đầy đủ thông tin!',
            success: false
          });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email đã tồn tại',
                success: false
            });
        }

        const user = await User.create(req.body);
        res.status(200).json({
            message: 'Tạo tài khoản thành công',
            success: true,
            user
        }
        )
     } catch (error) {
        res.status(400).json({
            message:'Tạo tài khoản thất bại',
            success: false
        })
     }
}

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email}); // tim user theo email
    if(!user ){
        return res.status(400).json({
            message: 'tài khoản không tồn tại',
            success: false,
        });
    }

    const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Sai mật khẩu',
                success: false
            });
        }
    const token = jwt.sign({id: user._id, role: user.role},
        process.env.JWT_SECRET, 
        {expiresIn: '1d'}
    );
    return res.json({ 
        message: 'Đăng nhập thành công',
        success: true,
        token,
        email: user.email,
        role: user.role
    });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi máy chủ khi đăng nhập',
            success: false
        });
    }

    
};



exports.forgotPassword = async (req,res) =>{
    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user) return res.status(400).json({ //nếu không tồn tại user nào thì trả về message
        message: "Email không tồn tại"
    });

    const newOTP = Math.floor(100000 + Math.random() * 900000).toString(); // tạo mã otp có 6 chữ số
    const newOTPExpire = Date.now() + (10 * 60 * 1000); // hiệu lực  trong 3 phút

    user.otp = newOTP; // gán otp của user bằng otp vừa tạo
    user.otpExpire = newOTPExpire;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOption = {
        to : user.email,
        subject: "Mã OTP đặt lại mật khẩu",
        text: `Mã OTP của bạn là : ${newOTP}. Có hiệu lực trong 10 phút !`
    };

    transporter.sendMail(mailOption, (error) =>{
        if (error) {
            console.error(error);  // In chi tiết lỗi 
            return res.status(500).json({
                message: "Gửi OTP thất bại",
                success: false
            });
        }
        res.status(200).json({
            message: "Mã OTP đã được gửi đến email của bạn"
        });
    });
};

exports.verifyOTP = async (req, res) => {
    const {email, otp} = req.body;
    const user = await User.findOne({email});

    if(!user) return res.status(404).json({
        message: "Email không hợp lệ"
    });

    if( user.otp !== otp || 
        user.otpExpire < Date.now()
    ) return res.status(404).json({
        message: "Mã OTP không hợp lệ hoặc hết hạn"
    });
    res.status(200).json({
        message: "OTP hợp lệ"
    });
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                message: 'Email không đúng',
                success: false 
            });
        }

        // Kiểm tra OTP và thời gian hết hạn
        if (user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ 
                message: 'Mã OTP không hợp lệ hoặc đã hết hạn',
                success: false 
            });
        }

        // console.log('Mật khẩu mới trước khi hash:', newPassword);

        // Mã hóa mật khẩu mới với salt rounds = 10
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Cập nhật mật khẩu mới
        user.password = newPassword;
        user.otp = null;
        user.otpExpire = null;
        
        await user.save();

        console.log('Mật khẩu đã lưu trong DB:', user.password);

        return res.status(200).json({ 
            message: 'Mật khẩu đã được cập nhật thành công',
            success: true
        });
    } catch (error) {
        console.error('Lỗi reset password:', error);
        return res.status(500).json({ 
            message: 'Đã xảy ra lỗi khi cập nhật mật khẩu',
            success: false 
        });
    }
};

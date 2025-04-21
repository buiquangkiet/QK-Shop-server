const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

    const isMatch = await user.comparePassword(password);
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


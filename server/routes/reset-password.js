const { Users } = require('../models')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');



require('dotenv').config();

// Lấy lại mật khẩu bằng email =====
// =================================
async function resetPassword_req(req, res) {
    const email = req.body;
    try {
        // Find user by email

        const user = await Users.findOne({ where: email })
        if (!user) throw new Error("User not found !");

        // Create resetPassword token - Tạo token lưu thông tin user được tìm thấy
        const resetPassword_token = jwt.sign({ userID: user.id }, process.env.SECRET_KEY, { expiresIn: '3m' })

        // Create transporter - email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Create link with token
        let reset_link = `http://${process.env.FRONTEND_URL}/reset-password/${resetPassword_token}`
        const mail = {
            from: `${process.env.EMAIL_USERNAME}`,
            to: `${email.email}`,
            subject: 'FORGOT YOUR PW, you stupid 😏 ',
            html: ` <div>Nhấn vào liên kết dưới đây để cập nhập lại mật khẩu của bạn :</div>
                    <a href="${reset_link}"
                      style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
                      Đặt lại mật khẩu
                   </a>`
        };

        const sendmail = await transporter.sendMail(mail)

        return res.json("Mail sent!")

    } catch (e) {
        if (e) return res.json({ message: e.message })
    }

}

async function resetPassword(req, res) {
    const { password } = req.body;
    console.log(password)
    const { token } = req.params;

    try {
        // decode token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userID = decoded.userID

        const user = await Users.findOne({ where: { id: userID } })
        if (!user) throw new Error("Người dùng từ reset token không tồn tại !")

        const newPasshashed = await bcrypt.hash(password, Number(process.env.SALT_ROUND))

        await Users.update({ password: newPasshashed }, { where: { id: userID } })

        return res.json({ message: "Mật khẩu mới được cập nhật !" })

    } catch (er) {
        return res.json({ message: er.message })
    }
}

module.exports = {
    resetPassword_req,
    resetPassword
}
const nodemailer = require('nodemailer');
const moment = require('moment');
const path = require('path');
module.exports = function (req, res) {
    nodemailer.createTestAccount((err, account) => {
        // 填入自己的账号和密码
        let transporter = nodemailer.createTransport({
            host: 'smtp.yeah.net',
            port: 465,
            secure: true, // 如果是 true 则port填写465, 如果 false 则可以填写其它端口号
            auth: {
                user: "xiofelix@yeah.net", // 发件人邮箱
                pass: "OKKUTYNRKMANYFWX" // 163IMAP/SMTP授权码密匙
            }
        });
        // 获取当前时间
        let sendTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        // 填写发件人, 收件人
        let mailOptions = {
            // 发件人地址
            from: 'xiofelix@yeah.net',
            // 收件人列表, 向163邮箱, gmail邮箱, qq邮箱各发一封
            to: 'xiofelix725@gmail.com, 1317858648@qq.com, wangqianying2022@gmail.com, cyqqazmlp@gmail.com, a1837312@adelaide.edu.au, a1841612@adelaide.edu.au, a1837323@adelaide.edu.au, a1844213@adelaide.edu.au',
            // 邮件主题
            subject: `To ${title.getTitle()}${emoji.getEmoji()}`,
            // 文字内容
            text: 'Hello World!',
            // html内容
            html: '<b>发送时间:' + sendTime + '</b>'

        };

        // 发送邮件
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log("Send SUCCESS");
            res.send('SUCCESS!');
        });
    });
};

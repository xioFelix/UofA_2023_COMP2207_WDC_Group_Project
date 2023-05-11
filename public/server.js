const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'yourusername',
    password: 'yourpassword',
    database: 'yourdatabase'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("已成功连接到数据库!");
});

app.post('/rsvp', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const attend = req.body.attend;

    const query = "INSERT INTO rsvp (name, email, number, attend) VALUES (?, ?, ?, ?)";

    connection.query(query, [name, email, number, attend], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.send("表单提交成功");
    });
});

app.listen(3000, function () {
    console.log("服务器正在运行在 http://localhost:3000");
});


// 在这个例子中，我们首先设置了一个连接到MySQL数据库的连接。然后，当表单提交到/rsvp路由时，我们从请求体中提取出数据，然后用这些数据执行一个插入（INSERT）查询，将数据添加到名为rsvp的数据库表中。我们使用?作为参数的占位符，然后在query函数的第二个参数中提供一个数组来替换这些占位符。

// 请注意，你需要替换上述代码中的yourusername、yourpassword、和yourdatabase为你的MySQL数据库的实际用户名、密码和数据库名。同时，你需要确保你的数据库中有一个名为rsvp的表，其结构应与你的表单数据匹配。

// 然后，你可以通过运行node server.js来启动服务器。当用户填写表单并点击提交按钮时，他们的数据将被发送到你的服务器，并最终存储在你的MySQL数据库中。

// 这只是一个基础示例，实际应用中还需要处理错误、验证输入、防止SQL注入等等。
// 密码可见/隐藏切换
document.getElementById('togglePassword').addEventListener('click', function() {
    var passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.setAttribute('type', 'text');
    } else {
        passwordInput.setAttribute('type', 'password');
    }
});

document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // 阻止表单的默认提交行为

    // 获取表单字段的值
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // 创建一个对象来存储要发送的数据
    var data = {
      username: username,
      email: email,
      password: password
    };

    // 发送POST请求到服务器
    fetch('/personal_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(function (response) {
        if (response.ok) {
          // eslint-disable-next-line no-console
          console.log('Updated successfully');
          // 在此处进行任何其他成功后的操作
          // eslint-disable-next-line no-alert
          alert('Update SUCCESSFULLY!'); // 显示成功的弹窗
        } else {
          // eslint-disable-next-line no-console
          console.log('FAIL to update');
          // 在此处进行任何其他失败后的操作
          // eslint-disable-next-line no-alert
          alert('FAIL to Update! Hint: Repeated Username or Email.'); // 显示失败的弹窗
        }
      })
      .catch(function (error) {
        console.log('Error:', error);
        // 在此处处理错误
        // eslint-disable-next-line no-alert
        alert('An error occurred'); // 显示错误的弹窗
      });
});

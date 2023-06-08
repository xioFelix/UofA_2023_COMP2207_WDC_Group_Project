// JavaScript
var joinButtons = document.querySelectorAll('.JoinButton');

joinButtons.forEach(function(button) {
  button.addEventListener('click', function(event) {
    event.preventDefault(); // 阻止按钮的默认点击行为

    // 获取按钮所在的俱乐部ID
    var club_id = button.getAttribute('data-club-id');

    var user_id = '11';

    // 创建一个对象来存储要发送的数据
    var data = {
      user_id: user_id,
      club_id: club_id
    };

    // 发送POST请求到服务器
    fetch('/joinClub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(function(response) {
        if (response.ok) {
          console.log('加入俱乐部成功');
          // 在此处进行任何其他成功后的操作
          alert('您已成功加入俱乐部！'); // 显示成功的弹窗
        } else {
          console.log('加入俱乐部失败');
          // 在此处进行任何其他失败后的操作
          alert('您已经是俱乐部的成员！'); // 显示失败的弹窗
        }
      })
      .catch(function(error) {
        console.log('错误:', error);
        // 在此处处理错误
        alert('发生错误'); // 显示错误的弹窗
      });
  });
});



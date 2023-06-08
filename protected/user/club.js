// eslint-disable-next-line no-unused-vars
function openClubUser() {
    window.location.href = 'clubs_user.html';
  }

  // eslint-disable-next-line no-unused-vars
  function openClubAll() {
    window.location.href = 'club_all.html';
  }

// club_your
// 获取存储的已加入俱乐部列表
// 加入的俱乐部localStorage并动态创建俱乐部链接。
// 获取按钮元素
// yourClubsButton 的点击事件

// 假设您有一个具有id="clubLinksContainer"的div元素用于包含俱乐部链接
const clubLinksContainer = document.getElementById('clubLink');
var user_id = '11';
// 发起异步请求获取已加入的俱乐部链接
fetch('/clubs_user?user_id=' + user_id)  // 将YOUR_USER_ID替换为实际的用户ID

  .then(response => response.text())
  .then(data => {
    // 将返回的数据插入到页面中的clubLinksContainer元素中
    clubLinksContainer.innerHTML = data;
  })
  .catch(error => {
    console.error(error);
  });




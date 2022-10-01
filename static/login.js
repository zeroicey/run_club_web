const loginBtn = document.querySelector('.loginBtn')

function login() {
  loginBtn.classList.add('visually-hidden')
  const username = document.querySelector('#floatingInput').value;
  const password = document.querySelector('#floatingPassword').value;

  axios.post('/login', {
    username: username,
    password: password
  })
  .then((response) => {
    // console.log(response);
    if (response.data) {
      swal("登陆成功", "欢迎来到常跑社", "success")
      .then(() => {
        window.location.href = "/"
      })
    } else {
      swal("登录失败", "请联系管理员解决", "error")
      loginBtn.classList.remove('visually-hidden')
    }
  })
  .catch((err) => {
    console.log(err);
  })
}
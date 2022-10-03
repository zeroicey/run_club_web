function img_click (img) {
    console.log(img);
    let src = img.getAttribute('src');
    let imgPreview = document.querySelector('.imgPreview img')
    imgPreview.setAttribute("src", src);
    document.querySelector('.imgPreview').classList.remove("visually-hidden")
};

function save(save_btn) {
    save_btn.classList.add('visually-hidden')
    let _class = document.querySelector('#class').value
    let nickname = document.querySelector('#nickname').value
    let password = document.querySelector('#password').value
    let password_again = document.querySelector('#password_again').value

    let patten = /^[\w]{6,15}$/;

    if (
        _class.trim() === '' ||
        nickname.trim() === '' ||
        password.trim() === ''
    ) {
        swal("格式错误", "输入框不能为空", "error")
        return save_btn.classList.remove('visually-hidden')
    } else if (isNaN(_class) || _class.length !== 3) {
        swal("格式错误", "班级格式错误", "error")
        return save_btn.classList.remove('visually-hidden')
    } else if (nickname.length < 2) {
        swal("格式错误", "昵称太短", "error")
        return save_btn.classList.remove('visually-hidden')
    } else if (nickname.length > 10) {
        swal("格式错误", "昵称太长", "error")
        return save_btn.classList.remove('visually-hidden')
    } else if (!(patten.exec(password))) {
        swal("格式错误", "请输入6-15个以字母开头, 可带数字, '_' 的密码", "error")
        return save_btn.classList.remove('visually-hidden')
    } else if (password !== password_again && password_again.length !== 0) {
        swal("格式错误", "两次密码不一致", "error")
        return save_btn.classList.remove('visually-hidden')
    }
    axios.post('/user', {
        nickname: nickname,
        password: password,
        class: _class
    })
    .then((response) => {
        if (response.data) {
            swal("修改成功", "即将刷新页面", "success")
            .then(() => {
                window.location.href = "/user"
            })
        } else {
            swal("修改失败", "请联系管理员解决", "error")
            save_btn.classList.remove('visually-hidden')
        }
    })
}

function reload(id, btn) {
    btn.classList.add('visually-hidden')
    axios.post('/reloadPic', {id: id})
    .then((response) => {
        console.log(response);
        if (response.data) {
            swal("刷新成功", "即将刷新页面", "success")
            .then(() => {
                window.location.href = '/user'
            })
        } else {
            swal("刷新失败", "请联系管理员解决", "error")
            .then(() => {
                window.location.href = '/user'
            })
        }
    })
}

function deleted(id, btn) {
    btn.classList.add('visually-hidden')
    axios.post('/deleteCard', {id: id})
    .then((response) => {
        console.log(response);
        if (response.data) {
            swal("删除成功", "即将刷新页面", "success")
            .then(() => {
                window.location.href = '/user'
            })
        } else {
            swal("删除失败", "请联系管理员解决", "error")
            .then(() => {
                window.location.href = '/user'
            })
        }
    })
    
}

document.querySelector('.imgPreview').onclick = function () {
    document.querySelector('.imgPreview').classList.add("visually-hidden")
};
const user_group = document.querySelector(".list-group")
const card_group = document.querySelector(".cardGroup")
var tagActive = document.querySelector(".active");

function get_off_user_clock_html(user) {
return `
        <label class="list-group-item d-flex gap-4 d-flex align-items-center list-group-item-dark justify-content-between">
            <div>
            <span class="badge bg-primary rounded-pill">未激活</span>
            <strong>${user.class} ${user.username}</strong>
            </div>
            <span class="badge bg-success rounded-pill">打卡${user.clockNum}次</span>
        </label>
    `
}

function get_on_user_clock_html(user, num) {
    return `
        <label class="list-group-item d-flex gap-4 d-flex align-items-center justify-content-between">
            <div>
            <span class="badge bg-primary rounded-pill">No.${num}</span>
            <strong>${user.class} ${user.username}</strong>
            </div>
            <span class="badge bg-success rounded-pill">打卡${user.clockNum}次</span>
        </label>
    `
}

function get_off_user_synthesis_html(user) {
return `
        <label class="list-group-item d-flex gap-4 d-flex align-items-center list-group-item-dark justify-content-between">
            <div>
            <span class="badge bg-primary rounded-pill">未激活</span>
            <strong>${user.class} ${user.username}</strong>
            </div>
            <span class="badge bg-success rounded-pill">${user.integration}</span>
        </label>
    `
}

function get_on_user_synthesis_html(user, num) {
    return `
        <label class="list-group-item d-flex gap-4 d-flex align-items-center justify-content-between">
            <div>
            <span class="badge bg-primary rounded-pill">No.${num}</span>
            <strong>${user.class} ${user.username}</strong>
            </div>
            <span class="badge bg-success rounded-pill">${user.integration}</span>
        </label>
    `
}

function get_card_html(data) {
    // console.log(data);
    let isPic = true
    let img1_html = `<img src="${data.pic1Url}" class="img-fluid rounded-start" onclick="img_click(this)">`
    let img2_html = `<img src="${data.pic2Url}" class="img-fluid rounded-start" onclick="img_click(this)">`
    if (data.isPic1 === 0 && data.isPic2 === 0) { isPic = false }
    return `
        <div class="card mb-3">
        <div class="row g-0">
        <div class="${isPic ? 'col-md-4 ': ''}d-flex flex-wrap justify-content-center align-items-center flex-raw">
            ${data.isPic1 ? img1_html : ''}
            ${data.isPic2 ? img2_html : ''}
        </div>
        <div class="${isPic ? 'col-md-8 ': 'col-md-12 '}">
            <div class="card-body">
            <div class="card-header">
            ${data.username}
            </div>
            <div class="card-body">
                <p class="card-text">跑步距离：${(data.len).split(' ')[0]}.${(data.len).split(' ')[1]} km</p>
                <p class="card-text">所用时间：${(data.time).split(':')[0]}min, ${(data.time).split(':')[1]}s</p>
                <p class="card-text">备注：${data.comment}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">打卡日期：${data.date}</small>
            </div>
            </div>
        </div>
        </div>
    </div>
    `
}

function active(tagactive) {
    user_group.innerHTML = ''
    card_group.innerHTML = ''
    if (tagactive.classList.contains('active')) {
    } else {
        tagActive.classList.remove('active')
        tagactive.classList.add("active")
        tagActive = tagactive
    }
    if (tagactive.text === '主页') {
        active_home()
    } else if (tagactive.text === '打卡榜') {
        active_clock()
    } else if (tagactive.text === '综合榜') {
        active_synthesis()
    }
}

function go_to_home(tagactive) {
    active(tagactive)
}


function exit() {
    axios.get('/exit')
    .then((response) => {
        if (response) {
            window.location.href = '/'
        }
    })
    .catch(function (error) {
        console.log(error);
    })
}

function active_home() {
    axios.get('/getCardData')
    .then(function (response) {
        // console.log(response);
        (response.data).forEach((resp) => {
            card_group.innerHTML += get_card_html(resp)
        });
    })
    .catch(function (error) {
        console.log(error);
        return
    });

}

function active_clock() {
    axios.get('/getClockData')
    .then(function (response) {
        // console.log(response);
        (response.data).forEach((resp, index) => {
            const hm = parseInt((new Date().getTime() - resp.lastLoginTime) / 1000)
            if (parseInt(hm/60/60/24) <= 15  && resp.lastLoginTime !== "") {
                user_group.innerHTML += get_on_user_clock_html(resp, index+1)
            } else {
                user_group.innerHTML += get_off_user_clock_html(resp)
            }
        });
    })
    .catch(function (error) {
        console.log(error);
        return
    });
}

function active_synthesis() {
    axios.get('/getSynthesisData')
    .then(function (response) {
        // console.log(response);
        (response.data).forEach((resp, index) => {
            const hm = parseInt((new Date().getTime() - resp.lastLoginTime) / 1000)
            if (parseInt(hm/60/60/24) <= 5  && resp.lastLoginTime !== "") {
                user_group.innerHTML += get_on_user_synthesis_html(resp, index+1)
            } else {
                user_group.innerHTML += get_off_user_synthesis_html(resp)
            }
        });
    })
    .catch(function (error) {
        console.log(error);
        return
    });
}

img_click = function (img) {
    console.log(img);
    let src = img.getAttribute('src');
    let imgPreview = document.querySelector('.imgPreview img')
    imgPreview.setAttribute("src", src);
    document.querySelector('.imgPreview').classList.remove("visually-hidden")
};

document.querySelector('.imgPreview').onclick = function () {
    document.querySelector('.imgPreview').classList.add("visually-hidden")
};

window.addEventListener('load', function () {
    active_home()
})
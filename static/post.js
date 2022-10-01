window.addEventListener('load', () => {
    let date = new Date()
    document.querySelector('#run_date_year').value = date.getFullYear()
    document.querySelector('#run_date_month').value = date.getMonth() + 1
    document.querySelector('#run_date_day').setAttribute("placeholder", date.getDate())
    document.querySelector('#comment').value = '继续努力！！！!'
})

function get_month_days(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var d = new Date(year, month, 0);
    return d.getDate();
}

function post(btn) {
    btn.classList.add('visually-hidden')
    let run_len_front = document.querySelector('#run_len_front').value
    let run_len_back = document.querySelector('#run_len_back').value
    let run_time_m = document.querySelector('#run_time_m').value
    let run_time_s = document.querySelector('#run_time_s').value
    let run_date_year = document.querySelector('#run_date_year').value
    let run_date_month = document.querySelector('#run_date_month').value
    let run_date_day = document.querySelector('#run_date_day').value
    let run_len = run_len_front + ' ' + run_len_back
    let run_time = run_time_m + ':' + run_time_s
    let run_date = run_date_year + '-' + run_date_month + '-' + run_date_day
    let run_pic1 = document.querySelector('.run_pic1').files
    let run_pic2 = document.querySelector('.run_pic2').files
    let run_comment = document.querySelector('#comment').value
    console.log(run_date_day);
    if (
        run_len_front.trim() === '' ||
        run_len_back.trim() === '' ||
        run_time_m.trim() === '' ||
        run_time_s.trim() === '' ||
        run_date_year.trim() === '' ||
        run_date_month.trim() === '' ||
        run_comment.trim() === '' ||
        run_date_day.trim() === ''
    ) {
        swal("格式错误", "输入框不能为空", "error")
        return btn.classList.remove('visually-hidden')
    } else if (!(0 < parseInt(run_date_day)) || !(parseInt(run_date_day) < get_month_days())) {
        swal("格式错误", "请输入正确的日期", "error")
        return btn.classList.remove('visually-hidden')
    } else if (run_date_month[0] === '0' || run_date_day[0] === '0') {
        swal("格式错误", "日期开头不能为0", "error")
        return btn.classList.remove('visually-hidden')
    } else if (run_pic1.length + run_pic2.length > 2) {
        swal("格式错误", "最多只能上传两张图片", "error")
        return btn.classList.remove('visually-hidden')
    } else if (
        isNaN(run_len_front.trim()) ||
        isNaN(run_len_back.trim()) ||
        isNaN(run_time_m.trim()) ||
        isNaN(run_time_s.trim()) ||
        isNaN(run_date_day.trim()) ||
        isNaN(run_date_month.trim()) ||
        isNaN(run_date_day.trim())
    ) {
	    btn.classList.remove('visually-hidden')
        return swal("格式错误", "请输入正确的数据", "error")
    }
    console.log(run_pic1);
    const formData = new FormData();
    formData.append("run_len", run_len);
    formData.append("run_time", run_time);
    formData.append("run_date", run_date);
    formData.append("run_comment", run_comment);
    console.log(run_pic1[0]);
    if (run_pic1.length === 1) { formData.append("run_pic1", run_pic1[0]); formData.append("run_is_pic1", 1) }
    else { formData.append("run_is_pic1", 0) }
    if (run_pic2.length === 1) { formData.append("run_pic2", run_pic2[0]); formData.append("run_is_pic2", 1) }
    else { formData.append("run_is_pic2", 0) }
    axios.post('/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        console.log(response);
        if (response.data) {
            swal("上传成功", "非常好，请继续加油", "success")
            .then(() => {
                window.location.href = '/post'
            })
        } else {
            swal("上传失败", "请联系管理员解决", "error")
            .then(() => {
                window.location.href = '/post'
            })
        }
    })
}

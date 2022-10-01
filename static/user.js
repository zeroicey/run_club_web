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
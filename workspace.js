document.querySelector('.textlinks').addEventListener("keyup", function (event) {
    if (event.keyCode === 13) { // key ENTER    
        event.preventDefault();
        loadImages();
    }
});
document.querySelector('.button').addEventListener("click", function () {
    loadImages();
});
document.querySelector('.clean-button').addEventListener("click", function () {
    cleanImagesAndContent();
});
function loadImages() {
    let promises = [];
    let counter = 0;
    let counter_error = 0;
    let value = document.getElementById('textlinks').value;

    if (value === '') {
        console.log('vacio');
    } else {
        document.getElementById('image-empty').style.display = "none";
        document.getElementById('content').innerHTML = "";
        var replace_space = value.replace(/[\s,]+/g, ',');;
        let split = replace_space.split(',');

        for (const index in split) {
            if (split[index] !== "") {
                promises.push(testImage(split[index].trim()).then(
                    function fulfilled(img) {
                        counter = + counter + 1;
                        let filename = getFilenameFromUrl(split[index].trim());
                        document.getElementById('content').innerHTML += '<div class="block"><label>'+filename+'</label><img src="' + split[index].trim() + '" onerror="onErrorImage()"></div>';
                    },
                    function rejected() {
                        counter_error = + counter_error + 1;
                        document.getElementById('content').innerHTML += '<div class="block"><img src="img/satellite.svg" style="transform: scale(0.4);"></div>';
                    }
                ));
            }
        }

        Promise.all(promises).then(() => {
            let errorMessage = counter_error > 0 ? ', ' + counter_error + ' imágenes erróneas' : '';
            document.querySelector('.text-result').innerHTML = counter + ' imágenes cargadas' + errorMessage;
            validateContentImagesIsEmpty();
        });
    }
}
function testImage(url) {
    const imgPromise = new Promise(function imgPromise(resolve, reject) {
        var tester = new Image();
        tester.addEventListener('load', () => {
            resolve(this);
        });
        tester.addEventListener('error', () => {
            reject();
        });
        tester.src = url;
    });
    return imgPromise;
}
function cleanImagesAndContent() {
    document.querySelector('.text-result').innerHTML = "0 imágenes cargadas";
    document.getElementById('textlinks').value = "";
    document.getElementById('content').innerHTML = "";         
    validateContentImagesIsEmpty();
}

function validateContentImagesIsEmpty() {
    let content = document.getElementById('content');
    let content_empty = document.getElementById('image-empty');
    
    if(content.innerHTML == ""){
        content_empty.style.display = "block";
    }else {
        content_empty.style.display = "none";
    }
}
function getFilenameFromUrl(url) {
    const pathname = new URL(url).pathname;
    const index = pathname.lastIndexOf('/');
    return (-1 !== index) ? pathname.substring(index + 1) : pathname;
  }
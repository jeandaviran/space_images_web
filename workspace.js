document.querySelector('.textlinks').addEventListener("keyup", function (event) {
    if (event.keyCode === 13) { // key ENTER    
        event.preventDefault();
        loadImages();
    }
});
document.querySelector('.button').addEventListener("click", function () {
    loadImages();
});
function loadImages() {
    let promises = [];
    let counter = 0;
    let counter_error = 0;
    let value = document.getElementById('textlinks').value;

    if (value === '') {
        console.log('vacio');
    } else {
        document.getElementById('content').innerHTML = "";
        var split = value.split(',');
        for (const index in split) {
            promises.push(testImage(split[index].trim()).then(
                function fulfilled(img) {
                    counter = + counter + 1;
                    document.getElementById('content').innerHTML += '<div class="block"><img src="' + split[index].trim() + '" onerror="onErrorImage()"></div>';
                },
                function rejected() {
                    counter_error = + counter_error + 1;
                    document.getElementById('content').innerHTML += '<div class="block"><img src="img/satellite.svg" style="transform: scale(0.4);"></div>';
                }
            ));
        }

        Promise.all(promises).then(() => {
            let errorMessage = counter_error > 0 ? ', ' + counter_error + ' imágenes erróneas' : '';
            document.querySelector('.text-result').innerHTML = counter + ' imágenes cargadas' + errorMessage;
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
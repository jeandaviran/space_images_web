const xlsxDataLoaded = [];

window.addEventListener("click", function (event) {
    if (!event.target.matches('.btn_dropdown')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
});
document.querySelector('.button').addEventListener("click", function () {
    loadImages();
});
document.querySelector('.clean-button').addEventListener("click", function () {
    cleanImagesAndContent();
});
document.querySelector('.btn_dropdown').addEventListener("click", function () {
    openDropdownList();
});
document.querySelector('#download_images').addEventListener("click", function () {
    downloadImages();
});
document.querySelector('#download_excel').addEventListener("click", function () {
    generateExcel();
});
function loadImages() {
    const notyf = new Notyf();
    let promises = [];
    let counter = 0;
    let counter_error = 0;
    let value = document.getElementById('textlinks').value;

    if (value === '') {
        console.log('vacio');
    } else {
        notyf.dismissAll();
        xlsxDataLoaded.splice(0, xlsxDataLoaded.length);
        document.querySelector('.content-result').innerHTML = 'Cargando imágenes...';
        document.getElementById('image-empty').style.display = "none";
        document.getElementById('content').innerHTML = "";
        var replace_space = value.replace(/[\s,]+/g, ',');;
        let split = replace_space.split(',');

        for (const index in split) {
            if (split[index] !== "") {
                let filename = getFilenameFromUrl(split[index].trim());
                promises.push(testImage(split[index].trim()).then(
                    function fulfilled(img) {
                        counter = + counter + 1;
                        document.getElementById('content').innerHTML += '<div class="block"><label>' + filename + '</label><img src="' + split[index].trim() + '" onerror="onErrorImage()"></div>';
                        var json = { "name": filename, "link": split[index], "status": "Available" };
                        xlsxDataLoaded.push(json);
                    },
                    function rejected() {
                        counter_error = + counter_error + 1;
                        document.getElementById('content').innerHTML += '<div class="block"><label>' + filename + '</label><img src="img/satellite.svg" style="transform: scale(0.4);"></div>';
                        var json = { "name": filename, "link": split[index], "status": "Incorrect" };
                        xlsxDataLoaded.push(json);
                    }
                ));
            }
        }

        Promise.all(promises).then(() => {
            let errorMessage = counter_error > 0 ? ', ' + counter_error + ' imágenes erróneas' : '';
            document.querySelector('.content-result').innerHTML = counter + ' imágenes cargadas' + errorMessage;
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
    document.querySelector('.content-result').innerHTML = "0 imágenes cargadas";
    document.getElementById('textlinks').value = "";
    document.getElementById('content').innerHTML = "";
    xlsxDataLoaded.splice(0, xlsxDataLoaded.length);
    validateContentImagesIsEmpty();
}
function validateContentImagesIsEmpty() {
    const notyf = new Notyf();
    let content = document.getElementById('content');
    let content_empty = document.getElementById('image-empty');

    if (content.innerHTML == "") {
        content_empty.style.display = "block";
    } else {
        content_empty.style.display = "none";
        notyf.success('Imágenes cargadas');
    }
}
function getFilenameFromUrl(url) {
    const pathname = new URL(url).pathname;
    const index = pathname.lastIndexOf('/');
    return (-1 !== index) ? pathname.substring(index + 1) : pathname;
}
function generateExcel() {
    const notyf = new Notyf();
    if (xlsxDataLoaded.length > 0) {
        if (typeof XLSX == 'undefined') XLSX = require('xlsx');
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(xlsxDataLoaded);
        XLSX.utils.book_append_sheet(wb, ws, "Images");
        var filename = 'space_images_' + dateNowString() + '.xlsx';
        XLSX.writeFile(wb, filename);
    } else {
        notyf.error("No hay imágenes cargadas");
    }
}
function dateNowString() {
    var f = new Date();
    return f.getDate() + "_" + (f.getMonth() + 1) + "_" + f.getFullYear();
}
function openDropdownList() {
    document.getElementById("myDropdown").classList.toggle("show");
}
function downloadImages() {
    const notyf = new Notyf();
    
    if (xlsxDataLoaded.length > 0) {
        var zip = new JSZip();        
  
        for (const x in xlsxDataLoaded) {    
            
            if (xlsxDataLoaded[x].status === "Available") {                
                zip.file(xlsxDataLoaded[x].name, urlToPromise(xlsxDataLoaded[x].link), { binary: true });
            }
        }

        zip.generateAsync({ type: "blob" })
            .then(function callback(blob) {
                saveAs(blob, "space_images_" + dateNowString() + ".zip");
            });
    } else {
        notyf.error("No hay imágenes cargadas");
    }
}
function urlToPromise(url) {
    return new Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}
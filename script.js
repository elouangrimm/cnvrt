const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const filePreview = document.getElementById('file-preview');
const conversionButtons = document.getElementById('conversion-buttons');
const convertButton = document.getElementById('convert-btn');

const supportedFileTypes = {
    'image/png': ['image/jpeg', 'image/webp', 'icon'],
    'image/jpeg': ['image/png', 'image/webp', 'icon'],
    'image/webp': ['image/png', 'image/jpeg', 'icon'],
    'application/pdf': ['image/png'],
};

let currentFile;
let selectedType;

dropArea.addEventListener('click', () => fileInput.click());

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'));

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

function handleFile(file) {
    if (!file) return;

    currentFile = file;
    filePreview.textContent = '';
    conversionButtons.innerHTML = '';
    convertButton.disabled = true;

    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = '100%';
        img.style.marginBottom = '20px';
        filePreview.appendChild(img);
    } else {
        filePreview.textContent = `File: ${file.name}`;
    }

    populateConversionButtons(file.type);
}

function populateConversionButtons(fileType) {
    if (supportedFileTypes[fileType]) {
        supportedFileTypes[fileType].forEach((type) => {
            const button = document.createElement('button');
            button.textContent = type.split('/')[1]?.toUpperCase() || type.toUpperCase();
            button.classList.add('conversion-option');
            button.dataset.type = type;
            button.addEventListener('click', () => handleConversionOption(type));
            conversionButtons.appendChild(button);
        });
    } else {
        alert('Unsupported file type');
    }
}

function handleConversionOption(type) {
    selectedType = type;
    convertButton.disabled = false;
}

convertButton.addEventListener('click', async () => {
    if (!currentFile || !selectedType) {
        alert('Please select a file and conversion type.');
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
        const arrayBuffer = e.target.result;

        if (selectedType.startsWith('image/')) {
            convertImage(arrayBuffer, selectedType);
        } else {
            alert('Conversion type not yet implemented for this file type.');
        }
    };
    fileReader.readAsArrayBuffer(currentFile);
});

function convertImage(arrayBuffer, outputType) {
    const blob = new Blob([arrayBuffer]);
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const convertedDataUrl = canvas.toDataURL(outputType);
        downloadFile(convertedDataUrl, `converted.${outputType.split('/')[1]}`);
    };
}

function downloadFile(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
}
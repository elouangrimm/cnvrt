const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const filePreview = document.getElementById('file-preview');
const fileTypeOptions = document.getElementById('file-type-options');
const convertButton = document.getElementById('convert-btn');

const supportedFileTypes = {
    'image/png': ['image/jpeg', 'image/webp'],
    'image/jpeg': ['image/png', 'image/webp'],
    'application/pdf': ['image/png'],
};

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

    filePreview.textContent = `File: ${file.name}`;
    populateConversionOptions(file.type);
}

function populateConversionOptions(fileType) {
    fileTypeOptions.innerHTML = '<option value="">Select conversion type</option>';

    if (supportedFileTypes[fileType]) {
        supportedFileTypes[fileType].forEach((type) => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            fileTypeOptions.appendChild(option);
        });

        convertButton.disabled = false;
    } else {
        convertButton.disabled = true;
        alert('Unsupported file type');
    }
}

convertButton.addEventListener('click', () => {
    const selectedType = fileTypeOptions.value;

    if (!selectedType) {
        alert('Please select a conversion type.');
        return;
    }

    alert('Conversion started! This is a placeholder functionality.');
});
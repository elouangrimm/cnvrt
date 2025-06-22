// --- DOM Elements ---
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const selectFileButton = document.getElementById("select-file-btn");
const ffmpegLoader = document.getElementById("ffmpeg-loader");
const initialState = document.getElementById("initial-state");
const filePreview = document.getElementById("file-preview");
const conversionControls = document.getElementById("conversion-controls");
const formatSelect = document.getElementById("format-select");
const convertBtn = document.getElementById("convert-btn");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const finishedState = document.getElementById("finished-state");
const downloadLink = document.getElementById("download-link");
const resetBtn = document.getElementById("reset-btn");

// --- FFmpeg Setup ---
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
    log: true,
    corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
});
let ffmpegReady = false;
let selectedFile = null;

// --- Conversion Mapping ---
const conversionMap = {
    image: {
        label: "Image",
        formats: ["png", "jpg", "webp", "bmp", "tiff"],
    },
    video: {
        label: "Video",
        formats: ["mp4", "webm", "mkv", "mov", "avi"],
    },
    audio: {
        label: "Audio",
        formats: ["mp3", "wav", "ogg", "flac", "aac"],
    },
};

// --- Functions ---

/**
 * Loads the FFmpeg engine and updates the UI.
 */
async function loadFFmpeg() {
    try {
        await ffmpeg.load();
        ffmpegReady = true;
        selectFileButton.style.display = "block";
        ffmpegLoader.style.display = "none";
        console.log("FFmpeg loaded successfully!");
    } catch (error) {
        console.error("Failed to load FFmpeg:", error);
        ffmpegLoader.textContent =
            "Error: Failed to load converter engine. Please refresh.";
    }
}

/**
 * Resets the entire UI to its initial state.
 */
function resetUI() {
    initialState.style.display = "block";
    filePreview.style.display = "none";
    filePreview.innerHTML = "";
    conversionControls.style.display = "none";
    progressContainer.style.display = "none";
    finishedState.style.display = "none";

    fileInput.value = ""; // Clear the file input
    selectedFile = null;
    dropArea.classList.remove("dragover-active");
}

/**
 * Handles file selection from both drag-drop and file input.
 * @param {File} file The selected file object.
 */
function handleFileSelect(file) {
    if (!ffmpegReady || !file) return;

    selectedFile = file;
    const fileType = getFileType(file);

    if (!fileType) {
        alert(
            "Unsupported file type. Please select an image, video, or audio file."
        );
        resetUI();
        return;
    }

    // Update UI
    initialState.style.display = "none";
    dropArea.classList.add("dragover-active");

    // Show preview
    displayPreview(file, fileType);
    filePreview.style.display = "block";

    // Populate and show conversion options
    populateFormatSelector(fileType, file.name.split(".").pop());
    conversionControls.style.display = "flex";
}

/**
 * Determines the file type (image, video, audio).
 * @param {File} file
 * @returns {string|null} 'image', 'video', 'audio', or null
 */
function getFileType(file) {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return null;
}

/**
 * Displays a preview of the selected file.
 * @param {File} file
 * @param {string} fileType
 */
function displayPreview(file, fileType) {
    const reader = new FileReader();
    reader.onload = (e) => {
        let previewElement;
        if (fileType === "image") {
            previewElement = `<img src="${e.target.result}" alt="File preview">`;
        } else if (fileType === "video") {
            previewElement = `<video src="${e.target.result}" controls alt="File preview"></video>`;
        } else if (fileType === "audio") {
            previewElement = `<audio src="${e.target.result}" controls alt="File preview"></audio><p>${file.name}</p>`;
        }
        filePreview.innerHTML = previewElement;
    };
    reader.readAsDataURL(file);
}

/**
 * Populates the format selector based on the file type.
 * @param {string} fileType 'image', 'video', or 'audio'
 * @param {string} originalExtension The original file extension
 */
function populateFormatSelector(fileType, originalExtension) {
    formatSelect.innerHTML = "";
    const formats = conversionMap[fileType].formats;
    formats.forEach((format) => {
        // Don't show option to convert to the same format
        if (format.toLowerCase() !== originalExtension.toLowerCase()) {
            const option = document.createElement("option");
            option.value = format;
            option.textContent = format.toUpperCase();
            formatSelect.appendChild(option);
        }
    });
}

/**
 * Starts the conversion process.
 */
async function startConversion() {
    if (!selectedFile) return;

    const outputFormat = formatSelect.value;
    const fileType = getFileType(selectedFile);
    const outputFileName = `${selectedFile.name
        .split(".")
        .slice(0, -1)
        .join(".")}.${outputFormat}`;

    // Update UI for conversion
    conversionControls.style.display = "none";
    progressContainer.style.display = "block";
    progressBar.value = 0;
    progressText.textContent = "Preparing file...";

    if (fileType === "image") {
        // Use Canvas for faster image conversion
        await convertImageWithCanvas(
            selectedFile,
            outputFormat,
            outputFileName
        );
    } else {
        // Use FFmpeg for audio/video
        await convertMediaWithFFmpeg(
            selectedFile,
            outputFormat,
            outputFileName
        );
    }
}

/**
 * Converts image using the Canvas API.
 */
async function convertImageWithCanvas(file, format, outputFileName) {
    progressText.textContent = "Converting image...";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const fileReader = new FileReader();
    fileReader.onload = () => {
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Note: Canvas only supports a few formats natively.
            const mimeType = `image/${format === "jpg" ? "jpeg" : format}`;
            const dataUrl = canvas.toDataURL(mimeType, 0.9);

            progressBar.value = 100;
            showDownload(dataUrl, outputFileName);
        };
        img.src = fileReader.result;
    };
    fileReader.readAsDataURL(file);
}

/**
 * Converts audio/video using FFmpeg.
 */
async function convertMediaWithFFmpeg(file, format, outputFileName) {
    ffmpeg.FS("writeFile", file.name, await fetchFile(file));

    ffmpeg.setProgress(({ ratio }) => {
        const progress = Math.round(ratio * 100);
        progressBar.value = progress;
        progressText.textContent = `Converting... ${progress}%`;
    });

    await ffmpeg.run("-i", file.name, outputFileName);

    const data = ffmpeg.FS("readFile", outputFileName);
    const blob = new Blob([data.buffer], {
        type: `${getFileType(file)}/${format}`,
    });
    const url = URL.createObjectURL(blob);

    showDownload(url, outputFileName);

    // Clean up filesystem
    ffmpeg.FS("unlink", file.name);
    ffmpeg.FS("unlink", outputFileName);
}

/**
 * Displays the final download link and reset button.
 * @param {string} url The data URL or object URL of the converted file.
 * @param {string} outputFileName The name for the downloaded file.
 */
function showDownload(url, outputFileName) {
    progressContainer.style.display = "none";
    downloadLink.href = url;
    downloadLink.download = outputFileName;
    finishedState.style.display = "block";

    // Auto-download the file
    downloadLink.click();
}

// --- Event Listeners ---

// Initial load
window.onload = loadFFmpeg;

// File selection button
selectFileButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (event) =>
    handleFileSelect(event.target.files[0])
);

// Drag and drop
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("dragover");
});
dropArea.addEventListener("dragleave", () =>
    dropArea.classList.remove("dragover")
);
dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");
    handleFileSelect(event.dataTransfer.files[0]);
});

// Action buttons
convertBtn.addEventListener("click", startConversion);
resetBtn.addEventListener("click", resetUI);

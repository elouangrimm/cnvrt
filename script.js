// --- DOM Elements ---
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const selectFileButton = document.getElementById("select-file-btn");
const engineLoader = document.getElementById("engine-loader");
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

// --- Global State ---
let selectedFile = null;
let currentHandler = null;
const libraryStatus = {
    ffmpeg: false,
    pdf: false,
};

// --- FFmpeg Setup ---
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
    log: true,
    corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
});

// --- PDF.js Setup ---
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;

// =================================================================
// ===== CORE CONVERSION ROUTER ====================================
// =================================================================
// This object maps file types to their specific conversion logic.
const CONVERSION_HANDLERS = {
    image: {
        name: "Image",
        handler: handleMediaConversion,
        formats: ["png", "jpg", "webp", "bmp", "tiff", "ico"],
        requires: "ffmpeg",
    },
    video: {
        name: "Video",
        handler: handleMediaConversion,
        formats: ["mp4", "webm", "mkv", "mov", "avi", "flv", "wmv", "gif"],
        requires: "ffmpeg",
    },
    audio: {
        name: "Audio",
        handler: handleMediaConversion,
        formats: ["mp3", "wav", "ogg", "flac", "aac", "wma"],
        requires: "ffmpeg",
    },
    "application/pdf": {
        name: "PDF Document",
        handler: handlePdfConversion,
        formats: ["png", "jpg"],
        requires: "pdf",
    },
    "application/epub+zip": {
        name: "eBook",
        handler: handleEpubConversion,
        formats: ["txt"],
        requires: null, // JSZip is small and loads instantly
    },
};
// =================================================================

/**
 * Initializes the application and loads necessary libraries in the background.
 */
async function initializeApp() {
    try {
        await ffmpeg.load();
        libraryStatus.ffmpeg = true;
        console.log("FFmpeg engine loaded.");
        engineLoader.textContent = "Converter engines are ready!";
    } catch (e) {
        console.error("FFmpeg failed to load", e);
        engineLoader.textContent = "Error: Media converter failed to load.";
    }
    // PDF.js is also ready by this point
    libraryStatus.pdf = true;
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
    dropArea.classList.remove("file-loaded");

    fileInput.value = "";
    selectedFile = null;
    currentHandler = null;
}

/**
 * Finds the correct handler for a given file.
 * @param {File} file
 * @returns {object|null} The handler object from CONVERSION_HANDLERS or null.
 */
function getHandlerForFile(file) {
    // Check by exact MIME type first
    if (file.type && CONVERSION_HANDLERS[file.type]) {
        return CONVERSION_HANDLERS[file.type];
    }
    // Check by generic MIME type (e.g., 'image/png' -> 'image')
    const genericType = file.type.split("/")[0];
    if (genericType && CONVERSION_HANDLERS[genericType]) {
        return CONVERSION_HANDLERS[genericType];
    }
    // Fallback to extension for files with weird MIME types
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "mkv") return CONVERSION_HANDLERS["video"];
    return null;
}

/**
 * Handles the initial selection of a file.
 * @param {File} file
 */
async function handleFileSelect(file) {
    if (!file) return;

    selectedFile = file;
    currentHandler = getHandlerForFile(file);

    if (!currentHandler) {
        alert(
            "Unsupported file type. Please select a supported media or document file."
        );
        resetUI();
        return;
    }

    // Update UI
    initialState.style.display = "none";
    dropArea.classList.add("file-loaded");
    filePreview.style.display = "block";

    // Show preview based on file type
    await displayPreview(file, file.type);

    // Populate and show conversion options
    populateFormatSelector(currentHandler, file.name.split(".").pop());
    conversionControls.style.display = "flex";
}

/**
 * Displays a preview of the selected file.
 */
async function displayPreview(file, mimeType) {
    filePreview.innerHTML = ""; // Clear previous preview

    if (
        mimeType.startsWith("image/") ||
        mimeType.startsWith("video/") ||
        mimeType.startsWith("audio/")
    ) {
        const url = URL.createObjectURL(file);
        let element;
        if (mimeType.startsWith("image/")) {
            element = document.createElement("img");
        } else if (mimeType.startsWith("video/")) {
            element = document.createElement("video");
            element.controls = true;
        } else {
            element = document.createElement("audio");
            element.controls = true;
            const p = document.createElement("p");
            p.textContent = file.name;
            filePreview.appendChild(p);
        }
        element.src = url;
        filePreview.appendChild(element);
    } else if (mimeType === "application/pdf") {
        const canvas = document.createElement("canvas");
        filePreview.appendChild(canvas);
        await renderPdfPreview(file, canvas);
    } else {
        const p = document.createElement("p");
        p.textContent = `Preview not available for ${file.name}`;
        filePreview.appendChild(p);
    }
}

/**
 * Renders the first page of a PDF onto a canvas.
 */
async function renderPdfPreview(file, canvas) {
    try {
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            const typedarray = new Uint8Array(this.result);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport: viewport })
                .promise;
        };
        fileReader.readAsArrayBuffer(file);
    } catch (e) {
        console.error("PDF Preview Error:", e);
        canvas.remove();
        const p = document.createElement("p");
        p.textContent = "Could not render PDF preview.";
        filePreview.appendChild(p);
    }
}

/**
 * Populates the format selector based on the handler's options.
 */
function populateFormatSelector(handler, originalExtension) {
    formatSelect.innerHTML = "";
    const originalExtLower = originalExtension.toLowerCase();

    handler.formats.forEach((format) => {
        if (format !== originalExtLower) {
            const option = document.createElement("option");
            option.value = format;
            option.textContent = format.toUpperCase();
            formatSelect.appendChild(option);
        }
    });
}

/**
 * Main function called when the "Convert" button is clicked.
 * Routes to the correct handler.
 */
async function startConversion() {
    if (!selectedFile || !currentHandler) return;

    conversionControls.style.display = "none";
    progressContainer.style.display = "block";

    // Wait for required library if it's not ready
    if (currentHandler.requires && !libraryStatus[currentHandler.requires]) {
        progressText.textContent = `Waiting for ${currentHandler.requires} engine...`;
        while (!libraryStatus[currentHandler.requires]) {
            await new Promise((r) => setTimeout(r, 100));
        }
    }

    progressBar.value = 0;
    progressText.textContent = "Starting conversion...";

    const outputFormat = formatSelect.value;
    try {
        await currentHandler.handler(selectedFile, outputFormat);
    } catch (error) {
        console.error("Conversion failed:", error);
        progressText.textContent = `Error: ${error.message}. Please try again.`;
        progressBar.style.display = "none";
    }
}

// --- Specific Conversion Handlers ---

/**
 * Handles all FFmpeg-based conversions (audio, video, image).
 */
async function handleMediaConversion(file, outputFormat) {
    const outputFileName = `${file.name
        .split(".")
        .slice(0, -1)
        .join(".")}.${outputFormat}`;

    ffmpeg.FS("writeFile", file.name, await fetchFile(file));

    ffmpeg.setProgress(({ ratio }) => {
        const progress = Math.min(100, Math.round(ratio * 100));
        progressBar.value = progress;
        progressText.textContent = `Converting... ${progress}%`;
    });

    const command = ["-i", file.name];
    if (outputFormat === "gif") {
        command.push("-vf", "fps=15,scale=500:-1:flags=lanczos");
    }
    command.push(outputFileName);

    await ffmpeg.run(...command);

    const data = ffmpeg.FS("readFile", outputFileName);
    const mimeType =
        getHandlerForFile(file).name.toLowerCase() +
        "/" +
        (outputFormat === "jpg" ? "jpeg" : outputFormat);
    const blob = new Blob([data.buffer], { type: mimeType });

    showDownload(URL.createObjectURL(blob), outputFileName);

    ffmpeg.FS("unlink", file.name);
    ffmpeg.FS("unlink", outputFileName);
}

/**
 * Handles PDF to Image conversion.
 */
async function handlePdfConversion(file, outputFormat) {
    progressText.textContent = "Rendering PDF page...";
    const outputFileName = `${file.name
        .split(".")
        .slice(0, -1)
        .join(".")}.1.${outputFormat}`;

    const fileData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(fileData).promise;
    // For this example, we convert the first page. A full implementation could loop through pages.
    const page = await pdf.getPage(1);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport: viewport }).promise;
    progressBar.value = 100;
    progressText.textContent = "Conversion complete!";

    const dataUrl = canvas.toDataURL(`image/${outputFormat}`, 0.95);
    showDownload(dataUrl, outputFileName);
}

/**
 * Handles EPUB to TXT conversion.
 */
async function handleEpubConversion(file, outputFormat) {
    progressText.textContent = "Extracting text from eBook...";
    const zip = await JSZip.loadAsync(file);
    let fullText = `Content from ${file.name}\n\n`;

    // A simple regex to strip HTML tags
    const stripHtml = (html) => {
        let doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    const textPromises = [];
    zip.forEach((relativePath, zipEntry) => {
        // Look for common content files
        if (zipEntry.name.match(/\.(xhtml|html)$/i)) {
            textPromises.push(zipEntry.async("string"));
        }
    });

    const htmlContents = await Promise.all(textPromises);
    htmlContents.forEach((html) => {
        fullText +=
            stripHtml(html)
                .replace(/[\r\n]+/g, "\n")
                .trim() + "\n\n";
        progressBar.value = (fullText.length / 10000) * 100; // Fake progress
    });

    progressText.textContent = "Conversion complete!";
    progressBar.value = 100;

    const blob = new Blob([fullText], { type: "text/plain" });
    const outputFileName = `${file.name.split(".").slice(0, -1).join(".")}.txt`;
    showDownload(URL.createObjectURL(blob), outputFileName);
}

// --- Finalization ---

/**
 * Displays the final download link and reset button.
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
window.onload = initializeApp;
selectFileButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (event) =>
    handleFileSelect(event.target.files[0])
);
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
convertBtn.addEventListener("click", startConversion);
resetBtn.addEventListener("click", resetUI);

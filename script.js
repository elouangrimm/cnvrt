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
const libraryStatus = { ffmpeg: false };

// --- FFmpeg Setup ---
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
});

// --- PDF.js Setup ---
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;


// =================================================================
// ===== CORE CONVERSION ROUTER ====================================
// =================================================================
const CONVERSION_HANDLERS = {
    // Media Handlers (FFmpeg)
    'image': { name: 'Image', handler: handleMediaConversion, formats: ['png', 'jpg', 'webp', 'bmp', 'tiff', 'ico'], requires: 'ffmpeg' },
    'video': { name: 'Video', handler: handleMediaConversion, formats: ['mp4', 'webm', 'mkv', 'mov', 'avi', 'gif'], requires: 'ffmpeg' },
    'audio': { name: 'Audio', handler: handleMediaConversion, formats: ['mp3', 'wav', 'ogg', 'flac', 'aac'], requires: 'ffmpeg' },
    // Vector Handler (Canvas)
    'image/svg+xml': { name: 'Vector Image', handler: handleSvgConversion, formats: ['png', 'jpg'] },
    // Document Handlers
    'application/pdf': { name: 'PDF Document', handler: handlePdfConversion, formats: ['png', 'jpg', 'txt'] },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { name: 'Word Document', handler: handleDocxConversion, formats: ['html', 'txt', 'pdf'] },
    'text/html': { name: 'HTML Document', handler: handleHtmlConversion, formats: ['pdf', 'txt'] },
    // Archive Handlers
    'application/zip': { name: 'ZIP Archive', handler: handleArchiveConversion, formats: ['tar.gz'] },
    'application/gzip': { name: 'Gzip Archive', handler: handleArchiveConversion, formats: ['zip'] }
};
// =================================================================

/** Initializes the application and loads necessary libraries. */
async function initializeApp() {
    try {
        await ffmpeg.load();
        libraryStatus.ffmpeg = true;
        console.log("FFmpeg engine loaded.");
        engineLoader.textContent = 'Converter engines are ready!';
    } catch (e) {
        console.error("FFmpeg failed to load", e);
        engineLoader.textContent = 'Error: Media converter failed to load.';
    }
}

/** Resets the entire UI to its initial state. */
function resetUI() {
    initialState.style.display = 'block';
    filePreview.style.display = 'none';
    filePreview.innerHTML = '';
    conversionControls.style.display = 'none';
    progressContainer.style.display = 'none';
    finishedState.style.display = 'none';
    dropArea.classList.remove('file-loaded');
    fileInput.value = '';
    selectedFile = null;
    currentHandler = null;
}

/** Finds the correct handler for a given file. */
function getHandlerForFile(file) {
    if (file.type && CONVERSION_HANDLERS[file.type]) return CONVERSION_HANDLERS[file.type];
    const genericType = file.type.split('/')[0];
    if (genericType && CONVERSION_HANDLERS[genericType]) return CONVERSION_HANDLERS[genericType];
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'mkv') return CONVERSION_HANDLERS['video'];
    if (ext === 'tar') { // Special case for .tar.gz
        const name = file.name.toLowerCase();
        if (name.endsWith('.tar.gz')) return CONVERSION_HANDLERS['application/gzip'];
    }
    return null;
}

/** Handles the initial selection of a file. */
async function handleFileSelect(file) {
    if (!file) return;
    resetUI(); // Reset first
    selectedFile = file;
    currentHandler = getHandlerForFile(file);

    if (!currentHandler) {
        alert("Unsupported file type or the type could not be determined.");
        resetUI();
        return;
    }

    initialState.style.display = 'none';
    dropArea.classList.add('file-loaded');
    filePreview.style.display = 'block';

    await currentHandler.handler(file, null, true); // Call handler in "preview mode"

    if (currentHandler.formats.length > 0) {
        populateFormatSelector(currentHandler, file.name.split('.').pop());
        conversionControls.style.display = 'flex';
    }
}

/** Populates the format selector based on the handler's options. */
function populateFormatSelector(handler, originalExtension) {
    formatSelect.innerHTML = '';
    handler.formats.forEach(format => {
        if (format.toLowerCase() !== originalExtension.toLowerCase()) {
            const option = document.createElement('option');
            option.value = format;
            option.textContent = format.toUpperCase();
            formatSelect.appendChild(option);
        }
    });
}

/** Main function called when the "Convert" button is clicked. */
async function startConversion() {
    if (!selectedFile || !currentHandler) return;
    
    conversionControls.style.display = 'none';
    progressContainer.style.display = 'block';

    if (currentHandler.requires && !libraryStatus[currentHandler.requires]) {
        progressText.textContent = `Waiting for ${currentHandler.requires} engine...`;
        while(!libraryStatus[currentHandler.requires]) {
            await new Promise(r => setTimeout(r, 100));
        }
    }
    
    progressBar.value = 0;
    progressText.textContent = 'Starting conversion...';
    
    try {
        await currentHandler.handler(selectedFile, formatSelect.value, false); // Call handler in "convert mode"
    } catch (error) {
        console.error("Conversion failed:", error);
        progressText.textContent = `Error: ${error.message}. Please try again.`;
    }
}

/** Displays the final download link and reset button. */
function showDownload(blobOrUrl, outputFileName) {
    const url = (blobOrUrl instanceof Blob) ? URL.createObjectURL(blobOrUrl) : blobOrUrl;
    progressContainer.style.display = 'none';
    downloadLink.href = url;
    downloadLink.download = outputFileName;
    finishedState.style.display = 'block';
    downloadLink.click();
}

// =================================================================
// ===== SPECIFIC CONVERSION HANDLERS ==============================
// =================================================================

/** Handles all FFmpeg-based conversions (audio, video, image). */
async function handleMediaConversion(file, outputFormat, isPreview) {
    if (isPreview) {
        const url = URL.createObjectURL(file);
        const type = file.type.split('/')[0];
        let element;
        if (type === 'image') element = `<img src="${url}" alt="Preview">`;
        else if (type === 'video') element = `<video src="${url}" controls alt="Preview"></video>`;
        else element = `<audio src="${url}" controls alt="Preview"></audio><p>${file.name}</p>`;
        filePreview.innerHTML = element;
        return;
    }
    // Conversion logic...
    const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat}`;
    ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    ffmpeg.setProgress(({ ratio }) => {
        progressBar.value = Math.min(100, Math.round(ratio * 100));
        progressText.textContent = `Converting... ${progressBar.value}%`;
    });
    const command = ['-i', file.name];
    if (outputFormat === 'gif') command.push('-vf', 'fps=15,scale=500:-1:flags=lanczos');
    command.push(outputFileName);
    await ffmpeg.run(...command);
    const data = ffmpeg.FS('readFile', outputFileName);
    showDownload(new Blob([data.buffer]), outputFileName);
    ffmpeg.FS('unlink', file.name);
    ffmpeg.FS('unlink', outputFileName);
}

/** Handles SVG to raster image conversion. */
async function handleSvgConversion(file, outputFormat, isPreview) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        if (isPreview) {
            filePreview.innerHTML = `<img src="${dataUrl}" alt="SVG Preview">`;
            return;
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const mimeType = `image/${outputFormat === 'jpg' ? 'jpeg' : 'png'}`;
            const resultUrl = canvas.toDataURL(mimeType);
            const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat}`;
            showDownload(resultUrl, outputFileName);
        };
        img.src = dataUrl;
    };
    reader.readAsDataURL(file);
}

/** Handles DOCX conversions. */
async function handleDocxConversion(file, outputFormat, isPreview) {
    if (isPreview) {
        filePreview.innerHTML = `<p>DOCX Preview not available. Ready to convert.</p>`;
        return;
    }
    const arrayBuffer = await file.arrayBuffer();
    progressText.textContent = 'Parsing DOCX file...';
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
    progressBar.value = 50;

    if (outputFormat === 'html') {
        showDownload(new Blob([html], { type: 'text/html' }), `${file.name}.html`);
    } else if (outputFormat === 'txt') {
        const text = html.replace(/<[^>]+>/g, '');
        showDownload(new Blob([text], { type: 'text/plain' }), `${file.name}.txt`);
    } else if (outputFormat === 'pdf') {
        progressText.textContent = 'Generating PDF from DOCX...';
        html2pdf().from(html).set({ filename: `${file.name}.pdf` }).save();
        // html2pdf handles its own download, so we need to manually show the finished state after a delay.
        setTimeout(() => {
            progressContainer.style.display = 'none';
            finishedState.style.display = 'block';
        }, 2000);
    }
}

/** Handles PDF conversions. */
async function handlePdfConversion(file, outputFormat, isPreview) {
    const fileData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(fileData).promise;
    
    if (isPreview) {
        const page = await pdf.getPage(1);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        filePreview.appendChild(canvas);
        return;
    }

    if (outputFormat === 'txt') {
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ');
            progressBar.value = (i / pdf.numPages) * 100;
        }
        showDownload(new Blob([fullText], {type: 'text/plain'}), `${file.name}.txt`);
    } else { // png or jpg
        const page = await pdf.getPage(1); // Convert first page
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 2.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const dataUrl = canvas.toDataURL(`image/${outputFormat}`);
        showDownload(dataUrl, `${file.name}.${outputFormat}`);
    }
}

/** Handles HTML conversions */
async function handleHtmlConversion(file, outputFormat, isPreview) {
    const html = await file.text();
    if (isPreview) {
        filePreview.innerHTML = `<p>HTML file loaded. Ready to convert.</p>`;
        return;
    }
    if (outputFormat === 'txt') {
        const text = html.replace(/<[^>]+>/g, '');
        showDownload(new Blob([text], { type: 'text/plain' }), `${file.name}.txt`);
    } else if (outputFormat === 'pdf') {
        html2pdf().from(html).set({ filename: `${file.name}.pdf` }).save();
        setTimeout(() => {
            progressContainer.style.display = 'none';
            finishedState.style.display = 'block';
        }, 2000);
    }
}

/** Handles ZIP and TAR.GZ conversions. */
async function handleArchiveConversion(file, outputFormat, isPreview) {
    if (isPreview) {
        filePreview.innerHTML = `<p>Archive file loaded: <strong>${file.name}</strong>. Ready to convert.</p>`;
        return;
    }

    const buffer = await file.arrayBuffer();
    progressText.textContent = 'Decompressing archive...';
    progressBar.value = 25;

    if (file.type === 'application/zip' && outputFormat === 'tar.gz') {
        const zip = await JSZip.loadAsync(buffer);
        const tape = new Tar();
        let fileCount = 0;
        const totalFiles = Object.keys(zip.files).length;
        for (const filename in zip.files) {
            if (!zip.files[filename].dir) {
                const content = await zip.files[filename].async('uint8array');
                tape.append(filename, content);
            }
            fileCount++;
            progressBar.value = 25 + (fileCount / totalFiles) * 50;
        }
        progressText.textContent = 'Compressing to TAR.GZ...';
        const out = tape.out;
        const compressed = pako.gzip(out);
        const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.tar.gz`;
        showDownload(new Blob([compressed]), outputFileName);
    }
    // Note: TAR.GZ to ZIP would be a similar, but reversed, process.
    // For brevity, only one direction is implemented here.
}


// --- Event Listeners ---
window.onload = initializeApp;
selectFileButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (event) => handleFileSelect(event.target.files[0]));
dropArea.addEventListener("dragover", (event) => { event.preventDefault(); dropArea.classList.add("dragover"); });
dropArea.addEventListener("dragleave", () => dropArea.classList.remove("dragover"));
dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");
    handleFileSelect(event.dataTransfer.files[0]);
});
convertBtn.addEventListener('click', startConversion);
resetBtn.addEventListener('click', resetUI);
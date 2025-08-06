// --- DOM Elements ---
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const selectFileButton = document.getElementById("select-file-btn");
const engineLoader = document.getElementById("engine-loader");
const initialState = document.getElementById("initial-state");
const filePreview = document.getElementById("file-preview");
const conversionControls = document.getElementById("conversion-controls");
const formatButtons = document.getElementById("format-buttons");
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

// --- Library Management ---
const CDN_URLS = {
    pdfjs: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.min.js',
    pdfjsWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js',
    mammoth: 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.5.1/mammoth.browser.min.js',
    html2pdf: 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    jszip: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
    pako: 'https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js',
    tar: 'https://cdn.jsdelivr.net/npm/tar-js@0.3.0/tar.min.js',
    sheetjs: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    heic2any: 'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.3/heic2any.min.js',
    psd: 'https://cdn.jsdelivr.net/npm/psd.js@3.2.0/dist/psd.min.js',
    opentype: 'https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js'
};
const loadedLibraries = new Set();

function loadScript(url) {
    if (loadedLibraries.has(url)) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            loadedLibraries.add(url);
            console.log(`${url} loaded.`);
            resolve();
        };
        script.onerror = () => {
            console.error(`Failed to load script: ${url}`);
            reject(new Error(`Failed to load script: ${url}`));
        };
        document.body.appendChild(script);
    });
}

// --- FFmpeg Setup ---
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
});


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
    'image/heic': { name: 'HEIC Image', handler: handleHeicConversion, formats: ['png', 'jpg'] },
    'image/heif': { name: 'HEIF Image', handler: handleHeicConversion, formats: ['png', 'jpg'] },
    'image/vnd.adobe.photoshop': { name: 'PSD Image', handler: handlePsdConversion, formats: ['png'] },
    // Document Handlers
    'application/pdf': { name: 'PDF Document', handler: handlePdfConversion, formats: ['png', 'jpg', 'txt'] },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { name: 'Word Document', handler: handleDocxConversion, formats: ['html', 'txt', 'pdf'] },
    'text/html': { name: 'HTML Document', handler: handleHtmlConversion, formats: ['pdf', 'txt'] },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { name: 'Excel Document', handler: handleExcelConversion, formats: ['csv', 'json'] },
    'application/vnd.ms-excel': { name: 'Excel Document', handler: handleExcelConversion, formats: ['csv', 'json'] },
    'text/csv': { name: 'CSV Document', handler: handleCsvConversion, formats: ['xlsx', 'json'] },
    // Archive Handlers
    'application/zip': { name: 'ZIP Archive', handler: handleArchiveConversion, formats: ['tar.gz'] },
    'application/gzip': { name: 'Gzip Archive', handler: handleArchiveConversion, formats: ['zip'] },
    // Font Handler
    'font': { name: 'Font File', handler: handleFontConversion, formats: ['ttf', 'otf', 'woff', 'woff2'] }
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
    if (['ttf', 'otf', 'woff', 'woff2'].includes(ext)) {
        return CONVERSION_HANDLERS['font'];
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
    formatButtons.innerHTML = '';
    handler.formats.forEach(format => {
        if (format.toLowerCase() !== originalExtension.toLowerCase()) {
            const button = document.createElement('button');
            button.className = 'format-btn';
            button.dataset.format = format;
            button.textContent = format.toUpperCase();
            formatButtons.appendChild(button);
        }
    });
}

/** Main function called when the "Convert" button is clicked. */
async function startConversion(outputFormat) {
    if (!selectedFile || !currentHandler || !outputFormat) return;
    
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
        await currentHandler.handler(selectedFile, outputFormat, false); // Call handler in "convert mode"
    } catch (error) {
        console.error("Conversion failed:", error);
        progressText.textContent = `Error: ${error.message}. Please try again.`;
    }
}

/** Displays the final download link and reset button. */
function showDownload(blobOrUrl, outputFileName) {
    const url = (blobOrUrl instanceof Blob) ? URL.createObjectURL(blobOrUrl) : blobOrUrl;

    // Show a preview for image types
    const extension = outputFileName.split('.').pop().toLowerCase();
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ico'];
    if (imageExtensions.includes(extension)) {
        filePreview.innerHTML = `<p class="preview-title">Converted Image:</p><img src="${url}" alt="Converted Image Preview">`;
        filePreview.style.display = 'block';
    } else {
        // For non-image types, we could show a generic success message in the preview area
        filePreview.innerHTML = `<p class="preview-title">File ready for download.</p>`;
        filePreview.style.display = 'block';
    }

    progressContainer.style.display = 'none';
    downloadLink.href = url;
    downloadLink.download = outputFileName;
    finishedState.style.display = 'block';

    // A brief delay can sometimes help ensure the preview renders before the download prompt appears.
    setTimeout(() => {
        downloadLink.click();
    }, 100);
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

    progressText.textContent = 'Loading converter...';
    await loadScript(CDN_URLS.mammoth);

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
        progressText.textContent = 'Loading PDF generator...';
        await loadScript(CDN_URLS.html2pdf);
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
    progressText.textContent = 'Loading PDF engine...';
    await loadScript(CDN_URLS.pdfjs);
    pdfjsLib.GlobalWorkerOptions.workerSrc = CDN_URLS.pdfjsWorker;

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
        progressText.textContent = 'Loading PDF generator...';
        await loadScript(CDN_URLS.html2pdf);
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

    progressText.textContent = 'Loading archive engines...';
    await Promise.all([
        loadScript(CDN_URLS.jszip),
        loadScript(CDN_URLS.pako),
        loadScript(CDN_URLS.tar)
    ]);

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

/** Handles Excel (XLSX, XLS) conversions. */
async function handleExcelConversion(file, outputFormat, isPreview) {
    await loadScript(CDN_URLS.sheetjs);

    if (isPreview) {
        filePreview.innerHTML = `<p>Excel file loaded: <strong>${file.name}</strong>. Ready to convert.</p>`;
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    if (outputFormat === 'csv') {
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.csv`;
        showDownload(new Blob([csv], { type: 'text/csv' }), outputFileName);
    } else if (outputFormat === 'json') {
        const json = XLSX.utils.sheet_to_json(worksheet);
        const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.json`;
        showDownload(new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }), outputFileName);
    }
}

/** Handles CSV conversions. */
async function handleCsvConversion(file, outputFormat, isPreview) {
    await loadScript(CDN_URLS.sheetjs);

    if (isPreview) {
        filePreview.innerHTML = `<p>CSV file loaded: <strong>${file.name}</strong>. Ready to convert.</p>`;
        return;
    }

    const text = await file.text();

    if (outputFormat === 'xlsx') {
        const worksheet = XLSX.utils.csv_to_sheet(text);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.xlsx`;
        showDownload(new Blob([buffer], { type: 'application/octet-stream' }), outputFileName);
    } else if (outputFormat === 'json') {
        const json = XLSX.utils.sheet_to_json(XLSX.utils.csv_to_sheet(text));
        const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.json`;
        showDownload(new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }), outputFileName);
    }
}


/** Handles HEIC/HEIF image conversions. */
async function handleHeicConversion(file, outputFormat, isPreview) {
    await loadScript(CDN_URLS.heic2any);

    const toType = `image/${outputFormat === 'jpg' ? 'jpeg' : 'png'}`;
    const conversionResult = await heic2any({
        blob: file,
        toType: toType,
    });

    const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
    const url = URL.createObjectURL(blob);

    if (isPreview) {
        filePreview.innerHTML = `<img src="${url}" alt="HEIC Preview">`;
        return;
    }

    const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat}`;
    showDownload(blob, outputFileName);
}

/** Handles PSD (Photoshop) image conversions. */
async function handlePsdConversion(file, outputFormat, isPreview) {
    await loadScript(CDN_URLS.psd);

    const url = URL.createObjectURL(file);
    const psd = await PSD.fromURL(url);
    const canvas = psd.image.toCanvas();
    const pngUrl = canvas.toDataURL('image/png');

    if (isPreview) {
        filePreview.innerHTML = `<img src="${pngUrl}" alt="PSD Preview">`;
        return;
    }

    if (outputFormat === 'png') {
        const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.png`;
        showDownload(pngUrl, outputFileName);
    }
}


/** Handles Font file conversions (TTF, OTF, WOFF, WOFF2). */
async function handleFontConversion(file, outputFormat, isPreview) {
    await loadScript(CDN_URLS.opentype);

    const arrayBuffer = await file.arrayBuffer();
    const font = opentype.parse(arrayBuffer);

    if (isPreview) {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1c1917'; // Match background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const fontName = font.names.fontFamily.en || 'Sample Text';

        // Draw the font name with a system font
        ctx.fillStyle = '#e7e5e4'; // Light text
        ctx.font = '20px sans-serif';
        ctx.fillText(fontName, 10, 30);

        // Draw sample text with the loaded font on a new line
        const previewText = 'The quick brown fox jumps over the lazy dog.';
        const path = font.getPath(previewText, 10, 100, 36);
        path.fill = '#e7e5e4'; // Light text
        path.draw(ctx);

        filePreview.innerHTML = '';
        filePreview.appendChild(canvas);
        return;
    }

    // NOTE: opentype.js can parse various font formats, but it primarily *writes* OTF (CFF) or TTF.
    // Converting to WOFF/WOFF2 would require an additional library.
    // For this implementation, we will just re-package the parsed font.
    // This is not a true conversion for all formats.
    const newFontBuffer = font.toArrayBuffer();

    const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat}`;
    showDownload(new Blob([newFontBuffer]), outputFileName);
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
resetBtn.addEventListener('click', resetUI);

formatButtons.addEventListener('click', (event) => {
    if (event.target.classList.contains('format-btn')) {
        const format = event.target.dataset.format;
        startConversion(format);
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        // Check if the app is not in its initial state
        if (initialState.style.display === 'none') {
            resetUI();
        }
    }
});
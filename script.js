// =================================================================
// === DOM ELEMENTS ================================================
// =================================================================
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const folderInput = document.getElementById("folder-input");
const selectFileButton = document.getElementById("select-file-btn");
const selectFolderButton = document.getElementById("select-folder-btn");
const engineLoader = document.getElementById("engine-loader");
const initialState = document.getElementById("initial-state");
const mainTitle = document.querySelector('h1');
const subtitle = document.getElementById('subtitle');
const funnySubtitle = document.getElementById('funny-subtitle');
const filePreview = document.getElementById("file-preview");
const conversionControls = document.getElementById("conversion-controls");
const conversionLabel = document.querySelector('.conversion-label');
const formatButtons = document.getElementById("format-buttons");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const cancelBtn = document.getElementById("cancel-btn");
const finishedState = document.getElementById("finished-state");
const finishedText = document.getElementById("finished-text");
const downloadLink = document.getElementById("download-link");
const resetBtn = document.getElementById("reset-btn");
const shareSettingsBtn = document.getElementById("share-settings-btn");

// Resize Controls
const resizeControls = document.getElementById("resize-controls");
const resizeEnable = document.getElementById("resize-enable");
const resizeInputs = document.getElementById("resize-inputs");
const resizeWidth = document.getElementById("resize-width");
const resizeHeight = document.getElementById("resize-height");
const resizeLockBtn = document.getElementById("resize-lock-btn");
const resizePixelArt = document.getElementById("resize-pixel-art");

// Batch elements
const batchQueue = document.getElementById("batch-queue");
const batchTitle = document.getElementById("batch-title");
const batchFileList = document.getElementById("batch-file-list");
const batchFormatButtons = document.getElementById("batch-format-buttons");
const batchProgress = document.getElementById("batch-progress");
const batchProgressBar = document.getElementById("batch-progress-bar");
const batchProgressText = document.getElementById("batch-progress-text");
const batchCancelBtn = document.getElementById("batch-cancel-btn");
const batchRemoveAll = document.getElementById("batch-remove-all");
const batchZipOutput = document.getElementById("batch-zip-output");
const batchMixedFormat = document.getElementById("batch-mixed-format");

// URL input
const urlInput = document.getElementById("url-input");
const urlFetchBtn = document.getElementById("url-fetch-btn");

// File size warning
const fileSizeWarning = document.getElementById("file-size-warning");
const fileSizeWarningText = document.getElementById("file-size-warning-text");
const fileSizeWarningDismiss = document.getElementById("file-size-warning-dismiss");

// Top bar
const settingsBtn = document.getElementById("settings-btn");
const historyBtn = document.getElementById("history-btn");
const statsBtn = document.getElementById("stats-btn");
const themeToggle = document.getElementById("theme-toggle");
const shortcutsBtn = document.getElementById("shortcuts-btn");

// Settings popup
const settingsPopup = document.getElementById("settings-popup");
const settingsCloseBtn = document.getElementById("settings-close-btn");
const settingAutoDownload = document.getElementById("setting-auto-download");
const settingNotifications = document.getElementById("setting-notifications");
const settingOfflineMode = document.getElementById("setting-offline-mode");

// Panels
const panelOverlay = document.getElementById("panel-overlay");
const historyPanel = document.getElementById("history-panel");
const statsPanel = document.getElementById("stats-panel");

// =================================================================
// === UI TEXT (expanded funny messages) ============================
// =================================================================
const UI_TEXT = {
    engineReady: [
        { loading: "Revving converter engines...", loaded: "Engines have been thoroughly revved!" },
        { loading: "Waking up the hamsters...", loaded: "The hamsters are ready for their wheel." },
        { loading: "Loading the conversion matrix...", loaded: "The matrix has you." },
        { loading: "Initializing all systems...", loaded: "All systems go! Or... all systems convert!" },
        { loading: "Transmogrifying files...", loaded: "Ready to transmogrify." },
        { loading: "Compiling dependencies...", loaded: "Just kidding, it's all client-side." },
        { loading: "Initializing... 4 8 15 16 23 42", loaded: "We have to go back!" },
        { loading: "git clone https://nothing.at.all/", loaded: "Resolving deltas: 100% (69/69), done." },
        { loading: "git clone https://absolutely.nothing/", loaded: "Resolving deltas: 100% (420/420), done." },
        { loading: "Updating Arch btw packages...", loaded: "Arch btw is ready to convert!" },
        { loading: "sudo apt-get install converter...", loaded: "0 upgraded, 1 newly installed, 0 to remove." },
        { loading: "pip install magic...", loaded: "Successfully installed magic-1.0.0" },
        { loading: "Downloading more RAM...", loaded: "RAM doubled. Just kidding." },
        { loading: "Asking the AI nicely...", loaded: "The AI said yes." },
        { loading: "Consulting Stack Overflow...", loaded: "Answer accepted. 420 upvotes." },
        { loading: "Brewing coffee for the CPU...", loaded: "CPU is caffeinated and ready." },
        { loading: "Teaching bytes new tricks...", loaded: "Bytes are surprisingly quick learners." },
        { loading: "Establishing quantum connection...", loaded: "Entangled and ready to convert." },
        { loading: "Reticulating splines...", loaded: "Splines have been reticulated." },
        { loading: "Reversing the polarity...", loaded: "Polarity reversed. Converter online." },
        { loading: "Negotiating with the firewall...", loaded: "Firewall has agreed to cooperate." },
        { loading: "Warming up the flux capacitor...", loaded: "Great Scott! We're ready!" },
        { loading: "Running npm install universe...", loaded: "Added 42,069 packages in 1.21s" },
        { loading: "Converting coffee to code...", loaded: "Conversion ratio: optimal." },
        { loading: "Defragmenting the mainframe...", loaded: "Mainframe is looking sharp." }
    ],
    conversionLabel: [
        "What's its final form?",
        "Choose its destiny:",
        "Let's make it a...",
        "And for its next trick, it'll become a...",
        "Pick your poison:",
        "Select target platform:",
        "Choose your new file's class:",
        "What should we git checkout to?",
        "Pipe to:",
        "Transmute into:",
        "Evolution stone: choose one.",
        "Cast conversion spell:"
    ],
    postUpload: [
        "Alright, what are we turning this thing into?",
        "File's in. Now for the magic part.",
        "Your file is safe with us. Now, choose its fate.",
        "Okay, it's loaded. Let the conversion commence!",
        "The file has landed. Pick a new format for it.",
        "It's dangerous to go alone! Take this converted file.",
        "Hello, world! Your file, that is.",
        "File acquired. Awaiting orders, captain.",
        "I see you've brought me something to work with.",
        "One file, coming right up. What'll it be?"
    ],
    conversionComplete: [
        "Voila! All done.",
        "And... it's a new file!",
        "Success! Another one bites the dust.",
        "Conversion complete. That was easy.",
        "Presto change-o! Your file is ready.",
        "Segmentation fault... just kidding, it worked!",
        "0 errors, 0 warnings, 1 new file.",
        "Achievement Unlocked: File Converted.",
        "POST https://thatwas.quick net::ERR_BLOCKED_BY_CLIENT",
        "Task completed successfully. Returning to idle.",
        "The byte is mightier than the sword.",
        "Ctrl+S not needed. Already saved.",
        "Your file has evolved!",
        "Built with zero dependencies. Oh wait.",
        "200 OK — conversion delivered."
    ]
};

function getRandomString(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getMimeType(extension) {
    const map = {
        'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
        'gif': 'image/gif', 'webp': 'image/webp', 'bmp': 'image/bmp',
        'tiff': 'image/tiff', 'ico': 'image/x-icon', 'svg': 'image/svg+xml',
        'pdf': 'application/pdf', 'txt': 'text/plain', 'html': 'text/html',
        'json': 'application/json', 'csv': 'text/csv', 'xml': 'text/xml',
        'zip': 'application/zip', 'tar': 'application/x-tar', 'gz': 'application/gzip',
        'mp4': 'video/mp4', 'webm': 'video/webm', 'mp3': 'audio/mpeg', 'wav': 'audio/wav',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    return map[extension.toLowerCase()] || 'application/octet-stream';
}


// =================================================================
// === GLOBAL STATE ================================================
// =================================================================
let selectedFile = null;
let currentHandler = null;
let originalAspectRatio = 0;
let isAspectRatioLocked = true;
let conversionCancelled = false;
let conversionStartTime = null;
let lastConvertedFormat = null;
let lastInputFormat = null;

// Batch state
let batchFiles = [];
let batchCancelled = false;
let batchConvertedBlobs = []; // For ZIP output

const libraryStatus = { ffmpeg: false };


// =================================================================
// === LIBRARY MANAGEMENT ==========================================
// =================================================================
const CDN_URLS = {
    pdfjs: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.min.js',
    pdfjsWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js',
    mammoth: 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.5.1/mammoth.browser.min.js',
    html2pdf: 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    jszip: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
    pako: 'https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js',
    tar: 'https://cdn.jsdelivr.net/npm/@gera2ld/tarjs@1.1.1/dist/tar.iife.min.js',
    sheetjs: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    heic2any: 'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.3/heic2any.min.js',
    psd: 'https://cdn.jsdelivr.net/npm/psd.js@3.2.0/dist/psd.min.js',
    opentype: 'https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js'
};
const loadedLibraries = new Set();

function loadScript(url) {
    if (loadedLibraries.has(url)) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => { loadedLibraries.add(url); resolve(); };
        script.onerror = () => reject(new Error('Failed to load: ' + url));
        document.body.appendChild(script);
    });
}


// =================================================================
// === FFmpeg Setup ================================================
// =================================================================
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
});


// =================================================================
// === CONVERSION ROUTER ===========================================
// =================================================================
const CONVERSION_HANDLERS = {
    'image': { name: 'Image', handler: handleMediaConversion, formats: ['png', 'jpg', 'webp', 'bmp', 'tiff', 'ico'], requires: 'ffmpeg' },
    'video': { name: 'Video', handler: handleMediaConversion, formats: ['mp4', 'webm', 'mkv', 'mov', 'avi', 'gif'], requires: 'ffmpeg' },
    'audio': { name: 'Audio', handler: handleMediaConversion, formats: ['mp3', 'wav', 'ogg', 'flac', 'aac'], requires: 'ffmpeg' },
    'image/svg+xml': { name: 'Vector Image', handler: handleSvgConversion, formats: ['png', 'jpg'] },
    'image/heic': { name: 'HEIC Image', handler: handleHeicConversion, formats: ['png', 'jpg'] },
    'image/heif': { name: 'HEIF Image', handler: handleHeicConversion, formats: ['png', 'jpg'] },
    'image/vnd.adobe.photoshop': { name: 'PSD Image', handler: handlePsdConversion, formats: ['png'] },
    'application/pdf': { name: 'PDF Document', handler: handlePdfConversion, formats: ['png', 'jpg', 'txt'] },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { name: 'Word Document', handler: handleDocxConversion, formats: ['html', 'txt', 'pdf'] },
    'text/html': { name: 'HTML Document', handler: handleHtmlConversion, formats: ['pdf', 'txt'] },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { name: 'Excel Document', handler: handleExcelConversion, formats: ['csv', 'json'] },
    'application/vnd.ms-excel': { name: 'Excel Document', handler: handleExcelConversion, formats: ['csv', 'json'] },
    'text/csv': { name: 'CSV Document', handler: handleCsvConversion, formats: ['xlsx', 'json'] },
    'application/zip': { name: 'ZIP Archive', handler: handleArchiveConversion, formats: ['tar.gz'] },
    'application/gzip': { name: 'Gzip Archive', handler: handleArchiveConversion, formats: ['zip'] },
    'font': { name: 'Font File', handler: handleFontConversion, formats: ['ttf', 'otf', 'woff', 'woff2'] }
};

function getHandlerForFile(file) {
    if (file.type && CONVERSION_HANDLERS[file.type]) return CONVERSION_HANDLERS[file.type];
    const genericType = file.type.split('/')[0];
    if (genericType && CONVERSION_HANDLERS[genericType]) return CONVERSION_HANDLERS[genericType];
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'mkv') return CONVERSION_HANDLERS['video'];
    if (ext === 'tar') {
        if (file.name.toLowerCase().endsWith('.tar.gz')) return CONVERSION_HANDLERS['application/gzip'];
    }
    if (['ttf', 'otf', 'woff', 'woff2'].includes(ext)) return CONVERSION_HANDLERS['font'];
    return null;
}


// =================================================================
// === APP INIT ====================================================
// =================================================================
async function initializeApp() {
    // Init features
    registerServiceWorker();
    CnvrtTheme.init();
    CnvrtShortcuts.init();
    CnvrtOffline.init();
    loadSettings();
    parseShareUrl();

    // Load FFmpeg
    const loadingMessage = getRandomString(UI_TEXT.engineReady);
    engineLoader.textContent = loadingMessage.loading;
    try {
        await ffmpeg.load();
        libraryStatus.ffmpeg = true;
        engineLoader.textContent = loadingMessage.loaded;
    } catch (e) {
        console.error("FFmpeg failed to load", e);
        engineLoader.textContent = 'Error: Media converter failed to load.';
    }
}

function loadSettings() {
    const settings = CnvrtSettings.getAll();
    settingAutoDownload.checked = settings.autoDownload;
    settingNotifications.checked = settings.browserNotifications;
    settingOfflineMode.checked = settings.offlineMode;
}

function parseShareUrl() {
    const shared = CnvrtShare.parseUrl();
    if (shared) {
        showBriefToast(`Shared settings loaded: ${shared.from || '?'} → ${shared.to || '?'}`);
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
    }
}


// =================================================================
// === RESET =======================================================
// =================================================================
function resetUI() {
    mainTitle.classList.remove('fade-out');
    subtitle.classList.remove('fade-out');
    funnySubtitle.style.display = 'none';
    progressBar.style.display = 'block';

    initialState.style.display = 'block';
    filePreview.style.display = 'none';
    filePreview.innerHTML = '';
    conversionControls.style.display = 'none';
    progressContainer.style.display = 'none';
    finishedState.style.display = 'none';
    fileSizeWarning.style.display = 'none';
    batchQueue.style.display = 'none';
    dropArea.classList.remove('file-loaded');
    fileInput.value = '';
    selectedFile = null;
    currentHandler = null;
    conversionCancelled = false;

    // Reset batch
    batchFiles = [];
    batchCancelled = false;
    batchConvertedBlobs = [];
    batchProgress.style.display = 'none';

    // Reset Resize Controls
    resizeControls.style.display = 'none';
    resizeEnable.checked = false;
    resizeInputs.classList.add('disabled');
    resizeWidth.value = '';
    resizeHeight.value = '';
    resizePixelArt.checked = false;
    resizeWidth.disabled = true;
    resizeHeight.disabled = true;
    resizePixelArt.disabled = true;
}


// =================================================================
// === FILE SIZE WARNING ===========================================
// =================================================================
function checkFileSize(file) {
    const type = file.type.split('/')[0];
    const warning = FILE_SIZE_WARNINGS[type] || FILE_SIZE_WARNINGS['default'];

    if (file.size > warning.threshold) {
        fileSizeWarningText.textContent = warning.message;
        fileSizeWarning.style.display = 'flex';
        return true;
    }
    fileSizeWarning.style.display = 'none';
    return false;
}


// =================================================================
// === SINGLE FILE HANDLING ========================================
// =================================================================
async function handleFileSelect(file) {
    if (!file) return;
    resetUI();
    selectedFile = file;
    currentHandler = getHandlerForFile(file);

    if (!currentHandler) {
        const errInfo = DETAILED_ERRORS.unsupported_format;
        showErrorDisplay(errInfo.title, errInfo.message, errInfo.tip);
        return;
    }

    mainTitle.classList.add('fade-out');
    subtitle.classList.add('fade-out');
    funnySubtitle.textContent = getRandomString(UI_TEXT.postUpload);
    funnySubtitle.style.display = 'block';

    initialState.style.display = 'none';
    dropArea.classList.add('file-loaded');
    filePreview.style.display = 'block';

    checkFileSize(file);

    await currentHandler.handler(file, null, true);

    if (currentHandler === CONVERSION_HANDLERS['image']) {
        setupResizeControls(file);
    } else {
        resizeControls.style.display = 'none';
    }

    if (currentHandler.formats.length > 0) {
        const ext = file.name.split('.').pop().toLowerCase();
        lastInputFormat = ext;
        populateFormatSelector(currentHandler, ext);
        conversionLabel.textContent = getRandomString(UI_TEXT.conversionLabel);
        conversionControls.style.display = 'flex';
    }
}

function setupResizeControls(file) {
    const img = new Image();
    img.onload = () => {
        resizeWidth.value = img.width;
        resizeHeight.value = img.height;
        originalAspectRatio = img.width / img.height;
        resizeControls.style.display = 'flex';
    };
    img.src = URL.createObjectURL(file);
}

function populateFormatSelector(handler, originalExtension) {
    formatButtons.innerHTML = '';
    handler.formats.forEach((format, idx) => {
        const button = document.createElement('button');
        button.className = 'format-btn';
        button.dataset.format = format;

        // Tooltip
        const tooltipText = FORMAT_TOOLTIPS[format] || '';
        let inner = format.toUpperCase();
        if (idx < 9) inner += `<span class="format-key">${idx + 1}</span>`;
        if (tooltipText) inner += `<span class="format-tooltip">${tooltipText}</span>`;
        button.innerHTML = inner;

        if (format.toLowerCase() === originalExtension.toLowerCase()) {
            button.classList.add('original-format');
            button.title = "Keep Original Format";
        }

        formatButtons.appendChild(button);
    });
}


// =================================================================
// === CONVERSION ==================================================
// =================================================================
async function startConversion(outputFormat) {
    if (!selectedFile || !currentHandler || !outputFormat) return;

    conversionCancelled = false;
    conversionStartTime = Date.now();
    conversionControls.style.display = 'none';
    progressContainer.style.display = 'block';
    cancelBtn.style.display = 'inline-block';

    if (currentHandler.requires && !libraryStatus[currentHandler.requires]) {
        progressText.textContent = `Waiting for ${currentHandler.requires} engine...`;
        while (!libraryStatus[currentHandler.requires]) {
            await new Promise(r => setTimeout(r, 100));
        }
    }

    progressBar.style.display = 'block';
    progressBar.value = 0;
    progressText.textContent = 'Starting conversion...';

    try {
        lastConvertedFormat = outputFormat;
        await currentHandler.handler(selectedFile, outputFormat, false);
    } catch (error) {
        if (conversionCancelled) {
            const errInfo = DETAILED_ERRORS.cancelled;
            showErrorDisplay(errInfo.title, errInfo.message, errInfo.tip);
        } else {
            console.error("Conversion failed:", error);
            const errInfo = getDetailedError(error);
            showErrorDisplay(errInfo.title, errInfo.message, errInfo.tip);
        }
    }
}

function showErrorDisplay(title, message, tip) {
    progressBar.style.display = 'none';
    cancelBtn.style.display = 'none';
    progressText.innerHTML = `
        <div class="error-display">
            <div class="error-title">${title}</div>
            <div class="error-message">${message}</div>
            ${tip ? `<div class="error-tip">${tip}</div>` : ''}
        </div>`;
}

function cancelConversion() {
    conversionCancelled = true;
    // FFmpeg doesn't have a clean cancel, but we set the flag
    // to prevent showDownload from firing
    progressText.textContent = 'Cancelling...';
}


// =================================================================
// === DOWNLOAD / FINISH ===========================================
// =================================================================
function showDownload(blobOrUrl, outputFileName, inputSize) {
    if (conversionCancelled) return;

    const duration = conversionStartTime ? Date.now() - conversionStartTime : null;

    let url, outputBlob;
    if (blobOrUrl instanceof Blob) {
        if (!blobOrUrl.type || blobOrUrl.type === 'application/octet-stream') {
            const ext = outputFileName.split('.').pop();
            const mime = getMimeType(ext);
            blobOrUrl = new Blob([blobOrUrl], { type: mime });
        }
        outputBlob = blobOrUrl;
        url = URL.createObjectURL(blobOrUrl);
    } else {
        url = blobOrUrl;
    }

    // Preview for image types
    const ext = outputFileName.split('.').pop().toLowerCase();
    const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ico'];
    if (imageExts.includes(ext)) {
        filePreview.innerHTML = `<p class="preview-title">Converted Image:</p><img src="${url}" alt="Converted Image Preview">`;
        filePreview.style.display = 'block';
    } else {
        filePreview.innerHTML = `<p class="preview-title">File ready for download.</p>`;
        filePreview.style.display = 'block';
    }

    progressContainer.style.display = 'none';
    finishedText.textContent = getRandomString(UI_TEXT.conversionComplete);
    downloadLink.href = url;
    downloadLink.download = outputFileName;
    finishedState.style.display = 'block';

    // Record stats & history
    const fileInputSize = inputSize || (selectedFile ? selectedFile.size : 0);
    const outputSize = outputBlob ? outputBlob.size : 0;
    const savings = fileInputSize - outputSize;
    const inputFormat = lastInputFormat || selectedFile?.name.split('.').pop().toLowerCase() || '?';

    CnvrtStats.record({
        inputSize: fileInputSize,
        outputSize: outputSize,
        savings: Math.max(0, savings),
        inputFormat: inputFormat,
        outputFormat: ext,
        duration: duration,
        isBatch: false,
        isUrl: selectedFile?._isUrl || false,
        isClipboard: selectedFile?._isClipboard || false
    });

    CnvrtHistory.add({
        inputName: selectedFile?.name || outputFileName,
        inputSize: fileInputSize,
        inputFormat: inputFormat,
        outputFormat: ext,
        outputSize: outputSize,
        savings: Math.max(0, savings),
        duration: duration
    });

    // Auto download
    if (CnvrtSettings.get('autoDownload')) {
        setTimeout(() => downloadLink.click(), 100);
    }

    // Browser notification
    CnvrtNotifications.send('Conversion Complete', `${outputFileName} is ready for download.`);
}


// =================================================================
// === BATCH CONVERSION ============================================
// =================================================================
function handleMultipleFiles(files) {
    if (!files || files.length === 0) return;

    // If single file, use normal flow
    if (files.length === 1) {
        handleFileSelect(files[0]);
        return;
    }

    resetUI();
    batchFiles = [];

    for (const file of files) {
        const handler = getHandlerForFile(file);
        if (handler) {
            batchFiles.push({ file, handler, status: 'pending', outputFormat: null });
        }
    }

    if (batchFiles.length === 0) {
        showBriefToast('No supported files found.');
        return;
    }

    mainTitle.classList.add('fade-out');
    subtitle.classList.add('fade-out');
    funnySubtitle.textContent = `${batchFiles.length} files queued for batch conversion.`;
    funnySubtitle.style.display = 'block';
    initialState.style.display = 'none';
    dropArea.classList.add('file-loaded');
    batchQueue.style.display = 'block';
    batchTitle.textContent = `Batch Queue (${batchFiles.length} files)`;

    renderBatchFileList();

    // Populate format buttons from the first file's handler
    const firstHandler = batchFiles[0].handler;
    populateBatchFormatSelector(firstHandler);
}

function renderBatchFileList() {
    batchFileList.innerHTML = '';
    batchFiles.forEach((entry, idx) => {
        const div = document.createElement('div');
        div.className = 'batch-file-item';

        let statusHtml = '';
        if (entry.status === 'done') statusHtml = '<span class="batch-file-status done">✓</span>';
        else if (entry.status === 'error') statusHtml = '<span class="batch-file-status error">✗</span>';
        else if (entry.status === 'active') statusHtml = '<span class="batch-file-status active">⟳</span>';
        else statusHtml = '<span class="batch-file-status pending">•</span>';

        div.innerHTML = `
            <span class="batch-file-name" title="${entry.file.name}">${entry.file.name}</span>
            <span class="batch-file-size">${CnvrtStats.formatBytes(entry.file.size)}</span>
            ${statusHtml}
            <button class="batch-remove-btn" data-idx="${idx}" title="Remove">✕</button>
        `;
        batchFileList.appendChild(div);
    });

    // Attach remove handlers
    batchFileList.querySelectorAll('.batch-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            batchFiles.splice(idx, 1);
            batchTitle.textContent = `Batch Queue (${batchFiles.length} files)`;
            renderBatchFileList();
            if (batchFiles.length === 0) resetUI();
        });
    });
}

function populateBatchFormatSelector(handler) {
    batchFormatButtons.innerHTML = '';
    handler.formats.forEach(format => {
        const btn = document.createElement('button');
        btn.className = 'format-btn';
        btn.dataset.format = format;

        const tooltipText = FORMAT_TOOLTIPS[format] || '';
        let inner = format.toUpperCase();
        if (tooltipText) inner += `<span class="format-tooltip">${tooltipText}</span>`;
        btn.innerHTML = inner;
        batchFormatButtons.appendChild(btn);
    });
}

async function startBatchConversion(outputFormat) {
    batchCancelled = false;
    batchConvertedBlobs = [];
    batchProgress.style.display = 'block';
    batchFormatButtons.parentElement.style.display = 'none';
    conversionStartTime = Date.now();

    const total = batchFiles.length;

    for (let i = 0; i < total; i++) {
        if (batchCancelled) break;
        const entry = batchFiles[i];
        entry.status = 'active';

        // If mixed format mode, use per-file format
        const format = entry.outputFormat || outputFormat;
        renderBatchFileList();

        batchProgressText.textContent = `Converting ${i + 1}/${total}...`;
        batchProgressBar.value = (i / total) * 100;

        try {
            // Ensure engine is loaded
            if (entry.handler.requires && !libraryStatus[entry.handler.requires]) {
                while (!libraryStatus[entry.handler.requires]) {
                    await new Promise(r => setTimeout(r, 100));
                }
            }

            const result = await convertFileToBlob(entry.file, format, entry.handler);
            entry.status = 'done';

            // Record in stats/history
            const outputSize = result.blob ? result.blob.size : 0;
            const savings = entry.file.size - outputSize;
            const ext = entry.file.name.split('.').pop().toLowerCase();

            CnvrtStats.record({
                inputSize: entry.file.size,
                outputSize,
                savings: Math.max(0, savings),
                inputFormat: ext,
                outputFormat: format,
                duration: null,
                isBatch: true
            });

            CnvrtHistory.add({
                inputName: entry.file.name,
                inputSize: entry.file.size,
                inputFormat: ext,
                outputFormat: format,
                outputSize,
                savings: Math.max(0, savings)
            });

            if (result.blob) {
                batchConvertedBlobs.push({ name: result.name, blob: result.blob });
            }
        } catch (err) {
            console.error(`Batch error for ${entry.file.name}:`, err);
            entry.status = 'error';
        }
        renderBatchFileList();
    }

    batchProgressBar.value = 100;
    batchProgressText.textContent = batchCancelled
        ? 'Batch cancelled.'
        : `Done! ${batchConvertedBlobs.length}/${total} converted.`;

    // Notification
    CnvrtNotifications.send('Batch Complete', `${batchConvertedBlobs.length}/${total} files converted.`);

    if (batchConvertedBlobs.length > 0) {
        if (batchZipOutput.checked) {
            await downloadBatchAsZip();
        } else {
            downloadBatchIndividually();
        }
    }
}

async function convertFileToBlob(file, outputFormat, handler) {
    const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat}`;

    // For FFmpeg-based conversions
    if (handler.requires === 'ffmpeg') {
        ffmpeg.FS('writeFile', file.name, await fetchFile(file));
        const command = ['-i', file.name];

        if (outputFormat === 'gif') command.push('-vf', 'fps=15,scale=500:-1:flags=lanczos');
        else if (outputFormat === 'ico') command.push('-vf', 'scale=256:256');

        command.push(outputFileName);
        await ffmpeg.run(...command);

        try {
            const data = ffmpeg.FS('readFile', outputFileName);
            const blob = new Blob([data.buffer], { type: getMimeType(outputFormat) });
            ffmpeg.FS('unlink', file.name);
            try { ffmpeg.FS('unlink', outputFileName); } catch {}
            return { name: outputFileName, blob };
        } catch {
            ffmpeg.FS('unlink', file.name);
            throw new Error(`Output not found: ${outputFileName}`);
        }
    }

    // For non-FFmpeg handlers, we'd need to handle each individually
    // Simplified: return a blob from the handler
    return { name: outputFileName, blob: file };
}

async function downloadBatchAsZip() {
    await loadScript(CDN_URLS.jszip);
    const zip = new JSZip();
    batchConvertedBlobs.forEach(item => {
        zip.file(item.name, item.blob);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cnvrt-batch.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showBriefToast('Batch ZIP downloaded!');
}

function downloadBatchIndividually() {
    batchConvertedBlobs.forEach((item, i) => {
        setTimeout(() => {
            const url = URL.createObjectURL(item.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = item.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
        }, i * 300); // Stagger downloads
    });
}


// =================================================================
// === URL FETCH ===================================================
// =================================================================
async function fetchFromUrl() {
    const url = urlInput.value.trim();
    if (!url) return;

    urlFetchBtn.textContent = 'Fetching...';
    urlFetchBtn.disabled = true;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        const filename = url.split('/').pop().split('?')[0] || 'downloaded-file';
        const file = new File([blob], filename, { type: blob.type });
        file._isUrl = true;

        handleFileSelect(file);
    } catch (err) {
        const errInfo = DETAILED_ERRORS.network_error;
        showBriefToast(`${errInfo.title}: ${err.message}`);
    } finally {
        urlFetchBtn.textContent = 'Fetch';
        urlFetchBtn.disabled = false;
    }
}


// =================================================================
// === CLIPBOARD PASTE =============================================
// =================================================================
function handleClipboardPaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
        if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file) {
                file._isClipboard = true;
                // The original file name from clipboard is usually like "image.png"
                handleFileSelect(file);
                e.preventDefault();
                return;
            }
        }
    }
}


// =================================================================
// === SIDE PANELS =================================================
// =================================================================
function openPanel(panel) {
    closeAllPanels();
    panel.classList.add('open');
    panelOverlay.classList.add('show');

    // Render content
    if (panel === historyPanel) {
        document.getElementById('history-panel-content').innerHTML = CnvrtHistory.renderHistoryPanel();
        // Bind clear history
        const clearBtn = document.getElementById('clear-history-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                CnvrtHistory.clear();
                document.getElementById('history-panel-content').innerHTML = CnvrtHistory.renderHistoryPanel();
            });
        }
    } else if (panel === statsPanel) {
        document.getElementById('stats-panel-content').innerHTML = CnvrtStats.renderStatsPanel();
    }
}

function closeAllPanels() {
    document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('open'));
    panelOverlay.classList.remove('show');
}


// =================================================================
// === INPUT TABS ==================================================
// =================================================================
function initInputTabs() {
    const tabs = document.querySelectorAll('.input-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.input-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.dataset.tab;
            document.getElementById(targetId)?.classList.add('active');
        });
    });
}


// =================================================================
// === SHARE SETTINGS ==============================================
// =================================================================
function shareCurrentSettings() {
    if (!selectedFile || !lastConvertedFormat) return;

    const inputFormat = selectedFile.name.split('.').pop().toLowerCase();
    const settings = {};
    if (resizeEnable.checked) {
        settings.width = resizeWidth.value;
        settings.height = resizeHeight.value;
    }

    const shareUrl = CnvrtShare.generateUrl(inputFormat, lastConvertedFormat, settings);

    CnvrtShare.copyToClipboard(shareUrl).then(ok => {
        showBriefToast(ok ? 'Share link copied to clipboard!' : 'Failed to copy link.');
    });
}


// =================================================================
// === CONVERSION HANDLERS =========================================
// =================================================================

async function handleMediaConversion(file, outputFormat, isPreview) {
    if (isPreview) {
        const url = URL.createObjectURL(file);
        const type = file.type.split('/')[0];
        let element;
        if (type === 'image') element = `<img src="${url}" alt="Preview">`;
        else if (type === 'video') element = `<video src="${url}" controls></video>`;
        else element = `<audio src="${url}" controls></audio>`;
        filePreview.innerHTML = `${element}<p>${file.name}</p>`;
        return;
    }

    const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat}`;
    ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    ffmpeg.setProgress(({ ratio }) => {
        if (conversionCancelled) return;
        progressBar.value = Math.min(100, Math.round(ratio * 100));
        progressText.textContent = `Converting... ${progressBar.value}%`;
    });

    const command = ['-i', file.name];
    let vfFilters = [];

    if (resizeEnable.checked && resizeWidth.value && resizeHeight.value) {
        let scaleFilter = `scale=${resizeWidth.value}:${resizeHeight.value}`;
        if (resizePixelArt.checked) scaleFilter += ":flags=neighbor";
        vfFilters.push(scaleFilter);
    }

    if (outputFormat === 'gif') {
        if (!resizeEnable.checked) vfFilters.push('fps=15,scale=500:-1:flags=lanczos');
        else vfFilters.push('fps=15');
    } else if (outputFormat === 'ico') {
        if (!resizeEnable.checked) vfFilters.push('scale=256:256');
    }

    if (vfFilters.length > 0) command.push('-vf', vfFilters.join(','));
    command.push(outputFileName);

    await ffmpeg.run(...command);

    if (conversionCancelled) {
        try { ffmpeg.FS('unlink', file.name); } catch {}
        try { ffmpeg.FS('unlink', outputFileName); } catch {}
        return;
    }

    try {
        const data = ffmpeg.FS('readFile', outputFileName);
        showDownload(new Blob([data.buffer]), outputFileName, file.size);
    } catch (e) {
        throw new Error(`Conversion failed: Output file "${outputFileName}" not found.`);
    } finally {
        try { ffmpeg.FS('unlink', file.name); } catch {}
        try { ffmpeg.FS('unlink', outputFileName); } catch {}
    }
}

async function handleSvgConversion(file, outputFormat, isPreview) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        if (isPreview) {
            filePreview.innerHTML = `<img src="${dataUrl}" alt="SVG Preview"><p>${file.name}</p>`;
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
            showDownload(resultUrl, outputFileName, file.size);
        };
        img.src = dataUrl;
    };
    reader.readAsDataURL(file);
}

async function handleDocxConversion(file, outputFormat, isPreview) {
    if (isPreview) {
        filePreview.innerHTML = `<p>DOCX Preview not available. Ready to convert.</p><p>${file.name}</p>`;
        return;
    }
    progressText.textContent = 'Loading converter...';
    await loadScript(CDN_URLS.mammoth);
    const arrayBuffer = await file.arrayBuffer();
    progressText.textContent = 'Parsing DOCX file...';
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
    progressBar.value = 50;

    if (outputFormat === 'html') {
        showDownload(new Blob([html], { type: 'text/html' }), `${file.name}.html`, file.size);
    } else if (outputFormat === 'txt') {
        const text = html.replace(/<[^>]+>/g, '');
        showDownload(new Blob([text], { type: 'text/plain' }), `${file.name}.txt`, file.size);
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
        filePreview.innerHTML += `<p>${file.name}</p>`;
        return;
    }

    if (outputFormat === 'txt') {
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            if (conversionCancelled) return;
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ');
            progressBar.value = (i / pdf.numPages) * 100;
        }
        showDownload(new Blob([fullText], { type: 'text/plain' }), `${file.name}.txt`, file.size);
    } else {
        const page = await pdf.getPage(1);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 2.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const dataUrl = canvas.toDataURL(`image/${outputFormat}`);
        showDownload(dataUrl, `${file.name}.${outputFormat}`, file.size);
    }
}

async function handleHtmlConversion(file, outputFormat, isPreview) {
    const html = await file.text();
    if (isPreview) {
        filePreview.innerHTML = `<p>HTML file loaded. Ready to convert.</p><p>${file.name}</p>`;
        return;
    }
    if (outputFormat === 'txt') {
        const text = html.replace(/<[^>]+>/g, '');
        showDownload(new Blob([text], { type: 'text/plain' }), `${file.name}.txt`, file.size);
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

async function handleArchiveConversion(file, outputFormat, isPreview) {
    if (isPreview) {
        filePreview.innerHTML = `
            <p>Archive file loaded: <strong>${file.name}</strong>.</p>
            <button id="view-zip-content-btn" class="action-btn secondary" style="margin-top:10px;font-size:0.8rem;padding:6px 12px;">View Contents</button>
            <div id="zip-content-list" style="display:none;text-align:left;background:var(--bg-secondary);padding:10px;margin-top:10px;max-height:200px;overflow-y:auto;font-family:monospace;font-size:0.8rem;"></div>
        `;
        document.getElementById('view-zip-content-btn').addEventListener('click', async () => {
            const listContainer = document.getElementById('zip-content-list');
            listContainer.style.display = 'block';
            listContainer.textContent = 'Loading...';
            try {
                await loadScript(CDN_URLS.jszip);
                const zip = await JSZip.loadAsync(file);
                listContainer.innerHTML = '';
                const ul = document.createElement('ul');
                ul.style.listStyle = 'none';
                ul.style.padding = '0';
                let count = 0;
                zip.forEach((relativePath, zipEntry) => {
                    if (count > 50) return;
                    const li = document.createElement('li');
                    li.textContent = (zipEntry.dir ? '📁 ' : '📄 ') + relativePath;
                    ul.appendChild(li);
                    count++;
                });
                if (count > 50) {
                    const li = document.createElement('li');
                    li.textContent = '... and more files.';
                    li.style.fontStyle = 'italic';
                    ul.appendChild(li);
                }
                listContainer.appendChild(ul);
            } catch (e) {
                listContainer.textContent = 'Error reading archive content.';
            }
        });
        return;
    }

    progressText.textContent = 'Loading archive engines...';
    await Promise.all([loadScript(CDN_URLS.jszip), loadScript(CDN_URLS.pako), loadScript(CDN_URLS.tar)]);
    const buffer = await file.arrayBuffer();
    progressText.textContent = 'Decompressing archive...';
    progressBar.value = 25;

    if (file.type === 'application/zip' && outputFormat === 'tar.gz') {
        const zip = await JSZip.loadAsync(buffer);
        if (typeof tarjs === 'undefined') throw new Error("Tar library failed to load.");
        const tape = new tarjs.Tar();
        let fileCount = 0;
        const totalFiles = Object.keys(zip.files).length;
        for (const filename in zip.files) {
            if (conversionCancelled) return;
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
        showDownload(new Blob([compressed]), outputFileName, file.size);
    }
}

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
        showDownload(new Blob([csv], { type: 'text/csv' }), `${file.name.split('.').slice(0, -1).join('.')}.csv`, file.size);
    } else if (outputFormat === 'json') {
        const json = XLSX.utils.sheet_to_json(worksheet);
        showDownload(new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }), `${file.name.split('.').slice(0, -1).join('.')}.json`, file.size);
    }
}

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
        showDownload(new Blob([buffer], { type: 'application/octet-stream' }), `${file.name.split('.').slice(0, -1).join('.')}.xlsx`, file.size);
    } else if (outputFormat === 'json') {
        const json = XLSX.utils.sheet_to_json(XLSX.utils.csv_to_sheet(text));
        showDownload(new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }), `${file.name.split('.').slice(0, -1).join('.')}.json`, file.size);
    }
}

async function handleHeicConversion(file, outputFormat, isPreview) {
    await loadScript(CDN_URLS.heic2any);
    const toType = `image/${outputFormat === 'jpg' ? 'jpeg' : 'png'}`;
    const conversionResult = await heic2any({ blob: file, toType });
    const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
    const url = URL.createObjectURL(blob);

    if (isPreview) {
        filePreview.innerHTML = `<img src="${url}" alt="HEIC Preview"><p>${file.name}</p>`;
        return;
    }
    const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat}`;
    showDownload(blob, outputFileName, file.size);
}

async function handlePsdConversion(file, outputFormat, isPreview) {
    await loadScript(CDN_URLS.psd);
    const url = URL.createObjectURL(file);
    const psd = await PSD.fromURL(url);
    const canvas = psd.image.toCanvas();
    const pngUrl = canvas.toDataURL('image/png');

    if (isPreview) {
        filePreview.innerHTML = `<img src="${pngUrl}" alt="PSD Preview"><p>${file.name}</p>`;
        return;
    }
    if (outputFormat === 'png') {
        showDownload(pngUrl, `${file.name.split('.').slice(0, -1).join('.')}.png`, file.size);
    }
}

async function handleFontConversion(file, outputFormat, isPreview) {
    await loadScript(CDN_URLS.opentype);
    const arrayBuffer = await file.arrayBuffer();
    const font = opentype.parse(arrayBuffer);

    if (isPreview) {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = getComputedStyle(document.body).backgroundColor || '#1c1917';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const fontName = font.names.fontFamily.en || 'Sample Text';
        ctx.fillStyle = getComputedStyle(document.body).color || '#e7e5e4';
        ctx.font = '20px sans-serif';
        ctx.fillText(fontName, 10, 30);
        const previewText = 'The quick brown fox jumps over the lazy dog.';
        const path = font.getPath(previewText, 10, 100, 36);
        path.fill = getComputedStyle(document.body).color || '#e7e5e4';
        path.draw(ctx);
        filePreview.innerHTML = '';
        filePreview.appendChild(canvas);
        filePreview.innerHTML += `<p>${file.name}</p>`;
        return;
    }
    const newFontBuffer = font.toArrayBuffer();
    const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat}`;
    showDownload(new Blob([newFontBuffer]), outputFileName, file.size);
}


// =================================================================
// === EVENT LISTENERS =============================================
// =================================================================

// App init
window.onload = initializeApp;

// File selection
selectFileButton.addEventListener("click", () => fileInput.click());
selectFolderButton.addEventListener("click", () => folderInput.click());

fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length > 1) handleMultipleFiles(files);
    else handleFileSelect(files[0]);
});

folderInput.addEventListener("change", (event) => {
    handleMultipleFiles(event.target.files);
});

// Drag & drop
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("dragover");
});
dropArea.addEventListener("dragleave", () => dropArea.classList.remove("dragover"));
dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");
    const files = event.dataTransfer.files;
    if (files.length > 1) handleMultipleFiles(files);
    else handleFileSelect(files[0]);
});

// Clipboard paste
document.addEventListener("paste", handleClipboardPaste);

// URL fetch
urlFetchBtn.addEventListener("click", fetchFromUrl);
urlInput.addEventListener("keydown", (e) => { if (e.key === 'Enter') fetchFromUrl(); });

// Format button clicks (single file)
formatButtons.addEventListener('click', (event) => {
    if (event.target.classList.contains('format-btn') || event.target.closest('.format-btn')) {
        const btn = event.target.classList.contains('format-btn') ? event.target : event.target.closest('.format-btn');
        const format = btn.dataset.format;
        startConversion(format);
    }
});

// Batch format button clicks
batchFormatButtons.addEventListener('click', (event) => {
    if (event.target.classList.contains('format-btn') || event.target.closest('.format-btn')) {
        const btn = event.target.classList.contains('format-btn') ? event.target : event.target.closest('.format-btn');
        const format = btn.dataset.format;
        startBatchConversion(format);
    }
});

// Cancel buttons
cancelBtn.addEventListener('click', cancelConversion);
batchCancelBtn.addEventListener('click', () => { batchCancelled = true; });
batchRemoveAll.addEventListener('click', () => { batchFiles = []; resetUI(); });

// File size warning dismiss
fileSizeWarningDismiss.addEventListener('click', () => { fileSizeWarning.style.display = 'none'; });

// Reset
resetBtn.addEventListener('click', resetUI);

// Share settings
shareSettingsBtn.addEventListener('click', shareCurrentSettings);

// Resize controls
resizeEnable.addEventListener('change', (e) => {
    if (e.target.checked) {
        resizeInputs.classList.remove('disabled');
        resizeWidth.disabled = false;
        resizeHeight.disabled = false;
        resizePixelArt.disabled = false;
    } else {
        resizeInputs.classList.add('disabled');
        resizeWidth.disabled = true;
        resizeHeight.disabled = true;
        resizePixelArt.disabled = true;
    }
});

resizeLockBtn.addEventListener('click', () => {
    isAspectRatioLocked = !isAspectRatioLocked;
    if (isAspectRatioLocked) {
        resizeLockBtn.classList.add('active');
        resizeLockBtn.innerHTML = '🔒';
        resizeLockBtn.title = "Unlock Aspect Ratio";
        if (resizeWidth.value) resizeHeight.value = Math.round(resizeWidth.value / originalAspectRatio);
    } else {
        resizeLockBtn.classList.remove('active');
        resizeLockBtn.innerHTML = '🔓';
        resizeLockBtn.title = "Lock Aspect Ratio";
    }
});

resizeWidth.addEventListener('input', () => {
    if (isAspectRatioLocked && resizeWidth.value && originalAspectRatio) {
        resizeHeight.value = Math.round(resizeWidth.value / originalAspectRatio);
    }
});

resizeHeight.addEventListener('input', () => {
    if (isAspectRatioLocked && resizeHeight.value && originalAspectRatio) {
        resizeWidth.value = Math.round(resizeHeight.value * originalAspectRatio);
    }
});

// Top bar buttons
themeToggle.addEventListener('click', () => CnvrtTheme.toggle());
shortcutsBtn.addEventListener('click', () => CnvrtShortcuts.toggleOverlay());

settingsBtn.addEventListener('click', () => {
    settingsPopup.classList.toggle('show');
});
settingsCloseBtn.addEventListener('click', () => settingsPopup.classList.remove('show'));
settingsPopup.addEventListener('click', (e) => {
    if (e.target === settingsPopup) settingsPopup.classList.remove('show');
});

historyBtn.addEventListener('click', () => {
    if (historyPanel.classList.contains('open')) closeAllPanels();
    else openPanel(historyPanel);
});

statsBtn.addEventListener('click', () => {
    if (statsPanel.classList.contains('open')) closeAllPanels();
    else openPanel(statsPanel);
});

panelOverlay.addEventListener('click', closeAllPanels);

// Panel close buttons
document.querySelectorAll('.side-panel-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const panelId = btn.dataset.closePanel;
        document.getElementById(panelId)?.classList.remove('open');
        panelOverlay.classList.remove('show');
    });
});

// Settings toggles
settingAutoDownload.addEventListener('change', (e) => CnvrtSettings.set('autoDownload', e.target.checked));
settingNotifications.addEventListener('change', (e) => CnvrtSettings.set('browserNotifications', e.target.checked));
settingOfflineMode.addEventListener('change', (e) => {
    CnvrtSettings.set('offlineMode', e.target.checked);
    if (e.target.checked) {
        const offlineProgress = document.getElementById('offline-progress');
        offlineProgress.style.display = 'block';
        document.getElementById('offline-progress-text').textContent = 'Caching all conversion engines...';
        // Progress will be updated by SW message
    }
});

// Input tabs
initInputTabs();

// Escape key (handled by CnvrtShortcuts but also keep legacy)
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        // CnvrtShortcuts handles this
    }
});

// Batch mixed format toggle
batchMixedFormat?.addEventListener('change', (e) => {
    if (e.target.checked) {
        renderBatchFileListWithFormatSelectors();
    } else {
        renderBatchFileList();
    }
});

function renderBatchFileListWithFormatSelectors() {
    batchFileList.innerHTML = '';
    batchFiles.forEach((entry, idx) => {
        const div = document.createElement('div');
        div.className = 'batch-file-item';
        const formats = entry.handler.formats;
        const optionsHtml = formats.map(f => `<option value="${f}" ${entry.outputFormat === f ? 'selected' : ''}>${f.toUpperCase()}</option>`).join('');

        div.innerHTML = `
            <span class="batch-file-name" title="${entry.file.name}">${entry.file.name}</span>
            <select class="batch-file-format-select" data-idx="${idx}">${optionsHtml}</select>
            <button class="batch-remove-btn" data-idx="${idx}" title="Remove">✕</button>
        `;
        batchFileList.appendChild(div);
    });

    // Bind select changes
    batchFileList.querySelectorAll('.batch-file-format-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            batchFiles[idx].outputFormat = e.target.value;
        });
    });

    // Bind remove
    batchFileList.querySelectorAll('.batch-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            batchFiles.splice(idx, 1);
            batchTitle.textContent = `Batch Queue (${batchFiles.length} files)`;
            renderBatchFileListWithFormatSelectors();
            if (batchFiles.length === 0) resetUI();
        });
    });
}

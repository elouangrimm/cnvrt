/**
 * CnVrt Features Module
 * Settings, Theme, Stats, Achievements, History, Notifications,
 * Keyboard Shortcuts, Offline Detection, Share Settings, Analytics
 */

// ============================================================
// === FORMAT TOOLTIPS ========================================
// ============================================================
const FORMAT_TOOLTIPS = {
    'png': 'Lossless, supports transparency. Best for graphics & screenshots.',
    'jpg': 'Lossy compression. Best for photos. Small file size.',
    'webp': 'Modern format. Great quality-to-size ratio. Wide browser support.',
    'gif': 'Supports animation. Limited to 256 colors.',
    'bmp': 'Uncompressed bitmap. Large file size. Universal support.',
    'tiff': 'High quality, used in print & photography. Large files.',
    'ico': 'Icon format for websites. Usually 256×256 or smaller.',
    'mp4': 'Most compatible video format. Great compression (H.264).',
    'webm': 'Open web video format. Good for web use. VP8/VP9 codec.',
    'mkv': 'Container format. Supports many codecs. Not ideal for web.',
    'mov': 'Apple QuickTime format. High quality. Large files.',
    'avi': 'Legacy video format. Large files. Universal playback.',
    'mp3': 'Universal audio. Lossy compression. Small file size.',
    'wav': 'Uncompressed audio. Lossless. Large file size.',
    'ogg': 'Open audio format. Good quality. Less compatible.',
    'flac': 'Lossless audio compression. Audiophile quality.',
    'aac': 'Modern lossy audio. Better quality than MP3 at same bitrate.',
    'pdf': 'Universal document format. Preserves layout perfectly.',
    'html': 'Web page format. Editable in any browser.',
    'txt': 'Plain text. No formatting. Universal compatibility.',
    'csv': 'Comma-separated values. For spreadsheets & data.',
    'json': 'Structured data format. Ideal for developers.',
    'xlsx': 'Excel spreadsheet. Supports formulas, charts, formatting.',
    'zip': 'Compressed archive. Universal support across all platforms.',
    'tar.gz': 'Unix-style compressed archive. Common on Linux/macOS.',
    'ttf': 'TrueType font. Wide compatibility across platforms.',
    'otf': 'OpenType font. Advanced typography features.',
    'woff': 'Web font format. Compressed for fast web loading.',
    'woff2': 'Modern web font. Best compression for web use.'
};

// ============================================================
// === FILE SIZE THRESHOLDS ===================================
// ============================================================
const FILE_SIZE_WARNINGS = {
    'image': { threshold: 50 * 1024 * 1024, message: 'This image is over 50 MB. Browser-based conversion may be slow or fail for very large images.' },
    'video': { threshold: 500 * 1024 * 1024, message: 'This video is over 500 MB. Browser-based conversion of large videos uses significant memory and may take a while.' },
    'audio': { threshold: 200 * 1024 * 1024, message: 'This audio file is over 200 MB. Conversion may take a moment.' },
    'default': { threshold: 100 * 1024 * 1024, message: 'This file is over 100 MB. Browser-based conversion may be slow.' }
};

// ============================================================
// === ERROR MESSAGES =========================================
// ============================================================
const DETAILED_ERRORS = {
    'ffmpeg_not_loaded': {
        title: 'Media Engine Not Ready',
        message: 'The media converter is still loading. Please wait a moment and try again.',
        tip: 'If this persists, try refreshing the page.'
    },
    'file_too_large': {
        title: 'File Too Large',
        message: 'This file may be too large for browser-based conversion.',
        tip: 'Try a smaller file, or reduce quality/resolution first.'
    },
    'unsupported_format': {
        title: 'Unsupported Format',
        message: 'This file type isn\'t supported for conversion yet.',
        tip: 'Supported types: images, video, audio, documents, archives, and fonts.'
    },
    'conversion_failed': {
        title: 'Conversion Failed',
        message: 'Something went wrong during conversion.',
        tip: 'The file may be corrupted or use an unsupported variant of the format.'
    },
    'network_error': {
        title: 'Network Error',
        message: 'Couldn\'t fetch the file from the URL.',
        tip: 'Check the URL is correct and the server allows cross-origin requests (CORS).'
    },
    'cancelled': {
        title: 'Conversion Cancelled',
        message: 'The conversion was cancelled.',
        tip: ''
    },
    'out_of_memory': {
        title: 'Out of Memory',
        message: 'The browser ran out of memory during conversion.',
        tip: 'Try closing other tabs or using a smaller file.'
    }
};

function getDetailedError(error) {
    const msg = (error?.message || '').toLowerCase();
    if (msg.includes('out of memory') || msg.includes('oom')) return DETAILED_ERRORS.out_of_memory;
    if (msg.includes('abort') || msg.includes('cancel')) return DETAILED_ERRORS.cancelled;
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('cors')) return DETAILED_ERRORS.network_error;
    if (msg.includes('not found') || msg.includes('output file')) return DETAILED_ERRORS.conversion_failed;
    return {
        title: 'Conversion Failed',
        message: error?.message || 'An unknown error occurred.',
        tip: 'Try again, or try a different output format.'
    };
}

// ============================================================
// === SETTINGS MANAGER =======================================
// ============================================================
const CnvrtSettings = {
    _key: 'cnvrt_settings',
    _defaults: {
        autoDownload: true,
        browserNotifications: false,
        offlineMode: false,
        theme: 'dark'
    },

    getAll() {
        try {
            const stored = localStorage.getItem(this._key);
            return { ...this._defaults, ...(stored ? JSON.parse(stored) : {}) };
        } catch { return { ...this._defaults }; }
    },

    get(key) {
        return this.getAll()[key] ?? this._defaults[key];
    },

    set(key, value) {
        const settings = this.getAll();
        settings[key] = value;
        localStorage.setItem(this._key, JSON.stringify(settings));

        if (key === 'theme') CnvrtTheme.set(value);
        if (key === 'offlineMode') this._handleOfflineMode(value);
        if (key === 'browserNotifications' && value) CnvrtNotifications.requestPermission();
    },

    _handleOfflineMode(enabled) {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            if (enabled) {
                navigator.serviceWorker.controller.postMessage({ type: 'ENABLE_OFFLINE' });
            }
        }
        CnvrtOffline.update();
    }
};

// ============================================================
// === THEME MANAGER ==========================================
// ============================================================
const CnvrtTheme = {
    init() {
        const theme = CnvrtSettings.get('theme');
        this.set(theme);
    },

    toggle() {
        const current = CnvrtSettings.get('theme');
        const next = current === 'dark' ? 'light' : 'dark';
        CnvrtSettings.set('theme', next);
        return next;
    },

    set(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = theme === 'dark' ? '#0c0a09' : '#fafaf9';
        }
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
            toggleBtn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
    }
};

// ============================================================
// === STATS & ANALYTICS ======================================
// ============================================================
const CnvrtStats = {
    _key: 'cnvrt_stats',

    _defaults: {
        totalConversions: 0,
        totalBytesProcessed: 0,
        totalBytesSaved: 0,
        formatCounts: {},
        sourceFormatCounts: {},
        firstConversion: null,
        lastConversion: null,
        fastestConversion: null,
        batchConversions: 0,
        urlConversions: 0,
        clipboardConversions: 0,
        dailyHistory: {}
    },

    getAll() {
        try {
            const stored = localStorage.getItem(this._key);
            return { ...this._defaults, ...(stored ? JSON.parse(stored) : {}) };
        } catch { return { ...this._defaults }; }
    },

    _save(stats) {
        localStorage.setItem(this._key, JSON.stringify(stats));
    },

    record(conversion) {
        const stats = this.getAll();
        const now = new Date();
        const isoNow = now.toISOString();
        const dayKey = isoNow.slice(0, 10);

        stats.totalConversions++;
        stats.totalBytesProcessed += (conversion.inputSize || 0);
        stats.totalBytesSaved += (conversion.savings || 0);
        stats.lastConversion = isoNow;
        if (!stats.firstConversion) stats.firstConversion = isoNow;

        if (conversion.duration != null && (!stats.fastestConversion || conversion.duration < stats.fastestConversion)) {
            stats.fastestConversion = conversion.duration;
        }

        const fmt = conversion.outputFormat?.toLowerCase();
        if (fmt) stats.formatCounts[fmt] = (stats.formatCounts[fmt] || 0) + 1;

        const srcFmt = conversion.inputFormat?.toLowerCase();
        if (srcFmt) stats.sourceFormatCounts[srcFmt] = (stats.sourceFormatCounts[srcFmt] || 0) + 1;

        if (conversion.isBatch) stats.batchConversions++;
        if (conversion.isUrl) stats.urlConversions++;
        if (conversion.isClipboard) stats.clipboardConversions++;

        // Daily history (keep last 30 days)
        if (!stats.dailyHistory) stats.dailyHistory = {};
        stats.dailyHistory[dayKey] = (stats.dailyHistory[dayKey] || 0) + 1;
        const keys = Object.keys(stats.dailyHistory).sort();
        if (keys.length > 30) {
            keys.slice(0, keys.length - 30).forEach(k => delete stats.dailyHistory[k]);
        }

        this._save(stats);

        CnvrtAchievements.check(stats, conversion);

        return stats;
    },

    formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    },

    getTopFormats(n = 5) {
        const stats = this.getAll();
        return Object.entries(stats.formatCounts || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, n);
    },

    renderStatsPanel() {
        const stats = this.getAll();
        const topFormats = this.getTopFormats(5);
        const unlocked = CnvrtAchievements.getUnlocked();
        const allAch = CnvrtAchievements.definitions;

        let html = '<div class="stats-section">';
        html += '<h4>Overview</h4>';
        html += '<div class="stats-grid">';
        html += `<div class="stat-card"><span class="stat-value">${stats.totalConversions}</span><span class="stat-label">Conversions</span></div>`;
        html += `<div class="stat-card"><span class="stat-value">${this.formatBytes(stats.totalBytesProcessed)}</span><span class="stat-label">Processed</span></div>`;
        html += `<div class="stat-card"><span class="stat-value">${this.formatBytes(Math.max(0, stats.totalBytesSaved))}</span><span class="stat-label">Space Saved</span></div>`;
        html += `<div class="stat-card"><span class="stat-value">${stats.fastestConversion ? (stats.fastestConversion / 1000).toFixed(1) + 's' : '—'}</span><span class="stat-label">Fastest</span></div>`;
        html += '</div>';

        if (topFormats.length > 0) {
            html += '<h4>Top Formats</h4>';
            html += '<div class="top-formats">';
            const maxCount = topFormats[0]?.[1] || 1;
            topFormats.forEach(([fmt, count]) => {
                const pct = Math.round((count / maxCount) * 100);
                html += `<div class="format-bar-row">
                    <span class="format-bar-label">.${fmt}</span>
                    <div class="format-bar-track"><div class="format-bar-fill" style="width:${pct}%"></div></div>
                    <span class="format-bar-count">${count}</span>
                </div>`;
            });
            html += '</div>';
        }

        // Daily activity sparkline (simple text-based)
        if (stats.dailyHistory && Object.keys(stats.dailyHistory).length > 0) {
            html += '<h4>Recent Activity</h4>';
            html += '<div class="activity-chart">';
            const today = new Date();
            for (let i = 13; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const key = d.toISOString().slice(0, 10);
                const count = stats.dailyHistory[key] || 0;
                const height = count === 0 ? 2 : Math.min(40, 4 + count * 6);
                const dayLabel = d.toLocaleDateString('en', { weekday: 'narrow' });
                html += `<div class="activity-bar" title="${key}: ${count} conversions"><div class="activity-bar-fill" style="height:${height}px"></div><span>${dayLabel}</span></div>`;
            }
            html += '</div>';
        }

        html += '</div>';

        // Achievements
        html += '<div class="stats-section">';
        html += `<h4>Achievements (${unlocked.length}/${allAch.length})</h4>`;
        html += '<div class="achievements-grid">';
        allAch.forEach(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            html += `<div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}" title="${ach.desc}">
                <span class="achievement-icon">${ach.icon}</span>
                <span class="achievement-name">${ach.name}</span>
            </div>`;
        });
        html += '</div></div>';

        return html;
    }
};

// ============================================================
// === ACHIEVEMENT SYSTEM =====================================
// ============================================================
const CnvrtAchievements = {
    _key: 'cnvrt_achievements',

    definitions: [
        { id: 'first_convert', name: 'First Steps', desc: 'Complete your first conversion', icon: '🎉', check: (s) => s.totalConversions >= 1 },
        { id: 'ten_converts', name: 'Getting Warmed Up', desc: 'Complete 10 conversions', icon: '⚡', check: (s) => s.totalConversions >= 10 },
        { id: 'fifty_converts', name: 'Power User', desc: 'Complete 50 conversions', icon: '🔥', check: (s) => s.totalConversions >= 50 },
        { id: 'hundred_converts', name: 'Centurion', desc: 'Complete 100 conversions', icon: '💯', check: (s) => s.totalConversions >= 100 },
        { id: 'five_hundred', name: 'Conversion Machine', desc: 'Complete 500 conversions', icon: '🤖', check: (s) => s.totalConversions >= 500 },
        { id: 'save_10mb', name: 'Space Saver', desc: 'Save 10 MB total across conversions', icon: '📦', check: (s) => s.totalBytesSaved >= 10 * 1024 * 1024 },
        { id: 'save_100mb', name: 'Mega Saver', desc: 'Save 100 MB total', icon: '🏆', check: (s) => s.totalBytesSaved >= 100 * 1024 * 1024 },
        { id: 'save_1gb', name: 'Giga Chad', desc: 'Save 1 GB total', icon: '👑', check: (s) => s.totalBytesSaved >= 1024 * 1024 * 1024 },
        { id: 'batch_master', name: 'Batch Master', desc: 'Complete a batch conversion', icon: '📚', check: (s) => s.batchConversions >= 1 },
        { id: 'format_explorer', name: 'Format Explorer', desc: 'Use 5+ different output formats', icon: '🧭', check: (s) => Object.keys(s.formatCounts || {}).length >= 5 },
        { id: 'format_collector', name: 'Format Collector', desc: 'Use 10+ different output formats', icon: '🗃️', check: (s) => Object.keys(s.formatCounts || {}).length >= 10 },
        { id: 'night_owl', name: 'Night Owl', desc: 'Convert a file after midnight', icon: '🦉', check: (s, c) => { const h = new Date().getHours(); return h >= 0 && h < 5; } },
        { id: 'early_bird', name: 'Early Bird', desc: 'Convert a file before 7 AM', icon: '🐦', check: (s, c) => { const h = new Date().getHours(); return h >= 5 && h < 7; } },
        { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete a conversion in under 1 second', icon: '💨', check: (s) => s.fastestConversion != null && s.fastestConversion < 1000 },
        { id: 'url_convert', name: 'Link Master', desc: 'Convert a file from a URL', icon: '🔗', check: (s) => s.urlConversions >= 1 },
        { id: 'clipboard_convert', name: 'Clipboard Ninja', desc: 'Convert a file from clipboard', icon: '📋', check: (s) => s.clipboardConversions >= 1 },
        { id: 'processed_1gb', name: 'Data Cruncher', desc: 'Process 1 GB of files total', icon: '💾', check: (s) => s.totalBytesProcessed >= 1024 * 1024 * 1024 },
        { id: 'ten_batches', name: 'Assembly Line', desc: 'Complete 10 batch conversions', icon: '🏭', check: (s) => s.batchConversions >= 10 }
    ],

    getUnlocked() {
        try {
            const stored = localStorage.getItem(this._key);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    },

    _save(unlocked) {
        localStorage.setItem(this._key, JSON.stringify(unlocked));
    },

    check(stats, conversion) {
        const unlocked = this.getUnlocked();
        const newlyUnlocked = [];

        for (const ach of this.definitions) {
            if (unlocked.includes(ach.id)) continue;
            try {
                if (ach.check(stats, conversion)) {
                    unlocked.push(ach.id);
                    newlyUnlocked.push(ach);
                }
            } catch {}
        }

        if (newlyUnlocked.length > 0) {
            this._save(unlocked);
            newlyUnlocked.forEach((ach, i) => {
                setTimeout(() => this.showToast(ach), i * 600);
            });
        }

        return newlyUnlocked;
    },

    showToast(achievement) {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <span class="achievement-toast-icon">${achievement.icon}</span>
            <div class="achievement-toast-info">
                <strong>Achievement Unlocked!</strong>
                <span>${achievement.name}</span>
            </div>
        `;
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('show'));
        });
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
};

// ============================================================
// === CONVERSION HISTORY =====================================
// ============================================================
const CnvrtHistory = {
    _key: 'cnvrt_history',
    _maxEntries: 100,

    getAll() {
        try {
            const stored = localStorage.getItem(this._key);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    },

    add(entry) {
        const history = this.getAll();
        history.unshift({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            timestamp: new Date().toISOString(),
            inputName: entry.inputName,
            inputSize: entry.inputSize,
            inputFormat: entry.inputFormat,
            outputFormat: entry.outputFormat,
            outputSize: entry.outputSize || null,
            savings: entry.savings || 0,
            duration: entry.duration || null
        });

        if (history.length > this._maxEntries) history.length = this._maxEntries;
        localStorage.setItem(this._key, JSON.stringify(history));
    },

    clear() {
        localStorage.removeItem(this._key);
    },

    formatDate(isoString) {
        const d = new Date(isoString);
        const now = new Date();
        const diff = now - d;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        return d.toLocaleDateString();
    },

    renderHistoryPanel() {
        const history = this.getAll();

        if (history.length === 0) {
            return '<div class="empty-state"><p>No conversions yet.</p><p class="empty-hint">Your conversion history will appear here.</p></div>';
        }

        let html = '<div class="history-list">';
        html += `<div class="history-actions"><button id="clear-history-btn" class="action-btn secondary" style="font-size:0.8rem;padding:6px 12px;">Clear History</button></div>`;

        history.forEach(entry => {
            const savings = entry.savings > 0
                ? `<span class="history-savings">-${CnvrtStats.formatBytes(entry.savings)}</span>`
                : '';

            html += `<div class="history-item">
                <div class="history-item-main">
                    <span class="history-filename" title="${entry.inputName}">${entry.inputName}</span>
                    <span class="history-arrow">.${entry.inputFormat} → .${entry.outputFormat}</span>
                </div>
                <div class="history-item-meta">
                    <span class="history-size">${CnvrtStats.formatBytes(entry.inputSize)}</span>
                    ${savings}
                    <span class="history-time">${this.formatDate(entry.timestamp)}</span>
                </div>
            </div>`;
        });

        html += '</div>';
        return html;
    }
};

// ============================================================
// === NOTIFICATION MANAGER ===================================
// ============================================================
const CnvrtNotifications = {
    async requestPermission() {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;
        const result = await Notification.requestPermission();
        return result === 'granted';
    },

    send(title, body) {
        if (!CnvrtSettings.get('browserNotifications')) return;
        if (!document.hidden) return;
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        try {
            new Notification(title, {
                body,
                icon: '/icons/icon-192.png',
                badge: '/icons/icon-192.png'
            });
        } catch {}
    }
};

// ============================================================
// === KEYBOARD SHORTCUTS =====================================
// ============================================================
const CnvrtShortcuts = {
    _bindings: [],
    _overlayVisible: false,

    init() {
        this._bindings = [
            { key: 'o', ctrl: true, desc: 'Open file selector', action: () => document.getElementById('file-input')?.click() },
            { key: 'Escape', desc: 'Close panel / Reset', action: () => this._handleEscape() },
            { key: '?', desc: 'Show keyboard shortcuts', action: () => this.toggleOverlay() },
            { key: 's', ctrl: true, desc: 'Open settings', action: () => document.getElementById('settings-btn')?.click() },
            { key: 'h', ctrl: true, desc: 'Toggle history', action: () => document.getElementById('history-btn')?.click() },
        ];

        document.addEventListener('keydown', (e) => this._handleKey(e));
    },

    _handleEscape() {
        // Close overlays first
        if (this._overlayVisible) { this.hideOverlay(); return; }

        const settingsPopup = document.getElementById('settings-popup');
        if (settingsPopup?.classList.contains('show')) {
            settingsPopup.classList.remove('show');
            return;
        }

        const panels = document.querySelectorAll('.side-panel.open');
        if (panels.length > 0) {
            panels.forEach(p => p.classList.remove('open'));
            document.getElementById('panel-overlay')?.classList.remove('show');
            return;
        }

        if (document.getElementById('initial-state')?.style.display === 'none') {
            document.getElementById('reset-btn')?.click();
        }
    },

    _handleKey(e) {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

        // Number keys for format selection
        if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey) {
            const formatBtns = document.querySelectorAll('#format-buttons .format-btn');
            const idx = parseInt(e.key) - 1;
            if (idx < formatBtns.length && document.getElementById('conversion-controls')?.style.display !== 'none') {
                formatBtns[idx].click();
                return;
            }
        }

        for (const binding of this._bindings) {
            const ctrlMatch = binding.ctrl ? (e.ctrlKey || e.metaKey) : !(e.ctrlKey || e.metaKey);
            const shiftMatch = binding.shift ? e.shiftKey : !binding.shift || !e.shiftKey;
            if (ctrlMatch && shiftMatch && e.key === binding.key) {
                e.preventDefault();
                binding.action();
                return;
            }
        }
    },

    toggleOverlay() {
        this._overlayVisible ? this.hideOverlay() : this.showOverlay();
    },

    showOverlay() {
        let overlay = document.getElementById('shortcuts-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'shortcuts-overlay';
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-content shortcuts-modal">
                    <div class="modal-header">
                        <h3>Keyboard Shortcuts</h3>
                        <button class="modal-close" id="shortcuts-close-btn">✕</button>
                    </div>
                    <div class="shortcuts-list">
                        ${this._bindings.map(b => `
                            <div class="shortcut-row">
                                <kbd>${b.ctrl ? 'Ctrl + ' : ''}${b.shift ? 'Shift + ' : ''}${b.key === ' ' ? 'Space' : b.key.toUpperCase()}</kbd>
                                <span>${b.desc}</span>
                            </div>
                        `).join('')}
                        <div class="shortcut-row">
                            <kbd>1 – 9</kbd>
                            <span>Quick-select format (when format buttons visible)</span>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            overlay.addEventListener('click', (e) => { if (e.target === overlay) this.hideOverlay(); });
            document.getElementById('shortcuts-close-btn').addEventListener('click', () => this.hideOverlay());
        }
        requestAnimationFrame(() => overlay.classList.add('show'));
        this._overlayVisible = true;
    },

    hideOverlay() {
        const overlay = document.getElementById('shortcuts-overlay');
        if (overlay) overlay.classList.remove('show');
        this._overlayVisible = false;
    }
};

// ============================================================
// === OFFLINE DETECTION ======================================
// ============================================================
const CnvrtOffline = {
    _indicator: null,

    init() {
        this._indicator = document.getElementById('offline-indicator');
        window.addEventListener('online', () => this.update());
        window.addEventListener('offline', () => this.update());
        this.update();
    },

    update() {
        if (!this._indicator) return;
        const isOnline = navigator.onLine;
        const offlineMode = CnvrtSettings.get('offlineMode');

        if (offlineMode) {
            this._indicator.textContent = '✓ Offline Ready';
            this._indicator.className = 'offline-indicator mode-offline';
        } else if (!isOnline) {
            this._indicator.textContent = '⚠ No Connection';
            this._indicator.className = 'offline-indicator mode-warning';
        } else {
            this._indicator.textContent = '✓ Online';
            this._indicator.className = 'offline-indicator mode-online';
        }
    }
};

// ============================================================
// === SHARE SETTINGS =========================================
// ============================================================
const CnvrtShare = {
    generateUrl(inputFormat, outputFormat, settings = {}) {
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('from', inputFormat);
        url.searchParams.set('to', outputFormat);
        if (settings.width) url.searchParams.set('w', settings.width);
        if (settings.height) url.searchParams.set('h', settings.height);
        return url.toString();
    },

    parseUrl() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        if (params.has('from')) result.from = params.get('from');
        if (params.has('to')) result.to = params.get('to');
        if (params.has('w') && params.has('h')) {
            result.resize = { width: parseInt(params.get('w')), height: parseInt(params.get('h')) };
        }
        return Object.keys(result).length > 0 ? result : null;
    },

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch { return false; }
    }
};

// ============================================================
// === PWA REGISTRATION =======================================
// ============================================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('SW registered:', reg.scope);
            })
            .catch(err => console.warn('SW registration failed:', err));

        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'OFFLINE_READY') {
                CnvrtOffline.update();
                showBriefToast('All conversion engines cached for offline use!');
            }
        });
    }
}

function showBriefToast(message) {
    const toast = document.createElement('div');
    toast.className = 'brief-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

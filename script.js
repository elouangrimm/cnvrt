const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const filePreview = document.getElementById("file-preview");
const selectFileButton = document.getElementById("select-file-btn");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

const {
	createFFmpeg,
	fetchFile
} = FFmpeg;
const ffmpeg = createFFmpeg({
	log: true
});

async function loadFFmpeg() {
	await ffmpeg.load();
	ffmpegReady = true;
	console.log("FFmpeg loaded successfully!");
}

selectFileButton.addEventListener("click", () => fileInput.click());

dropArea.addEventListener("dragover", (event) => {
	event.preventDefault();
	dropArea.classList.add("dragover");
	document.getElementById("upload-instruction").textContent = "Drop the file HERE!";
});

dropArea.addEventListener("dragleave", () => {
	dropArea.classList.remove("dragover");
	document.getElementById("upload-instruction").textContent = "Drag a file or select one below:";
});

dropArea.addEventListener("drop", (event) => {
	event.preventDefault();
	dropArea.classList.remove("dragover");
	document.getElementById("upload-instruction").textContent = "Your file has been uploaded. Please wait while it is being converted.";
	selectFileButton.style.display = "none";
	handleFile(event.dataTransfer.files[0]);
});

fileInput.addEventListener("change", (event) => {
	document.getElementById("upload-instruction").textContent = "Your file has been uploaded. Please wait while it is being converted.";
	selectFileButton.style.display = "none";
	handleFile(event.target.files[0]);
});

function handleFile(file) {
	if (!ffmpegReady) {
		console.error("FFmpeg is not ready yet.");
		return;
	}
	if (!file) return;

	const fileType = file.type;

	if (fileType.match(/audio\/(wav|m4a|aac)/)) {
		convertAudioToMp3(file);
	} else if (fileType.match(/image\/(webp|jpeg|jpg|png|gif|bmp|tiff)/)) {
		convertImageToPng(file);
	} else if (fileType.match(/video\/(webm|mp4|avi|mov|mkv)/)) {
		convertVideoToMp4(file);
	} else {
		alert("Unsupported file type.");
	}
}

async function convertImageToPng(file) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	const img = new Image();
	const fileReader = new FileReader();

	fileReader.onload = () => {
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;

			ctx.drawImage(img, 0, 0);

			const pngUrl = canvas.toDataURL("image/png");

			const downloadLink = document.createElement("a");
			downloadLink.href = pngUrl;
			downloadLink.download = `${file.name.replace(/\.(webp|jpg|jpeg)$/i, ".png")}`;
			downloadLink.click();

			const screenWidth = window.innerWidth * 0.4;
			const previewHeight = (screenWidth / img.width) * img.height;

			filePreview.innerHTML = `
              <img src="${pngUrl}" alt="File preview" 
                   style="width: ${screenWidth}px; height: ${previewHeight}px; border: 1px solid #ffffff; border-radius: 8px;">
              <p>${file.name.replace(".webp", ".png")}</p>
          `;
		};
		img.src = fileReader.result;
	};

	fileReader.readAsDataURL(file);
	setTimeout(() => {
		location.reload();
	}, 1000);
}

async function convertVideoToMp4(file) {
	ffmpeg.FS('writeFile', file.name, await fetchFile(file));

	const outputFileName = file.name.replace(/\.(webm|avi|mov|mkv)$/i, '.mp4');

  progressContainer.style.display = "block";
  progressText.textContent = "Converting video (this may take a while)...";

  await ffmpeg.run('-i', file.name, outputFileName, {
      onProgress: (progress) => {
          progressBar.value = progress.percent;
          progressText.textContent = `Converting video... ${Math.round(progress.percent)}%`;
      }
  });

	const mp4Data = ffmpeg.FS('readFile', outputFileName);

	const mp4Blob = new Blob([mp4Data.buffer], {
		type: 'video/mp4'
	});
	const mp4Url = URL.createObjectURL(mp4Blob);

	const downloadLink = document.createElement('a');
	downloadLink.href = mp4Url;
	downloadLink.download = outputFileName;
	downloadLink.click();
	setTimeout(() => {
		location.reload();
	}, 1000);
}

async function convertAudioToMp3(file) {
	ffmpeg.FS('writeFile', file.name, await fetchFile(file));

	const outputFileName = file.name.replace(/\.(wav|m4a|aac)$/i, '.mp3');

  progressContainer.style.display = "block";
  progressText.textContent = "Converting audio...";

  await ffmpeg.run('-i', file.name, outputFileName, {
      onProgress: (progress) => {
          progressBar.value = progress.percent;
          progressText.textContent = `Converting audio... ${Math.round(progress.percent)}%`;
      }
  });

	const mp3Data = ffmpeg.FS('readFile', outputFileName);
	const mp3Blob = new Blob([mp3Data.buffer], {
		type: 'audio/mp3'
	});
	const mp3Url = URL.createObjectURL(mp3Blob);

	const downloadLink = document.createElement('a');
	downloadLink.href = mp3Url;
	downloadLink.download = outputFileName;
	downloadLink.click();
	// setTimeout(() => {
	// 	location.reload();
	// }, 1000);
}

window.onload = loadFFmpeg;

/*
const helpIcon = document.getElementById("help-icon");
const modal = document.getElementById("modal");
const closeButton = document.querySelector(".close-button");

helpIcon.addEventListener("click", () => {
    modal.style.display = "block";
});

closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}); */
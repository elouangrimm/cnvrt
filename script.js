const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const filePreview = document.getElementById("file-preview");
const selectFileButton = document.getElementById("select-file-btn");

selectFileButton.addEventListener("click", () => fileInput.click());

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("dragover");
  document.getElementById("upload-instruction").textContent = "Drop the file here!";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
  document.getElementById("upload-instruction").textContent = "Drag a file or select one below:";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.classList.remove("dragover");
  document.getElementById("upload-instruction").textContent = "";
  handleFile(event.dataTransfer.files[0]);
});

fileInput.addEventListener("change", (event) => {
  handleFile(event.target.files[0]);
});

function handleFile(file) {
  if (!file) return;

  const fileType = file.type;

  if (fileType.match(/image\/(webp|jpeg|jpg)/)) {
    convertAndDownload(file);
  } else if (fileType.match(/video\/webm/)) {
    convertWebmToMp4(file);
  } else {
    alert("Unsupported file type.");
  }
}

function convertAndDownload(file) {
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
}

async function convertWebmToMp4(file) {
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: true });
  
  await ffmpeg.load();
  
  ffmpeg.FS('writeFile', file.name, await fetchFile(file));
  
  await ffmpeg.run('-i', file.name, 'output.mp4');
  
  const mp4Data = ffmpeg.FS('readFile', 'output.mp4');
  
  const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });
  const mp4Url = URL.createObjectURL(mp4Blob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = mp4Url;
  downloadLink.download = file.name.replace(/\.(webm)$/i, '.mp4');
  downloadLink.click();
  
}

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
});
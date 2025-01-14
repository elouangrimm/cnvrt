const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const filePreview = document.getElementById("file-preview");
const convertButton = document.getElementById("convert-btn");

let selectedFile = null;

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("dragover");
  document.getElementById("upload-instruction").textContent = "Drop the file here!";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
  document.getElementById("upload-instruction").textContent = "Drag or upload a file";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.classList.remove("dragover");
  handleFile(event.dataTransfer.files[0]);
});

fileInput.addEventListener("change", (event) => {
  handleFile(event.target.files[0]);
});

function handleFile(file) {
  if (!file) return;

  if (!file.type.includes("webp")) {
    alert("Please select a valid WebP file.");
    return;
  }

  selectedFile = file;
  displayFilePreview(file);
  convertButton.disabled = false;
}

function displayFilePreview(file) {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    filePreview.innerHTML = `
      <img src="${fileReader.result}" alt="File preview" style="max-width: 100%; height: auto; border: 1px solid #ffffff; border-radius: 8px;">
      <p>${file.name}</p>
    `;
  };
  fileReader.readAsDataURL(file);
}

convertButton.addEventListener("click", () => {
  if (!selectedFile) return;

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
      downloadLink.download = `${selectedFile.name.replace(".webp", ".png")}`;
      downloadLink.textContent = "Download PNG";
      downloadLink.style.display = "block";
      downloadLink.style.color = "#00e676";

      filePreview.appendChild(downloadLink);
    };
    img.src = fileReader.result;
  };

  fileReader.readAsDataURL(selectedFile);
});
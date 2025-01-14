const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const filePreview = document.getElementById("file-preview");
const selectFileButton = document.getElementById("select-file-btn");

// Add click event to open file picker dialog
selectFileButton.addEventListener("click", () => fileInput.click());

// Handle drag and drop
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
  handleFile(event.dataTransfer.files[0]);
});

// Handle file input change
fileInput.addEventListener("change", (event) => {
  handleFile(event.target.files[0]);
});

// Handle file selection
function handleFile(file) {
  if (!file) return;

  if (!file.type.includes("webp")) {
    alert("Please select a valid WebP file.");
    return;
  }

  convertAndDownload(file);
}

// Convert WebP to PNG and download
function convertAndDownload(file) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  const fileReader = new FileReader();

  fileReader.onload = () => {
    img.onload = () => {
      // Resize the image to 40% of the screen width
      const targetWidth = window.innerWidth * 0.4;
      const aspectRatio = img.height / img.width;

      canvas.width = targetWidth;
      canvas.height = targetWidth * aspectRatio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to PNG
      const pngUrl = canvas.toDataURL("image/png");

      // Auto-download the converted PNG
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${file.name.replace(".webp", ".png")}`;
      downloadLink.click();

      // Display a preview of the PNG image
      filePreview.innerHTML = `
        <img src="${pngUrl}" alt="File preview" style="max-width: 100%; height: auto; border: 1px solid #ffffff; border-radius: 8px;">
        <p>Image downloaded as ${file.name.replace(".webp", ".png")}</p>
      `;
    };
    img.src = fileReader.result;
  };

  fileReader.readAsDataURL(file);
}

const textInput = document.getElementById("qr-text");
const sizeSelect = document.getElementById("qr-size");
const colorInput = document.getElementById("qr-color");
const bgcolorInput = document.getElementById("qr-bgcolor");
const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const qrContainer = document.getElementById("qrcode");
const emptyState = document.getElementById("empty-state");

let currentDataUrl = null;

generateBtn.addEventListener("click", generateQR);
textInput.addEventListener("input", handleInput);
textInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generateQR();
});

function handleInput() {
  const hasValue = textInput.value.trim().length > 0;
  generateBtn.disabled = !hasValue;
  if (!hasValue) {
    clearQR();
  }
}

function clearQR() {
  qrContainer.innerHTML = "";
  emptyState.classList.remove("hidden");
  downloadBtn.disabled = true;
  downloadBtn.classList.add("disabled-state");
  currentDataUrl = null;
}

async function generateQR() {
  const text = textInput.value.trim();
  if (!text) return;

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";

  const size = parseInt(sizeSelect.value, 10);
  const color = colorInput.value;
  const bgcolor = bgcolorInput.value;

  try {
    qrContainer.innerHTML = "";
    emptyState.classList.add("hidden");

    const canvas = await QRCode.toCanvas(text, {
      width: size,
      height: size,
      color: {
        dark: color,
        light: bgcolor,
      },
      margin: 2,
    });

    qrContainer.appendChild(canvas);

    currentDataUrl = canvas.toDataURL("image/png");
    downloadBtn.disabled = false;
    downloadBtn.classList.remove("disabled-state");
  } catch (err) {
    console.error(err);
    alert("Failed to generate QR code. Please try again.");
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate QR Code";
  }
}

downloadBtn.addEventListener("click", () => {
  if (!currentDataUrl) return;
  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = currentDataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

handleInput();

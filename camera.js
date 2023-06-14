let mediacRecorder;
let recordedChunks = [];
const recordli = [];
async function startcRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1920, height: 1080, frameRate: 30 },
      audio: {
        echoCancellation: true, // Annulation de l'écho
        noiseSuppression: true, // Suppression du bruit
        sampleRate: 44100, // Taux d'échantillonnage audio (en Hz)
        channelCount: 2 // Nombre de canaux audio (1 pour mono, 2 pour stéréo)
      },
    });
    const videoPreview = document.getElementById('previe');
    videoPreview.srcObject = stream;

    mediacRecorder = new MediaRecorder(stream);
    mediacRecorder.ondataavailable = handleDataAvailable;
    mediacRecorder.start();

    document.getElementById("start-cbutton").disabled = true;
    document.getElementById("stop-cbutton").disabled = false;
  } catch (error) {
    console.error("Erreur lors de la capture vidéo:", error);
  }
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}

function stopcRecording() {
  mediacRecorder.stop();
  mediacRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    recordedChunks = [];

    const videoPreview = document.getElementById("previe");
    videoPreview.src = URL.createObjectURL(blob);
    videoPreview.controls = true;
    const recording = {
        blob: blob,
        url: URL.createObjectURL(blob),
        name: `Recording ${recordli.length + 1}`,
        date: new Date().toLocaleString(),
      };
  
      recordli.push(recording);
      renderrecordli();
  

    document.getElementById("start-cbutton").disabled = false;
    document.getElementById("stop-cbutton").disabled = true;
  };
}
function renderrecordli() {
    const recordliList = document.getElementById("record-list");
    recordliList.innerHTML = "";
  
    recordli.forEach(function (recording, index) {
      const recordingItem = document.createElement("li");
      recordingItem.innerHTML = `
              <span>${recording.name}</span>
              <span>${recording.date}</span>
              <a href="${recording.url}" download="${recording.name}.webm">Télécharger</a>
            `;
  
      recordliList.appendChild(recordingItem);
    });
  }

const startcButton = document.getElementById("start-cbutton");
startcButton.addEventListener("click", startcRecording);

const stopcButton = document.getElementById("stop-cbutton");
stopcButton.addEventListener("click", stopcRecording);

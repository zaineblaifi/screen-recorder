let mediaRecorder;
const chunks = [];
const recordings = [];
function startRecording() {
  const displayOptions = {
    video: { width: 1920, height: 1080, frameRate: 30 },
    audio: {
      echoCancellation: true, // Annulation de l'écho
      noiseSuppression: true, // Suppression du bruit
      sampleRate: 44100, // Taux d'échantillonnage audio (en Hz)
      channelCount: 2, // Nombre de canaux audio (1 pour mono, 2 pour stéréo)
    },
  };

  navigator.mediaDevices
    .getDisplayMedia(displayOptions)
    .then(function (stream) {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };

      mediaRecorder.start();

      document.getElementById("start-button").disabled = true;
      document.getElementById("stop-button").disabled = false;
    })
    .catch(function (error) {
      console.error("Erreur lors de la capture de l'écran et du son:", error);
    });
}

function stopRecording() {
  mediaRecorder.stop();

  mediaRecorder.onstop = function () {
    const blob = new Blob(chunks, { type: "video/webm" });
    chunks.length = 0;

    const videoPreview = document.getElementById("preview");
    videoPreview.src = URL.createObjectURL(blob);
    videoPreview.controls = true;
    /*const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'enregistrement.webm';
            downloadLink.click();*/
    const recording = {
      blob: blob,
      url: URL.createObjectURL(blob),
      name: `Recording ${recordings.length + 1}`,
      date: new Date().toLocaleString(),
    };

    recordings.push(recording);
    renderRecordings();
    document.getElementById("start-button").disabled = false;
    document.getElementById("stop-button").disabled = true;
  };
}
function renderRecordings() {
  const recordingsList = document.getElementById("recordings-list");
  recordingsList.innerHTML = "";

  recordings.forEach(function (recording, index) {
    const recordingItem = document.createElement("li");
    recordingItem.innerHTML = `
            <span>${recording.name}</span>
            <span>${recording.date}</span>
            <a href="${recording.url}" download="${recording.name}.webm">Télécharger</a>
            `;

    recordingsList.appendChild(recordingItem);
  });
}

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", startRecording);

const stopButton = document.getElementById("stop-button");
stopButton.addEventListener("click", stopRecording);

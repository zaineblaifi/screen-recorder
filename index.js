let mediaRecorder=null; // Déclaration de la variable mediaRecorder

function startRecording() {
  navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    .then(function (stream) {
      mediaRecorder = new MediaRecorder(stream); // Attribution à la variable globale

      const chunks = [];

      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };

      mediaRecorder.start();

      mediaRecorder.onstop = function () {
        const blob = new Blob(chunks, { type: 'video/webm' });

        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = 'enregistrement.webm';

        downloadLink.click();

        window.URL.revokeObjectURL(downloadLink.href);
      };
    })
    .catch(function (error) {
      console.error('Erreur lors de la capture de l\'écran et du son:', error);
    });
}

const startButton = document.getElementById('start-button');
if (startButton) {
  startButton.addEventListener('click', startRecording);
}

  
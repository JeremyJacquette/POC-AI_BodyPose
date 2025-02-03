let videoElement = document.getElementById('video');
let canvasElement = document.getElementById('output');
let canvas = canvasElement.getContext('2d');
let poseNet;
let poses = [];
let count = 0;
let lastCountTime = 0;

function setup() {
    // Accédez à la webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            videoElement.srcObject = stream;
            poseNet = ml5.poseNet(videoElement, modelLoaded);
            poseNet.on('pose', function(results) {
                poses = results;
                drawCanvas();
            });
        })
        .catch(function(err) {
            console.log("Erreur lors de l'accès à la webcam: " + err);
        });
}

function modelLoaded() {
    console.log('Model Loaded!');
}

function drawCanvas() {
    canvas.clearRect(0, 0, 640, 480);
    canvas.save();
    canvas.scale(-1, 1);
    canvas.translate(-640, 0);
    canvas.drawImage(videoElement, 0, 0, 640, 480);
    canvas.restore();

    if (poses.length > 0) {
        let pose = poses[0].pose;
        let keypoints = pose.keypoints;

        // Vérifiez si les points 10 et 9 sont au-dessus des points 2 et 1
        if (keypoints[10] && keypoints[9] && keypoints[2] && keypoints[1]) {
            if (keypoints[10].position.y < keypoints[2].position.y &&
                keypoints[9].position.y < keypoints[1].position.y) {
                let currentTime = Date.now();
                if (currentTime - lastCountTime > 1000) { // Délai de 1 seconde
                    count++;
                    lastCountTime = currentTime;
                    document.getElementById('count').innerText = count;
                }
            }
        }

        // Dessinez les keypoints
        for (let i = 0; i < keypoints.length; i++) {
            let x = keypoints[i].position.x;
            let y = keypoints[i].position.y;
            canvas.beginPath();
            canvas.arc(x, y, 10, 0, 2 * Math.PI);
            canvas.fillStyle = 'red';
            canvas.fill();
        }
    }
}

// Initialisez le setup
setup();
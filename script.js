const videoElement = document.getElementById("video");
const canvasElement = document.getElementById("canvas");
const canvasCtx = canvasElement.getContext("2d");
const statusText = document.getElementById("status");


// MediaPipe Hands
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});


// Hand tracking settings
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});


// Function that runs whenever MediaPipe detects a hand
hands.onResults((results) => {

    // Make canvas match video resolution
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Clear previous frame
    canvasCtx.save();
    canvasCtx.clearRect(
        0,
        0,
        canvasElement.width,
        canvasElement.height
    );


    // Draw the camera image
    canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
    );


    // Check if hands were detected
    if (results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0) {

        statusText.textContent =
            "Hand detected!";

        // Draw every detected hand
        for (const landmarks of results.multiHandLandmarks) {

            // Draw connections between hand points
            drawConnectors(
                canvasCtx,
                landmarks,
                HAND_CONNECTIONS,
                {
                    color: "#00FF00",
                    lineWidth: 4
                }
            );


            // Draw the hand landmarks
            drawLandmarks(
                canvasCtx,
                landmarks,
                {
                    color: "#FF0000",
                    lineWidth: 2,
                    radius: 5
                }
            );
        }

    } else {

        statusText.textContent =
            "No hand detected";

    }

    canvasCtx.restore();
});


// Start the webcam
const camera = new Camera(videoElement, {

    onFrame: async () => {

        await hands.send({
            image: videoElement
        });

    },

    width: 1280,
    height: 720

});


// Start camera
camera.start()
    .then(() => {
        statusText.textContent =
            "Camera started. Show your hand.";
    })
    .catch((error) => {

        console.error(error);

        statusText.textContent =
            "Unable to access camera. Please allow camera permission.";
    });

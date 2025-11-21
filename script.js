const video = document.getElementById('video');
const captureButton = document.getElementById('capture');
const canvases = [
    document.getElementById('photo1'),
    document.getElementById('photo2'),
    document.getElementById('photo3')
];

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
.then(stream => {
    video.srcObject = stream;
})
.catch(err => console.error('Error accessing camera: ', err));

let captureCount = 0;

captureButton.addEventListener('click', () => {
    if (captureCount >= 3) {
        alert('Bạn đã chụp đủ 3 ảnh!');
        return;
    }
    const canvas = canvases[captureCount];
    const context = canvas.getContext('2d');
    const videoRatio = video.videoWidth / video.videoHeight;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.width / videoRatio;

    canvas.height = canvasHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    captureCount++;
});

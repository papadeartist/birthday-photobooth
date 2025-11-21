// Typing animation
const line3 = document.getElementById('line3');
const text = line3.dataset.text;
let idx = 0;

function typing() {
    if (idx < text.length) {
        line3.innerHTML += text[idx];
        idx++;
        setTimeout(typing, 50);
    }
}
typing();

// Heart button click -> show photobooth
const heartBtn = document.getElementById('heart-btn');
const photobooth = document.querySelector('.photobooth-container');
heartBtn.addEventListener('click', () => {
    photobooth.classList.remove('hidden');
    heartBtn.disabled = true; // tránh bấm nhiều lần
});

// Photobooth camera setup
const video = document.getElementById('video');
const captureBtn = document.getElementById('capture');
const saveBtn = document.getElementById('save');
const canvases = [
    document.getElementById('photo1'),
    document.getElementById('photo2'),
    document.getElementById('photo3')
];

navigator.mediaDevices.getUserMedia({video: true, audio: false})
.then(stream => { video.srcObject = stream; })
.catch(err => console.error(err));

let captureCount = 0;

captureBtn.addEventListener('click', () => {
    if(captureCount >= 3) return alert('Bạn đã chụp đủ 3 ảnh!');
    const canvas = canvases[captureCount];
    const ctx = canvas.getContext('2d');
    const ratio = video.videoWidth / video.videoHeight;
    canvas.height = canvas.width / ratio;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    captureCount++;
});

// Save final photobooth image
saveBtn.addEventListener('click', () => {
    if(captureCount < 3) return alert('Chụp đủ 3 ảnh trước khi lưu!');
    const finalCanvas = document.createElement('canvas');
    const width = 360;
    const height = 360*3 + 60;
    finalCanvas.width = width;
    finalCanvas.height = height;
    const ctx = finalCanvas.getContext('2d');

    // Draw background
    const bg = new Image();
    bg.src = 'assets/background.jpg';
    bg.onload = () => {
        ctx.drawImage(bg,0,0,width,height);

        // Draw photos
        canvases.forEach((c,i) => {
            ctx.drawImage(c,0,i*width,width,width);
        });

        // Draw text
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#e91e63';
        ctx.textAlign = 'center';
        ctx.fillText('Birthday Babe - 23/11', width/2, height - 20);

        // Draw stickers
        const sticker1 = new Image();
        sticker1.src = 'assets/sticker1.png';
        const sticker2 = new Image();
        sticker2.src = 'assets/sticker2.png';
        sticker1.onload = () => {
            ctx.drawImage(sticker1,10,height-70,50,50);
            sticker2.onload = () => {
                ctx.drawImage(sticker2,width-60,height-70,50,50);

                // Trigger download
                const link = document.createElement('a');
                link.download = 'birthday_photobooth.png';
                link.href = finalCanvas.toDataURL();
                link.click();
            }
        }
    }
});

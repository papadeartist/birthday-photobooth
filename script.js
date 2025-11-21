// Typing animation
const line3 = document.querySelector('.line3');
const text = line3.dataset.text;
let idx = 0;
function typing() {
    if(idx < text.length) {
        line3.innerHTML += text[idx];
        idx++;
        setTimeout(typing, 50);
    }
}
typing();

// Heart button -> show photobooth
const heartBtn = document.getElementById('heart-btn');
const photobooth = document.querySelector('.photobooth-container');
heartBtn.addEventListener('click', () => {
    photobooth.classList.remove('hidden');
    heartBtn.disabled = true;
});

// Camera setup
const video = document.getElementById('video');
navigator.mediaDevices.getUserMedia({video:true, audio:false})
.then(stream => { video.srcObject = stream; })
.catch(err => console.error(err));

const captureBtn = document.getElementById('capture');
const saveBtn = document.getElementById('save');
const preview = document.getElementById('preview');
const frameImg = document.getElementById('frame');
const stickers = document.querySelectorAll('.sticker');

let photos = [];

captureBtn.addEventListener('click', () => {
    if(photos.length >= 3) return alert('Bạn đã chụp đủ 3 ảnh!');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 360;
    tempCanvas.height = 360;
    const ctx = tempCanvas.getContext('2d');
    const ratio = video.videoWidth / video.videoHeight;
    const h = tempCanvas.width / ratio;
    tempCanvas.height = h;
    ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    photos.push(tempCanvas);

    updatePreview();
});

// Preview ghép 3 ảnh vào 1 canvas
function updatePreview(){
    const ctx = preview.getContext('2d');
    const width = 360;
    const height = photos.reduce((acc,p) => acc + p.height,0);
    preview.width = width;
    preview.height = height;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,width,height);

    let y = 0;
    photos.forEach(p => {
        ctx.drawImage(p,0,y,width,p.height);
        y += p.height;
    });
}

// Lưu ảnh cuối cùng
saveBtn.addEventListener('click', () => {
    if(photos.length < 3) return alert('Chụp đủ 3 ảnh trước khi lưu!');
    const finalCanvas = document.createElement('canvas');
    const width = 360;
    const height = photos.reduce((acc,p)=>acc+p.height,0) + 100;
    finalCanvas.width = width;
    finalCanvas.height = height;
    const ctx = finalCanvas.getContext('2d');

    // Background
    const bg = new Image();
    bg.src = 'assets/background.jpg';
    bg.onload = () => {
        ctx.drawImage(bg,0,0,width,height);

        // 3 ảnh
        let y=0;
        photos.forEach(p=>{
            ctx.drawImage(p,0,y,width,p.height);
            y += p.height;
        });

        // Frame
        const frame = new Image();
        frame.src = 'assets/frame.png';
        frame.onload = () => {
            ctx.drawImage(frame,0,0,width,height);
            
            // Text
            ctx.fillStyle = '#000';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Birthday Babe - 23/11', width/2, height - 20);

            // Stickers
            let loaded = 0;
            stickers.forEach((st,i)=>{
                const img = new Image();
                img.src = st.src;
                img.onload = ()=>{
                    ctx.drawImage(img, i*60, height-70, 50,50);
                    loaded++;
                    if(loaded===stickers.length){
                        // Download
                        const link = document.createElement('a');
                        link.download = 'photobooth.png';
                        link.href = finalCanvas.toDataURL();
                        link.click();
                    }
                }
            });
        }
    }
});

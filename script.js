// 初始化 Three.js 場景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); // 設置相機位置
camera.lookAt(0, 0, 0); // 確保相機看向場景中心

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // 環境光
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 定向光
directionalLight.position.set(10, 10, 10); // 設置光源位置
scene.add(directionalLight);

// 文件上傳處理
const imageUpload = document.getElementById('imageUpload');
const convertButton = document.getElementById('convertButton');

convertButton.addEventListener('click', () => {
    if (imageUpload.files.length > 0) {
        const file = imageUpload.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                create3DModel(img);
            };
        };
        reader.readAsDataURL(file);
    }
});

// 創建 3D 模型的函數
function create3DModel(image) {
    const width = image.width;
    const height = image.height;

    // 創建 Canvas 用於解析灰階高度
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, width, height);

    // 創建幾何體
    const geometry = new THREE.PlaneGeometry(10, 10, width - 1, height - 1);

    // 設置頂點高度
    const vertices = geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        const pixelIndex = (y * width + x) * 4; // 每個像素 4 個通道 (RGBA)
        const heightValue = imageData.data[pixelIndex] / 255; // 灰階值範圍 0~1
        vertices.setZ(i, heightValue * 3); // 設置高度 (可調整倍率)
    }
    geometry.computeVertexNormals(); // 更新法線

    // 創建材質與模型
    const material = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        displacementMap: new THREE.CanvasTexture(canvas), // 使用生成的 Canvas 作為位移貼圖
        displacementScale: 3, // 調整高度
        wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2; // 調整為水平
    scene.add(mesh);
}

// 當窗口大小變動時更新渲染區域
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // 更新相機
});

// 繪製循環
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

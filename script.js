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
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // 環境光
scene.add(ambientLight);

// 加載高度圖與貼圖
const loader = new THREE.TextureLoader();
const heightmapPath = 'assets/heightmap.jpg'; // 灰階高度圖
const texturePath = 'assets/texture.jpg'; // 貼圖材質

loader.load(heightmapPath, (heightmap) => {
    loader.load(texturePath, (texture) => {
        const width = heightmap.image.width;
        const height = heightmap.image.height;

        // 創建 Canvas 用於解析灰階高度
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage(heightmap.image, 0, 0);
        const imageData = context.getImageData(0, 0, width, height);

        // 創建幾何
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
            map: texture, // 貼圖
            displacementMap: heightmap, // 使用高度圖作為位移貼圖
            displacementScale: 3, // 調整高度
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2; // 調整為水平
        scene.add(mesh);
    });
});

// 窗口調整
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// 動畫渲染循環
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

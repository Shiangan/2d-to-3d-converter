// 初始化 Three.js 場景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// 加載 GLB 模型的函數
const loader = new THREE.GLTFLoader();
document.getElementById('loadModelButton').addEventListener('click', () => {
    const input = document.getElementById('modelUpload');
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const arrayBuffer = event.target.result;
            loader.parse(arrayBuffer, '', (gltf) => {
                const model = gltf.scene;
                model.scale.set(2, 2, 2);
                scene.add(model);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

// 將高度圖轉為 3D 的函數
document.getElementById('convertButton').addEventListener('click', () => {
    const input = document.getElementById('imageUpload');
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const image = new Image();
            image.onload = function () {
                const canvas = document.createElement('canvas');
                const width = image.width;
                const height = image.height;
                canvas.width = width;
                canvas.height = height;

                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                const imageData = context.getImageData(0, 0, width, height);

                const geometry = new THREE.PlaneGeometry(10, 10, width - 1, height - 1);
                const vertices = geometry.attributes.position;
                for (let i = 0; i < vertices.count; i++) {
                    const x = i % width;
                    const y = Math.floor(i / width);
                    const pixelIndex = (y * width + x) * 4;
                    const heightValue = imageData.data[pixelIndex] / 255;
                    vertices.setZ(i, heightValue * 3);
                }
                geometry.computeVertexNormals();

                const material = new THREE.MeshStandardMaterial({ color: 0x999999 });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.rotation.x = -Math.PI / 2;
                scene.add(mesh);
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// 自適應窗口
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// 繪製循環
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
animate();

// 加載圖片並生成深度圖
async function loadImageAndGenerateDepth(imageFile) {
    const reader = new FileReader();

    // 將圖片加載為 Base64
    reader.onload = async (event) => {
        const imgSrc = event.target.result;

        // 顯示加載的圖片（測試用）
        const img = new Image();
        img.src = imgSrc;
        document.getElementById('output').appendChild(img);

        // 模擬深度圖數據（這裡需要使用 AI 模型處理）
        const depthData = await simulateDepthData(imgSrc);

        // 使用深度數據生成 3D 模型
        create3DModel(depthData);
    };

    reader.readAsDataURL(imageFile);
}

// 模擬深度數據（測試用：實際應調用 AI API 或模型）
async function simulateDepthData(imageSrc) {
    // 這裡可以使用 AI 模型生成深度圖
    // 返回模擬的深度數據陣列
    const width = 256, height = 256;
    const depthData = new Array(width * height).fill(0).map(() => Math.random());
    return { width, height, data: depthData };
}

// 創建 3D 模型
function create3DModel({ width, height, data }) {
    const container = document.getElementById('canvas-container');

    // 初始化 Three.js 場景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 創建平面幾何體
    const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);

    // 調整頂點的 Z 坐標
    for (let i = 0; i < geometry.attributes.position.count; i++) {
        const z = data[i] * 10; // 放大深度數據
        geometry.attributes.position.setZ(i, z);
    }

    geometry.computeVertexNormals();

    // 材質和網格
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff, wireframe: false });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1);
    scene.add(light);

    // 設置攝像機位置
    camera.position.z = 200;

    // 渲染循環
    function animate() {
        requestAnimationFrame(animate);
        plane.rotation.x += 0.01;
        plane.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}

// 文件選擇事件綁定
document.getElementById('convertButton').addEventListener('click', () => {
    const fileInput = document.getElementById('imageUpload');
    if (fileInput.files.length > 0) {
        loadImageAndGenerateDepth(fileInput.files[0]);
    } else {
        alert("請先上傳圖片！");
    }
});

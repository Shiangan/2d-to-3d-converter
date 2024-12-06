// 創建 Three.js 場景
const scene = new THREE.Scene();

// 創建相機 (透視攝像機)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8); // 設置相機位置

// 創建 WebGL 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); // 設置渲染器大小
renderer.outputEncoding = THREE.sRGBEncoding; // 確保顏色更真實
document.body.appendChild(renderer.domElement); // 將渲染器附加到頁面中

// 添加場景光源
const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1); // 環境光
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 定向光
directionalLight.position.set(5, 10, 7.5); // 設置光源位置
scene.add(directionalLight);

// 添加地板 (可選)
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // 平面翻轉為水平
floor.position.y = -1;
scene.add(floor);

// 加載 .glb 模型
const loader = new THREE.GLTFLoader();
loader.load(
    'path/to/your/model.glb', // 模型路徑
    (gltf) => {
        const model = gltf.scene; // 提取 3D 模型
        model.scale.set(1, 1, 1); // 調整模型大小（可根據需要修改）
        scene.add(model); // 將模型添加到場景中

        // 如果模型有動畫，啟用動畫
        const mixer = new THREE.AnimationMixer(model);
        if (gltf.animations.length > 0) {
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play(); // 播放所有動畫
            });
        }

        // 動畫循環
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate); // 下一幀動畫

            const delta = clock.getDelta(); // 計算時間間隔
            if (mixer) mixer.update(delta); // 更新動畫

            model.rotation.y += 0.01; // 模型自轉
            renderer.render(scene, camera); // 渲染場景
        }
        animate(); // 啟動動畫循環
    },
    (xhr) => {
        console.log(`模型加載進度：${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
        console.error("模型加載失敗：", error);
    }
);

// 當視窗大小改變時，重新設置相機和渲染器
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // 更新相機的投影矩陣
});

// 渲染場景（如果模型未加載，保證至少場景正常渲染）
function animateFallback() {
    requestAnimationFrame(animateFallback);
    renderer.render(scene, camera);
}
animateFallback();

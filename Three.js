// 創建 Three.js 場景
const scene = new THREE.Scene();

// 創建相機
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);  // 設置相機位置

// 創建 WebGL 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);  // 設置渲染器的大小
document.body.appendChild(renderer.domElement);  // 將渲染器附加到頁面中

// 添加光源
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 20, 0);  // 設置光源位置
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(5, 10, 7.5);  // 設置方向光位置
scene.add(directionalLight);

// 加載 .glb 模型
const loader = new THREE.GLTFLoader();
loader.load('path/to/your/model.glb', (gltf) => {
    const model = gltf.scene;  // 提取 3D 模型
    scene.add(model);  // 添加到場景中

    // 動畫循環
    function animate() {
        requestAnimationFrame(animate);  // 進行動畫重繪
        model.rotation.y += 0.01;  // 每幀旋轉模型
        renderer.render(scene, camera);  // 渲染場景
    }
    animate(); 
  // 開始動畫
}, undefined, (error) => {
    console.error("模型加載失敗：", error);
});

// 當視窗大小改變時，重新設置相機和渲染器
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();  // 更新相機的投影矩陣
});

// 動畫渲染循環
function animate() {
    requestAnimationFrame(animate);  // 下一幀動畫
    renderer.render(scene, camera);  // 渲染場景
}
animate();  // 啟動動畫循環





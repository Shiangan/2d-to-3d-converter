// 處理圖片上傳與 3D 轉換
document.getElementById('convertButton').addEventListener('click', processImage);

async function processImage() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];

    if (!file) {
        alert("請選擇一張圖片！");
        return;
    }

    // 顯示處理中的消息
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = "處理中，請稍候...";

    try {
        // 模擬的 API 請求，替換為您的服務
        const modelUrl = await convert2Dto3D(file);

        // 渲染生成的 3D 模型
        outputDiv.innerHTML = "3D 模型生成成功！";
        render3DModel(modelUrl);
    } catch (error) {
        outputDiv.innerHTML = "發生錯誤：" + error.message;
    }
}

// 模擬 API 請求（替換為您自己的 AI API 服務）
async function convert2Dto3D(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    // 替換為您的 API URL 和密鑰
    const response = await fetch("https://api.example.com/2d-to-3d", {
        method: "POST",
        headers: { 
            "Authorization": "Bearer YOUR_API_KEY"
        },
        body: formData
    });

    if (!response.ok) throw new Error("API 請求失敗");

    const result = await response.json();
    return result.model_url; // 返回模型的下載 URL，例如 .glb 文件鏈接
}

// 使用 Three.js 渲染 3D 模型
function render3DModel(modelUrl) {
    const container = document.getElementById('canvas-container');
    container.innerHTML = ""; // 清空舊的內容

    // 創建 Three.js 場景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 添加光源
    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // 加載 3D 模型
    const loader = new THREE.GLTFLoader();
    loader.load(
        modelUrl,
        (gltf) => {
            const object = gltf.scene;
            scene.add(object);

            // 設置相機位置
            camera.position.set(0, 1, 5);

            // 動畫渲染
            function animate() {
                requestAnimationFrame(animate);
                object.rotation.y += 0.01; // 模型旋轉效果
                renderer.render(scene, camera);
            }
            animate();
        },
        undefined,
        (error) => {
            console.error("加載模型時出錯：", error);
        }
    );
}

import torch
import cv2
import numpy as np
from midas.model_loader import load_model

def estimate_depth(input_image_path, output_depth_path):
    model_type = "DPT_Large"  # 模型類型
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # 載入模型
    model, transform = load_model(model_type, device)
    
    # 載入輸入圖片
    img = cv2.imread(input_image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = transform(img).unsqueeze(0).to(device)

    # 預測深度
    print("Predicting depth...")
    with torch.no_grad():
        depth = model(img).squeeze().cpu().numpy()

    # 正規化深度圖並儲存
    depth = (depth / depth.max() * 255).astype("uint8")
    cv2.imwrite(output_depth_path, depth)
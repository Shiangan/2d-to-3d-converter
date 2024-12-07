import os
from src.depth_estimation import estimate_depth
from src.point_cloud import generate_point_cloud
from src.mesh_texturing import create_textured_mesh

# 設定路徑
INPUT_IMAGE = "images/input.jpg"
DEPTH_OUTPUT = "outputs/depth_map.png"
POINT_CLOUD_OUTPUT = "outputs/point_cloud.ply"
TEXTURED_MODEL_OUTPUT = "outputs/textured_model.obj"
TEXTURE_OUTPUT = "outputs/texture.png"

# 深度估算
print("Step 1: Estimating depth...")
estimate_depth(INPUT_IMAGE, DEPTH_OUTPUT)

# 生成點雲
print("Step 2: Generating point cloud...")
generate_point_cloud(DEPTH_OUTPUT, INPUT_IMAGE, POINT_CLOUD_OUTPUT)

# 生成帶紋理的3D模型
print("Step 3: Creating textured 3D mesh...")
create_textured_mesh(POINT_CLOUD_OUTPUT, INPUT_IMAGE, TEXTURED_MODEL_OUTPUT, TEXTURE_OUTPUT)

print("Process completed! Outputs are in the 'outputs' folder.")
import numpy as np
import cv2
import open3d as o3d

def generate_point_cloud(depth_path, image_path, output_path):
    depth = cv2.imread(depth_path, cv2.IMREAD_GRAYSCALE)
    color = cv2.imread(image_path)
    h, w = depth.shape

    # 相機內參假設
    fx, fy = w / 2.0, h / 2.0
    cx, cy = w / 2.0, h / 2.0

    # 計算3D點
    points = []
    colors = []
    for y in range(h):
        for x in range(w):
            z = depth[y, x] / 255.0  # 假設深度範圍為[0,1]
            if z > 0:
                X = (x - cx) * z / fx
                Y = (y - cy) * z / fy
                points.append([X, Y, z])
                colors.append(color[y, x] / 255.0)  # 顏色歸一化

    # 儲存點雲
    points = np.array(points)
    colors = np.array(colors)
    cloud = o3d.geometry.PointCloud()
    cloud.points = o3d.utility.Vector3dVector(points)
    cloud.colors = o3d.utility.Vector3dVector(colors)
    o3d.io.write_point_cloud(output_path, cloud)
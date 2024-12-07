import open3d as o3d

def create_textured_mesh(point_cloud_path, image_path, output_mesh_path, texture_output_path):
    # 載入點雲
    pcd = o3d.io.read_point_cloud(point_cloud_path)

    # 點雲法線估算
    print("Estimating normals...")
    pcd.estimate_normals()

    # 基於點雲生成三角形網格
    print("Generating mesh...")
    mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=9)[0]

    # 精簡網格
    mesh = mesh.simplify_vertex_clustering(voxel_size=0.005)

    # 保存紋理和模型
    print("Saving textured mesh...")
    o3d.io.write_triangle_mesh(output_mesh_path, mesh)
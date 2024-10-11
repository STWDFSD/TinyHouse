import {
  StandardMaterial,
  ShadowGenerator,
  PBRMaterial,
  Texture,
  Color3,
  CubeTexture,
  PBRMetallicRoughnessMaterial,
  Scene,
} from "@babylonjs/core";
import { getShadowGenerator } from "./applyLight";

const applyTransparency = (mesh, alphaValue = 0.1) => {
  let material = mesh.material;
  if (material instanceof BABYLON.StandardMaterial) {
    if (material.diffuseTexture) {
      material.diffuseTexture.hasAlpha = true;
      material.useAlphaFromDiffuseTexture = true;
    }
    material.alpha = alphaValue;
  } else if (material instanceof BABYLON.PBRMaterial) {
    if (material.albedoTexture) {
      material.albedoTexture.hasAlpha = true;
      material.useAlphaFromAlbedoTexture = true;
    }
    material.transparencyMode =
      BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLENDANDBACKFACECULLING_TRANSPARENCYMODE;
    material.alpha = alphaValue;
  }
};

const applyTexture = (mesh, textureURL) => {
  let material = new StandardMaterial(mesh.name, mesh.getScene());
  material.diffuseTexture = new Texture(textureURL, mesh.getScene());
  mesh.material = material;
};

const applyTextureColor = (mesh, color) => {
  const material = new StandardMaterial("TVScreen", mesh.getScene());
  material.diffuseColor = color;
  mesh.material = material;
};

export default function applyMaterials(meshes, scene) {
  // Get shadow Generator
  let shadowGenerator = getShadowGenerator();

  const exteriorMetal = "/Textures/Exterior Metal/Metal Dark Gray_dif.jpg";
  const exteriorWood = "/Textures/Exterior light oak/_Light Oak.jpg";
  const exteriorDarkWood =
    "/Textures/Exterior light oak/_Light Oak_specular.jpg";

  const interiorFloorWood =
    "/Textures/Flooring Wood Pine/Flooring Wood Pine_dif.jpg";
  const interiorCeilWood =
    "/Textures/Flooring Wood Oak Light/_Wood Flooring Oak Light_dif.jpg";
  const interiorWallWood =
    "/Textures/Interior Walls/interior_walls_white_difuse.jpg";
  const interiorTolietWall =
    "/Textures/Interior Ceramic_Toilet/gray_ceramics_60x60.jpg";
  const interiorFornitureWood =
    "/Textures/Furniture Beije/Furniture_White_dif.jpg";
  const interiorAluminium =
    "/Textures/Black Aluminio/Black Alumin_specular.jpg";
  const interiorBedCushion = "/Textures/BED/Matress_dif.jpg";
  const interiorSofaCushion = "/Textures/BED/Matress_dif.jpg";

  const kitchenFaucet = "/Textures/Black Aluminio/Black Alumin_dif.jpg";
  const kitchenStone = "/Textures/Kitchen/stone.png";

  const tolietFiddle = "/Textures/Interior Ceramic_Toilet/granito_specular.jpg";

  const windowsFrame =
    "/Textures/Furniture Beije/Furniture_Laquer_Ref_original.jpg";
  const windowsFrameExtra =
    "/Textures/Black Aluminio/Black Alumin_specular.jpg";


  meshes.forEach((mesh) => {
    mesh.receiveShadows = true;

    switch (mesh.name) {
      // Make glasses to transparency
      case "janelas_primitive2":
        applyTransparency(mesh);
        break;

      // Remove unnecessary mesh
      // This mesh is an red edge around the windows
      case "janelas_primitive3":
        mesh.dispose();
        break;

      // Exteriors Extensions
      case "metal003":
        applyTexture(mesh, exteriorMetal);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "madeira003_primitive0":
        applyTexture(mesh, exteriorWood);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "madeira004_primitive0":
        applyTexture(mesh, exteriorWood);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "madeira005":
        applyTexture(mesh, exteriorWood);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      // Exterior Top
      case "cobertura deck.001":
        applyTexture(mesh, exteriorWood);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "exterior dec madeira":
        applyTexture(mesh, exteriorWood);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      // Exterior Walls
      case "madeira":
        applyTexture(mesh, exteriorWood);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "paredes exterior.001":
        applyTexture(mesh, exteriorDarkWood);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      // Exterior Bottom
      case "chao exterior":
        applyTexture(mesh, exteriorDarkWood);
        break;

      // Interior Ceil
      case "teto":
        applyTexture(mesh, interiorWallWood);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      // Interior Walls
      case "paredes interior.001":
        // const texture = new BABYLON.Texture('/Textures/Exterior light oak/_Light Oak.jpg', scene);
        // const tempMaterial = new BABYLON.StandardMaterial('material', scene)
        // tempMaterial.diffuseTexture = texture;
        // mesh.material = tempMaterial;

        const createWallMaterial = (scene) => {
          const pbr = new BABYLON.PBRMaterial("pbr", scene);

          // Set base color (albedo)
          pbr.albedoColor = new BABYLON.Color3(1.0, 1.0, 1.0); // White color

          // Set metallic and roughness properties
          pbr.metallic = 0; // Non-metallic, typical for walls
          pbr.roughness = 0;
          pbr.alpah = 0;

          pbr.clearCoat.isEnabled = true;
          pbr.clearCoat.intensity = 1.0;
          pbr.clearCoat.roughness = 0.1;

          // pbr.bumpTexture = new BABYLON.Texture("path/to/normal_map.jpg", scene);

          return pbr;
        }

        // Usage
        const wallMaterial = createWallMaterial(scene);
        mesh.material = wallMaterial;

        // mesh.material = wallMaterial;
        applyTexture(mesh, interiorWallWood);
        // mesh.material.specularColor = new Color3(0.2, 0.2, 0.2);
        break;
      // Interior Floor
      case "chao interior":
        applyTexture(mesh, interiorFloorWood);
        mesh.material.specularColor = new Color3(0.5, 0.5, 0.5);
        break;

      // Interior TV
      case "tv_primitive1":
        applyTextureColor(mesh, new Color3(0.3, 0.3, 0.3));
        break;
      case "tv_primitive0":
        applyTextureColor(mesh, new Color3(0, 0, 0));
        break;

      // Windows
      case "plainWindowProtector":
        console.log(mesh.name);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "janelas_primitive0":
        applyTexture(mesh, windowsFrame);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "frame janela":
        applyTexture(mesh, windowsFrameExtra);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "frame janelas fixo":
        applyTexture(mesh, windowsFrameExtra);
        shadowGenerator.addShadowCaster(mesh);
        break;

      // Interior Door
      case "guardas portas":
        applyTexture(mesh, interiorFornitureWood);
        break;
      case "portas correr_primitive0":
        applyTexture(mesh, interiorFornitureWood);
        break;
      case "portas correr_primitive1":
        applyTexture(mesh, windowsFrame);
        break;

      // Tables
      case "movel quarto":
        applyTexture(mesh, interiorFornitureWood);
        mesh.material.specularColor = new Color3(0.3, 0.3, 0.3);
        break;
      case "movel cozinha_primitive0":
        applyTexture(mesh, interiorFornitureWood);
        shadowGenerator.addShadowCaster(mesh);
        mesh.material.specularColor = new Color3(0.3, 0.3, 0.3);
        break;
      case "movel cozinha_primitive1":
        applyTexture(mesh, interiorAluminium);
        mesh.material.specularColor = new Color3(0.3, 0.3, 0.3);
        break;
      case "roupeiro":
        applyTexture(mesh, interiorFornitureWood);
        mesh.material.specularColor = new Color3(0.3, 0.3, 0.3);
        break;
      case "bancada":
        applyTexture(mesh, interiorFornitureWood);
        mesh.material.specularColor = new Color3(0.3, 0.3, 0.3);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "armario sala_primitive0":
        applyTexture(mesh, interiorFornitureWood);
        mesh.material.specularColor = new Color3(0.3, 0.3, 0.3);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "armario sala_primitive1":
        applyTexture(mesh, interiorAluminium);
        shadowGenerator.addShadowCaster(mesh);
        break;

      // Beds
      case "beliche_primitive0":
        applyTexture(mesh, interiorFornitureWood);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "cama_primitive0":
        applyTexture(mesh, interiorFornitureWood);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "beliche_primitive1":
        applyTexture(mesh, interiorBedCushion);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "cama_primitive1":
        applyTexture(mesh, interiorBedCushion);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "cama_primitive2":
        applyTexture(mesh, interiorBedCushion);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "cama_primitive3":
        applyTexture(mesh, interiorBedCushion);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;

      // Sofas
      case "stool 004_primitive0":
        applyTexture(mesh, interiorSofaCushion);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "stool 005_primitive0":
        applyTexture(mesh, interiorSofaCushion);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "stool 006_primitive0":
        applyTexture(mesh, interiorSofaCushion);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "chair 002_primitive0":
        applyTexture(mesh, interiorSofaCushion);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "chair 003_primitive0":
        applyTexture(mesh, interiorSofaCushion);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "sofa_primitive0":
        applyTexture(mesh, interiorSofaCushion);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "sofa_primitive1":
        applyTexture(mesh, interiorAluminium);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "chair 002_primitive1":
        applyTexture(mesh, interiorAluminium);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "chair 003_primitive1":
        applyTexture(mesh, interiorAluminium);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "stool 004_primitive1":
        applyTexture(mesh, interiorAluminium);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "stool 005_primitive1":
        applyTexture(mesh, interiorAluminium);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;
      case "stool 006_primitive1":
        applyTexture(mesh, interiorAluminium);
        mesh.material.specularColor = new Color3(0, 0, 0);
        shadowGenerator.addShadowCaster(mesh);
        break;

      // Toilet
      case "sanita_primitive0":
        applyTexture(mesh, tolietFiddle);
        break;
      case "sanita_primitive1":
        applyTexture(mesh, tolietFiddle);
        break;
      case "lavatorio_primitive0":
        applyTexture(mesh, tolietFiddle);
        break;
      case "lavatorio_primitive1":
        applyTexture(mesh, tolietFiddle);
        break;
      case "lavatorio_primitive2":
        applyTexture(mesh, interiorFornitureWood);
        break;
      case "paredes casa de banho":
        applyTexture(mesh, interiorTolietWall);
        break;

      // Kitchen
      case "bancada cozinha":
        applyTexture(mesh, kitchenStone);
        mesh.material.specularColor = new Color3(0.3, 0.3, 0.3);
        break;
      case "torneira cozinha":
        const pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);
        mesh.material = pbr;
        pbr.baseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
        pbr.metallic = 1.0;
        pbr.roughness = 0;
        pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
          "/Textures/Kitchen/cubemap222.dds",
          scene
        );
        break;
      case "frigorifico_primitive0":
        applyTexture(mesh, tolietFiddle);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "frigorifico_primitive1":
        applyTexture(mesh, interiorAluminium);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "frigorifico_primitive2":
        applyTexture(mesh, interiorAluminium);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
      case "frigorifico_primitive3":
        applyTexture(mesh, interiorAluminium);
        mesh.material.specularColor = new Color3(0, 0, 0);
        break;
    }
  });
}

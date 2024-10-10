import { Color3, MeshBuilder, StandardMaterial } from "@babylonjs/core";

export default function addGround(scene) {
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 250, height: 250 },
    scene
  );
  const groundMaterial = new StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseColor = new Color3(0.95, 0.95, 0.95);
  groundMaterial.specularColor = new Color3(0, 0, 0);
  ground.position.y = 0; // Adjust to fit your scene
  ground.material = groundMaterial;
}

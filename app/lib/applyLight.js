import {
  Color3,
  DirectionalLight,
  GlowLayer,
  HemisphericLight,
  PointLight,
  Scene,
  ShadowGenerator,
  Vector3,
  CubeTexture,
  MeshBuilder,
  StandardMaterial,
} from "@babylonjs/core";

let light;

export default function applyLight(engine, scene) {
  addDirectionalLight(scene);
  addAmbientLight(scene);
  addGlowLayer(scene);
  applyFogEffect(scene);
  applyEnvironmentTexture(scene);
  addPointLights(scene);
}

function addDirectionalLight(scene) {
  // Add a directional light to simulate sunlight
  light = new DirectionalLight("directionalLight", new Vector3(-5, -20, -20), scene);
  light.intensity = 0.8;
  light.diffuse = new Color3(0.9, 0.9, 0.9);
}

function addAmbientLight(scene) {
  // Add ambient light for general illumination
  const ambientLight = new HemisphericLight("ambientLight", new Vector3(0, 1, 0), scene);
  ambientLight.intensity = 0.3;
  ambientLight.groundColor = new Color3(1, 1, 1);
  ambientLight.diffuse = new Color3(1, 1, 1);
}

function addGlowLayer(scene) {
  // Add a glow layer for special visual effects
  const glowLayer = new GlowLayer("glow", scene);
  glowLayer.intensity = 1.0;
}

function applyFogEffect(scene) {
  // Configure fog to add depth and atmosphere
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.01;
  scene.fogColor = new Color3(0.9, 0.9, 0.85);
}

function applyEnvironmentTexture(scene) {
  // Set an environment texture for reflections and global illumination
  scene.environmentTexture = CubeTexture.CreateFromPrefilteredData("/environment.dds", scene);
}

function addPointLights(scene) {
  // Define point lights with their respective positions and properties
  const pointLights = [

    { name: 'pointLight3', position: new Vector3(3, 2.7, 0), intensity: 0.4, range: 10 },
    { name: 'pointLight4', position: new Vector3(-3, 2.7, 0), intensity: 0.4, range: 10 },
    { name: 'pointLight1', position: new Vector3(-1.6, 2.7, 0), intensity: 0.4, range: 10 },
    { name: 'pointLight2', position: new Vector3(0.6, 2.7, 1), intensity: 0.4, range: 4 },
  ];

  pointLights.forEach(lightInfo => {
    const pointLight = new PointLight(lightInfo.name, lightInfo.position, scene);
    pointLight.diffuse = new Color3(1, 1, 1);
    pointLight.specular = new Color3(1, 1, 1);
    pointLight.intensity = lightInfo.intensity;
    pointLight.range = lightInfo.range;

    // Create a small sphere to visually represent the light position
    const lightSphere = MeshBuilder.CreateSphere(`${lightInfo.name}Sphere`, { diameter: 0.1 }, scene);
    lightSphere.position = lightInfo.position.clone();

    // Assign a standard material to the sphere
    const material = new StandardMaterial(`${lightInfo.name}Material`, scene);
    material.emissiveColor = new Color3(1, 1, 0); // Yellow to simulate light glow
    lightSphere.material = material;
  });
}

export function getShadowGenerator() {
  // Create and configure a shadow generator
  const shadowGenerator = new ShadowGenerator(4096, light);
  shadowGenerator.bias = 0.000003;
  shadowGenerator.setDarkness(0.5);
  shadowGenerator.usePercentageCloserFiltering = true;
  return shadowGenerator;
}
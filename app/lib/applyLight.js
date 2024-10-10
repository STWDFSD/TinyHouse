import {
  Color3,
  DirectionalLight,
  GlowLayer,
  HemisphericLight,
  PointLight,
  SpotLight,
  Scene,
  ShadowGenerator,
  Vector3,
  CubeTexture,
} from "@babylonjs/core";

let light;

export default function applyLight(engine, scene) {
  // Add sunlight
  light = new DirectionalLight(
    "directionalLight",
    new Vector3(-5, -20, -20),
    scene
  );
  light.intensity = 0.8;
  light.diffuse = new Color3(0.9, 0.9, 0.9); // white

  // Add ambientLight in the living room
  const ambientLight = new HemisphericLight(
    "ambientLight",
    new Vector3(0, 1, 0),
    scene
  );
  ambientLight.intensity = 0.3;
  ambientLight.groundColor = new Color3(1, 1, 1);
  ambientLight.diffuse = new Color3(1, 1, 1);

  // GlowLayer
  const gl = new GlowLayer("glow", scene);
  gl.intensity = 1.0; // Adjust the intensity as needed

  // Fog Effect
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.01; // Decrease or increase depending upon scene size
  scene.fogColor = new Color3(0.9, 0.9, 0.85);

  // Add environment texture for global illumination
  scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
    "/environment.dds",
    scene
  );

  // Add interior spotlights
  const spotLight1 = new SpotLight(
    "spotLight1",
    new Vector3(-7, -3, -10),
    new Vector3(0, 0, 0),
    Math.PI / 100,
    2,
    scene
  );
  spotLight1.intensity = 1;
  spotLight1.diffuse = new Color3(1, 0, 0);

  const pointLight = new PointLight('pointLight', new Vector3(-7, -3, -10), scene);

  // Set the light color
  pointLight.diffuse = new Color3(1, 1, 1); // Red color
  pointLight.specular = new Color3(1, 1, 1); // White specular light
  pointLight.intensity = 0.3;
}

export function getShadowGenerator() {
  let shadowGenerator = new ShadowGenerator(4096, light);
  shadowGenerator.bias = 0.000003;
  shadowGenerator.setDarkness(0.5);
  shadowGenerator.usePercentageCloserFiltering = true;
  return shadowGenerator;
}

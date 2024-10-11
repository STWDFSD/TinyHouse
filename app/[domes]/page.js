"use client";

import Configurator from "../components/Configurator";
import applyMaterials from "../lib/applyMaterials";
import applyLight from "../lib/applyLight";
import addGround from "../lib/addGround";
import { test } from "../lib/test";
import "babylonjs-loaders";
import {
  ArcRotateCamera,
  UniversalCamera,
  Vector3,
  Color3,
  Texture,
  CubeTexture,
  StandardMaterial,
  Mesh,
  MeshBuilder,
  SceneLoader,
  PBRMaterial,
  Scene,
  Animation,
  ParticleSystem,
  GlowLayer,
} from "@babylonjs/core";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

let outsideCamera;
let livingRoomCamera;
let currentCamera;
let scene;
let engine;
let canvas;
let global_meshes;


function onSceneReady(sceneReady) {
  // Get canvas from scene.
  scene = sceneReady;
  engine = scene.getEngine();
  canvas = scene.getEngine().getRenderingCanvas();

  // Outside camera
  outsideCamera = new ArcRotateCamera(
    "ArcRotateCamera",
    Math.PI / 4,
    (Math.PI * 2) / 5,
    18,
    Vector3.Zero(),
    scene
  );
  outsideCamera.attachControl(canvas, true);
  outsideCamera.target = Vector3.Zero();
  outsideCamera.lowerRadiusLimit = 10;
  outsideCamera.upperRadiusLimit = 100;
  outsideCamera.lowerBetaLimit = Math.PI / 6;
  outsideCamera.upperBetaLimit = Math.PI / 2.1;

  // Living Room Camera
  livingRoomCamera = new BABYLON.UniversalCamera(
    "LivingRoomCamera",
    new BABYLON.Vector3(0, 2, 0),
    scene
  );
  livingRoomCamera.setTarget(new BABYLON.Vector3(-7, -3, -10));
  livingRoomCamera.attachControl(canvas, true);
  livingRoomCamera.minZ = 0.1;
  livingRoomCamera.fov = BABYLON.Tools.ToRadians(60);
  // livingRoomCamera.inputs.removeByType("FreeCameraKeyboardMoveInput");
  // livingRoomCamera.inputs.removeByType("FreeCameraMouseInput");
  livingRoomCamera.attachControl(canvas, true);
  livingRoomCamera.speed = 0.05;
  livingRoomCamera.inertia = 0.9;

  livingRoomCamera.keysUp.push(87); // W key
  livingRoomCamera.keysDown.push(83); // S key
  livingRoomCamera.keysLeft.push(65); // A key
  livingRoomCamera.keysRight.push(68); // D key



  const mouseInput = new BABYLON.FreeCameraMouseInput();
  mouseInput.buttons = [0];
  mouseInput._onMouseUp = function (evt) {
    if (!this.previousPosition && !this._isMouseDown) {
      return;
    }
    this.previousPosition = null;
    this._isMouseDown = false;
  };
  livingRoomCamera.inputs.add(mouseInput);

  // Add ground
  addGround(scene);

  // Add lights
  applyLight(engine, scene);

  // And Skydome
  const skydome = BABYLON.Mesh.CreateSphere("skyDome", 32, 1000, scene);
  const skydomeMaterial = new BABYLON.StandardMaterial("skyDome", scene);
  skydomeMaterial.backFaceCulling = false;
  skydomeMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skydomeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skydome.material = skydomeMaterial;

  // Load models
  BABYLON.SceneLoader.ImportMesh(
    "",
    "/",
    "final-house-03.glb",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups, cameras) {
      global_meshes = meshes;
      applyMaterials(meshes, scene);
    }
  );

  // For Test
  test(scene, engine);
}

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => { };

async function cameraViewChanger(cameraMode) {
  if (scene.activeCamera !== livingRoomCamera && cameraMode === "Living Room") {
    scene.activeCamera.detachControl(canvas);
    livingRoomCamera.setTarget(new BABYLON.Vector3(-7, -3, -10));
    scene.activeCamera = livingRoomCamera;
    scene.activeCamera.attachControl(canvas, true);
  } else if (scene.activeCamera !== outsideCamera && cameraMode === "Outside") {
    scene.activeCamera.detachControl(canvas);
    outsideCamera.alpha = Math.PI / 3;
    outsideCamera.beta = (Math.PI * 2) / 5;
    outsideCamera.radius = 18;
    scene.activeCamera = outsideCamera;
    scene.activeCamera.attachControl(canvas, true);
  }
}

function onClickExteriorWindowsFrameColorChange(color) {
  global_meshes.forEach((mesh) => {
    if (
      mesh.name === "janelas_primitive0" ||
      mesh.name === "frame janela" ||
      mesh.name === "frame janelas fixo"
    ) {
      if (color === "red") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          244 / 255,
          101 / 255,
          101 / 255
        );
      } else if (color === "yellow") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          236 / 255,
          201 / 255,
          75 / 255
        );
      } else if (color === "cyan") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          6 / 255,
          182 / 255,
          212 / 255
        );
      } else if (color === "blue") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          66 / 255,
          153 / 255,
          255 / 255
        );
      } else if (color === "green") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          72 / 255,
          187 / 255,
          120 / 255
        );
      } else if (color === "orange") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          249 / 255,
          115 / 255,
          22 / 255
        );
      }
    }
  });
}

function onClickInteriorWallsColorChange(color) {
  global_meshes.forEach((mesh) => {
    if (mesh.name === "paredes interior.001" || mesh.name === "teto") {
      if (color === "red") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          254 / 255,
          101 / 255,
          101 / 255
        );
      } else if (color === "yellow") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          236 / 255,
          201 / 255,
          75 / 255
        );
      } else if (color === "cyan") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          6 / 255,
          182 / 255,
          212 / 255
        );
      } else if (color === "blue") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          66 / 255,
          153 / 255,
          255 / 255
        );
      } else if (color === "green") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          72 / 255,
          187 / 255,
          120 / 255
        );
      } else if (color === "orange") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          249 / 255,
          115 / 255,
          22 / 255
        );
      }
    }
  });
}

function onClickSofaColorChange(color) {
  global_meshes.forEach((mesh) => {
    if (mesh.name === "sofa_primitive0" || mesh.name === "sofa_primitive1") {
      if (color === "red") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          244 / 255,
          101 / 255,
          101 / 255
        );
      } else if (color === "yellow") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          236 / 255,
          201 / 255,
          75 / 255
        );
      } else if (color === "cyan") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          6 / 255,
          182 / 255,
          212 / 255
        );
      } else if (color === "blue") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          66 / 255,
          153 / 255,
          255 / 255
        );
      } else if (color === "green") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          72 / 255,
          187 / 255,
          120 / 255
        );
      } else if (color === "orange") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          249 / 255,
          115 / 255,
          22 / 255
        );
      }
    }
  });
}

function onClickTVScreenChange(color) {
  global_meshes.forEach((mesh) => {
    if (mesh.name === "tv_primitive1") {
      if (color === "red") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          244 / 255,
          101 / 255,
          101 / 255
        );
      } else if (color === "yellow") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          236 / 255,
          201 / 255,
          75 / 255
        );
      } else if (color === "cyan") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          6 / 255,
          182 / 255,
          212 / 255
        );
      } else if (color === "blue") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          66 / 255,
          153 / 255,
          255 / 255
        );
      } else if (color === "green") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          72 / 255,
          187 / 255,
          120 / 255
        );
      } else if (color === "orange") {
        mesh.material.diffuseColor = new BABYLON.Color3(
          249 / 255,
          115 / 255,
          22 / 255
        );
      }
    }
  });
}

function toggleShowingChairs(chairNum) {
  global_meshes.forEach((mesh) => {
    if (
      chairNum === 1 &&
      (mesh.name === "stool 004_primitive0" ||
        mesh.name === "stool 004_primitive1")
    ) {
      mesh.isVisible = !mesh.isVisible;
    } else if (
      chairNum === 2 &&
      (mesh.name === "stool 005_primitive0" ||
        mesh.name === "stool 005_primitive1")
    ) {
      mesh.isVisible = !mesh.isVisible;
    } else if (
      chairNum === 3 &&
      (mesh.name === "stool 006_primitive0" ||
        mesh.name === "stool 006_primitive1")
    ) {
      mesh.isVisible = !mesh.isVisible;
    }
  });
}

export default function Dome({ params }) {
  const router = useRouter();

  // Windows, Interior Walls, Sofas, and TV
  let [selectedMenuItems, setSelectedMenuItems] = useState([
    true,
    false,
    false,
    false,
  ]);

  let [windowsColor, setWindowsColor] = useState("");
  let [interiorWallsColor, setInteriorWallsColor] = useState("");
  let [sofaColor, setSofaColor] = useState("");
  let [TVScreenColor, setTVScreenColor] = useState("");

  return (
    <div className="flex flex-col h-screen">
      {/* The Canvas Area */}
      <div className="relative w-full h-1 grow">
        {/* Configurator canvas */}
        <Configurator
          antialias={true}
          onSceneReady={onSceneReady}
          onRender={onRender}
          id="house_configurator"
          className="w-full h-full"
        />
        <div className="absolute top-0 left-0 flex flex-wrap justify-between w-full px-4 pt-2 text-white">
          {/* Top left cornor */}
          <div className="text-3xl font-medium text-white">{`Domes / ${params.domes}`}</div>
          {/* Top right cornor */}
          <div
            className="text-3xl font-medium text-white hover:cursor-pointer hover:text-blue-200"
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-none p-2 space-y-2 overflow-auto h-72 md:h-52">
        {/* Menu Items */}
        <div className="basis-1/2 sm:flex sm:justify-center sm:items-center">
          <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:justify-between sm:w-full md:w-1/2 xl:w-1/3">
            <div>
              <div
                onClick={() => {
                  setSelectedMenuItems([true, false, false, false]);
                  cameraViewChanger("Outside");
                }}
                className={`p-1 ${selectedMenuItems[0]
                  ? "sm:border-b-2 bg-blue-600"
                  : "bg-blue-400 hover:bg-blue-500 hover:sm:border-b-2"
                  } text-center sm:bg-white sm:rounded-none sm:hover:text-black border-green-600 sm:hover:bg-white sm:focus:bg-white sm:text-gray-600 sm:shadow-none rounded shadow active:bg-blue-600 hover:cursor-pointer text-white font-semibold`}
              >
                Windows
              </div>
            </div>
            <div>
              <div
                onClick={() => {
                  setSelectedMenuItems([false, true, false, false]);
                  cameraViewChanger("Living Room");
                }}
                className={`p-1 ${selectedMenuItems[1]
                  ? "sm:border-b-2 bg-blue-600"
                  : "bg-blue-400 hover:bg-blue-500 hover:sm:border-b-2"
                  } text-center sm:bg-white sm:rounded-none sm:hover:text-black border-green-600 sm:hover:bg-white sm:focus:bg-white sm:text-gray-600 sm:shadow-none rounded shadow active:bg-blue-600 hover:cursor-pointer text-white font-semibold`}
              >
                Interrior Walls
              </div>
            </div>
            <div>
              <div
                onClick={() => {
                  setSelectedMenuItems([false, false, true, false]);
                  cameraViewChanger("Living Room");
                }}
                className={`p-1 ${selectedMenuItems[2]
                  ? "sm:border-b-2 bg-blue-600"
                  : "bg-blue-400 hover:bg-blue-500 hover:sm:border-b-2"
                  } text-center sm:bg-white sm:rounded-none sm:hover:text-black border-green-600 sm:hover:bg-white sm:focus:bg-white sm:text-gray-600 sm:shadow-none rounded shadow active:bg-blue-600 hover:cursor-pointer text-white font-semibold`}
              >
                Sofa
              </div>
            </div>
            <div>
              <div
                onClick={() => {
                  setSelectedMenuItems([false, false, false, true]);
                  cameraViewChanger("Living Room");
                }}
                className={`p-1 ${selectedMenuItems[3]
                  ? "sm:border-b-2 bg-blue-600"
                  : "bg-blue-400 hover:bg-blue-500 hover:sm:border-b-2"
                  } text-center sm:bg-white sm:rounded-none sm:hover:text-black border-green-600 sm:hover:bg-white sm:focus:bg-white sm:text-gray-600 sm:shadow-none rounded shadow active:bg-blue-600 hover:cursor-pointer text-white font-semibold`}
              >
                TV Screen
              </div>
            </div>
          </div>
        </div>

        {/* Menu Details */}
        <div className="flex items-center basis-1/2 sm:items-start md:flex md:justify-center">
          {/* Because these following six utilites are used dynamically
          to render the color options for the geometries, those must be
          compiled forcely in this way. */}
          <div hidden>
            <div className="bg-blue-500"></div>
            <div className="bg-orange-500"></div>
            <div className="bg-red-500"></div>
            <div className="bg-cyan-500"></div>
            <div className="bg-green-500"></div>
            <div className="bg-yellow-500"></div>
          </div>

          {/* Windows */}
          {selectedMenuItems[0] && (
            <div className="flex flex-wrap justify-between w-full gap-2 md:w-1/2 lg:w-1/3">
              {["blue", "orange", "red", "cyan", "green", "yellow"].map(
                (color) => (
                  <div
                    onClick={() => {
                      setWindowsColor(color);
                      onClickExteriorWindowsFrameColorChange(color);
                    }}
                    className={`w-12 h-12 rounded-lg shadow-lg hover:cursor-pointer bg-${color}-500 outline-3 ${windowsColor === color ? "outline" : "hover:outline"
                      } outline-offset-2 outline-green-500`}
                  ></div>
                )
              )}
            </div>
          )}

          {/* Interior Walls */}
          {selectedMenuItems[1] && (
            <div className="flex flex-wrap justify-between w-full gap-2 md:w-1/2 lg:w-1/3">
              {["blue", "orange", "red", "cyan", "green", "yellow"].map(
                (color) => (
                  <div
                    onClick={() => {
                      setInteriorWallsColor(color);
                      onClickInteriorWallsColorChange(color);
                    }}
                    className={`w-12 h-12 rounded-lg shadow-lg hover:cursor-pointer bg-${color}-500 outline-3 ${interiorWallsColor === color ? "outline" : "hover:outline"
                      } outline-offset-2 outline-green-500`}
                  ></div>
                )
              )}
            </div>
          )}

          {/* Sofa */}
          {selectedMenuItems[2] && (
            <div className="flex flex-wrap justify-between w-full gap-2 md:w-1/2 lg:w-1/3">
              {["blue", "orange", "red", "cyan", "green", "yellow"].map(
                (color) => (
                  <div
                    onClick={() => {
                      setSofaColor(color);
                      onClickSofaColorChange(color);
                    }}
                    className={`w-12 h-12 rounded-lg shadow-lg hover:cursor-pointer bg-${color}-500 outline-3 ${sofaColor === color ? "outline" : "hover:outline"
                      } outline-offset-2 outline-green-500`}
                  ></div>
                )
              )}
            </div>
          )}

          {/* TV Screen */}
          {selectedMenuItems[3] && (
            <div className="flex flex-wrap justify-between w-full gap-2 md:w-1/2 lg:w-1/3">
              {["blue", "orange", "red", "cyan", "green", "yellow"].map(
                (color) => (
                  <div
                    onClick={() => {
                      setTVScreenColor(color);
                      onClickTVScreenChange(color);
                    }}
                    className={`w-12 h-12 rounded-lg shadow-lg hover:cursor-pointer bg-${color}-500 outline-3 ${TVScreenColor === color ? "outline" : "hover:outline"
                      } outline-offset-2 outline-green-500`}
                  ></div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

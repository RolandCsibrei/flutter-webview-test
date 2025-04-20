import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Scene } from "@babylonjs/core/scene";
import { Tools } from "@babylonjs/core/Misc/tools";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
// import { LoadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Ground } from "./ground";
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui";

export default class MainScene {
  private camera: ArcRotateCamera;

  constructor(
    private scene: Scene,
    private canvas: HTMLCanvasElement,
    private engine: Engine | WebGPUEngine
  ) {
    this._setCamera(scene);
    this._setLight(scene);
    //  this._setEnvironment(scene);
    this.loadComponents();
  }

  _setCamera(scene: Scene): void {
    this.camera = new ArcRotateCamera(
      "camera",
      Tools.ToRadians(90),
      Tools.ToRadians(80),
      20,
      Vector3.Zero(),
      scene
    );
    this.camera.attachControl(this.canvas, true);
    this.camera.setTarget(Vector3.Zero());

    const btn = document.createElement("button");
    btn.innerText = "Click me";
    btn.style.position = "absolute";
    btn.style.top = "10px";
    btn.style.left = "10px";
    btn.style.zIndex = "1000"; // Ensure the button is on top of other elements
    btn.style.backgroundColor = "blue";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.padding = "10px 20px";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.onclick = () => {
      window.location.reload();
    };
    document.body.appendChild(btn);

    (window as any).handleFlutterPointerMove = function (data: any) {
      const event = new CustomEvent("flutterPointerMove", { detail: data });
      window.dispatchEvent(event);
    };

    // Example: Listen to the event
    window.addEventListener("flutterPointerMove", (e: any) => {
      const { x, y } = e.detail;
      console.log("Pointer moved to:", x, y);

      const event = new PointerEvent("pointermove", {
        bubbles: true,
        clientX: x,
        clientY: y,
        pointerId: 1,
        pointerType: "pointer",
      });

      // Dispatch on the element of your choice — here it's the body
      document.elementFromPoint(x, y)?.dispatchEvent(event);
      // Do something, e.g., move a div, trigger animation, etc.
    });
  }

  _setLight(scene: Scene): void {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.5;
  }

  _setEnvironment(scene: Scene) {
    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });
  }

  _setPipeLine(): void {
    const pipeline = new DefaultRenderingPipeline(
      "default-pipeline",
      false,
      this.scene,
      [this.scene.activeCamera!]
    );
    pipeline.fxaaEnabled = true;
    pipeline.samples = 4;
  }

  async loadComponents(): Promise<void> {
    // Load your files in order
    new Ground(this.scene);
  }
}

import * as THREE from "three";

import { useEffect, useRef } from "react";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import bg from "../assets/images/WorldBackgrorund.jpg"
import worldmap from "../assets/lowpoly/World Map.glb"

// import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"

const Explore = () => {

  const divContainer = useRef<HTMLDivElement>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const controls = useRef<OrbitControls |null>(null);

  const mouse = useRef<THREE.Vector2>(null);
  const raycaster = useRef<THREE.Raycaster | null>(null);
  const outlinePassRef = useRef<OutlinePass | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const effectFXAARef = useRef<ShaderPass | null>(null);

  /** 객체 이동 */
  const OnPointerMove = (event:PointerEvent) => {
    if (event.isPrimary === false) return;

    console.log(event)
    console.log(mouse.current!.x)
    // mouse.current!.x = (event.clientX / window.innerWidth) * 2 - 1;
    // mouse.current!.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // CheckIntersection();
  }

  /** 카메라 따라가기 */
  const CheckIntersection = () => {
    raycaster.current!.setFromCamera(mouse.current!, camera.current!)

    const interescts = raycaster.current?.intersectObject(scene.current!, true);
    if (interescts!.length > 0) {
      const selectedObject = interescts![0].object;
      outlinePassRef.current!.selectedObjects = [ selectedObject ];
    } else {
      outlinePassRef.current!.selectedObjects = [];
    }
  }

  /**  */
  const SetupPostProcess = () => {
    const composer = new EffectComposer(renderer.current!);

    const renderPass = new RenderPass(scene.current!, camera.current!);
    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene.current!, camera.current!);
    composer.addPass(outlinePass);

    const effetFXAA = new ShaderPass(FXAAShader);
    effetFXAA.uniforms["resolution"].value.set(1/window.innerWidth, 1/window.innerHeight);
    composer.addPass(effetFXAA);

    outlinePassRef.current = outlinePass;
    composerRef.current = composer;
    effectFXAARef.current = effetFXAA;

  }

  // /** */
  // const SetupGUI = () => {
  //   const params = {
  //     edgeStrength: 3.0,
  //     edgeGlow: 0.0,
  //     edgeThickness: 1.0,
  //     pulsePeriod: 0,
  //     rotate: false,
  //     usePatternTexture: false,
  //     visibleEdgeColor: "#ffffff",
  //     hiddenEdgeColor: "#190a05"
  //   };
  //   const gui = new GUI({ width:300 });

  //   gui.add(params, "edgeStrength", 0.01, 10).onChange((value:any) => {
  //       outlinePassRef.current!.edgeStrength = Number(value);
  //   });

  //   gui.add(params, "edgeGlow", 0.0, 1).onChange((value:any) => {
  //       outlinePassRef.current!.edgeGlow = Number(value);
  //   });

  //   gui.add(params, "edgeThickness", 1, 4).onChange((value:any) => {
  //       outlinePassRef.current!.edgeThickness = Number(value);
  //   });

  //   gui.add(params, "pulsePeriod", 0.0, 5).onChange((value:any) => {
  //       outlinePassRef.current!.pulsePeriod = Number(value);
  //   });

  //   gui.add(params, "rotate");

  //   gui.add(params, "usePatternTexture").onChange((value:any) => {
  //       outlinePassRef.current!.usePatternTexture = value;
  //   })

  //   gui.addColor(params, "visibleEdgeColor").onChange((value:any) => {
  //       outlinePassRef.current!.visibleEdgeColor.set(value);
  //   });

  //   gui.addColor(params, "hiddenEdgeColor").onChange((value:any) => {
  //       outlinePassRef.current!.hiddenEdgeColor.set(value);
  //   });
  // }

  /** 카메라 적정 위치 구하는 함수 */
  const ZoomFit = (object3D:any, camera:THREE.PerspectiveCamera) => {
    // 모델 경계 박스
    const box = new THREE.Box3().setFromObject(object3D);

    // 모델 경계 박스 대각 길이
    const sizeBox = box.getSize(new THREE.Vector3()).length();

    // 모델의 경계 박스 중심 위치
    const centerBox = box.getCenter(new THREE.Vector3());

    // 모델 크기의 절반값
    const halfSizeModel = sizeBox * 0.5;

    // 카메라의 fov의 절반값
    const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);

    // 모델을 화면에 꽉 채우기 위한 적당한 거리
    const distance = halfSizeModel / Math.tan(halfFov);

    // 모델 중심에서 카메라 위치로 향하는 방향 단위 벡터 계산
    const direction = (new THREE.Vector3()).subVectors(
      camera.position,
      centerBox
    ).normalize();

    // "단위 방향 벡터" 방향으로 모델 중심 위치에서 distance 거리에 대한 위치
    const position = direction.multiplyScalar(distance).add(centerBox);
    camera.position.copy(position);

    // 모델의 크기에 맞게 카메라의 near, far 값을 대략적으로 조정
    camera.near = sizeBox / 100;
    camera.far = sizeBox * 100;

    // 카메라 기본 속성 변경에 따른 투영행렬 업데이트
    camera.updateProjectionMatrix();

    // 카메라가 모델의 중심을 바라 보도록 함
    camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
  }

   /** 배경함수 */
   const Background = () => {

     //2. 이미지를 배경으로 (방법 여러개지만, 여기서는 Texture 이용)
     const loader = new THREE.TextureLoader();

     loader.load(bg, texture => {
         scene.current!.background = texture;
         
         // SetupModel이 없는 상태에서 background를 받으려니 문제 생김!
         // => Backround를 호출할 때, 모델을 호출해주자
         SetupModel();
     })
  } 

  /** 카메라 커스텀 함수 */
  const SetupCamera = () => {
    // const width = divContainer.current?.clientWidth || 0;
    // const height = divContainer.current?.clientHeight || 0;
    const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 30000);
    // cam.position.z = 1;
    // cam.position.set(1000, 10000, 10000);      // 카메라의 위치는 7, 7, 0
    cam.position.set(0, 13000, 10000);      // 카메라의 위치는 7, 7, 0
    cam.rotation.set(0, 0, 0);
    cam.lookAt(0, 0, 0);          // 카메라가 바라보는 곳이 0, 0, 0
    
    camera.current = cam;

    scene.current?.add(cam)
  };

  /** 모델 커스텀 함수 */
  const SetupModel = () => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      worldmap,
      (glb) => {
        const root = glb.scene;
        scene.current?.add(root)

        // if (camera.current) {
        //   ZoomFit(root, camera.current)
        // }
      }
    )

    // 대륙을 클릭하기 위한 객체 생성        
    const targetPivot = new THREE.Object3D();
    const target = new THREE.Object3D();  // Mesh 대신에 Object3D이므로 화면상에 보이지는 않음
    targetPivot.add(target);
    targetPivot.name = "targetPivot";
    target.position.set(3, 0.5, 0);
    scene.current?.add(targetPivot);
  };

  /** 조명 커스텀 함수 */
  const SetupLight = () => {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    // light.position.set(-1, 2, 4);

    light.position.set(0, 5, 0);
    light.target.position.set(0, 0, 0);
    scene.current?.add(light.target);    // 조명의 위치와 조명이 가리키는 방향을 알려줌

    // scene.current?.add(light);
    // 카메라에 조명을 달았음
    camera.current?.add(light)
  };

  /** 마우스 그래그로 회전시킴 */
  const SetupControls = () => {
    if (camera.current) {
      controls.current = new OrbitControls(camera.current, divContainer.current!); // OrbitControls를 초기화합니다.
      controls.current.target.set(0, 5000, 4000)    // 카메라 회전점
      controls.current.enableDamping = true;        // 부드럽게 돌아가
      controls.current.minPolarAngle = THREE.MathUtils.degToRad(0);   // 0도 부터
      controls.current.maxPolarAngle = THREE.MathUtils.degToRad(60);  // 60도 까지 회전 가능
    }
  }

  const Update = (time: number) => {
    time *= 0.01;
    // cube.current!.rotation.x = time;
    // cube.current!.rotation.y = time;
  };

  /** 렌더링 될 때마다 사이즈 초기화 */
  const Resize = () => {
    const width = divContainer.current?.clientWidth || 0;
    const height = divContainer.current?.clientHeight || 0;

    if (camera.current !== null) {
      camera.current.aspect = width / height;
      camera.current.updateProjectionMatrix();
    }
    renderer.current?.setSize(width, height);
  };

  const Render = (time: number) => {
    renderer.current?.render(scene.current!, camera.current!);
    Update(time);
    requestAnimationFrame(Render);
  };

  useEffect(() => {
    if (divContainer.current) {

      const ren = new THREE.WebGLRenderer({ antialias: true });
      ren.setPixelRatio(window.devicePixelRatio);

      ren.shadowMap.enabled = true;
      ren.domElement.style.touchAction = "none";
      divContainer.current.appendChild(ren.domElement);

      
      renderer.current = ren;

      const scn = new THREE.Scene();
      scene.current = scn;

      window.addEventListener("resize", Resize);
      divContainer.current.addEventListener("pointermove", OnPointerMove, false);

      SetupCamera();
      // SetupGUI();
      SetupControls();
      SetupLight();
      SetupModel();
      Background();
      SetupPostProcess();
      
      window.onresize = Resize;
      Resize();

      requestAnimationFrame(Render);
    }
  }, []);

  return(
  <div
    style={{ backgroundColor: 'grey', width: '100%', height: 1000 }}
    ref={divContainer} 
  />
  )
};

export default Explore;
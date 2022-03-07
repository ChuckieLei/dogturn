import * as THREE from "../../../build/three.module.js";
import {OrbitControls} from "../../../jsm/controls/OrbitControls.js";
import {cache} from "./Cache.js";
import Utils from "./Utils.js";
import EventManager from "./EventManager.js";

export default class Stage extends THREE.EventDispatcher {
    constructor({ container, production = true }) {
        var _a;
        super();
        this.stats = null;
        this.cache = cache;
        this.prod = production;
        this.size = { width: window.innerWidth, height: window.innerHeight };
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        this.camera;
        this.controls;
        this.frustumSize = 2;
        this.orthoCamera;
        this.activeCamera;
        this.isFixedCamera = false;
        this.mouse = new THREE.Vector2();
        this.mouse2d = new THREE.Vector2();
        this.cameraRange = 0.03;
        this.cameraBasePos = new THREE.Vector3();
        this.cameraTarget = new THREE.Vector3();
        this.events = new EventManager();
        if (container)
            this._init(container);
        this.grid = new THREE.Group();
        this.add(this.grid);
        this._addEvent();
        this.update();
        if (!this.prod) {
            this.grid.show();
            this.controls.enabled = true;
        }
    }
    render() {
        if (this.renderer)
            this.renderer.render(this.scene, this.activeCamera);
    }
    add(obj) {
        this.scene.add(obj);
    }
    remove(obj) {
        this.scene.remove(obj);
    }
    update() {
        if (this.stats) {
            this.stats.update();
        }
        if (this.prod)
            this._updateCameraPos();
        this.render();
    }
    fixCamera() {
        this.isFixedCamera = true;
    }
    unFixCamera() {
        this.isFixedCamera = false;
    }
    //更新相机位置
    _updateCameraPos() {
        if (this.isFixedCamera)
            return;
        const pos = this.camera.position;
        pos.x = pos.x + 0.2 * (this.cameraTarget.x - pos.x);
        pos.y = pos.y + 0.2 * (this.cameraTarget.y - pos.y);
    }
    //场景初始化
    _init(container) {
        this.scene.fog = new THREE.Fog(0x000000, 0, 100);           //添加雾的效果
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
        this.camera.position.set(0, 0, 2);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = false;
        const aspect = this.size.width / this.size.height;
        this.frustumSize = 2;
        this.orthoCamera = new THREE.OrthographicCamera((this.frustumSize * aspect) / -2, (this.frustumSize * aspect) / 2, this.frustumSize / 2, this.frustumSize / -2, 0, 100);
        this.activeCamera = this.camera;
        container.appendChild(this.renderer.domElement);
        this.setMousePosition(this.size.width / 2, this.size.height / 2);
        if (this.prod) {
            this.controls.enabled = false;
        }
    }
    //设置鼠标位置
    setMousePosition(x, y) {
        this.mouse.set((x / this.size.width) * 2 - 1, -(y / this.size.height) * 2 + 1);
        this.mouse2d.set(x, y);
    }
    fixCameraBasePos() {
        this.cameraBasePos.copy(this.camera.position);
        this.setCameraTarget(this.cameraBasePos);
    }
    setCameraTarget(basePos) {
        this.cameraTarget.x = Utils.map(this.mouse2d.x, 0, this.size.width, basePos.x - this.cameraRange, basePos.x + this.cameraRange);
        this.cameraTarget.y = Utils.map(this.mouse2d.y, 0, this.size.height, basePos.y + this.cameraRange, basePos.y - this.cameraRange);
    }
    _addEvent() {
        if (!this.renderer)
            return;
        if (this.renderer.domElement)
            this.events.init(this.renderer.domElement);
        this.events.addEventListener('resize', this._resize.bind(this));
        this.events.addEventListener('orientationchange', this._onOrientationChange.bind(this));
        this.events.addEventListener('mousemove', this._onMouseMove.bind(this));
        this.events.addEventListener('click', this._onClick.bind(this));
        this.events.addEventListener('touchstart', this._onTouchStart.bind(this));
        this.events.addEventListener('touchend', this._onTouchEnd.bind(this));
        this.events.addEventListener('touchmove', this._onTouchMove.bind(this));
    }
    _resize() {
        this.size.width = window.innerWidth;
        this.size.height = window.innerHeight;
        const aspect = this.size.width / this.size.height;
        if (this.activeCamera === this.orthoCamera) {
            this.orthoCamera.left = (-this.frustumSize * aspect) / 2;
            this.orthoCamera.right = (this.frustumSize * aspect) / 2;
            this.orthoCamera.top = this.frustumSize / 2;
            this.orthoCamera.bottom = -this.frustumSize / 2;
            this.orthoCamera.updateProjectionMatrix();
        }
        else {
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
        }
        this.renderer.setSize(this.size.width, this.size.height);
    }
    _onOrientationChange() {
        this._resize();
        TweenLite.delayedCall(0.1, () => {
            this._resize();
        });
    }
    //鼠标移动 对应的修改相机位置
    _onMouseMove(e) {
        if (e.originEvent instanceof MouseEvent)
            this.setMousePosition(e.originEvent.clientX, e.originEvent.clientY);
        this.setCameraTarget(this.cameraBasePos);
    }
    //鼠标点击 记录pos
    _onClick(e) {
        if (e.originEvent instanceof MouseEvent)
            this.setMousePosition(e.originEvent.clientX, e.originEvent.clientY);
    }
    //touch
    _onTouchStart(e) {
        if (e.originEvent instanceof TouchEvent) {
            this.setMousePosition(e.originEvent.touches[0].pageX, e.originEvent.touches[0].pageY);
        }
    }
    //touchmove
    _onTouchMove(e) {
        if (e.originEvent instanceof TouchEvent) {
            this.setMousePosition(e.originEvent.touches[0].pageX, e.originEvent.touches[0].pageY);
            this.setCameraTarget(this.cameraBasePos);
        }
    }
    _onTouchEnd() {
    }
    //更换相机类型
    changeCamera() {
        this.activeCamera =
            this.activeCamera === this.camera ? this.orthoCamera : this.camera;
        this.controls.enabled = this.activeCamera === this.camera;
    }
    //绑定click事件
    bindClick(cb) {
        const fun = () => {
            document.removeEventListener("click", fun);
            cb && cb();
        }
        document.addEventListener("click", fun);
    }
}
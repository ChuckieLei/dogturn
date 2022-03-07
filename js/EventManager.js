import * as THREE from "../../../build/three.module.js";

//常规的事件管理类
export default class EventManager extends THREE.EventDispatcher {
    constructor() {
        super();
        this.dom = null;
        this.resizeEvent = { type: 'resize' };
        this.orientationChangeEvent = { type: 'orientationchange' };
        this.mouseMoveEvent = { type: 'mousemove' };
        this.touchStartEvent = { type: 'touchstart' };
        this.touchEndEvent = { type: 'touchend' };
        this.touchMoveEvent = { type: 'touchmove' };
        this.clickEvent = { type: 'click' };
        this.mousePositionEvent = { type: 'mouse-position' };
        this.cameraPositionTargetEvent = { type: 'camera-position-target' };
    }
    init(dom) {
        this.dom = dom;
        this.dom.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.dom.addEventListener('click', this.onClick.bind(this));
        this.dom.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.dom.addEventListener('touchend', this.onTouchEnd.bind(this), false);
        this.dom.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('orientationchange', this.onOrientationChange.bind(this));
    }
    resize() {
        this.dispatchEvent(this.resizeEvent);
    }
    //横竖屏变化
    onOrientationChange() {
        this.dispatchEvent(this.orientationChangeEvent);
    }
    //PC鼠标移动
    onMouseMove(e) {
        e.preventDefault();
        this.mouseMoveEvent.originEvent = e;
        this.dispatchEvent(this.mouseMoveEvent);
    }
    //PC鼠标点击
    onClick(e) {
        e.preventDefault();
        this.clickEvent.originEvent = e;
        this.dispatchEvent(this.clickEvent);
    }
    //移动端手指按下
    onTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            this.touchStartEvent.originEvent = e;
            this.dispatchEvent(this.touchStartEvent);
        }
    }
    //移动端手指移动
    onTouchMove(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.touches.length === 1) {
            this.touchMoveEvent.originEvent = e;
            this.dispatchEvent(this.touchMoveEvent);
        }
    }
    //移动端手指抬起
    onTouchEnd(e) {
        e.preventDefault();
        if (e.touches.length === 0) {
            this.touchEndEvent.originEvent = e;
            this.dispatchEvent(this.touchEndEvent);
        }
    }
}
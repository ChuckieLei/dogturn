import * as THREE from "../../../../build/three.module.js";
import TurnCircle from "../element/TurnCircle.js";
import SmallDog from "../element/SmallDog.js";
import Chapter from "./Chapter.js";

export default class ChapterTurn extends Chapter {
    constructor(stage, key) {
        super();
        this.key = key;
        this.stage = stage;
        this.circle = null;
        this.dog = null;
    }
    start() {
        this.stage.renderer.setClearColor(0xffffff, 1);         //背景色为白色
        this.stage.camera.position.set(0, 0, 2);
        this.stage.controls.target.set(0, 0, 0);
        this.stage.controls.update();
        this.stage.cameraRange = 0.01;
        this.circle = new TurnCircle(1.1, 1.1);                                 //创建转变的circle
        this.circle.position.set(0, 0, 0.05);                                   //初始circle scale为0.05
        this.circle.visible = false;                                            //初始时circle隐藏            
        this.stage.add(this.circle);
        this.dog = new SmallDog(0.45, 0.45, this.stage.cache.get('small'));     //创建smallDog
        this.dog.position.set(0, 0, 0);
        this.dog.visible = false;                                               //初始化时隐藏
        this.stage.add(this.dog);
        this.done(6.5, new THREE.Vector3(0, 0, 0), new THREE.Vector3());
        this._animate();
    }
    update() {
        this.circle.update();
        // this.circle.lookAt(this.stage.camera.position);
        this.dog.update();
    }
    //出场
    stop(cb) {
        this.dog.scaleUp(1);                                    //dog逐渐放大到1倍
        TweenLite.delayedCall(3, () => { this.dog.show(); });   //3秒后dog显示
        this.circle.fadeOut(4, () => {                          //circle 4秒后淡出，淡出后清理场景
            this.circle && this.stage.remove(this.circle);
            this.dog && this.stage.remove(this.dog);
            this.circle = null;
            this.dog = null;
            cb();
        });
    }
    //进场
    _animate() {
        TweenLite.delayedCall(0.5, () => {
            TweenLite.delayedCall(1.5, () => {          //0.5+1.5秒后 circle开始显示 伴随3秒fadeIn效果
                if (this.circle) {
                    this.circle.visible = true;
                    this.circle.fadeIn(3);
                }
                TweenLite.delayedCall(2, () => {        //0.5+1.5+2秒后  dog开始显示
                    if (this.dog)
                        this.dog.visible = true;
                });
            });
        });
    }
}
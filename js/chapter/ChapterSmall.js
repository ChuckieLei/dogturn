import * as THREE from "../../../../build/three.module.js";
import SmallDog from "../element/SmallDog.js";
import Chapter from "./Chapter.js";

export default class ChapterSmall extends Chapter {
    constructor(stage, key) {
        super();
        this.key = key;
        this.stage = stage;
        this.dog = null;
    }
    start() {
        this.stage.renderer.setClearColor(0xffffff, 1);     //舞台背景色为黑色
        this.stage.cameraRange = 0.01;
        this.dog = new SmallDog(0.45, 0.45, this.stage.cache.get('small'));     //添加smallDog类
        this.dog.position.set(0, 0, 0);
        this.dog.scaleUpRight();                            //设置正常scale
        this.dog.showRight();                  
        this.stage.add(this.dog);
        this.done(2, new THREE.Vector3(0, -0.03, 0), new THREE.Vector3());
        this._animate();
    }
    //每帧更新
    update() {
        this.dog.update();
    }
    //出场
    stop(cb) {
        this.dog.fadeOut();                                 //dog淡出消失
        TweenLite.delayedCall(1.6, () => {                  //1.6秒后清理场景
            this.dog && this.stage.remove(this.dog);
            this.dog = null;
            cb();
        });
    }
    _animate() {
    }
}
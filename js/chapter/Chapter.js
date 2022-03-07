import * as THREE from "../../../../build/three.module.js";

export default class Chapter extends THREE.EventDispatcher {
    constructor() {
        super();
        this.key = '';
        this.text = '';
        this.textIdx = 0;
        this.doneEvent = { type: 'done' };
        this.finishEvent = { type: 'finish' };
    }
    start() {
        throw new Error('need extend');
    }
    stop(cb) {
        throw new Error('need extend');
    }
    update(time) {
        throw new Error('need extend');
    }
    //分发done事件
    dispatchDone(position, offset, color) {
        this.doneEvent.data = { position, offset, color };
        this.dispatchEvent(this.doneEvent);
    }
    //分发finish事件
    dispatchFinish() {
        this.dispatchEvent(this.finishEvent);
    }
    done(delay = 0, position = new THREE.Vector3(), offset = new THREE.Vector3(), color = '') {
        TweenLite.delayedCall(delay, () => this.dispatchDone(position, offset, color));
    }
}
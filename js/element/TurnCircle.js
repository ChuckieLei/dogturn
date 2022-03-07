import * as THREE from "../../../../build/three.module.js";
import Utils from "../Utils.js";

const vs = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fs = `
  precision mediump float;
  varying vec2 v_uv;                    //线性uv    
  uniform float u_time;                 //u_time每帧累加的值
  uniform float u_rangeMax;             //最高阈值
  uniform vec4 u_metaballs[40];         //metaball数据

  void main() {
    vec2 st = 2.0 * v_uv - 1.0;
    float v = 0.0;
    for ( int i = 0; i < 40; i++ ) {                      //metaballs势能叠加
      vec4 mb = u_metaballs[i];
      float dx = st.x + cos(u_time * mb.w) * mb.x;        //u_time 和 w 属性变化来使小球运动
      float dy = st.y + sin(u_time * mb.w) * mb.y;
      float r = mb.z;                                     //半径
      v += r * r / (dx * dx + dy * dy);                   //叠加20个Metaball的势
    }
    vec4 color = vec4(1.0);
    
    //float rangeMax = 10.2; // 10.2            //最高阈值
    float rangeMin = u_rangeMax - 0.5;          //最低阈值
    if (v > u_rangeMax) {                                 
      color = vec4(0.0, 0.0, 0.0, 1.0);         //势能大于rangMax 则黑色
    } else if (v > rangeMin) {
      color = vec4(0.0, 0.0, 0.0, smoothstep(1.0, 0.0, (u_rangeMax - v) / (u_rangeMax - rangeMin)));  //势能处于大小阈值之间，则设置平滑的透明度
    } else {
      color = vec4(1.0, 1.0, 1.0, 0.0);         //势能小于rangeMin 则透明
    }

    gl_FragColor = color;

  }
`;
export default class TurnCircle extends THREE.Object3D {
    constructor(width = 1, height = 1) {
        super();
        this.width = width;
        this.height = height;
        this.shape = null;
        this.wireframe = null;
        this.balls = [];
        this.uniforms = {
            u_time: { value: 0.0 },
            u_metaballs: { type: 'v4', value: this.balls },
            u_rangeMax: { value: 10.2 },
        };
        this.isAnimate = false;
        this._createShape();
    }
    //u_time每帧叠加
    update() {
        this.uniforms.u_time.value += 0.02;
    }
    //淡入
    fadeIn(time = 1) {
        this.balls.forEach(ball => {
            TweenLite.to(ball, Utils.random(time - 1, time), {
                delay: Utils.random(0, 1),
                x: Utils.random(0, 1) < 0.5                   //一半左移，一半右移
                    ? Utils.random(-0.6, -0.1)
                    : Utils.random(0.1, 0.6),
                y: Utils.random(0, 1) < 0.5                   //一半下移，一半上移
                    ? Utils.random(-0.6, -0.1)
                    : Utils.random(0.1, 0.6),
                z: Utils.random(0.12, 0.25),                  //半径放大到0.12~0.25
                w: Utils.random(0.1, 1),
                ease: Power3.easeOut,
            });
        });
        TweenLite.delayedCall(2, () => {
            this.isAnimate = true;
        });
    }
    //淡出消失
    fadeOut(time = 1, cb) {                                                         
        this.balls.forEach(ball => {
            TweenLite.to(ball, Utils.random(time - 1, time), {        //依次缩放到最小
                delay: Utils.random(0, 1),
                z: 0.001,
                ease: Power2.easeInOut,
            });
        });
        TweenLite.to(this.uniforms.u_rangeMax, time, { value: 16 });  //势能最大阀值调高，即颜色慢慢变浅
        TweenLite.delayedCall(time + 1.5, () => {                     //1.5S之后消失
            this.visible = false;
            cb();
        });
    }
    _createShape() {
        this._createMetaballs();
        const geo = new THREE.PlaneBufferGeometry(this.width, this.height, 1, 1);     //创建平面几何图形
        const mat = new THREE.ShaderMaterial({                                        //自定义材质
            vertexShader: vs,
            fragmentShader: fs,
            uniforms: this.uniforms,
            transparent: true,
            side: THREE.DoubleSide,
        });
        this.shape = new THREE.Mesh(geo, mat);
        this.add(this.shape);
    }
    //创建40个metaballs
    _createMetaballs() {
        for (let i = 0; i < 40; i++) {
            this.balls.push(new THREE.Vector4(0, 0, 0.001, 0));       //初始化坐标为(0,0) 半径为0.001
        }
    }
}
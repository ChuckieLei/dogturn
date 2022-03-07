import * as THREE from "../../../../build/three.module.js";

const vs = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fs = `
  varying vec2 v_uv;            //uv坐标
  uniform float u_time;         //u_time随时间累加
  uniform sampler2D u_texture;  //u_texture
  uniform float u_amp;          //控制波动的幅度
  uniform float u_opacity;      //控制透明度

  //GLSL Noise Algorithms
  //https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }
  float noise(vec2 p){                    //常规value噪声函数
    vec2 ip = floor(p);
    vec2 u = fract(p);                    //小数部分u来做缓和曲线
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(                      //随机四个方格点的向量 做插值
      mix( rand(ip), rand(ip + vec2(1.0,0.0)), u.x ),
      mix( rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x )
      ,u.y
    );
    return res*res;                       //结果再平方,相对于原结果更随机
  }

  void main() {
    vec2 uv = v_uv;

    // float speed = cos(u_time * 0.05) * 0.2; // default 0.1
    float speed = 0.3;                                            //固定速度为0.3
    uv.x += (noise(uv * 10. + u_time * speed) - 0.5) * u_amp;     // uv*10 即扩大网格, noise取值逐渐增大
    uv.y += (noise(uv * 10. + u_time * speed) - 0.5) * u_amp;     // (10,100) * u_amp  (1.5,15)
    // uv.x += (noise(uv * 1000. + u_time * speed) - 0.5) * u_amp;   //uv的倍数系数越大,动画就看起来越密集, u_amp控制整体幅度;u_amp越小越接近原图
    // uv.y += (noise(uv * 10. + u_time * 0.2) - 0.5) * u_amp;

    gl_FragColor = texture2D(u_texture, uv);                      //得到处理的uv后，取该点的像素值
    gl_FragColor.a *= u_opacity;                                  //乘以透明度,便于淡入淡出操作
  }
`;
export default class SmallDog extends THREE.Object3D {
    constructor(width = 1, height = 1, texture) {
        super();
        this.uniforms = {
            u_time: { value: 0.0 },
            u_texture: { value: texture },
            u_amp: { value: 0.11 },
            u_opacity: { value: 1.0 },
        };
        this.width = width;
        this.height = height;
        this.shape = null;
        this.wireframe = null;
        this._createShape();
    }
    draw() {
    }
    //动画放大
    scaleUp(time) {
        this.shape && TweenLite.to(this.shape.scale, time, { x: 1, y: 1 });
    }
    //直接放大到正常的scale
    scaleUpRight() {
        this.shape && this.shape.scale.set(1, 1, 1);
    }
    //显示动画
    show() {
        TweenLite.to(this.uniforms.u_amp, 3, {    //u_amp 3秒变为0,即从波动变为平静
            value: 0,
            ease: Power2.easeInOut,
        });
    }
    //正差显示
    showRight() {
        this.uniforms.u_amp.value = 0;    //u_amp为0，即uv无变化
    }
    //1秒渐变消失 透明度变为0，u_amp变为0.15
    fadeOut() {
        TweenLite.to(this.uniforms.u_amp, 1, { value: 0.15 });
        TweenLite.to(this.uniforms.u_opacity, 1, { value: 0.0 });
    }
    //u_time递增
    update() {
        this.uniforms.u_time.value += 0.05;
    }
    _createShape() {
        const geo = new THREE.PlaneBufferGeometry(this.width, this.height, 1, 1);   //平面几何图形
        const mat = new THREE.ShaderMaterial({           //自定义shader材质
            vertexShader: vs,
            fragmentShader: fs,
            uniforms: this.uniforms,
            transparent: true,
            side: THREE.DoubleSide,
        });
        this.shape = new THREE.Mesh(geo, mat);
        this.shape.scale.set(0.2, 0.2, 1);
        this.add(this.shape);
    }
}
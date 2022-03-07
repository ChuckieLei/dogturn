import * as THREE from "../../../build/three.module.js";

const list = [
    { name: 'whiteCircle', path: "res/white_circle.png" },
    { name: 'textSink', path: "res/txt_sink.png" },
    { name: 'freezeCharacter', path: "res/freeze_character.png" },
    { name: 'small', path: "res/small.png" },
];
//加载image资源
export default class ImageLoader {
    load(cache) {
        return new Promise(resolve => {
            const total = list.length;
            let count = 0;
            list.forEach(item => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.addEventListener('load', () => {
                    const texture = this._getTexture(img);
                    cache.add(item.name, texture);
                    count += 1;
                    if (count >= total) {
                        TweenLite.delayedCall(0.1, () => resolve());
                    }
                });
                img.src = item.path;
            });
        });
    }
    //根据img初始化texture
    _getTexture(img) {
        const isJPEG = img.src.search(/\.jpe?g($|\?)/i) > 0 ||
            img.src.search(/^data\:image\/jpeg/) === 0;
        const texture = new THREE.Texture();
        texture.image = img;
        texture.format = isJPEG ? THREE.RGBFormat : THREE.RGBAFormat;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
        return texture;
    }
}
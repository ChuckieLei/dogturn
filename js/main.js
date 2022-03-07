import ImageLoader from "./ImageLoader.js";
import Stage from "./Stage.js";
import ChapterManager from "./ChapterManager.js";

(function() {
    const stage = new Stage({
        container: document.body,
        production: true,
    });

    const chapterManager = new ChapterManager(stage);

    //加载图片
    function load(key) {
        const imageLoader = new ImageLoader();
        imageLoader.load(stage.cache).then(() => {
            chapterManager.init(stage);
            TweenLite.delayedCall(0.4, () => start(key));
        });
    }
    
    //开始
    function start(key) {
        chapterManager.start(key);
        loop(0);
    }
    //循环帧
    function loop(time) {
        stage.update();
        // indicatorManager.update();
        chapterManager.update(time);
        requestAnimationFrame(loop);
    }

    load('concern');
})();
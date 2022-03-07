import ChapterTurn from "./chapter/ChapterTurn.js";
import ChapterSmall from "./chapter/ChapterSmall.js";

//Chapter管理类
export default class ChapterManager {
    constructor(stage) {
        this.stage = stage;
        this.chapters = [];
        this.idx = 0;
    }
    init(stage) {
        this.chapters = [
            new ChapterTurn(stage, 'turn'),
            new ChapterSmall(stage, 'small'),
        ];
        this.chapters.forEach(chapter => {
            chapter.addEventListener('done', this._onDone.bind(this));
        });
    }
    //开始
    start(key) {
        this.idx = this._getChapterIdx(key);
        this.chapters[this.idx].start();
    }
    //下一个Chapter开始
    next() {
        // const currChapter = this._getCurrChapter();
        // currChapter.stop();

        const currChapter = this._getCurrChapter();
        currChapter.stop(() => {                                //当前chapter停止并移除,下一个chapter开始
            this.idx += 1;
            const curr = this._getCurrChapter();
            if (!curr) return;
            curr.start();
        });
    }
    //更新
    update(time) {
        this.chapters[this.idx] && this.chapters[this.idx].update(time);
    }
    _onDone(event) {
        this.stage.bindClick(() => {
            this.next();
        });
    }
    //当前章index
    _getChapterIdx(key) {
        for (let i = 0; i < this.chapters.length; i++) {
            if (this.chapters[i].key === key)
                return i;
        }
        return 0;
    }
    //当前章
    _getCurrChapter() {
        return this.chapters[this.idx];
    }
}
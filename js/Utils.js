export default class Utils {
    //区间里的随机值
    static random(_min, _max) {
        let min = _min;
        let max = _max;
        if (min > max) {
            max = _min;
            min = _max;
        }
        return Math.random() * (max - min) + min;
    }
    //返回合适约束
    static constrain(value, min, max) {   
        return Math.min(Math.max(value, min), max);   //若min < value < max 取value, 若vlaue < min则取min
    }
    //线性映射
    static map(value, istart, istop, ostart, ostop) {
        const min = Math.min(ostart, ostop);
        const max = Math.max(ostart, ostop);
        return this.constrain(ostart + (ostop - ostart) * ((value - istart) / (istop - istart)), min, max);
    }

    //向量距离
    static distanceVector3(v1, v2) {
        const x = v2.x - v1.x;
        const y = v2.y - v1.y;
        const z = v2.z - v1.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
}
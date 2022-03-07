const cache = {
    files: {},
    add: function (key, file) {
        this.files[key] = file;
    },
    get: function (key) {
        return this.files[key];
    },
    remove: function (key) {
        delete this.files[key];
    },
    clear: function () {
        this.files = {};
    },
}
export {cache};
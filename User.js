module.exports = class User {
    constructor(id) {
        this.id = id;
        this.question = 1;
    }

    nextquestion(){
        this.id = this.id + 1
    }
};
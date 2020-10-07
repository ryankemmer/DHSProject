module.exports = class User {
    constructor(id) {
        this.id = id;
        this.question = 1;
        this.questionArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }

    nextquestion(){
        this.question = this.question + 1
    }

    selectQuestion(){

        var candidates = []

        for(var i = 0, length = this.questionArray.length; i < length; i++){
            if (this.questionArray[i] == 0){
                candidates.push(i)
            }
        }

        console.log(candidates)

        var questionNumber = candidates[Math.floor(Math.random() * candidates.length)]

        this.questionArray[questionNumber] = 1

        return questionNumber
    }
};
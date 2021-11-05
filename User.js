module.exports = class User {
    constructor(id) {
        this.id = id;
        this.index = 1;
        this.questionArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //36 in length
        this.currentQuestion = 0;
        this.prevTime = 60
    }

    currentQ(){
        return this.currentQuestion
    }

    nextquestion(){
        this.index = this.index + 1
    }

    setPrevTime(time){
        this.prevTime = time
    }

    getPrevTime(){
        return this.prevTime
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
        questionNumber = questionNumber + 1
        this.currentQuestion = questionNumber
        return questionNumber
    }
};

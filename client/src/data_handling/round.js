
export class Round {
    // Allow initialization with score list or number of holes
    constructor (scoreOrNumberOfHoles) {
        // If the number of holes is given, then create a blank
        // array with that many holes.
        if(Number.isInteger(scoreOrNumberOfHoles)) {
            this.score = new Array(numberOfHoles);
        }
        // If an array is given, copy the scores
        else {
            this.score = scoreOrNumberOfHoles;
        }
    }

    updateJSON = () => {
        
    }

    // Note: holeNumber is really the real hole number - 1
    modifyScore = (holeNumber, newScore) => {
        if(holeNumber < 0 || holeNumber >= this.numberOfHoles) {
            return false;
        }

        this.score[holeNumber] = newScore;
    }

    modifyEntireScore = (newScoreArray) => {
        // Must be array and same length
        if(typeof newScoreArray !== Array) {
            return false;
        }
        if(newScoreArray.length !== this.score.length) {
            return false;
        }
        this.score = newScoreArray;
        
    }

    getScore = () => {
        return this.score;
    }
}
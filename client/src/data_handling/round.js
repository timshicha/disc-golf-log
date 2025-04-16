
export class Round {
    // Allow initialization with round or number of holes
    constructor (roundOrdNumberOfHoles) {
        // If the number of holes is given, then create a blank
        // array with that many holes.
        console.log(roundOrdNumberOfHoles, typeof roundOrdNumberOfHoles)
        if(typeof roundOrdNumberOfHoles === "number") {
            this.score = new Array(roundOrdNumberOfHoles).fill("");
            this.roundID = crypto.randomUUID();
        }
        // If a round is given
        else {
            // Copy score and round ID
            this.score = roundOrdNumberOfHoles.score;
            this.roundID = roundOrdNumberOfHoles.roundID;
        }
        console.log(this.score, this.roundID)
        // Create json file for this round
        this.updateJSON();
    }

    updateJSON = () => {
        localStorage.setItem(this.roundID + ".json", 
            JSON.stringify({
                score: this.score,
                roundID: this.roundID
            })
        );
    }

    // Note: holeNumber is really the real hole number - 1
    modifyScore = (holeNumber, newScore) => {
        if(holeNumber < 0 || holeNumber >= this.numberOfHoles) {
            return false;
        }

        this.score[holeNumber] = newScore;
        this.updateJSON();
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
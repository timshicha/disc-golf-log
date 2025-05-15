
// Given a round, return the total score
const getRoundTotal = (round) => {
    if(!round || !round.score || !Array.isArray(round.score)) {
        return 0;
    }
    let total = 0;
    for (let i = 0; i < round.score.length; i++) {
        total += parseInt(round.score[i]);
    }
    return total;
}

export { getRoundTotal };
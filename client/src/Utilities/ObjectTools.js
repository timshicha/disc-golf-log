
class ObjectTools {

    // Given a round, return the total score for the round
    static getRoundTotal = (round) => {
        // Given a round, return the total score
        if(!round || !round.score || !Array.isArray(round.score)) {
            return 0;
        }
        let total = 0;
        for (let i = 0; i < round.score.length; i++) {
            total += Number(round.score[i]);
        }
        return total;
    }

    // Given a course, return the list of hole labels.
    // If no hole labels, default to 1, 2, 3, ...
    static getCourseHoleLabels = (course) => {
        if(course.holeLabels && Array.isArray(course.holeLabels)) {
            return course.holeLabels;
        }
        // If no labels, return 1, 2, 3, ...
        return Array.from({ length: course.holes }, (_, i) => i + 1);
    }
}

export default ObjectTools;
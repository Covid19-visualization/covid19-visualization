const { AGGREGATION } = require("./aggregation");

var exports = (module.exports = {});

const unwindAndMatch = (groupBy, matchBy) => {
    return [
        AGGREGATION.UNWIND_DATA,
        matchBy,
        groupBy[0],
    ]
}

exports.unwindAndMatchByDate = (groupBy, matchCondition) => {
    let matchBy = {
        $match: {
            "data.date": { $gte: matchCondition.from, $lte: matchCondition.to },
        }
    }
    return unwindAndMatch(groupBy, matchBy)
    
}

exports.unwindAndMatchByName = (groupBy, matchCondition) => {
    let matchBy = {
        $match: {
            "name": {$in: matchCondition.namesList },
        }
    }
    return unwindAndMatch(groupBy, matchBy)

}

exports.unwindAndMatchByDateAndName = (groupBy, matchCondition) => {
    let matchBy = {
        $match: {
            "data.date": { $gte: matchCondition.from, $lte: matchCondition.to },
            "name": {$in: matchCondition.selectedCountries },
        }
    }
    return unwindAndMatch(groupBy, matchBy)
}

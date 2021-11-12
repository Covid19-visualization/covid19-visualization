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

exports.dbLabelStatic = [
    "population",
    "total_cases",
    "population_density",
    "median_age",
    "gdp_per_capita",
    "extreme_poverty",
    "cardiovasc_death_rate",
    "diabetes_prevalence",
    "female_smokers",
    "male_smokers",
    "life_expectancy",
    "human_development_index"
]
    
exports.dbLabelDaily = [
    "new_cases",
    "new_cases_smoothed",
    "total_deaths",
    "new_deaths",
    "new_deaths_smoothed",
    "new_deaths_per_million",
    "reproduction_rate",
    "positive_rate",
    "tests_per_case",
    "stringency_index",
    "new_vaccinations_smoothed",
    "people_fully_vaccinated",
    "people_vaccinated"
]

exports.countriesNames = [
    "Netherlands",
    "North Macedonia",
    "Switzerland",
    "Latvia",
    "Slovenia",
    "Bulgaria",
    "Cyprus",
    "Croatia",
    "Czechia",
    "Isle of Man",
    "Jersey",
    "Monaco",
    "France",
    "Austria",
    "Estonia",
    "Slovakia",
    "Sweden",
    "Lithuania",
    "San Marino",
    "Denmark",
    "Belgium",
    "Russia",
    "Serbia",
    "Hungary",
    "Greece",
    "Guernsey",
    "Bosnia and Herzegovina",
    "Faeroe Islands",
    "Kosovo",
    "Gibraltar",
    "Finland",
    "Ireland",
    "Liechtenstein",
    "Belarus",
    "Moldova",
    "Spain",
    "Poland",
    "Iceland",
    "Romania",
    "Italy",
    "Andorra",
    "Malta",
    "Germany",
    "Albania",
    "Montenegro",
    "Norway",
    "Luxembourg",
    "Portugal",
    "Ukraine",
    "Vatican",
    "United Kingdom"
]
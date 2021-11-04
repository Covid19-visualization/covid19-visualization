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
    "people_fully_vaccinated",
    "people_vaccinated",
    "population_density",
    "median_age",
    "age_65_older",
    "age_70_older",
    "gdp_per_capita",
    "extreme_poverty",
    "cardiovasc_death_rate",
    "diabetes_prevalence",
    "female_smokers",
    "male_smokers",
    "hospital_beds_per_thousand",
    "life_expectancy",
    "human_development_index"
]
    
exports.dbLabelDaily = ["new_cases",
    "new_cases_smoothed",
    "total_deaths",
    "new_deaths",
    "new_deaths_smoothed",
    "total_cases_per_million",
    "new_cases_per_million",
    "new_cases_smoothed_per_million",
    "total_deaths_per_million",
    "new_deaths_per_million",
    "new_deaths_smoothed_per_million",
    "reproduction_rate",
    "icu_patients",
    "icu_patients_per_million",
    "hosp_patients",
    "hosp_patients_per_million",
    "new_tests",
    "total_tests",
    "total_tests_per_thousand",
    "new_tests_per_thousand",
    "new_tests_smoothed",
    "new_tests_smoothed_per_thousand",
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
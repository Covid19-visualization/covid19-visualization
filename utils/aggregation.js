var exports = (module.exports = {});

exports.AGGREGATION = {

    UNWIND_DATA: {
        $unwind: {
            path: '$data',
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: false
        }
    },
    EUROPE_DAILY: [
        {
            $group: {
                _id: "$data.date",
                new_cases: { $sum: '$data.new_cases_smoothed' },
                new_vaccinations: { $sum: '$data.new_vaccinations_smoothed' },
                new_deaths: { $sum: '$data.new_deaths_smoothed'},

                population: {$sum: '$population'},
                population_density: { $sum: '$population_density' },
                life_expectancy: { $sum: '$life_expectancy'},
                gdp_per_capita: { $sum: "$gdp_per_capita" },
                human_development_index: { $sum: "$human_development_index" },
                cardiovasc_death_rate: {$sum: "$cardiovasc_death_rate"},
                diabetes_prevalence: {$sum: "$diabetes_prevalence"},
                female_smokers: {$sum: "$female_smokers"},
                male_smokers: {$sum: "$male_smokers"},
                median_age: {$sum: "$median_age"},
                people_vaccinated: {$sum: '$data.people_vaccinated'},
                people_fully_vaccinated: {$sum: '$data.people_fully_vaccinated'},
                total_deaths: {$sum: '$data.total_deaths'},
                total_cases: {$push: '$data.total_cases'},
                total_boosters: {$sum: '$data.total_boosters'},
                stringency_index : {$sum: '$data.stringency_index'}
            },
        },
    ],
    ALL_COUNTRY_INFO: [
        {
            $group: {
                _id: '$name',
                total_cases: { $sum: '$data.new_cases_smoothed' },
                total_vaccinations: { $sum: '$data.new_vaccinations_smoothed' },
                total_new_deaths: { $sum: '$data.new_deaths_smoothed'},
                population: { $first: '$population' },
                name: { $first: "$name" }
            },
        },
    ],
    GET_SELECTED_COUNTRY_INFO: [
        {},
    ],
    GET_PEOPLE_VACCINATED: [
        {
            $group: {
                _id: "$data.date",
                population: { $first: "$population"},
                name: { $first: "$name" },
                people_vaccinated: {$first: '$data.people_vaccinated'},
                people_fully_vaccinated: {$first: '$data.people_fully_vaccinated'},
                total_deaths: {$first: '$data.total_deaths'},
                total_cases: {$first: '$data.total_cases'},
                total_boosters: {$first: '$data.total_boosters'},
                stringency_index : {$first: '$data.stringency_index'}
            },
        },
    ],
    COMPUTE_PCA: [
        {},
    ],
    GET_SELECTED_COUNTRY_DAILY_INFO: [
        {
            $group: {
                _id: {
                    date: "$data.date",
                    name: "$name",
                },
                new_cases: { $sum: '$data.new_cases_smoothed' },
                new_vaccinations: { $sum: '$data.new_vaccinations_smoothed' }, 
                new_deaths: {$sum: '$data.new_deaths_smoothed'},

                population_density: { $first: '$population_density' },
                life_expectancy: { $first: '$life_expectancy'},
                gdp_per_capita: { $first: "$gdp_per_capita" },
                human_development_index: { $first: "$human_development_index" },
                cardiovasc_death_rate: {$first: "$cardiovasc_death_rate"},
                diabetes_prevalence: {$first: "$diabetes_prevalence"},
                female_smokers: {$first: "$female_smokers"},
                male_smokers: {$first: "$male_smokers"},
                median_age: {$first: "$median_age"},
                population: {$first: '$population'}
            },
        },
    ],
}

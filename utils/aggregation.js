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
                new_cases: { $sum: '$data.new_cases' },
                new_vaccinations_smoothed: { $sum: '$data.new_vaccinations_smoothed' },
            },
        },
    ],
    ALL_COUNTRY_INFO: [
        {
            $group: {
                _id: '$name',
                total_cases: { $sum: '$data.new_cases' },
                total_vaccinations: { $sum: '$data.new_vaccinations_smoothed' },
                population: { $first: '$population' },
                name: { $first: "$name" }
            },
        },
    ],
    GET_SELECTED_COUNTRY_INFO: [
        {
            $group: {
                _id: "$data.date",
                new_cases: { $sum: '$data.new_cases' },
                new_vaccinations_smoothed: { $sum: '$data.new_vaccinations_smoothed' },
                
                // For RADAR
                name: { $push: "$name" },
                population_density: { $push: '$population_density' },
                life_expectancy: { $push: '$life_expectancy'},
                gdp_per_capita: { $push: "$gdp_per_capita" },
                //extreme_poverty: { $push: "$extreme_poverty" },
                human_development_index: { $push: "$human_development_index" },
                cardiovasc_death_rate: {$push: "$cardiovasc_death_rate"},
                diabetes_prevalence: {$push: "$diabetes_prevalence"},
                female_smokers: {$push: "$female_smokers"},
                male_smokers: {$push: "$male_smokers"},
                median_age: {$push: "$median_age"}
            },
        },
    ],
    PCA_INFO: [
        {
            $group: {},
        },
    ]
}

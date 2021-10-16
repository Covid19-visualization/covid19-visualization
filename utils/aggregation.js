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
                population: { $first: '$population' },
                gdp_per_capita: { $first: "$gdp_per_capita" },
                extreme_poverty: { $first: "$extreme_poverty" },
                human_development_index: { $first: "$human_development_index" }
            },
        },
    ]
}

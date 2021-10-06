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
                _id: '$name',
                total_cases: { $sum: '$data.new_cases' },
                total_vaccinations: { $sum: '$data.new_vaccinations_smoothed' },
                population: { $first: '$population' },
                name: { $first: "$name" }
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
              _id: "$name",
              dailyData: { $addToSet: "$data" }
            },
          },
    ]
}

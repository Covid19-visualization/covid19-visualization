
var exports = (module.exports = {});

exports.CONST = {
    EUROPE: {
        NUM_COUNTRIES: 51,
        NAME: "Europe",
        ID: "EU"
    },
    SELECTED_COUNTRIES: { NAME: "Selected Countries", ID: "SC"},
    DEFAULT: {
        DATE: "1900-01-01",
        COVID_UPDATE_URL: "https://covid.ourworldindata.org/data/owid-covid-data.json"
    },
    METHODS: {
        GET_EUROPE_DAILY_DATA: "getEuropeDailyData",
        GET_ALL_COUNTRY_INFO: "getAllCountryInfo",
        GET_COUNTRY_INFO: "getCountryInfo",
        GET_SELECTED_COUNTRIES_INFO: "getSelectedCountriesInfo",
        UPDATE_DATA: "updateData",
        DELETE_ALL: "deleteAll",
        COMPUTE_PCA: "computePca",
        GET_PEOPLE_VACCINATED: "getPeopleVaccinated"
    }
}

const debug = (message, isError) => {
    !isError
        ? console.log(message)
        : console.error(message)
}

exports.debugStart = (methodName, data, noStringify) => {
    noStringify
        ? debug(`DEBUG START: ${methodName} ${data}`)
        : debug(`DEBUG START: ${methodName} ${JSON.stringify(data, null, 1)}`)
}

exports.debugEnd = (methodName, data, noStringify) => {
    noStringify
        ? debug(`DEBUG END: ${methodName} > ${data}`)
        : debug(`DEBUG END: ${methodName} > ${JSON.stringify(data, null, 1)}`)
}

exports.debugError = (methodName, data, noStringify) => {
    noStringify
        ? debug(`DEBUG ERROR: ${methodName} ${data}`, true)
        : debug(`DEBUG ERROR: ${methodName} ${JSON.stringify(data, null, 1)}`, true)
}

exports.debugCatch = (methodName, data, noStringify) => {
    noStringify
        ? debug(`DEBUG CATCH: ${methodName} ${data.message}`, true)
        : debug(`DEBUG CATCH: ${methodName} ${JSON.stringify(data.message, null, 1)}`, true)
}

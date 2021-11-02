const mongoose = require("mongoose");
const fetch = require('node-fetch');

const Country = require('../models/country.model');
const Continent = require('../models/continent.model');
const DailyDataScheme = require('../models/dailyData.model');
const DailyData = mongoose.model("DailyData", DailyDataScheme);
const kmeans = require('node-kmeans');

const { CONST, debugStart, debugEnd, debugCatch, debugError } = require("../utils/utils");
const { unwindAndMatchByDateAndName, unwindAndMatchByDate } = require("../utils/mongoHandler");
const { sendHandler, RESPONSE_CODE, sendComplete, sendError } = require("../utils/sendHandler");
const { AGGREGATION } = require("../utils/aggregation");

exports.getCountryInfo = (req, res) => {
  let methodName = CONST.METHODS.GET_COUNTRY_INFO
  try {
    debugStart(methodName, req.body)

    var countryId = req.countryId;
    Country.findById({ _id: countryId })
      .exec((err, country) => {
        if (!err) {
          debugEnd(methodName, country.length)
          sendComplete(res, RESPONSE_CODE.SUCCESS.OK, country._doc);
        }
        else {
          sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, err.message)
          debugError(methodName, err)
        }
      });
  }
  catch (e) {
    sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, err.message)
    debugCatch(methodName, e.message)
  }

};

exports.getAllCountryInfo = (req, res) => {
  let methodName = CONST.METHODS.GET_ALL_COUNTRY_INFO;
  try {
    debugStart(methodName, req.body)
    let matchingCondition = {
      from: new Date(req.body.from),
      to: new Date(req.body.to)
    }

    Country.aggregate(
      unwindAndMatchByDate(AGGREGATION.ALL_COUNTRY_INFO, matchingCondition))
      .exec((err, countries) => {
        if (!err) {
          sendComplete(res, RESPONSE_CODE.SUCCESS.OK, countries)
          debugEnd(methodName, countries.length, true)
        }
        else {
          sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, err.message)
          debugError(methodName, err);
        }
      });
  }
  catch (e) {
    sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, e.message)
    debugCatch(methodName, e)
  }
};

exports.getEuropeDailyData = (req, res) => {
  let methodName = CONST.METHODS.GET_EUROPE_DAILY_DATA;
  try {
    debugStart(methodName, req.body)

    let matchingCondition = {
      from: new Date(req.body.from),
      to: new Date(req.body.to),
    }

    Country.aggregate(
      unwindAndMatchByDate(AGGREGATION.EUROPE_DAILY, matchingCondition))
      .exec((err, countries) => {
        if (!err) {
          sendComplete(res, RESPONSE_CODE.SUCCESS.OK, countries)
          debugEnd(methodName, countries.length, true)
        }
        else {
          debugError(methodName, err);
          res.send({ success: false, message: err });
        }
      });

  }
  catch (error) {
    debugCatch(methodName, error);
    return res.send({ success: false, message: error.message });
  }

};


exports.getSelectedCountriesInfo = (req, res) => {

  let methodName = CONST.METHODS.GET_SELECTED_COUNTRIES_INFO
  try {
    debugStart(methodName, req.body)

    let matchingCondition = {
      from: new Date(req.body.from),
      to: new Date(req.body.to),
      selectedCountries: req.body.selectedCountries
    }


    Country.aggregate(
      unwindAndMatchByDateAndName(AGGREGATION.GET_SELECTED_COUNTRY_INFO, matchingCondition))
      .exec((err, selectedData) => {
        if (!err) {
          Country.aggregate(
            unwindAndMatchByDate(AGGREGATION.EUROPE_DAILY, matchingCondition))
            .exec((error, europeData) => {
              if (!error) {
                let result = [{_id: CONST.SELECTED_COUNTRIES.ID, dailyData: selectedData}, {_id: CONST.EUROPE.ID, dailyData: europeData}];

                sendComplete(res, RESPONSE_CODE.SUCCESS.OK, result)
                debugEnd(methodName, result.length, true)
              }
              else {
                debugError(methodName, error);
                res.send({ success: false, message: error });
              }
            });
        }
        else {
          sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, err.message)
          debugError(methodName, err)
        }
      });

  }
  catch (e) {
    sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, err.message)
    debugCatch(methodName, e)
  }

};

exports.updateData = async (req, res) => {
  let methodName = CONST.METHODS.UPDATE_DATA;
  var lastUpdateContinent = null, justUpdate = false;

  try {
    debugStart(methodName, req.body)

    continent = Continent.find({ name: CONST.EUROPE.NAME }, async function (e, docs) {
      if (e) {
        sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, err.message)
        debugError(methodName, err.message)
      }
      else {
        await fetch(CONST.DEFAULT.COVID_UPDATE_URL, { method: "Get" })
          .then(res => res.json())
          .then((json) => {
            let item, continent, country;
            continent = Continent();
            for (var isoCode in json) {
              item = json[isoCode];
              if (item.continent == CONST.EUROPE.NAME) {

                justUpdate = !(docs.length == 0);

                !justUpdate
                  ? country = setCountryData(item, continent, CONST.DEFAULT.DATE, false)
                  : country = setCountryData(item, continent, docs[0]._doc.lastUpdate, true);

                if (!justUpdate) {
                  lastUpdateContinent == null
                    ? lastUpdateContinent = country.lastUpdate
                    : lastUpdateContinent < country.lastUpdate
                      ? lastUpdateContinent = country.lastUpdate
                      : null;
                }
              }
            }

            if (!justUpdate) {
              updateContinentStatistics(continent, lastUpdateContinent);
              sendComplete(res, RESPONSE_CODE.SUCCESS.CORRECT_UPDATE, continent);
              debugEnd(methodName, continent.length, true);

            }
            else {
              sendComplete(res, RESPONSE_CODE.SUCCESS.ALREADY_UPDATED, continent);
              debugEnd(methodName, continent.length, true);
            }
          });
      }
    });
  }
  catch (e) {
    sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, err.message)
    debugCatch(methodName, e)
  }
}

exports.deleteAll = async (req, res) => {
  let methodName = CONST.METHODS.DELETE_ALL;

  try {
    debugStart(methodName, req.body)
    Continent.deleteMany({}, async (e, docs) => {
      if(e){
        sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, e.message)
        debugError(methodName, e.message)
      }
      else
        console.log("Continent deleted")
    });
    Country.deleteMany({}, async (e, docs) => {
      if(e){
        sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, e.message)
        debugError(methodName, e.message)
      }
      else
        console.log("Countries deleted")
    });
    sendComplete(res, RESPONSE_CODE.SUCCESS.OK, "Ok")
    debugEnd(methodName, result.length, true)
  }
  catch (e) {
    sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, e.message)
    debugCatch(methodName, e)
  }
}



function setCountryData(item, continent, lastUpdate, onlyUpdates) {
  try {
    let country = Country({ "name": item.location });
    updateCountryData(country, item);

    // Calculate a sum of data over all the countries
    if (!onlyUpdates) {
      updateContinentData(continent, item);
    }

    let dailyData = DailyData();
    let countryLastUpdate = null;
    let filteredDate = item.data;
    let newData = false;

    // Only updates the newly fetched data
    if (onlyUpdates) {
      filteredDate = item.data.filter((item) => {
        return new Date(item.date) > lastUpdate
      })
    }

    var lastVaccinatedData = {
      people_fully_vaccinated: 0,
      people_vaccinated: 0
    }

    //For each dailyData (filtered by range) compute the information needed
    filteredDate.map((data) => {
      let timestamp = data.date;
      countryLastUpdate == null ? countryLastUpdate = timestamp : countryLastUpdate < timestamp ? countryLastUpdate = timestamp : null;

      updateDailyData(dailyData, timestamp, data);
      updateVaccinatedData(data, lastVaccinatedData);

      country.data.push(dailyData);
      newData = true;
    })

    if (newData) {
      saveNewUpdateInCountry(country, filteredDate, lastVaccinatedData, countryLastUpdate);
      return country;
    }
    else return newData;

  } catch (e) {
    sendError(res, RESPONSE_CODE.ERROR.SERVER_ERROR, err.message)
    debugCatch(methodName, e)
  }

}

function saveNewUpdateInCountry(country, filteredDate, lastVaccinatedData, countryLastUpdate) {
  country.total_cases = filteredDate[filteredDate.length - 1].total_cases;
  country.people_fully_vaccinated = lastVaccinatedData.people_fully_vaccinated;
  country.people_vaccinated = lastVaccinatedData.people_vaccinated;

  country.lastUpdate = countryLastUpdate;

  if (country.total_vaccinations > 0) {
    console.log(filteredDate[filteredDate.length - 1].total_vaccinations);
    console.log(country.name, country.total_vaccinations);
  }
  country.save();
}

function updateCountryData(country, item) {
  country.name = item.location;
  country.continent = item.continent;
  country.population = item.population != null ? item.population : 0;
  country.population_density = item.population_density != null ? item.population_density : 0;
  country.median_age = item.median_age != null ? item.median_age : 0;
  country.age_65_older = item.age_65_older != null ? item.age_65_older : 0;
  country.age_70_older = item.age_70_older != null ? item.age_70_older : 0;
  country.gdp_per_capita = item.gdp_per_capita != null ? item.gdp_per_capita : 0;
  country.extreme_poverty = item.extreme_poverty != null ? item.extreme_poverty : 0;
  country.cardiovasc_death_rate = item.cardiovasc_death_rate != null ? item.cardiovasc_death_rate : 0;
  country.diabetes_prevalence = item.diabetes_prevalence != null ? item.diabetes_prevalence : 0;
  country.female_smokers = item.female_smokers != null ? item.female_smokers : 0;
  country.male_smokers = item.male_smokers != null ? item.male_smokers : 0;
  country.hospital_beds_per_thousand = item.hospital_beds_per_thousand != null ? item.hospital_beds_per_thousand : 0;
  country.life_expectancy = item.life_expectancy != null ? item.life_expectancy : 0;
  country.human_development_index = item.human_development_index != null ? item.human_development_index : 0;
}

function updateContinentData(continent, item) {
  continent.population != null ? continent.population += item.population : 0;
  continent.population_density != null ? continent.population_density += item.population_density : 0;
  continent.median_age != null ? continent.median_age += item.median_age : 0;
  continent.gdp_per_capita != null ? continent.gdp_per_capita += item.gdp_per_capita : 0;
  continent.extreme_poverty != null ? continent.extreme_poverty += item.extreme_poverty : 0;
  continent.cardiovasc_death_rate != null ? continent.cardiovasc_death_rate += item.cardiovasc_death_rate : 0;
  continent.diabetes_prevalence != null ? continent.diabetes_prevalence += item.diabetes_prevalence : 0;
  continent.female_smokers != null ? continent.female_smokers += item.female_smokers : 0;
  continent.male_smokers != null ? continent.male_smokers += item.male_smokers : 0;
  continent.hospital_beds_per_thousand != null ? continent.hospital_beds_per_thousand += item.hospital_beds_per_thousand : 0;
  continent.life_expectancy != null ? continent.life_expectancy += item.life_expectancy : 0;
  continent.human_development_index != null ? continent.human_development_index += item.human_development_index : 0;
}

function updateDailyData(dailyData, timestamp, data) {
  dailyData.date = timestamp;
  dailyData.total_cases = data.total_cases;
  dailyData.new_cases = data.new_cases;
  dailyData.new_cases_smoothed = data.new_cases_smoothed;
  dailyData.total_deaths = data.total_deaths;
  dailyData.new_deaths = data.new_deaths;
  dailyData.new_deaths_smoothed = data.new_deaths_smoothed;
  dailyData.total_cases_per_million = data.total_cases_per_million;
  dailyData.new_cases_per_million = data.new_cases_per_million;
  dailyData.new_cases_smoothed_per_million = data.new_cases_smoothed_per_million;
  dailyData.total_deaths_per_million = data.total_deaths_per_million;
  dailyData.new_deaths_per_million = data.new_deaths_per_million;
  dailyData.new_deaths_smoothed_per_million = data.new_deaths_smoothed_per_million;
  dailyData.reproduction_rate = data.reproduction_rate;
  dailyData.new_tests_smoothed = data.new_tests_smoothed;
  dailyData.new_tests_smoothed_per_thousand = data.new_tests_smoothed_per_thousand;
  dailyData.positive_rate = data.positive_rate;
  dailyData.tests_per_case = data.tests_per_case;
  dailyData.tests_units = data.tests_units;
  dailyData.stringency_index = data.stringency_index;
  dailyData.new_vaccinations_smoothed = data.new_vaccinations_smoothed;
  dailyData.people_fully_vaccinated = data.people_fully_vaccinated; // 2 doses
  dailyData.people_vaccinated = data.people_vaccinated; // 1 dose
}

function updateVaccinatedData(data, lastVaccinatedData) {
  data.people_fully_vaccinated != null
    ? lastVaccinatedData.people_fully_vaccinated = data.people_fully_vaccinated
    : null;

  data.people_vaccinated != null
    ? lastVaccinatedData.people_vaccinated = data.people_vaccinated
    : null;
}

function updateContinentStatistics(continent, lastUpdate) {
  continent.population_density /= CONST.EUROPE.NUM_COUNTRIES;
  continent.median_age /= CONST.EUROPE.NUM_COUNTRIES;
  continent.gdp_per_capita /= CONST.EUROPE.NUM_COUNTRIES;
  continent.extreme_poverty /= CONST.EUROPE.NUM_COUNTRIES;
  continent.cardiovasc_death_rate /= CONST.EUROPE.NUM_COUNTRIES;
  continent.diabetes_prevalence /= CONST.EUROPE.NUM_COUNTRIES;
  continent.female_smokers /= CONST.EUROPE.NUM_COUNTRIES;
  continent.male_smokers /= CONST.EUROPE.NUM_COUNTRIES;
  continent.hospital_beds_per_thousand /= CONST.EUROPE.NUM_COUNTRIES;
  continent.life_expectancy /= CONST.EUROPE.NUM_COUNTRIES;
  continent.human_development_index /= CONST.EUROPE.NUM_COUNTRIES;
  continent.lastUpdate = lastUpdate;
  continent.save();
}


exports.kmeansTest = (req, res) => {
  const data = [
    { 'country': 'Italy', 'positive': 91259, 'deaths': 60420, 'gdp': 1.4 },
    { 'country': 'France', 'positive': 400000, 'deaths': 98787, 'gdp': 3.4 },
    { 'country': 'Spain', 'positive': 700, 'deaths': 716, 'gdp': 1.5 },
    { 'country': 'Germany', 'positive': 48000, 'deaths': 11567, 'gdp': 2.4 },
    { 'country': 'UK', 'positive': 14000, 'deaths': 6426, 'gdp': 1.09 },
    { 'country': 'Poland', 'positive': 15000, 'deaths': 8700, 'gdp': 0.8 },
  ];

  // Create the data 2D-array (vectors) describing the data
  let vectors = new Array();
  for (let i = 0; i < data.length; i++) {
    vectors[i] = [data[i]['positive'], data[i]['deaths'], data[i]['gdp']];
  }

  kmeans.clusterize(vectors, { k: 2 }, (err, result) => {
    if (err) console.error(err);
    else {

      res.send({
        success: true,
        status: 200,
        data: result,
      });
    }
  });


}
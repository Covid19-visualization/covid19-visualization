const mongoose = require("mongoose");
const fetch = require('node-fetch');

const Country = require('../models/country.model');
const Continent = require('../models/continent.model');
const DailyDataScheme = require('../models/dailyData.model');
const DailyData = mongoose.model("DailyData", DailyDataScheme);

const { CONST } = require("../utils/utils");

exports.getCountryInfo = (req, res) => {
  try {
    console.log(`DEBUG START: getCountryInfo'`);

    var countryId = req.countryId;
    Country.findById({ _id: countryId })
      .exec((err, country) => {
        if (!err) {
          res.send({
            success: true,
            status: 200,
            data: country._doc,
          });
        }
        else {
          console.error(`ERROR: getCountryInfo : country error > ${JSON.stringify(err)}`);
          res.send({ success: false, message: err });
        }
      });
    console.log(`DEBUG END: getCountryInfo`);
  }
  catch (e) {
    console.error(`CATCH: getCountryInfo : country error > ${e}`);
    return res.send({ success: false, message: e.message });
  }

};

exports.getAllCountryInfo = (req, res) => {
  try {
    console.log(`DEBUG START: getAllCountryInfo'`);

    Country.find({})
      .select("-data")
      .exec((err, countries) => {
        if (!err) {
          res.send({
            success: true,
            status: 200,
            data: countries,
          });
          console.log(`DEBUG END: getAllCountryInfo`);
        }
        else {
          console.error(`ERROR: getAllCountryInfo : country error > ${JSON.stringify(err)}`);
          res.send({ success: false, message: err });
        }
      });
  }
  catch (e) {
    console.error(`CATCH: getAllCountryInfo : country error > ${e}`);
    return res.send({ success: false, message: e.message });
  }

};

exports.updateData = async (req, res) => {
  try {
    console.log(`DEBUG START: updateData`);

    let url = "https://covid.ourworldindata.org/data/owid-covid-data.json"
    let settings = { method: "Get" };
    let item, continent, country;
    var lastUpdateContinent = null;
    var justUpdate = false;

    continent = Continent.find({ name: 'Europe' }, async function (e, docs) {
      if (e) {
        console.error(`CATCH: updateData : error > ${e}`);
        return res.send({ success: false, message: e.message });
      }
      else {
        await fetch(url, settings)
          .then(res => res.json())
          .then((json) => {
            continent = Continent();
            for (var isoCode in json) {
              item = json[isoCode];
              if (item.continent == "Europe") {

                justUpdate = !(docs.length == 0);

                !justUpdate
                  ? country = setCountryData(item, continent, "1900-01-01", false)
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
              res.send({
                success: true,
                status: 200,
                message: "Data updated correctly."
              });
            }
            else {
              res.send({
                success: true,
                status: 400,
                message: "Data already updated."
              });
            }

          });
        console.log(`DEBUG END: updateData`);
      }
    });

  }
  catch (e) {
    console.error(`CATCH: updateData : error > ${e}`);
    return res.send({ success: false, message: e.message });
  }
}


function setCountryData(item, continent, lastUpdate, onlyUpdates) {
  try {
    let country = Country();
    country.name = item.location;
    country.continent = item.continent;
    country.population = item.population;
    country.population_density = item.population_density;
    country.median_age = item.median_age;
    country.age_65_older = item.age_65_older;
    country.age_70_older = item.age_70_older;
    country.gdp_per_capita = item.gdp_per_capita;
    country.extreme_poverty = item.extreme_poverty;
    country.cardiovasc_death_rate = item.cardiovasc_death_rate;
    country.diabetes_prevalence = item.diabetes_prevalence;
    country.female_smokers = item.female_smokers;
    country.male_smokers = item.male_smokers;
    country.hospital_beds_per_thousand = item.hospital_beds_per_thousand;
    country.life_expectancy = item.life_expectancy;
    country.human_development_index = item.human_development_index;

    if (!onlyUpdates) {
      continent.population != null ? continent.population += item.population : null;
      continent.population_density != null ? continent.population_density += item.population_density : null;
      continent.median_age != null ? continent.median_age += item.median_age : null;
      continent.gdp_per_capita != null ? continent.gdp_per_capita += item.gdp_per_capita : null;
      continent.extreme_poverty != null ? continent.extreme_poverty += item.extreme_poverty : null;
      continent.cardiovasc_death_rate != null ? continent.cardiovasc_death_rate += item.cardiovasc_death_rate : null;
      continent.diabetes_prevalence != null ? continent.diabetes_prevalence += item.diabetes_prevalence : null;
      continent.female_smokers != null ? continent.female_smokers += item.female_smokers : null;
      continent.male_smokers != null ? continent.male_smokers += item.male_smokers : null;
      continent.hospital_beds_per_thousand != null ? continent.hospital_beds_per_thousand += item.hospital_beds_per_thousand : null;
      continent.life_expectancy != null ? continent.life_expectancy += item.life_expectancy : null;
      continent.human_development_index != null ? continent.human_development_index += item.human_development_index : null;
    }

    let dailyData = DailyData();
    let countryLastUpdate = null;
    let filteredDate = item.data;
    let newData = false;

    if (onlyUpdates) {
      filteredDate = item.data.filter((item) => {
        return new Date(item.date) > lastUpdate
      })
    }


    filteredDate.map((data) => {
      let timestamp = data.date;

      countryLastUpdate == null ? countryLastUpdate = timestamp : countryLastUpdate < timestamp ? countryLastUpdate = timestamp : null;
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

      country.data.push(dailyData);
      newData = true;
    })

    if (newData) {
      country.total_cases = filteredDate[filteredDate.length - 1].total_cases
      country.lastUpdate = countryLastUpdate;
      country.save();
      return country;
    }
    else return newData;

  } catch (e) {
    console.error(`CATCH: updateData : error > ${e}`);
    return res.send({ success: false, message: e.message });
  }

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

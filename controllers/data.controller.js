const mongoose = require("mongoose");
const fs = require('fs');
const http = require('http');
const https = require('https');
const config = require('../config.js');
const fetch = require('node-fetch');

const Country = require('../models/country.model');
const DailyDataScheme = require('../models/dailyData.model');
const DailyData = mongoose.model("DailyData", DailyDataScheme);




exports.getCountryInfo = (req, res) => {
  try {
    console.log(`${req.decoded._id} DEBUG START: getCountryInfo'`);

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
          console.error(`${req.decoded._id}  ERROR: getCountryInfo : country error > ${JSON.stringify(err)}`);
          res.send({ success: false, message: err });
        }
      });
    console.log(`${req.decoded._id} DEBUG END: getCountryInfo`);
  }
  catch (e) {
    console.error(`${req.decoded._id} + ' CATCH: getCountryInfo : country error > ${e}`);
    return res.send({ success: false, message: e.message });
  }

};

exports.updateData = async (req, res) => {
  try {
    console.log(`DEBUG START: updateData`);

    let url = "https://covid.ourworldindata.org/data/owid-covid-data.json"
    let data = {};
    let settings = { method: "Get" };
    let nation, country;

    await fetch(url, settings)
      .then(res => res.json())
      .then((json) => {
        for (var isoCode in json) {
          nation = json[isoCode];
          if (nation.continent == "Europe") {
            country = Country();
            country.name = nation.location;
            country.continent = nation.continent;
            country.population = nation.population;
            country.population_density = nation.population_density;
            country.median_age = nation.median_age;
            country.age_65_older = nation.age_65_older;
            country.age_70_older = nation.age_70_older;
            country.gdp_per_capita = nation.gdp_per_capita;
            country.extreme_poverty = nation.extreme_poverty;
            country.cardiovasc_death_rate = nation.cardiovasc_death_rate;
            country.diabetes_prevalence = nation.diabetes_prevalence;
            country.female_smokers = nation.female_smokers;
            country.male_smokers = nation.male_smokers;
            country.hospital_beds_per_thousand = nation.hospital_beds_per_thousand;
            country.life_expectancy = nation.life_expectancy;
            country.human_development_index = nation.human_development_index;

            let dailyData = DailyData();

            nation.data.map((data) => {
              dailyData.date = data.date;
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
            })

            country.save();
          }
        }
      });
    res.send({
      success: true,
      status: 200,
      data: data != null ? data : null,
      message: data != null ? "Data updated correctly." : "There are no more updates."
    });

    console.log(`DEBUG END: updateData`);
  }
  catch (e) {
    console.error(`CATCH: updateData : error > ${e}`);
    return res.send({ success: false, message: e.message });
  }
}




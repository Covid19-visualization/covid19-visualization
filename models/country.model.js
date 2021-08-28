"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
const DailyDataSchema = require("./dailyData.model");

var CountrySchema = new Schema({
  name: String,
  continent: String,
  population: { type: Number, default: 0 },
  total_cases: { type: Number, default: 0},
  population_density: { type: Number, default: 0 },
  median_age:{ type: Number, default: 0 },
  age_65_older: { type: Number, default: 0 },
  age_70_older: { type: Number, default: 0 },
  gdp_per_capita: { type: Number, default: 0 },
  extreme_poverty: { type: Number, default: 0 },
  cardiovasc_death_rate: { type: Number, default: 0 },
  diabetes_prevalence: { type: Number, default: 0 },
  female_smokers: { type: Number, default: 0 },
  male_smokers: { type: Number, default: 0 },
  hospital_beds_per_thousand:{ type: Number, default: 0 },
  life_expectancy: { type: Number, default: 0 },
  human_development_index: { type: Number, default: 0 },
  lastUpdate: Date,
  data: [DailyDataSchema],
}).plugin(mongoosePaginate);


var Country = mongoose.model("Country", CountrySchema);
module.exports = Country;

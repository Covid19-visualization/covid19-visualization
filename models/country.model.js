"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
const DailyDataSchema = require("./dailyData.model");

var CountrySchema = new Schema({
  name: String,
  continent: String,
  population: Number,
  population_density: Number,
  median_age: Number,
  age_65_older: Number,
  age_70_older: Number,
  gdp_per_capita: Number,
  extreme_poverty: Number,
  cardiovasc_death_rate: Number,
  diabetes_prevalence: Number,
  female_smokers: Number,
  male_smokers: Number,
  hospital_beds_per_thousand: Number,
  life_expectancy: Number,
  human_development_index: Number,
  data: [DailyDataSchema],
}).plugin(mongoosePaginate);


var Country = mongoose.model("Country", CountrySchema);
module.exports = Country;

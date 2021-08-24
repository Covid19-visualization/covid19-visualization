"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var DailyDataSchema = new Schema({
    date: Date,
    total_cases: String,
    new_cases: Number,
    new_cases_smoothed: Number,
    total_deaths: Number,
    new_deaths: Number,
    new_deaths_smoothed: Number,
    total_cases_per_million: Number,
    new_cases_per_million: Number,
    new_cases_smoothed_per_million: Number,
    total_deaths_per_million: Number,
    new_deaths_per_million: Number,
    new_deaths_smoothed_per_million: Number,
    reproduction_rate: Number,
    icu_patients: Number,
    icu_patients_per_million: Number,
    hosp_patients: Number,
    hosp_patients_per_million: Number,
    new_tests: Number,
    total_tests: Number,
    total_tests_per_thousand: Number,
    new_tests_per_thousand: Number,
    new_tests_smoothed: Number,
    new_tests_smoothed_per_thousand: Number,
    positive_rate: Number,
    tests_per_case: Number,
    tests_units: String,
    stringency_index: Number,
}).plugin(mongoosePaginate);


var DailyData = mongoose.model("DailyData", DailyDataSchema);
module.exports = DailyDataSchema;

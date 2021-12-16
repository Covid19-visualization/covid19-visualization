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
    stringency_index: Number,
    new_vaccinations_smoothed: Number,
    people_fully_vaccinated: Number,
    people_vaccinated: Number,
    total_boosters: Number
}).plugin(mongoosePaginate);


var DailyData = mongoose.model("DailyData", DailyDataSchema);
module.exports = DailyDataSchema;

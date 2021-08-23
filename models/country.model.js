"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
//const crypto = require('crypto');
const bcrypt = require("bcrypt");
const { CONST } = require("../config");

var CountrySchema = new Schema({
  name: String,
}).plugin(mongoosePaginate);


var Country = mongoose.model("Country", CountrySchema);
module.exports = Country;

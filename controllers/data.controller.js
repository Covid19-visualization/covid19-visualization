const Country = require('../models/country.model');
const fs = require('fs');
const http = require('http');
const https = require('https');
const config = require('../config.js');
const fetch = require('node-fetch');



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
          if(nation.continent == "Europe") {
            country = Country();
            country.name = nation.location;
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




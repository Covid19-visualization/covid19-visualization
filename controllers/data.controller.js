const Country = require('../models/country.model');
var config = require('../config.js');

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
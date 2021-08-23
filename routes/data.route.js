
module.exports = function (app) {
    var data = require('../controllers/data.controller');

    app.post('/data/getCountryInfo', data.getCountryInfo);                                      // get country info

};


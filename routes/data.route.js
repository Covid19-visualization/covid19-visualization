
module.exports = function (app) {

    var data = require('../controllers/data.controller');

    app.post('/data/getCountryInfo', data.getCountryInfo);                                     // get country info
    app.get('/data/getAllCountryInfo', data.getAllCountryInfo);                                // get all country info
    app.post('/data/updateData', data.updateData);                                             // update data
    
};


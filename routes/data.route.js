
module.exports = function (app) {

    var data = require('../controllers/data.controller');

    app.post('/data/getCountryInfo', data.getCountryInfo);                                     // get country info
    app.post('/data/getAllCountryInfo', data.getAllCountryInfo);                               // get all country info
    app.post('/data/getSelectedCountriesInfo', data.getSelectedCountriesInfo);                 // get selected country info
    app.post('/data/getEuropeDailyData', data.getEuropeDailyData);                             // get europe daily data info
    app.post('/data/updateData', data.updateData);                                             // update data
    app.post('/data/kmeansTest', data.kmeansTest);                                             // update data

    app.delete('/data/deleteAll', data.deleteAll);                                             // delete all records on DB
    app.post('/data/computePca', data.computePca);

};


const NefitEasyClient = require('nefit-easy-commands');
const Promise         = require('bluebird');
const client          = NefitEasyClient({
    serialNumber : process.env.NEFIT_SERIAL_NUMBER,
    accessKey    : process.env.NEFIT_ACCESS_KEY,
    password     : process.env.NEFIT_PASSWORD
});
var request = require('request');

client.connect().then(function() {
    console.log('Connected');
    updateStats();
});

function updateStats() {
   Promise.try(function() {
        return [ client.status(), client.pressure() ];
    }).spread((status, pressure) => {

        boilerIndicator = true;
        if (status['boiler indicator'] == 'off') {
            boilerIndicator = false;
        }
        body =
            'temp_setpoint,source=nefiteasy value=' + status['temp setpoint'].toFixed(2) + '\n' +
            'temp_current,source=nefiteasy value=' + status['in house temp'].toFixed(2) + '\n' +
            'temp_outdoor,source=nefiteasy value=' + status['outdoor temp'].toFixed(2) + '\n' +
            'ps_active,source=nefiteasy value=' + status['ps active'] + '\n' +
            'fp_active,source=nefiteasy value=' + status['fp active'] + '\n' +
            'boiler_indicator,source=nefiteasy value=' + boilerIndicator + '\n' +
            'boiler_indicator,source=nefiteasy value=' + boilerIndicator + '\n' +
            'pressure,source=nefiteasy value=' + pressure.pressure;

        request({
            method: 'POST',
            uri: process.env.INFLUXDB_URI,
            body: body
        }, function (error, response, body) {
            if (error) {
                console.error('Request Error: ' + error);
                return;
            }
            console.log('Send status to InfluxDB, status: ' + response.statusCode);
        });
    }).catch((e) => {
        console.error('Error', e);
    }).finally(function() {
        setTimeout(updateStats, 30000);
    });
}

const NefitEasyClient = require('nefit-easy-commands');
const Promise         = require('bluebird');
const request = require('request');
const client          = NefitEasyClient({
    serialNumber : process.env.NEFIT_SERIAL_NUMBER,
    accessKey    : process.env.NEFIT_ACCESS_KEY,
    password     : process.env.NEFIT_PASSWORD
});

client.connect().then(function() {
    console.log('Connected');
    updateStats();
});

const updateStats = () => {
    Promise.try(() => {
        return [ client.status(), client.pressure(), client.get('/heatingCircuits/hc1/actualSupplyTemperature') ];
    }).spread((status, pressure, supplyTemperature) => {

        let centralHeating = false;
        let hotWater = false;
        if (status['boiler indicator'] === 'central heating') {
            centralHeating = true;
        }
        if (status['boiler indicator'] === 'hot water') {
            hotWater = true;
        }
        const body =
            'temp_setpoint,source=nefiteasy value=' + status['temp setpoint'].toFixed(2) + '\n' +
            'temp_current,source=nefiteasy value=' + status['in house temp'].toFixed(2) + '\n' +
            'temp_outdoor,source=nefiteasy value=' + status['outdoor temp'].toFixed(2) + '\n' +
            'temp_supply,source=nefiteasy value=' + supplyTemperature['value'].toFixed(2) + '\n' +
            'ps_active,source=nefiteasy value=' + status['ps active'] + '\n' +
            'fp_active,source=nefiteasy value=' + status['fp active'] + '\n' +
            'centralheating,source=nefiteasy value=' + centralHeating + '\n' +
            'hotwater,source=nefiteasy value=' + hotWater + '\n' +
            'pressure,source=nefiteasy value=' + pressure.pressure;

        request({
            method: 'POST',
            uri: process.env.INFLUXDB_URI,
            body: body
        }, (error, response, body) => {
            if (error) {
                console.error('Request Error: ' + error);
                return;
            }
            console.log('Send status to InfluxDB, status: ' + response.statusCode);
        });
    }).catch((e) => {
        console.error('Error', e);
    }).finally(() => {
        setTimeout(updateStats, 30000);
    });
};

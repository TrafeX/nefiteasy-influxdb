Publish Netfit Easy metrics to InfluxDB
=======================================

Every 30 seconds this will send the temperatures, boiler state and pressure to InfluxDB


[![Docker Pulls](https://img.shields.io/docker/pulls/trafex/nefiteasy-influxdb.svg)](https://hub.docker.com/r/trafex/nefiteasy-influxdb/)


Usage
-----

    docker run -d --name nefiteasy -e "NEFIT_SERIAL_NUMBER=<serial number>" -e "NEFIT_ACCESS_KEY=<accesskey>" -e "NEFIT_PASSWORD=<password>" -e "INFLUXDB_URI=http://<InfluxDB uri>:8086/write?db=nefiteasy" trafex/nefiteasy-influxdb

Debugging
---------
Add:

    -v "$PWD":/usr/src/app -w /usr/src/app

Nefit Easy
----------
Communicating with the Nefit Easy is done with the [Nefit Easy Commands](https://github.com/robertklep/nefit-easy-commands) package.

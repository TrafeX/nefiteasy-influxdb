Publish Netfit Easy metrics to InfluxDB
=======================================

Every 10 seconds this will send the temperatures, boiler state and pressure to InfluxDB.

Usage
-----

    docker run -it --rm --name nefiteasy -e "NEFIT_SERIAL_NUMBER=<serial number>" -e "NEFIT_ACCESS_KEY=<accesskey>" -e "NEFIT_PASSWORD=<password>" -e "INFLUXDB_URI=http://<UnfluxDB uri>:8086/write?db=nefiteasy" nefiteasy


Nefit Easy
----------
Communicating with the Nefit Easy is done with the [Nefit Easy Commands](https://github.com/robertklep/nefit-easy-commands) package.

Publish Netfit Easy metrics to InfluxDB
=======================================

Every 10 seconds this will send the temperatures, boiler state and pressure to InfluxDB

Usage
-----

    docker run -it --rm --name nefiteasy -e "NEFIT_SERIAL_NUMBER=<serial number>" -e "NEFIT_ACCESS_KEY=<accesskey>" -e "NEFIT_PASSWORD=<password>" -e "INFLUXDB_URI=http://<UnfluxDB url>:8086/write?db=nefiteasy" nefiteasy

STC\-1000+
========

Improved firmware for fermentation and Arduino based uploader for the STC-1000 dual stage thermostat.

![STC-1000](http://img.diytrade.com/cdimg/1066822/11467124/0/1261107339/temperature_controllers_STC-1000.jpg)

The STC-1000 is a dual stage (heating and cooling) thermostat that is pretty cheap to buy. I (and a low of fellow homebrewers) use them to control the fermentation temperature of beer.

The goal of this project is twofold
 * To create the means to reprogram the STC-1000 with a custom firmware
 * To create a custom firmware, suited for fermenting beer

The first goal is achieved by using an Arduino (UNO and Pro Mini verified to work) with a sketch to act as a programmer, and the second by using the SDCC compiler and GPUTILS. 

Download by visiting the [releases page](https://github.com/matsstaff/stc1000p/releases)
and start by reading [the user manual](/usermanual/usermanual.md)

Features
--------

* Both Fahrenheit and Celsius versions
* Up to 6 profiles with up to 10 setpoints.
* Each setpoint can be held for 1-999 hours (i.e. up to ~41 days).
* Somewhat intuitive menus for configuring
* Separate delay settings for cooling and heating
* Configurable hysteresis (allowable temp swing) from 0.0 to 2.5°C or 0.0 to 5.0°F
* User definable alarm when temperature is out of or within range
* Optionally limit heating and cooling by input from 2nd temp probe
* Approximative ramping
* Button acceleration, for frustrationless programming by buttons

Updates
-------

|Date|Release|Description|
|----|-------|-----------|
|2014-04-04|v1.00|First release|
|2014-04-11|v1.01|Increase approximative ramping steps to 64|
|2014-04-15|v1.02|Improved temperature averaging|
|2014-04-16|v1.03|Added leaky integration filtering, improved averaging (+ bugfix)|
|2014-05-25|v1.04|A couple of minor improvements and a minor bugfix|
|2014-08-02|v1.05|Reset both heating and cooling delay when either heating or cooling cycle ends. Improved power off| functionality, increased button debounce time, allow longer heating delays.|  
|2014-09-??|v1.06|Add functionality for 2nd temp probe (to limit heating/cooling). Display 'OFF' in soft off mode. Added user definable temperature alarm. Added profile 'editor' webpage.|

Some excellent user provided content
------------------------------------
STC-1000+ Menu Navigation by Will Conrad   
[![STC-1000+ Menu Navigation by Will Conrad](http://img.youtube.com/vi/u95BEq3bk7Q/0.jpg)](http://youtu.be/u95BEq3bk7Q)

STC-1000+ Temp Profile Programming by Will Conrad   
[![STC-1000+ Temp Profile Programming by Will Conrad](http://img.youtube.com/vi/nZst7ETP-w8/0.jpg)](http://youtu.be/nZst7ETP-w8)

[STC-1000+ Profile Builder Spreadsheet by Will Conrad](http://www.blackboxbrew.com/s/STC-1000-Profile-Builder.xlsx "STC-1000+ Profile Builder Spreadsheet by Will Conrad")   

STC-1000+ Flashing Firmware by Will Conrad   
[![STC-1000+ Firmware Flashing by Will Conrad](http://img.youtube.com/vi/-DdTweLYyN0/0.jpg)](http://youtu.be/-DdTweLYyN0)

STC-1000+ Firmware upload by Matt Hall   
[![STC-1000+ Firmware upload by Matt Hall](http://img.youtube.com/vi/oAZKI5U_SoM/0.jpg)](http://youtu.be/oAZKI5U_SoM)

# node-red-contrib-opi

# Control I/O for Digital Pins
There are two nodes, one for output and one for input.
These are Node-RED nodes that interface GPIO pins on Orange Pi boards as well as on other Pi's.

# Background
These nodes are using the great [onoff] library, which includes the pins via the sysfs filesytem. Therefore, it should work on all platforms that support sysfs.
Your system should have the path /sys/class/gpio/ and this directory should be populated. Watch for additional entries if node-red start flows using GPIO.

# Additional Setup
Run node-red from console and watch for error messages. 
In order to use GPIO also as a standard user without root rights, some conditions have to be fulfilled.
* The user group `gpio` must exist and the user must belong to this group.
* The kernel must map gpio access to the user space, but this is not necessarily always the default behaviour.

### User setup
To meet these requirements for user `pi`, run this commands as root:
Check if user `pi` belongs to `gpio`:
```sh
$ groups pi
```
Otherwise, run this:
```sh
$ addgroup gpio
$ usermod -a -G gpio pi
```
If `pi` is not allowed to use GPIO now, additional steps are required: 
### Kernel Setup
Create a new file: 
```sh
$ touch /etc/udev/rules.d/99-com.rules
```
copy this text to the file:
```sh
KERNEL=="gpio*", RUN="/bin/sh -c 'chgrp -R gpio /sys/%p /sys/class/gpio && chmod -R g+w /sys/%p /sys/class/gpio'" 
```
and do a reboot.

# Remarks
This is tested on Orange Pi PC, Banana Pi M1, Banana Pi M2+ under Armbian.
Compared to the solution, which is provided for Raspberry Pi, this way is much more efficient. The whole code runs direct in Node.js and uses kernel live support.
But Raspberry Pi I/O nodes create for each pin an own shell and run a not so lightweighted Python process in it... 
If you have a new set of gpio pins tested at another Pi, feel free to send me a file with pin-number, pin and IO-port name which I can include to the setup.

g.prand(at)gmail.com

# Release history
0.0.7
Added support for Active Low pin mode.
Thank you, Stanislav Y.

0.0.6
Update dependencies

0.0.5
Added Orange Pi Zero Plus 2 (h5).
Changed to the latest onoff library.

0.0.4   
Wrong pin numbering corrected. 
Added pins to NanoPi Neo/Air.
Section "other" now defaults to PA0 after initial selection.

0.0.3   
Added some Pi's, changed interrupt initialisation and warning.
If you upgrade your flows from 0.0.2, you should delete GPIO nodes and then add again.

0.0.2
First release

   [onoff]: <https://github.com/fivdi/onoff>
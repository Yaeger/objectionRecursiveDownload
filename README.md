
![objectionRecursiveDownloadLogo](https://github.com/Yaeger/objectionRecursiveDownload/blob/master/images/objectionRecursiveDownload.png) 
<br> 
[![licence badge]][licence] 
[![stars badge]][stars] 
[![forks badge]][forks] 
[![issues badge]][issues] |

[licence badge]:https://img.shields.io/badge/license-New%20BSD-blue.svg
[stars badge]:https://img.shields.io/github/stars/Yeager/objectionRecursiveDownload.svg
[forks badge]:https://img.shields.io/github/forks/NetSPI/objectionRecursiveDownload.svg
[issues badge]:https://img.shields.io/github/issues/Yaeger/objectionRecursiveDownload.svg

[licence]:https://github.com/Yaeger/objectionRecursiveDownload/blob/master/LICENSE
[stars]:https://github.com/Yaeger/objectionRecursiveDownload/stargazers
[forks]:https://github.com/Yaeger/objectionRecursiveDownload/network
[issues]:https://github.com/Yaeger/objectionRecursiveDownload/issues

### objectionRecursiveDownload: A simple node.js wrapper script written to recursively download an application directory through sensepost's objection toolkit and the Frida instrumentation toolkit.

The scripts requires frida and objection to be installed localy and can support either an injected frida-gadget or frida-server on the device. 

***

Usage: node dl.js [options]

This script wraps the objection tool from sensepost to recursively download application files from a connected device.

Options:
                -j --gadget option passed to objection

Example: node dl.js -j '--gadget "App Name"'

***

### Author, Contributors, and License
* Author: Aaron Yaeger - 2019
* License: BSD 3-Clause
* Required Dependencies: [node.js](https://nodejs.org/en/) [frida](https://www.frida.re) [objection](https://github.com/sensepost/objection)

### Issue Reports

I'm sure there are issues, but seeing that only a handful of people ever have used the script, they don't tell me about them... :)

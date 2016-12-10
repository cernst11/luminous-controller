Luminous Controller
==================

A REST, and UDP interface for controlling WS2812 LEDS connected to a Raspberry pi (Has been tested and rpi B+ rpi0 and rpi 3) 

Note* Websocket interface has been depercaetd due to not working correctly with http2. WebRTC data channel may replace it in a future release

Installation
===

Install nodejs onto your raspberry pi running your favorite linux distribution.

Install `bower` globally
  sudo npm -g install bower
  
Install `npm` dependencies for REST and Websocket controller 

    ssh to your raspberry pi

    git clone https://github.com/cernst11/luminous-controller.git
  
    cd luminous-controller 
    npm install
    
    Wait a while...
    Wait some more.....
    Wait a few more minutes.....

Configure your server and light properties in config/default.json

    strip properties - The properties of the 
    num_leds : how many leds on the light strip
    location : The location of the Strip
    strandType : The strand Type. Default ws2812 (currently only working one)

Generate your own cert  on the raspberry pi in the Root of the luminous-controller folder

    ssh to your pi if you are not already there
    
    cd to the luminous-controller directory
    
    openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
    openssl rsa -passin pass:x -in server.pass.key -out server.key
    rm server.pass.key

    openssl req -new -key server.key -out server.csrlow
    Follow the onscreen prompts

    openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt

Configure luminous-app. Currently there is no auto device discovery so we need to configure manually 😢

    ssh to your pi if you are not already there

    sudo npm -g install polymer-cli
    Wait a while...
    Wait some more.....
    Wait a few more minutes.....

    cd the containing directory of luminous-controller not inside!
    
    git clone https://github.com/cernst11/luminous-app.git

    cd luminous-app
    open src/my-lights.html
    add the luminous-chrome element with the deviceurl parameter under the closing style tag

    <luminous-chrome deviceurl="http://192.168.1.112:3000"></luminous-chrome>

    Build the app
    polymer build

    polymer serve build/unbundled -H 'ip address of pi'

    Note: If the server is not running you will just see a app shell

    Check in your favorite modern browser that it is loaded

    Copy build to dist in luminous-app
    cp -R build/unbundled ../luminous-app/dist
  
To run -- Important must be ran as sudo

    sudo node bin/www
    Tip: use nodemon to automatically reload backend changes
  

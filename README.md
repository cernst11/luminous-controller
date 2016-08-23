Luminous Controller
==================

A REST,  Websocket adn UDP interface for controlling WS2812 LEDS connected to a Raspberry pi (Only has been tested on version 1 model B)

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

Install `bower` dependencies for frontend (This may be removed and moved in to seperate project the individual polymer elements already are)

    bower install
    Wait some more....
    gulp to compile front end 
  
To run -- Important must be ran as sudo

    sudo node bin/www
    Tip: use nodemon to automatically reload backend changes
  

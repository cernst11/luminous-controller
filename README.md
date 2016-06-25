# luminous-controller

A ws2812 led controller with a websocket and REST interface. 

# Using luminous controller 

Luminous controller is an Express appication with a polymer frontend. 

To build the application:

Clone the git repository to your raspberry pi(This has only been tested on the original) 

bower install

npm install

gulp 

Use the bower scipt to compile the backend and use the gulp for the frontend which will be placed in public/dist.

The two main elements to control the lights are provided as seprate polymer elements



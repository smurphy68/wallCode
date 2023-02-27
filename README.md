# wallCode

The aim of this project is to add programmable functionality to my home climbing wall.
Each hold on the wall has an accompanying LED, which can light up in four states - red, green, blue, and cyan. These indicate an end hold, start hold, route hold and a foot only hold.

The leds are controlled by a series of raspberry pi picos, which are inturn all controlled by one raspberry pi pico-w (wifi enables).

The client will be a web page that has a grid of holds, representing the current climbing wall. Each of the elements will toggle between each of the states. When the route is submitted, the user has the option of saving the route with some meta-data. The submission of the route will send a stream of data to the pico-w server which distributes commands to each of the LED picos. The relevent LEDs will then display the submitted state.

This project has four elements:
  1. The pico script controlling the LEDs (micropython)
  2. The pico-w script controlling the other micro-controllers (micropython)
  3. The node server connecting the pico-w and the client (node.js JavaScript)
  4. The client interface (Javascript, HMTL, CSS)

The next step in the project is to add functionality to the LED controllers, so they can recieve a new script through the web-socket instead of having to take the wall down and upload the script to each individual controller.

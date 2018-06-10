# ACLED-deckgl
Data from the [Armed Conflict Location and Event Data Project](https://www.acleddata.com) (ACLED)
rendered using a 3D heatmap.

![Screenshot](./images/screenshot.png?raw=true)

## Description
This project is a modified version of the hexagon-cell [deck.gl example](https://github.com/uber/deck.gl), adding a time-slider to render data sets on a per-year basis or to dynamically combine groups of years.

Also uses [blueprint.js](http://blueprintjs.com) React components for UI elements.

### Live Demo
https://douglasgmurphy.com/demos/acled-viz/

## Installation
1. Clone the repository:
``` 
git clone https://github.com/dgmurphy/acled-deckgl.git && cd acled-deckgl
```
2. Install dependencies:
``` 
npm install
```
3. Set Mapbox Token:
```
export MapboxAccessToken=<your mapbox api key here>
```
Or, set the variable MAPBOX_TOKEN at the top of `app.js`

4. Start the dev server
```
npm start
```
Open http://localhost:3000 in your browser.


## Usage
Data for this visualization was downloaded from ACLED and converted to the simple format used by deck.gl. The `data` folder in this project contains one input file per year.


### More
Notes on the development and lessons learned at https://douglasgmurphy.com/acled-deckgl


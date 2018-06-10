/* global window,document */
import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './components/deckgl-overlay.js';
import LayerControls from './components/layer-controls';
import autobind from 'react-autobind';
import { DataFiles } from './components/data-files.js';

import { csv as requestCsv } from 'd3-request';


let MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
// If not using an environment var, Set your mapbox token here
if (!MAPBOX_TOKEN)
  MAPBOX_TOKEN = "mapbox-token-here";

const INITIAL_YEAR = 2008;
const FINAL_YEAR = 2018;
const NUM_DATASETS = FINAL_YEAR - INITIAL_YEAR + 1;

class Root extends Component {

  constructor(props) {

    super(props);
    autobind(this);

    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      opacity: 0.75,
      coverage: 0.9,
      radius: 57000,
      elevScale: 10000,
      data: [],
      rangeData: [],
      eventInfo: 0,
      clickedInfo: null,
      year: 2017,
      range: [INITIAL_YEAR, FINAL_YEAR],
      binType: 'per-year',
      allDataLoaded: false

    };

    this.dataArr = [];
    this.dataSetsLoaded = 0;
  }


  processDataSet(idx, dataArr) { 

    //console.log("Processing data set: #" + idx);

    this.setState({ data: dataArr });
    ++this.dataSetsLoaded;

    if(this.dataSetsLoaded === NUM_DATASETS)
      this.setState({allDataLoaded: true});

  }

  componentWillMount() {

    let dataArr = [];
    let i;
    let appThis = this;
    // anonymous self-invoking function in a loop
    //  required because csv loader is async 
    for (i = 0; i < 11; i++) (function (i, appThis) {

      requestCsv(DataFiles[i], (error, response) => {
        if (!error) {
          dataArr[i] = response.map(d => [Number(d.lng), Number(d.lat)]);
          appThis.processDataSet(i, dataArr);
        }
      });

    })(i, this);
  }

  componentDidMount() {

    window.addEventListener('resize', this._resize.bind(this));
    this._resize();

    // Drop loading graphics
    const lg = document.getElementById('loading-graphics');
    if(lg)
      lg.outerHTML = '';

  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }


  handleUpdateOpacity(value) {
    this.setState({ opacity: value });
  }

  handleUpdateCoverage(value) {
    this.setState({ coverage: value });
  }

  handleUpdateRadius(value) {
    this.setState({ radius: value });
  }

  handleUpdateElev(value) {
    this.setState({ elevScale: value });
  }

  handleUpdateYear(value) {
    this.setState({ year: value });
  }

  handleOnHover(info) {
    this.setState({ eventInfo: info });
  }

  handleOnClick(info) {
    this.setState({ clickedInfo: info });
  }

  // Fires when blank area (no cell) is clicked
  handleLayerClick(info) {
    if (info == null)
      this.setState({ clickedInfo: null });
  }


  buildRangeData() {

    let r = this.state.range;
    let startIdx = r[0] - INITIAL_YEAR;
    let endIdx = r[1] - INITIAL_YEAR;
    //console.log("building range data: " + startIdx + ", " + endIdx);

    let rdata = this.state.data[startIdx];
    if (endIdx > startIdx) {
      for (var i = startIdx; i < endIdx; ++i) {
        rdata = rdata.concat(this.state.data[i + 1])
      }
    }

    this.setState({ rangeData: rdata });
  }

  handleTimeSelect(event) {

    this.setState({ binType: event.currentTarget.value });
    if (event.currentTarget.value === "range")
      this.buildRangeData();

  }

  handleUpdateRange(value) {
    this.setState({ range: value })
    this.buildRangeData();
  }

  getRangeIndexes() {
    return (
      [this.state.range[0] - INITIAL_YEAR,
      this.state.range[1] - INITIAL_YEAR]
    )
  }

  render() {

    const { viewport, data } = this.state;

    let numEventsInLayer = 0;
    let yearIdx = this.state.year - INITIAL_YEAR;
    let useRange = false;

    if (this.state.binType == "range") {

      useRange = true;
      numEventsInLayer = this.state.rangeData.length;

    } else {

      if (data[yearIdx] != null) {
        numEventsInLayer = data[yearIdx].length;
      }
    }

    return (
      <div>
        <div id="control-panel">
          <div className="app-title">
            <h3 style={{marginTop:'10px'}}>ACLED Heat Map</h3>
            <p style={{margin:'0 10px 14px 10px'}}> Data sets from the 
              <a href="https://www.acleddata.com/data/" target="_blank">
                Armed Conflict Location &amp; Event Data Project (ACLED) </a> rendered 
                using the <a href="https://github.com/uber/deck.gl" target="_blank">
                deck.gl</a> hexagon-cell layer.
          </p>
          </div>
          <hr className="hrule" />
          <LayerControls
            opacity={this.state.opacity}
            coverage={this.state.coverage}
            radius={this.state.radius}
            elevScale={this.state.elevScale}
            year={this.state.year}
            range={this.state.range}
            binType={this.state.binType}
            updateOpacity={this.handleUpdateOpacity.bind(this)}
            updateCoverage={this.handleUpdateCoverage.bind(this)}
            updateRadius={this.handleUpdateRadius.bind(this)}
            updateElev={this.handleUpdateElev.bind(this)}
            updateYear={this.handleUpdateYear.bind(this)}
            eventInfo={this.state.eventInfo}
            clickedInfo={this.state.clickedInfo}
            eventCount={numEventsInLayer}
            updateTimeSelect={this.handleTimeSelect.bind(this)}
            updateRange={this.handleUpdateRange.bind(this)}
            timeEnabled={this.state.allDataLoaded}
          />

        </div>
        <MapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/light-v9"
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          <DeckGLOverlay viewport={viewport} data={data || []}
            opa={this.state.opacity}
            coverage={this.state.coverage}
            radius={this.state.radius}
            elevScale={this.state.elevScale}
            onHover={this.handleOnHover}
            onClick={this.handleOnClick}
            onLayerClick={this.handleLayerClick}
            yearIdx={yearIdx}
            useRange={useRange}
            rangeIndexes={this.getRangeIndexes()}
            rangeData={this.state.rangeData}
          />
        </MapGL>
      </div>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));

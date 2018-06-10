import React, { Component } from 'react'
import { Slider, RangeSlider, Tooltip, RadioGroup, Radio } from "@blueprintjs/core"
import iconOpacityLow from '../images/opacity-low.png'
import iconOpacityHigh from '../images/opacity-high.png'
import InfoBox from './info-box'

class LayerControls extends Component {

  constructor(props) {

    super(props);

  }

  renderRadiusLabel(val) {
    return val / 1000 + "K";
  }

  render() {

    let useRange = false;
    if (this.props.binType == "range") {
      useRange = true;
    }

    return (
      <div>
        <div className="slider-control">
          <div className="sliders-row">

            <div className='cem-slider'>  
              <div className="opacity-high" title="opacity" width="32px"></div>
              <div className="bp-slider">
                <Slider
                  min={0}
                  max={1}
                  stepSize={0.01}
                  onChange={this.props.updateOpacity.bind(this)}
                  value={this.props.opacity}
                  labelRenderer={false}
                  vertical={true}
                />
              </div>
              <div className="opacity-low" title="opacity" width="32px"></div>
            </div>

            <div className='cem-slider'>
              <div className="coverage-high" title="coverage" width="32px"></div>
              <div className='bp-slider'>
                <Slider
                  min={0}
                  max={1}
                  stepSize={0.01}
                  onChange={this.props.updateCoverage.bind(this)}
                  value={this.props.coverage}
                  labelRenderer={false}
                  vertical={true}
                />
              </div>
              <div className="coverage-low" title="coverage" width="32px"></div>
            </div>

            <div className='cem-slider'>
              <div className="elevation-high" title="elevation" width="32px"></div>
              <div className='bp-slider'>
                <Slider
                  min={100}
                  max={40100}
                  stepSize={1000}
                  onChange={this.props.updateElev.bind(this)}
                  value={this.props.elevScale}
                  labelRenderer={false}
                  vertical={true}
                />
              </div>
              <div className="elevation-low" title="elevation" width="32px"></div>
            </div>

            <div className='cem-slider'>
              <div className="radius-high" title="cell radius" width="32px"></div>
              <div className='bp-slider'>
                <Slider
                  min={500}
                  max={100500}
                  stepSize={1000}
                  onChange={this.props.updateRadius.bind(this)}
                  value={this.props.radius}
                  labelRenderer={false}
                  labelStepSize={20000}
                  vertical={true}
                />
              </div>
              <div className="radius-low" title="cell radius" width="32px"></div>
            </div>

          </div>

        </div>

        <div className="time-select">
          <div style={{ float: 'left', marginRight: '16px' }}>Bin data:</div>
           
            <RadioGroup
              onChange={this.props.updateTimeSelect}
              selectedValue={this.props.binType}
              inline={true}
            >
              <Radio label="One Year" value="per-year" />
              <Radio label="Span Years" value="range" />
            </RadioGroup>
           
        </div>

        {useRange ? (
          <RangeYears
            range={this.props.range}
            updateRange={this.props.updateRange}
            timeEnabled={this.props.timeEnabled}
          />
        ) : (
            <SingleYear
              year={this.props.year}
              updateYear={this.props.updateYear}
              timeEnabled={this.props.timeEnabled}
            />
          )
        }

        <hr className="hrule" />
        <InfoBox
          eventInfo={this.props.eventInfo}
          clickedInfo={this.props.clickedInfo}
          layerYear={this.props.year}
          eventCount={this.props.eventCount}
          useRange={useRange}
          range={this.props.range}
        />
        <hr className="hrule" />

        <div className="social">
          <a className="social-icon" href="https://douglasgmurphy.com/acled-deckgl" target="_blank"> 
            <img border="0" alt="Wordpress" src="./images/WordPress.svg" width="22" height="22"/>
          </a>
         <a className="social-icon" href="https://github.com/dgmurphy/acled-viz" target="_blank">
            <img border="0" alt="GitHub" src="./images/GitHub.svg" width="22" height="22"/>
          </a> 
        </div>

      </div>

    )

  }
}


function SingleYear(props) {
  return (
    <div className="time-slider">
      <p style={{marginRight: '40px'}} >Year:</p>
      <Slider
        min={2008}
        max={2018}
        stepSize={1}
        onChange={props.updateYear}
        value={props.year}
        labelRenderer={true}
        labelStepSize={5}
        vertical={false}
        showTrackFill={false}
        disabled={!(props.timeEnabled)}
      />
    </div>
  );

}

function RangeYears(props) {

  return (
    <div className="time-slider">
      <p style={{marginRight: '40px'}}>Span:</p>
      <RangeSlider
        min={2008}
        max={2018}
        stepSize={1}
        onChange={props.updateRange}
        value={props.range}
        labelRenderer={true}
        labelStepSize={5}
        showTrackFill={true}
        disabled={!(props.timeEnabled)}
      />
    </div>
  );

}


export default LayerControls;
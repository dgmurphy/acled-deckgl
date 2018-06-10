/* global window */
import React, { Component } from 'react';
import DeckGL, { HexagonLayer } from 'deck.gl';
import { ColorRanges } from './colors';


const LIGHT_SETTINGS = {
  lightsPosition: [20, -40, 8000, 0, -50, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

export default class DeckGLOverlay extends Component {
  static get defaultColorRange() {
    return colorRanges[0];
  }

  static get defaultViewport() {
    return {
      longitude: 32.910767,
      latitude: -9,
      zoom: 3.2,
      minZoom: 1,
      maxZoom: 15,
      pitch: 50,
      bearing: 0
    };
  }

  constructor(props) {
    super(props);
    this.startAnimationTimer = null;
    this.intervalTimer = null;
  }


  handleLayerClick(info) {
    this.props.onLayerClick(info);
  }


  buildRangeLayer() {

    let layer = new HexagonLayer({
      id: 'heatmap-rangelayer',
      colorRange: ColorRanges[0],
      coverage: this.props.coverage,
      data: this.props.rangeData,
      elevationRange: [0, 1000],
      elevationDomain: [0, 10000],
      elevationScale: this.props.elevScale,
      extruded: true,
      getPosition: d => d,
      lightSettings: LIGHT_SETTINGS,
      onHover: this.props.onHover,
      onClick: this.props.onClick,
      opacity: this.props.opa,
      pickable: Boolean(this.props.onHover),
      radius: this.props.radius,
      autoHighlight: true,
      highlightColor: [209, 242, 109, 128],
      visible: true
    })
    return layer;

  }

  render() {
    const { viewport, data } = this.props;

    if (!data) {
      return null;
    }

    let layers = [];

    if (this.props.useRange) {   // build range layer

      layers[0] = this.buildRangeLayer();

    } else {

      // build single-year layer
      let yearIdx = this.props.yearIdx;
      layers[yearIdx] = new HexagonLayer({
        id: 'heatmap' + yearIdx,
        colorRange: ColorRanges[0],
        coverage: this.props.coverage,
        data: data[yearIdx],
        elevationRange: [0, 1000],
        elevationDomain: [0, 10000],
        elevationScale: this.props.elevScale,
        extruded: true,
        getPosition: d => d,
        lightSettings: LIGHT_SETTINGS,
        onHover: this.props.onHover,
        onClick: this.props.onClick,
        opacity: this.props.opa,
        pickable: Boolean(this.props.onHover),
        radius: this.props.radius,
        autoHighlight: true,
        highlightColor: [209, 242, 109, 128],
        visible: true
      })

    }

    return <DeckGL {...viewport} layers={layers} onLayerClick={this.handleLayerClick.bind(this)} />;
  }
}

DeckGLOverlay.displayName = 'DeckGLOverlay';

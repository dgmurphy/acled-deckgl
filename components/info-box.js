import React, { Component } from 'react'


class InfoBox extends Component {

    constructor(props) {

        super(props);

    }


    render() {
    
        let numPoints = 0;

        if (this.props.clickedInfo != null)
            numPoints = this.props.clickedInfo.object.points.length;

        if (this.props.eventInfo.object != null)
            numPoints = this.props.eventInfo.object.points.length;


        return (
            <div className="info-box">
                <p><b>Layer Details: </b></p>
                <div style={{ marginLeft: '5px' }}>

                { this.props.useRange ? 
                    (<p>Years: <span className='values'>{this.props.range[0]} - {this.props.range[1]}</span></p>) : 
                    (<p>Year: <span className='values'>{this.props.layerYear}</span></p>)
                }
                    <p>Total Event count: <span className='values'>{this.props.eventCount}</span></p>
                </div>
                <p><b>Cell Details: </b></p>
                <div style={{ marginLeft: '5px' }}>
                    <p>Event count: <span className='values'>{numPoints}</span></p>
                    <CellData cdata={this.props.clickedInfo} />
                </div>
            </div>
        )
    }
}

function CellData(props) {

    if (props.cdata == null)
        return <p className='hints'><em>click a cell for more data... </em></p>;

    let cdata = props.cdata;
    let lngLatText = "";
    let lng = Number((cdata.lngLat[0]).toFixed(6));
    let lat = Number((cdata.lngLat[1]).toFixed(6));

    return (
        <div>
            <p className='hints'> Last-clicked cell data: </p>
            <p> Long/Lat: <span className='values'> {lng}, {lat} </span></p>
            <p> Color:  <span className='values'> 
                {cdata.color[0]}, {cdata.color[1]}, {cdata.color[2]}, {cdata.color[3]}
            </span></p>
            <p> Device Pixel:  <span className='values'> 
                {cdata.devicePixel[0]}, {cdata.devicePixel[1]}
            </span></p>
            <p> Index:  <span className='values'> {cdata.index}</span></p>
        </div>
    )
}

export default InfoBox;
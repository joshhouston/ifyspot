import React, { Component } from 'react';
import cassette from '../cassette.png';

class Box extends Component {
    constructor() {
        super();
        this.imgRef = React.createRef();
    }

    render() {
        return (

            <div className="section">
                <div className="recently">
                    <div className="sd1">
                        <h3 style={{ color: this.props.data.vibrant }}>SD 1:</h3>
                    </div>

                    <div className="recent-tracks1">
                        <ul className="tracks" >
                            {this.props.side1.map((track, index) => {
                                return (
                                    <li key={index} style={{ color: this.props.data.lightVibrant }}>{track.track.name.substring(0, 16)}</li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="side-cassette">
                        <h4 style={{ color: this.props.data.vibrant }}>RECENT</h4>
                        <img src={cassette} alt="" />
                    </div>

                    <div className="recent-tracks2">
                        <ul className="tracks" >
                            {this.props.side2.map((track, index) => {
                                return (
                                    <li key={index} style={{ color: this.props.data.vibrant }}>{track.track.name.substring(0, 20)}</li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="sd2">
                        <h3 style={{ color: this.props.data.lightVibrant }}>SD 2:</h3>
                    </div>
                </div>

                <div className="side-title">
                    <div className="side-art">
                        <img src={this.props.image} alt="album art" />
                    </div>

                    <div className="side-headline">
                        <h1 style={{ color: this.props.data.vibrant }}>{this.props.artist}</h1>
                    </div>
                    <div className="vol">
                        <h4 style={{ color: this.props.data.lightVibrant }}>VOL.1</h4>
                    </div>
                </div>


                <div className="japanese">
                    <div className="album-info">
                        <div className="artwork">

                            <img
                                crossOrigin={"anonymous"}
                                ref={this.imgRef}
                                src={this.props.image}
                                alt={'img'}
                                className={"example__img"}
                            />
                        </div>

                    </div>
                    <div className="song-name">
                        <h2
                            style={{
                                color: this.props.data.vibrant,
                                borderTop: `.33vmin solid ${this.props.data.lightVibrant}`,
                                transition: '1s'
                            }}>カラー</h2>
                        <h2 style={{
                            color: this.props.data.vibrant,
                            borderTop: `.33vmin solid ${this.props.data.lightVibrant}`,
                            transition: '1s',
                            borderBottom: `.33vmin solid ${this.props.data.lightVibrant}`

                        }}>テープ</h2>
                    </div>
                    <div className="song-bottom">
                        <h3 style={{ color: this.props.data.lightVibrant, transition: '1s' }} >第巻壱</h3>
                        <div className="bottom-cassette">
                            <h4 style={{ color: this.props.data.vibrant }}>TRK - 001</h4>
                            <img src={cassette} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Box;
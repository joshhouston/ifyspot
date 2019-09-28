import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import ColorThief from 'colorthief';
import dweeb from './dweeb.jpg'
import props from './props.png'

const Thief = new ColorThief();
const spotifyWebApi = new Spotify();

class App extends Component {
  constructor() {
    super();
    this.imgRef = React.createRef();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        image: ''
      },
      savedTracks: [],
      r: '',
      g: '',
      b: ''
    }
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token)
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyWebApi.getMyCurrentPlaybackState()
      .then((response) => {
        console.log(response)
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })
      })

    console.log(this.state.nowPlaying.image)
  }

  playTrack() {
    spotifyWebApi.play()
      .then((response) => {
        console.log(response)
      })
  }

  pauseTrack() {
    spotifyWebApi.pause()
  }


  getSavedTracks() {
    spotifyWebApi.getMySavedTracks()
      .then((response) => {
        console.log(response.items)
        this.setState({
          savedTracks: response.items
        })
      })
  }


  render() {
    return (
      <div className="App" style={{backgroundColor: `rgb(${this.state.r}, ${this.state.g}, ${this.state.b})`}}>
        <a href="http://localhost:8888">
          <button>Login With Spotify</button>
        </a>

        <div>Now Playing: {this.state.nowPlaying.name}</div>
        <div>
          <img src={this.state.nowPlaying.image} style={{ width: 100 }} />
        </div>
        <button onClick={() => this.getNowPlaying()}>
          Check Now Playing
        </button>
        <button onClick={() => this.playTrack()} >Play</button>
        <button onClick={() => this.pauseTrack()} > Pause</button>
        <button onClick={() => this.getTopArtists()} > Next</button>
        <button onClick={() => this.getSavedTracks()} > Tracks</button>
        {/* <button onClick={() => this.colorMe()} > Color</button> */}

        <img
            crossOrigin={"anonymous"}
            ref={this.imgRef}
            src={this.state.nowPlaying.image}
            alt={"example"}
            className={"example__img"}
            onLoad={() => {
              const colorThief = new ColorThief();
              const img = this.imgRef.current;
              const result = colorThief.getColor(img, 25);
              this.setState({r: result[0], g: result[1], b: result[2]})
              // this.setState({color: result})
            }}
          />

        <div className="savedTracks">
          {this.state.savedTracks.map((track, index) => {
            return (
              // style={{writingMode: "vertical-rl", width: 500}}
              <div key={index}  >
                <h3>{track.track.name}</h3>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;

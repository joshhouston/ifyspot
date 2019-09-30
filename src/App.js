import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import ColorThief from 'colorthief';
import { Palette } from 'react-palette';

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
      primary: {
        r: '',
        g: '',
        b: ''
      },
      secondary: {
        r: '',
        g: '',
        b: ''
      },
      tertiary: {
        r: '',
        g: '',
        b: ''
      },
      quaternary: {
        r: '',
        g: '',
        b: ''
      },

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

  getVibe(){
    
  }

  getNowPlaying() {
    spotifyWebApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })
      })

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
      <div className="App" style={{backgroundColor: `rgb(${this.state.primary.r}, ${this.state.primary.g}, ${this.state.primary.b})`}}>
        <a href="http://localhost:8888">
          <button>Login With Spotif</button>
        </a>

        <div>Now Playing: {this.state.nowPlaying.name}</div>
        <div>
          <img src={this.state.nowPlaying.image} style={{ width: 100 }} />
        </div>
        <button style={{backgroundColor: `rgb(${this.state.quaternary.r}, ${this.state.quaternary.g}, ${this.state.quaternary.b})`}} onClick={() => this.playTrack()} onClick={() => this.getNowPlaying()}>
          Check Now Playing
        </button>
        <button style={{backgroundColor: `rgb(${this.state.secondary.r}, ${this.state.secondary.g}, ${this.state.secondary.b})`, color: `rgb(${this.state.quaternary.r}, ${this.state.quaternary.g}, ${this.state.quaternary.b}`}} onClick={() => this.playTrack()} >Play</button>
        <button style={{backgroundColor: `rgb(${this.state.secondary.r}, ${this.state.secondary.g}, ${this.state.secondary.b})`}} onClick={() => this.playTrack()}  onClick={() => this.pauseTrack()} > Pause</button>
        <button style={{backgroundColor: `rgb(${this.state.secondary.r}, ${this.state.secondary.g}, ${this.state.secondary.b})`}} onClick={() => this.playTrack()}  onClick={() => this.getTopArtists()} > Next</button>
        <button style={{backgroundColor: `rgb(${this.state.secondary.r}, ${this.state.secondary.g}, ${this.state.secondary.b})`}} onClick={() => this.playTrack()}  onClick={() => this.getSavedTracks()} > Tracks</button>
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
              const result = colorThief.getPalette(img, 25);
              const result2 = colorThief.getColor(img, 25)

              console.log(result[0], result2)
              this.setState({
                primary: {
                  r: result2[0],
                  g: result2[1],
                  b: result2[2]
                },

                secondary: {
                  r: result[1][0],
                  g: result[1][1],
                  b: result[1][2]
                },

                tertiary: {
                  r: result[2][0],
                  g: result[2][1],
                  b: result[2][2]
                },
                quaternary: {
                  r: result[0][0],
                  g: result[0][1],
                  b: result[0][2]
                }
              })
              // this.setState({r: result2[0], g: result2[1], b: result2[2]})
            }}
          />

      <Palette src={this.state.nowPlaying.image}>
        {({ data, loading, error }) => (

          <div style={{ backgroundColor: data.vibrant }}>
            {console.log(data)}
            Text with the vibrant color
          </div>
        )}
      </Palette>


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

import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import ColorThief from 'colorthief';
import cassette from './cassette.png'
import { Palette } from 'react-palette';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faBackward, faForward, faPause } from '@fortawesome/free-solid-svg-icons';

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
        image: '',
        isPlaying: false
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




  componentDidMount() {
    spotifyWebApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url,
            isPlaying: true
          }
        })
      })
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.nowPlaying !== prevState.nowPlaying){
      spotifyWebApi.getMyCurrentPlayingTrack()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })

      })
    }
  }

  playTrack() {
    spotifyWebApi.play()
  }

  pauseTrack() {
    spotifyWebApi.pause()
    this.setState({nowPlaying: {
      isPlaying: false
    }})
  }

  nextTrack() {
    spotifyWebApi.skipToNext()
  }

  previousTrack() {
    spotifyWebApi.skipToPrevious()
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
      <div className="App" style={{ backgroundColor: `rgb(${this.state.primary.r}, ${this.state.primary.g}, ${this.state.primary.b})` }}>
        <a href="http://localhost:8888">
          <button>Login With Spotif</button>
        </a>

        <div>Now Playing: {this.state.nowPlaying.name}</div>


        <div className="artwork">

          <div className="cassette">

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
          </div>

        </div>

        <div className="cassette">
          <img src={cassette} alt="" />
          <Palette src={this.state.nowPlaying.image}>
            {({ data, loading, error }) => (

              <div className='controls'>
                <FontAwesomeIcon
                  style={{ color: data.vibrant }}
                  size='4x'
                  icon={faBackward}
                  onClick={() => this.previousTrack()}
                />
                {!this.state.nowPlaying.isPlaying
                  ? <FontAwesomeIcon
                    style={{ color: data.vibrant }}
                    size='4x'
                    icon={faPause}
                    onClick={() => this.pauseTrack()}
                  />
                  : <FontAwesomeIcon
                    style={{ color: data.vibrant }}
                    size='4x'
                    icon={faPlay}
                    onClick={() => this.playTrack()}
                  />
                }
                

                <FontAwesomeIcon
                  style={{ color: data.vibrant }}
                  size='4x'
                  icon={faForward}
                  onClick={() => this.nextTrack()}
                />
              </div>
            )}
          </Palette>
        </div>



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

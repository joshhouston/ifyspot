import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import ColorThief from 'colorthief';
import cassette from './cassette.png'
import { Palette } from 'react-palette';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faBackward, faForward, faPause } from '@fortawesome/free-solid-svg-icons';


const spotifyWebApi = new Spotify();


class App extends Component {
  constructor() {
    super();
    this.imgRef = React.createRef();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      name: '',
      image: '',
      isPlaying: false,
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

    spotifyWebApi.getMyCurrentPlayingTrack()
      .then((response) => {
        this.setState({
          name: response.item.name,
          image: response.item.album.images[0].url,
          isPlaying: response.is_playing,
        })
        console.log(response)
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.savedTracks !== prevState.name) {
      setTimeout(() => {

        spotifyWebApi.getMyCurrentPlayingTrack()
          .then((response) => {
            this.setState({
              name: response.item.name,
              image: response.item.album.images[0].url,
              isPlaying: response.is_playing
            })
          })
      }, 4000)
    }
  }

  playTrack() {
    spotifyWebApi.play()
  }

  pauseTrack() {
    spotifyWebApi.pause()
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

      <div className="App" style={{ backgroundColor: `rgb(${this.state.primary.r}, ${this.state.primary.g}, ${this.state.primary.b})`, transition: '1s' }}>
        <div className="content">
          {!this.state.loggedIn
            ?
            <div className="login">
              <a href="http://localhost:8888">
                <button>Login With Spotify</button>
              </a>
            </div>
            :
            <div className="album-info">
              <div className="artwork">
                <img
                  crossOrigin={"anonymous"}
                  ref={this.imgRef}
                  src={this.state.image}
                  alt={'img'}
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
                  }}
                />
              </div>

              <Palette src={this.state.image}>
                {({ data, loading, error }) => (
                  <div className="section">

                  <div className="song-name">
                    <h2 style={{
                      color: data.vibrant,
                      borderTop: `.33vmin solid rgb(${this.state.quaternary.r}, ${this.state.quaternary.g}, ${this.state.quaternary.b})`,
                      transition: '1s'
                    }}>イチゴ</h2>
                    <h2 style={{
                      color: data.vibrant,
                      borderTop: `.33vmin solid rgb(${this.state.quaternary.r}, ${this.state.quaternary.g}, ${this.state.quaternary.b})`,
                      transition: '1s',
                      borderBottom: `.33vmin solid rgb(${this.state.quaternary.r}, ${this.state.quaternary.g}, ${this.state.quaternary.b})`
                    }}>テープ</h2>
                  </div>
                    <div className="song-bottom">
                      <h3 style={{ color: data.vibrant, transition: '1s' }} >第巻壱</h3>
                      <div className="bottom-cassette">
                        <h4>TRCK - 001</h4>
                        <img src={cassette} alt="" />
                      </div>
                    </div>
                  </div>
                )}
              </Palette>

            </div>



          }





          <div className="cassette">
            <Palette src={this.state.image}>
              {({ data, loading, error }) => (

                <div className='controls'>
                  <div style={{ color: data.lightVibrant, fontFamily: 'Didact Gothic', fontSize: '4vw', fontWeight: '400', textAlign: 'center' }}>
                    test
                    <img src={cassette} alt="" />
                  </div>

                  <div className="icons">

                    <FontAwesomeIcon
                      style={{ color: data.vibrant }}
                      size='4x'
                      icon={faBackward}
                      onClick={() => this.previousTrack()}
                    />
                    {(this.state.isPlaying)
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
                </div>
              )}
            </Palette>
          </div>



          {/* <div className="savedTracks">
          {this.state.savedTracks.map((track, index) => {
            return (
              // style={{writingMode: "vertical-rl", width: 500}}
              <div key={index}  >
                <h3>{track.track.name}</h3>
              </div>
            )
          })}
        </div> */}
        </div>
      </div>
    );
  }
}

export default App;

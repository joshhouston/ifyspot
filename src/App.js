import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import cassette from './cassette.png'
import Box from './components/Box';
import logo from './musiclogo.png'
import { Palette } from 'react-palette';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faBackward, faForward, faPause } from '@fortawesome/free-solid-svg-icons';
const spotifyWebApi = new Spotify();

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = '1685b77ad23941e9a3ab8c1ecde63bf0';
const redirectUri = 'https://colorspot.art';
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-library-read",
  "user-read-recently-played",
];


class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      name: '',
      image: '',
      artist: '',
      albums: '',
      isPlaying: false,
      side1: [],
      side2: [],

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
          artist: response.item.artists[0].name,
          album: response.item.album.name
        })
      })
      .catch(error => console.log(error))

    spotifyWebApi.getMyRecentlyPlayedTracks()
      .then((response) => {
        this.setState({
          side1: response.items.slice(0, 5),
          side2: response.items.slice(5, 10)
        })
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
              isPlaying: response.is_playing,
              artist: response.item.artists[0].name
            })
          })
          .catch(error => console.log(error))
      }, 1000)
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

  render() {
    return (

      <div className="App">
        <Palette src={this.state.image}>
          {({ data, loading, error }) => (
            <div
              className="content"
              style={{ backgroundColor: `${data.darkMuted}` }}

            >

              {!this.state.loggedIn
                ? <div className="login">
                  
                  <div className="logo">
                    <img src={logo} alt="" />
                  </div>
                  <div className="welcome">
                    <h2>Welcome to Color Spot!</h2>
                      <h3>Couple of things to note:</h3>
                    <ul className='welcome-list'>
                      <li>Make sure you are already playing music before you click Login</li>
                      <li>This is just a controller, so unfortunately you can not play music through this app</li>
                      <li>When you log in, you are granted a token. This token only lasts for 1 hour. <br></br>After this token expires, you must login again to obtain a new token</li>
                    </ul>
                    <h2>Enjoy!</h2>
                  </div>
                  <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
                    <button id='spotlogin'>Login With Spotify</button>
                  </a>
                </div>
                :

                <div className="palette">

                  <Box

                    name={this.state.name}
                    image={this.state.image}
                    data={data}
                    side1={this.state.side1}
                    side2={this.state.side2}
                    artist={this.state.artist}
                    isPlaying={this.state.isPlaying}
                  />


                  <div className="cassette">

                    <div className='controls'>
                      <div style={{ color: data.lightVibrant, fontSize: '4vw', fontWeight: '400', textAlign: 'center' }}>
                        <h4>{this.state.name}</h4>
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
                  </div>
                </div>
              }
            </div>
          )}

        </Palette>
      </div>
    );
  }
}

export default App;



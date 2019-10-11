import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
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
      artist: '',
      albums: '',
      isPlaying: false,
      side1: [],
      side2: []

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

    spotifyWebApi.getMyRecentlyPlayedTracks()
      .then((response) => {
        this.setState({
          side1: response.items.slice(0, 5),
          side2: response.items.slice(5, 10)
        })
        console.log(response.items[0].track.name)
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
      }, 3000)
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

      <div className="App" style={{ transition: '1s' }}>
        <Palette src={this.state.image}>
          {({ data, loading, error }) => (
            <div className="content" style={{ backgroundColor: `${data.darkMuted}` }}>
              {!this.state.loggedIn
                ? <div className="login">
                  <a href="http://localhost:8888">
                    <button>Login With Spotify</button>
                  </a>
                </div>
                :
                <div className="palette">



                  <div className="section">
                    <div className="recently">
                      <div className="sd1">
                        <h3 style={{ color: data.vibrant }}>SD 1:</h3>
                      </div>

                      <div className="recent-tracks1">
                        <ul className="tracks" >
                          {this.state.side1.map((track, index) => {
                            return (
                              <li key={index} style={{color: data.lightVibrant}}>{track.track.name}</li>
                            )
                          })}
                        </ul>
                      </div>

                      <div className="side-cassette">
                        <img src={cassette} alt=""/>
                        <h4>RECENT</h4>
                      </div>

                      <div className="recent-tracks2">
                        <ul className="tracks" >
                          {this.state.side2.map((track, index) => {
                            return (
                              <li key={index} style={{color: data.vibrant}}>{track.track.name}</li>
                            )
                          })}
                        </ul>
                      </div>
                      <div className="sd2">
                        <h3 style={{ color: data.lightVibrant }}>SD 2:</h3>
                      </div>
                    </div>

                    <div className="side-title">
                      <div className="side-art">
                        <img src={this.state.image} alt="album art" />
                      </div>

                      <div className="side-headline">
                        <h1 style={{ color: data.vibrant }}>{this.state.artist}</h1>
                      </div>
                      <div className="vol">
                        <h4 style={{ color: data.lightVibrant }}>VOL.1</h4>
                      </div>
                    </div>


                    <div className="japanese">
                      <div className="album-info">
                        <div className="artwork">

                          <img
                            crossOrigin={"anonymous"}
                            ref={this.imgRef}
                            src={this.state.image}
                            alt={'img'}
                            className={"example__img"}
                          />
                        </div>

                      </div>
                      <div className="song-name">
                        <h2 style={{
                          color: data.vibrant,
                          borderTop: `.33vmin solid ${data.lightVibrant}`,
                          transition: '1s'

                        }}>アート</h2>
                        <h2 style={{
                          color: data.vibrant,
                          borderTop: `.33vmin solid ${data.lightVibrant}`,
                          transition: '1s',
                          borderBottom: `.33vmin solid ${data.lightVibrant}`

                        }}>サイト</h2>
                      </div>
                      <div className="song-bottom">
                        <h3 style={{ color: data.lightVibrant, transition: '1s' }} >トラック</h3>
                        <div className="bottom-cassette">
                          <h4 style={{ color: data.vibrant }}>TRK - 001</h4>
                          <img src={cassette} alt="" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cassette">


                    <div className='controls'>
                      <div style={{ color: data.lightVibrant, fontFamily: 'Didact Gothic', fontSize: '4vw', fontWeight: '400', textAlign: 'center' }}>
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



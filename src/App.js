import React, {Component} from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import ColorThief from 'colorthief';

const Thief = new ColorThief();
const spotifyWebApi = new Spotify();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    this.state ={
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        image: ''
      },
      savedTracks: []
    }
    if(params.access_token){
      spotifyWebApi.setAccessToken(params.access_token)
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getNowPlaying(){
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
  }

  playTrack(){
    spotifyWebApi.play()
      .then((response) => {
        console.log(response)
      })
  }

  pauseTrack(){
    spotifyWebApi.pause()
  }

  getTopArtists(){
    spotifyWebApi.skipToNext()
      .then((response) => {
        console.log(response)
      })
  }

  getSavedTracks(){
    spotifyWebApi.getMySavedTracks()
      .then((response) => {
        console.log(response.items)
        this.setState({
          savedTracks: response.items
        })
      })
  }

  render(){
    return (
      <div className="App">
        <a href="http://localhost:8888">
          <button>Login With Spotify</button>
        </a>

        <div>Now Playing: {this.state.nowPlaying.name}</div>
        <div>
          <img src={this.state.nowPlaying.image} style={{width: 100}}/>
        </div>
        <button onClick={() => this.getNowPlaying()}>
          Check Now Playing
        </button>
        <button onClick={() => this.playTrack()} >Play</button>
        <button onClick={() => this.pauseTrack()} > Pause</button>
        <button onClick={() => this.getTopArtists()} > Next</button>
        <button onClick={() => this.getSavedTracks()} > Tracks</button>

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

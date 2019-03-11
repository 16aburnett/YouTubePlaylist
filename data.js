/*

  Program: YouTube Playlist
  Author: Anthony Burnett
  Date:  February 3 2019
  Description: Uses embedded youtube 
  videos to create a custom youtube
  playlist style 

*/


/*************************************************************************/
// Global Variables

var data;
var dataToSave;
var dataToLoad;

/*************************************************************************/
// Saving states

function saveData(){

  dataToSave = {};

  dataToSave.songs = [];
  dataToSave.playlists = []; 

  // grab all songs 
  for(var i = 0; i < data.songs.length; ++i){

    var song = {};
    var s = data.songs[i];
    song.title = s.title;
    song.artist = s.artist; 
    song.videoId = s.videoId;

    dataToSave.songs.push(song);

  }

  // grab all playlists
  for(var i = 0; i < data.playlists.length; ++i){

    var playlist = {};
    var p = data.playlists[i];
    playlist.title = p.title;
    playlist.songs = [];

    // grab all videoId 
    for(var j = 0; j < p.songs.length; ++j){
      playlist.songs.push(p.songs[j].videoId);
    }
    dataToSave.playlists.push(playlist);
  }

  saveJSON(dataToSave, 'datas.json');

}


/*************************************************************************/
// loading file data

function preload(){

  dataToLoad = loadJSON("datas.json");

}


/*************************************************************************/
// convert data into an usuable data structure
function loadData(){
  data = {};

  // transfer songs
  data.songs = dataToLoad.songs;

  // generate playlists
  data.playlists = [];
  for(var i = 0; i < dataToLoad.playlists.length; ++i){
    data.playlists[i] = {};
    data.playlists[i].title = dataToLoad.playlists[i].title;
    data.playlists[i].songs = [];
    for(var j = 0; j < dataToLoad.playlists[i].songs.length; ++j){
      data.playlists[i].songs.push(getSong(dataToLoad.playlists[i].songs[j]));
    }
  }

  // generate artist playlists
  data.artists = [];
  for(var i = 0; i < data.songs.length; ++i){

    var a = getArtist(data.songs[i].artist);

    // artist doesnt exist
    if(a == -1){

      // create artist 
      var artist = {
        title: data.songs[i].artist,
        songs: []
      }
      data.artists.push(artist);

      // add song 
      artist.songs.push(data.songs[i]);

    } 
    // artist exists 
    else {
      // add song 
      data.artists[a].songs.push(data.songs[i]); 
    }
  }

  // sort artists
  sortByTitle(data.artists);
}

/* *********************************************************************** */
// returns the index of a given artist in the data (if there is one)
// otherwise -1

function getArtist(artist){
  for(var i = 0; i < data.artists.length; ++i){
    if(artist == data.artists[i].title){
        return i;
    }
  }
  return -1;
}

/*************************************************************************/
// Adds a song to the data file 

function addSong(){
  var song = {};
  
  // prompt user for data
  song.title = prompt("please enter the title of the song");
  song.artist = prompt("please enter the name of the artist of the song");
  song.videoId = prompt("please enter the video id");
  data.songs.push(song);

  // if the current playist isnt also the all songs playlist
  if(current_playlist.songs != data.songs){
      // add song to data
      var songCopy = {};
      songCopy.title = song.title;
      songCopy.artist = song.artist;
      songCopy.videoId = song.videoId;
      current_playlist.songs.push(songCopy);
  }
  updateSongPane();
}

/*********************************************************************** */
// gets a particular song object with a given videoId

function getSong(videoId){
  for(var i = 0; i < data.songs.length; ++i){
      if(data.songs[i].videoId == videoId){
      return data.songs[i];
      }
  }
}

/*************************************************************************/

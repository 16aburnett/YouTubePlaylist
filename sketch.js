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

// data
var playlists;
var current_song_list; // holds the playlists songs in a given state
var current_playlist; 
var current_song;
var current_song_index;
var player_status = 2;// 0 - paused, 1 - playing, 2 - hasnt played yet



// LAYOUT
const BLANK = 12;
const THEATER = 13;
const WINDOWS = 14;
var layout_state = WINDOWS; 

var history_list;


/*

  to-do
    - create next and prev buttons 
    - queue for independent song playing 
    - thumbnail images using http://i.ytimg.com/vi/{video_id}/maxresdefault.jpg
    - key/legend for key commands (k - play/pause, f - fullscreen/normal, m - mute/unmute)
    - '<' for the current playlist so it looks like its sendin packets ovah idfk...lol
    - maybe a way to minimize the playlist and song panes to have a larger video box 

    -- mode where only vid box us shown

    -- be able to move songs around in the playlist 
    -- queue of songs to play before the playlist
      -- you can add songs to the queue from diff lists
      so youll need to disallow song change when clicking a playlist
      
  load songs to the queue 
  play whats in the queue (no abrupt change when clicking a new playlist)

  *** when div is dragged over accepting div, accepting div should change color 

*/




/*************************************************************************/

function draw() {
  noLoop();
}

/*************************************************************************/

function setup() {

  // grab html elements 
  grabHTMLElements();

  // load data
  loadData();

  // add playlists to playlist pane
  updatePlaylistPane();

  // assign all songs as the current playlist
  var playlist = {};
  playlist.title = "All Songs";
  playlist.songs = data.songs;
  current_playlist = playlist;
  current_song_list = current_playlist.songs;
  current_song_list.isShuffled = false;
  current_song_list.isReversed = false;
  current_song_list.isSorted_Title = false;
  current_song_list.isSorted_Artist = false;

  // set the current song 
  current_song = current_song_list[0];
  current_song_index = 0;
  
  // keep track of songs played
  history_list = [];

  // keep track of songs to play next 
  queue_list = [];

  // display songs in song pane
  updateSongPane();

  // update video desc
  updateVideoDesc();

  // updates the footer
  updateFooter();

}

/*************************************************************************/
// key pressed events

function keyPressed(){

  if(keyCode == TAB){
    saveData();
  }

}

/* ********************************************************************** */

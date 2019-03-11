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


/*************************************************************************/
// allows an element to be dragged
function allowDrop(ev) {
    ev.preventDefault();
  }
  
  
/*************************************************************************/
// in transit of drag, saves the data to move 
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  
/*************************************************************************/
// adds song to playlist upon dropping song div
  // target is the thing dropped on 
  function drop(ev) {
    ev.preventDefault();
    var d = ev.dataTransfer.getData("text");
  
    var song = {};
    // find song 
    for(var i = 0; i < current_playlist.songs.length; ++i){
      if(d == current_playlist.songs[i].songId){
        song.title = current_playlist.songs[i].title;
        song.artist = current_playlist.songs[i].artist;
        song.videoId = current_playlist.songs[i].videoId;
        break;
      }
    }
    var playlist = ev.target.parentElement.playlist;
    playlist.songs.push(song);
    
    updateSongPane();
  
  }
  
  
/*************************************************************************/

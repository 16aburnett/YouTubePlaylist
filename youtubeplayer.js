/*

  Program: YouTube Playlist
  Author: Anthony Burnett
  Date:  February 2019
  Description: Uses embedded youtube 
  videos to create a custom youtube
  playlist style 

*/


/*************************************************************************/
// Global Variables



/*************************************************************************/
// FROM THE YOUTUBE PLAYER API 
// https://developers.google.com/youtube/iframe_api_reference


var player;
function onYouTubeIframeAPIReady() {

  // create the video player 
  player = new YT.Player('video_box', {
    height: '390',
    width: '640',
    videoId:  "Kb24RrHIbFk",// initializes with a particular song
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  
}

/*************************************************************************/
//  The API will call this function when the video player is ready.

function onPlayerReady(event) {
    //event.target.playVideo(); // plays video on ready 
}
  

  
/*************************************************************************/
// Any event change with the player
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        nextSong();
    }
}
/*

  Program: YouTube Playlist
  Author: Anthony Burnett
  Date:  February 2019
  Description: Uses embedded youtube 
  videos to create a custom youtube
  playlist style 

  - this handles all updates to the html of the page 
    - song window
    - playlists window
    - footer bar

*/


/*************************************************************************/
// Global Variables

// html elements
var video_window;

// video desc
var video_desc_edit;
var title_field;
var artist_field;

// songs
var song_window;
var song_pane;
var shuffle_button;
var song_count;
var playlist_title;
var song_pane_desc_index;
var song_pane_desc_title;
var song_pane_desc_artist;
var song_pane_desc_title_arrow;
var song_pane_desc_artist_arrow;

// playlists
var playlist_window;
var playlist_header;
var playlist_pane;
const PLAYLISTS = 0;
const ARTISTS = 1;
var playlist_type = PLAYLISTS;
var playlists_tab;
var artists_tab;


// queue
var queue_window;
var queue_pane;
var queue_pane_desc_index;
var queue_pane_desc_title;
var queue_pane_desc_artist;

// footer 
var add_song_btn;
var f_thumbnail;
var f_title;
var f_artist;
var f_controls_prev;
var f_controls_play;
var f_controls_next;
var f_shuffle_btn;
var f_layout_btn;

/*************************************************************************/
// initializes DOM element pointers

function grabHTMLElements(){
    video_window = document.getElementById("video_box");

    // video desc
    video_desc_edit = document.getElementById("video_desc_edit");
    title_field = document.getElementById("video_desc_title_field");
    artist_field = document.getElementById("video_desc_artist_field");

    // Song Pane
    song_window = document.getElementById('songs');
    song_pane = document.getElementById("song_pane");
    shuffle_button = document.getElementById("shuffle_button");
    playlist_title = document.getElementById("songs_title");
    song_count = document.getElementById("song_count");  
    song_pane_desc_index = document.getElementById("song_pane_desc_index");
    song_pane_desc_title = document.getElementById("song_pane_desc_title");
    song_pane_desc_artist = document.getElementById("song_pane_desc_artist");
    song_pane_desc_title_arrow = document.getElementById("song_pane_desc_title_arrow");
    song_pane_desc_artist_arrow = document.getElementById("song_pane_desc_artist_arrow");
    add_song_btn = document.getElementById("add_song_btn");
 
    // playlists
    playlist_window = document.getElementById("playlists");
    playlist_header = document.getElementById("playlist_header_title");
    playlist_pane = document.getElementById("playlist_pane");
    playlists_tab = document.getElementById("playlists_tab");
    artists_tab = document.getElementById("artists_tab");

    // Queue Pane 
    queue_window = document.getElementById('queue');
    queue_pane = document.getElementById("queue_pane");
    queue_pane_desc_index = document.getElementById("queue_pane_desc_index");
    queue_pane_desc_title = document.getElementById("queue_pane_desc_title");
    queue_pane_desc_artist = document.getElementById("queue_pane_desc_artist");
    playlists = [];

    // footer
    f_thumbnail = document.getElementById('f_current_song_thmbnl_img');
    f_title = document.getElementById('f_current_song_title');
    f_artist = document.getElementById('f_current_song_artist');
    f_controls_prev = document.getElementById('f_controls_prev');
    f_controls_play = document.getElementById('f_controls_play');
    f_controls_next = document.getElementById('f_controls_next');
    f_shuffle_btn = document.getElementById('f_shuffle_btn_label');
    f_layout_btn = document.getElementById('f_layout_btn_label');

}

/*************************************************************************/
// updates the video description with the current song 

function updateVideoDesc(){
  
  // Update Video info
  title_field.value = current_song.title;
  artist_field.value = current_song.artist;
  
}

/*************************************************************************/
// adds songs to the songs pane

function updateSongPane(){

    // Update Playlist info
      playlist_title.innerHTML = current_playlist.title;

  
    // clear previous songs
    while(song_pane.firstChild){
      song_pane.removeChild(song_pane.firstChild);
    }
  
    // for each song in the current playlist 
    for(var i = 0; i < current_song_list.length; ++i){
  
      // create div for song 
      var div = document.createElement('div');
      div.className = "song";
      div.draggable = true;
      div.id = "song"+i;
      current_song_list[i].songId = "song"+i;
      div.ondragstart = function(){
          drag(event);
      };
  
      var div_index = document.createElement("div");
      div_index.className = "video_index";
      div_index.innerHTML = 0;
  
      var div_title = document.createElement("div");
      div_title.className = "video_title";
      div_title.innerHTML = current_song_list[i].title;
  
      var div_artist = document.createElement("div");
      div_artist.className = "video_artist";
      div_artist.innerHTML = current_song_list[i].artist;
  
      var div_delete = document.createElement('div');
      div_delete.className = "video_delete";
      div_delete.innerHTML = 'x';
      
  
      div.appendChild(div_index);
      div.appendChild(div_title);
      div.appendChild(div_artist);
      div.appendChild(div_delete);
      div.song = current_song_list[i];
      current_song_list[i].div = div;
      div_index.onclick = function(){
          if(!this.parentElement.song.isCurrent) // if its not already the cur song 
              changeSong(this.parentElement.song);
      }
      div_title.onclick = function(){
        if(!this.parentElement.song.isCurrent) // if its not already the cur song 
            changeSong(this.parentElement.song);
      }
      div_artist.onclick = function(){
        if(!this.parentElement.song.isCurrent) // if its not already the cur song 
          changeSong(this.parentElement.song);
      }
      div_delete.onclick = function(){
        var result = confirm("Are you sure you want to delete this song from the playlist?");
        if(result)
          deleteFromPlaylist(this);
      }
  
      if(current_song_list[i].isCurrent){
        div_index.innerHTML = '>';
        // add 'current' style to new curr
        div.style.backgroundColor = "rgb(200,20,200)";
        div.style.color = "rgb(250,250,250)";
      } else {  
        div_index.innerHTML = i + 1;
      }
  
      // add to song pane
      song_pane.appendChild(div);
    }
  
    // Update Index out of Total Display
    song_count.innerHTML = (current_song_index + 1) + " / " + current_playlist.songs.length;
  
    // Update shuffle button visual
    if(current_song_list.isShuffled){
      shuffle_button.innerHTML = 'S';
      shuffle_button.style.backgroundColor = '#444';
      shuffle_button.style.color = '#eee';
    } else { 
      shuffle_button.innerHTML = 'N';
      shuffle_button.style.backgroundColor = '#eee';
      shuffle_button.style.color = '#444';
    }
  
    // Update desc bar sortedness
    if(current_song_list.isSorted_Title){
  
      // ensure other desc options are 'unclicked'
      song_pane_desc_index.style.backgroundColor = "var(--color1)";
      song_pane_desc_artist.style.backgroundColor = "var(--color1)";
  
      song_pane_desc_title.style.backgroundColor = "var(--color2)";
      
      // arrow direction
      if(current_song_list.isReversed){
        song_pane_desc_title_arrow.innerHTML = '&and;';
        song_pane_desc_artist_arrow.innerHTML = '';
      } else{
        song_pane_desc_title_arrow.innerHTML = '&or;';
        song_pane_desc_artist_arrow.innerHTML = '';
      }
  
    } else if(current_song_list.isSorted_Artist){
  
      // ensure other desc options are 'unclicked'
      song_pane_desc_index.style.backgroundColor = "var(--color1)";
      song_pane_desc_title.style.backgroundColor = "var(--color1)";
  
      song_pane_desc_artist.style.backgroundColor = "var(--color2)";
  
      // arrow direction
      if(current_song_list.isReversed){
        song_pane_desc_artist_arrow.innerHTML = '&and;';
        song_pane_desc_title_arrow.innerHTML = '';
      } else{
        song_pane_desc_artist_arrow.innerHTML = '&or;';
        song_pane_desc_title_arrow.innerHTML = '';
      }
  
    } else { // not sorted 
  
      // ensure everything is unclicked
      song_pane_desc_index.style.backgroundColor = "var(--color1)";
      song_pane_desc_title.style.backgroundColor = "var(--color1)";
      song_pane_desc_artist.style.backgroundColor = "var(--color1)";
  
      // remove arrows 
      song_pane_desc_title_arrow.innerHTML = '';
      song_pane_desc_artist_arrow.innerHTML = '';
  
    }
  
  
}
  
/*************************************************************************/
// adds playlists to the playlist pane 

function updatePlaylistPane(){

    // clear previous playlists
    while(playlist_pane.firstChild){
      playlist_pane.removeChild(playlist_pane.firstChild);
    }


  // playlists 
  if(playlist_type == PLAYLISTS){
    
    // change header 
    playlist_header.innerHTML = "Playlists";

    // tab style
    playlists_tab.style.zIndex = "11";
    playlists_tab.style.backgroundColor = "var(--color1)";
    artists_tab.style.zIndex = "10";
    artists_tab.style.backgroundColor = "var(--color2)";

      // all songs playlist
    var allSongs = document.createElement('div');
    allSongs.className = "playlist";
  
    var div_title = document.createElement('div');
    div_title.className = "playlist_title";
    div_title.innerHTML = "All Songs";
    allSongs.appendChild(div_title);
    div_title.onclick = function(){
      var playlist = {};
      playlist.title = "All Songs";
      playlist.songs = data.songs;
      playlist.div = this.parentElement;
      changePlaylist(playlist);
    }
  
    playlist_pane.appendChild(allSongs);

    for(var i = 0; i < data.playlists.length; ++i){
  
      // creates the div for the playlist
      var div = document.createElement('div');
      div.className = "playlist";
      div.playlist = data.playlists[i];
      data.playlists[i].div = div;
      div.id = "playlist"+i;
      data.playlists[i].id = "playlist"+i;
  
      var div_title = document.createElement('div');
      div_title.className = "playlist_title";
      div_title.innerHTML = data.playlists[i].title;
      div_title.onclick = function(){
        if(!this.parentElement.playlist.isCurrent); // if its not already the cur song 
          changePlaylist(this.parentElement.playlist);
      }
      div.appendChild(div_title);
  
      var div_delete = document.createElement('div');
      div_delete.className = "playlist_delete";
      div_delete.innerHTML = 'x';
      div_delete.onclick = function (){
        var result = confirm("Are you sure you want to delete this playlist?");
        if(result)
          deletePlaylist(this);
      }
      div.appendChild(div_delete);
  
      div.ondragover = function(){
          allowDrop(event);
      };
      div.ondrop = function(){
          drop(event);
      };
  
      playlist_pane.appendChild(div);
  
    }
  
    // add playlist button
    var div = document.createElement('div');
    div.className = "playlist";
  
    var div_title = document.createElement('div');
    div_title.className = "playlist_title";
    div_title.innerHTML = "All Songs";
    div_title.innerHTML = "+ Create new playlist";
    div_title.onclick = function(){
        var playlist = {};
        playlist.title = prompt();
        playlist.songs = [];
        data.playlists.push(playlist);
        updatePlaylistPane();
    }
    div.appendChild(div_title);
  
    playlist_pane.appendChild(div);

  }


  // artists
  else if (playlist_type == ARTISTS){

    // change header 
    playlist_header.innerHTML = "Artists";

    // tab style
    artists_tab.style.zIndex = "11";
    artists_tab.style.backgroundColor = "var(--color1)";
    playlists_tab.style.zIndex = "10";
    playlists_tab.style.backgroundColor = "var(--color2)";

    // create artist divs 
    for (var i = 0; i < data.artists.length; ++i){

      // creates the div for the artist
      var div = document.createElement('div');
      div.className = "playlist";
      div.artist = data.artists[i];
      data.artists[i].div = div;
      div.id = "artist"+i;
      data.artists[i].id = "artist"+i;
  
      var div_title = document.createElement('div');
      div_title.className = "playlist_title";
      div_title.innerHTML = data.artists[i].title;
      div_title.onclick = function(){
        if(!this.parentElement.artist.isCurrent); // if its not already the cur song 
          changePlaylist(this.parentElement.artist);
      }
      div.appendChild(div_title);

      playlist_pane.appendChild(div);
      
    }

  }
  
}
  
/*************************************************************************/
// updates the elements of the footer

function updateFooter(){

  // thumbnail 
  f_thumbnail.style.background = 'url(http://i.ytimg.com/vi/' + current_song.videoId + '/maxresdefault.jpg)'
  f_thumbnail.style.backgroundSize = "cover";

  // title
  f_title.innerHTML = current_song.title;

  // artist
  f_artist.innerHTML = current_song.artist;

  // play/pause button 
  if(player_status == 0 || player_status == 2){
    f_controls_play.style.background = "url(res/icons/play_white.png)";
    f_controls_play.onmouseover = function(){
      this.style.background = "url(res/icons/play_black.png)";
      this.style.backgroundColor = "rgba(255,255,255,0.25)";
    }
    f_controls_play.onmouseout = function(){
      f_controls_play.style.background = "url(res/icons/play_white.png)";
      this.style.backgroundColor = "rgba(255,255,255,0)";
    }
  } else {
    f_controls_play.style.background = "url(res/icons/pause_white.png)";
    f_controls_play.onmouseover = function(){
      this.style.background = "url(res/icons/pause_black.png)";
      this.style.backgroundColor = "rgba(255,255,255,0.25)";
    }
    f_controls_play.onmouseout = function(){
      f_controls_play.style.background = "url(res/icons/pause_white.png)";
      this.style.backgroundColor = "rgba(255,255,255,0)";
    }
  }

}
 
/*************************************************************************/
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

var editMode = false;


/*************************************************************************/
/***VIDEO CONTROLS********************************************************/
/*************************************************************************/
// changes to the last song in history

function previousSong(){
    if(history_list.length > 0) {
      changeSong(history_list[history_list.length - 1]);
      history_list.splice(history_list.length - 2, 2);
    }
}
  
/*************************************************************************/
// Plays/Pauses the current song 

function pauseSong(){
    if(player_status == 0 || player_status == 2){
        player.playVideo();
        player_status = 1;
    } else {
        player.pauseVideo();
        player_status = 0;
    }
    updateFooter();
}
  
/*************************************************************************/
// Plays the next song in the queue

function nextSong(){
    var nextIndex = ++current_song_index;
    if(nextIndex < current_song_list.length) {
        changeSong(current_song_list[nextIndex]);
    } else {
        changeSong(current_song_list[0]);
    }
}

/*************************************************************************/
// loads a given song up to the video player

function changeSong(song){

    if(current_song){
      // remove 'current' style from prev curr
      current_song.div.style.backgroundColor = "#eee";
      current_song.div.style.color = "rgb(20,20,20)";
      current_song.isCurrent = false;
  
      // add prev song to history
      history_list.push(current_song);
  
      // ensure history only holds a set amount
      if(history_list.length > 25){
        history_list.splice(0,1);
      }
    }
  
    player_status = 1;
  
    // change to next song 
    current_song = song;
    current_song.isCurrent = true;
  
    // find currentIndex of new currentSong
    findCurrentIndex();
  
    // update video desc
    updateVideoDesc();
  
    // load video to player
    player.loadVideoById(current_song.videoId);

    // Play video 
    // - this is used for casting to other devices 
    // as casting next song doesnt start the video
    player.playVideo();
  
    // Reload Song pane
    updateSongPane();
  
    // updates the footer
    updateFooter();
  
  }

/*************************************************************************/
// change the current playlist to a given playlist 

function changePlaylist(p){

    // remove 'current' style from prev curr
    if(current_playlist.div){
      current_playlist.div.style.backgroundColor = "#eee";
      current_playlist.div.style.color = "rgb(20,20,20)";
      current_playlist.isCurrent = false;
    }
  
    // change to given playlist 
    current_playlist = p;
    current_playlist.isCurrent = true;
    current_song_list = current_playlist.songs;
    current_song_list.isShuffled = false
  
    // load playlists up to playlist pane 
    updatePlaylistPane();
  
    // add 'current' style to new curr
    current_playlist.div.style.backgroundColor = "rgb(200,50,200)";
    current_playlist.div.style.color = "rgb(250,250,250)";
    current_playlist.div.firstChild.style.color = "rgb(250,250,250)";
  
    // Ensure sorting is not still recognized
    current_song_list.isShuffled = false;
    current_song_list.isSorted_Title = false;
    current_song_list.isSorted_Artist = false;
  
    // load songs to songs pane
    updateSongPane();
  
  }
  

/*************************************************************************/
// deletes a given song from the current playlist
function deleteFromPlaylist(div){
    for(var i = 0; i < current_song_list.length; ++i){
        if(current_song_list[i].songId == div.parentElement.id){
        current_song_list.splice(i, 1);
        break;
        }
    }
    updateSongPane();
}

/*************************************************************************/
// deletes a given playlist
function deletePlaylist(div){
    for(var i = 0; i < data.playlists.length; ++i){
        if(data.playlists[i].id == div.parentElement.id){
        data.playlists.splice(i, 1);
        break;
        }
    }
    updatePlaylistPane();
}



/*************************************************************************/
// finds the current song's index in the current list of songs 

function findCurrentIndex(){

    for(var i = 0; i < current_song_list.length; ++i){
      current_song_index = -1;
      if(current_song.songId == current_song_list[i].songId){
        current_song_index = i;
        break;
      }
    }
  
  }
  
/* ******************************************************************** */
// allows the user to edit the song title, artist, or videoId

function editSong(edit_btn){

  if(editMode){
    editMode = false;

    // disable editable fields
    title_field.disabled = true;
    artist_field.disabled = true;
    video_desc_edit.style.backgroundColor = "var(--color1)";
    title_field.style.outline = "none";
    artist_field.style.outline = "none";

    // change song info 
    current_song.title = title_field.value;
    current_song.artist = artist_field.value;

    // updates song pane
    updateSongPane();

  } else {
    editMode = true;

    // enable editable fields
    title_field.disabled = false;
    artist_field.disabled = false;
    title_field.focus();
    video_desc_edit.style.backgroundColor = "var(--color2)";
    title_field.style.outline = "auto";
    artist_field.style.outline = "auto";

  }
}

/* **************************************************************************** */
// playlists/artists thingies

function playlistsTab(){
    if(playlist_type != PLAYLISTS){
        playlist_type = PLAYLISTS;
        updatePlaylistPane();
    }
}

function artistsTab(){
    if(playlist_type != ARTISTS){
        playlist_type = ARTISTS;
        updatePlaylistPane();
    }
}

/*************************************************************************/
/*************************** SORTING *************************************/
/*************************************************************************/
// sorts the current playlist by title

function toggleSortedByTitle(){

    // if list is already sorted by title 
    if(current_song_list.isSorted_Title && !current_song_list.isReversed){
      //  then sort by artist in reverse order
      current_song_list = current_song_list.reverse();
      current_song_list.isReversed = true;
  
    } 
    
    // if list was sorted and was reversed
    else if(current_song_list.isSorted_Title && current_song_list.isReversed){
      // then reverse back to orignal
      current_song_list = current_song_list.reverse();
      current_song_list.isReversed = false;
  
    }
  
    // if list is not sorted  
    else {
      //  then sort by title 
      sortByTitle(current_song_list);
      current_song_list.isReversed = false;
    }
  
    // ensure state of list 
    current_song_list.isShuffled = false;
    current_song_list.isSorted_Title = true;
    current_song_list.isSorted_Artist = false;
  
    // Update song pane
    updateSongPane();
  
  }
  
  
  /*************************************************************************/
  // sorts the current playlist by artist
  
  function toggleSortedByArtist(){
  
    // if list is already sorted by artist 
    if(current_song_list.isSorted_Artist && !current_song_list.isReversed){
      //  then sort by artist in reverse order
      current_song_list = current_song_list.reverse();
      current_song_list.isReversed = true;
  
    } 
    
    // if list was sorted and was reversed
    else if(current_song_list.isSorted_Artist && current_song_list.isReversed){
      // then reverse back to orignal
      current_song_list = current_song_list.reverse();
      current_song_list.isReversed = false;
  
    }
  
    // if list is not sorted  
    else {
      //  then sort by artist 
      sortByArtist(current_song_list);
      current_song_list.isReversed = false;
    }
  
  
    // ensure state of list 
    current_song_list.isShuffled = false;
    current_song_list.isSorted_Title = false;
    current_song_list.isSorted_Artist = true;
  
    // Update song pane
    updateSongPane();
  
  
  }
  
  
  /*************************************************************************/
  // sorts a given list of songs lexographically by title 
  
  function sortByTitle(list){
  
    list.sort(function(a,b) {return a.title.localeCompare(b.title)});
  
  }
  
  /*************************************************************************/
  // sorts a given list of songs lexographically by artist 
  
  function sortByArtist(list){
  
    list.sort(function(a,b) {return a.artist.localeCompare(b.artist)});
  
  }


/*************************************************************************/
// loads up the shuffled list of songs 

function toggleShuffledSongs(){
    if(current_song_list.isShuffled){
      current_song_list = current_playlist.songs;// remove shuffle
      current_song_list.isShuffled = false;
      findCurrentIndex(); // relocate current song
      updateSongPane();
    } else {
      var shuffled_songs = shuffle(current_playlist.songs);
      current_song_list = shuffled_songs;// add shuffle
      current_song_list.isShuffled = true;
      findCurrentIndex(); // relocate current song
      updateSongPane();
    }
  }  

/*************************************************************************/
/********************* END SORTING ***************************************/
/*************************************************************************/




/*************************************************************************/

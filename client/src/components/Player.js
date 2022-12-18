import PlayArrow from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import PauseCircle from '@mui/icons-material/PauseCircle';
import FastForward from '@mui/icons-material/FastForward';
import FastRewind from '@mui/icons-material/FastRewind';
import React from 'react';
import YouTube from 'react-youtube';
import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';



export default function Player() {
     // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST

    const { store } = useContext(GlobalStoreContext);
    let videoPlaylist=store.currentVideo;
    let playlist = store.sessionSelectedList!=null? store.sessionSelectedList.songs.map((song)=>
        song.youTubeId):null;

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let currentSong = 0;

    const playerOptions = {
        height: '390',
        width: '505',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        videoPlaylist=player;
        if(store.currentVideo!=videoPlaylist){
            store.updateCurrentVideo(player);
        }
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    let res = <YouTube
    videoId={playlist==null?playlist:playlist[currentSong]}
    opts={playerOptions}
    onReady={onPlayerReady}
    onStateChange={onPlayerStateChange}
    />

    //own code
    function handleLastSongButton(){
            currentSong=(currentSong+playlist.length-1)%playlist.length;
            loadAndPlayCurrentSong(videoPlaylist);
    }
    function handlePauseSongButton(){
        videoPlaylist.pauseVideo();
    }
    function handleStartSongButton(){
        videoPlaylist.playVideo();
    }
    function handleNextSongButton(){
        currentSong=(currentSong+playlist.length+1)%playlist.length;
        loadAndPlayCurrentSong(videoPlaylist);

    }
    return (
        <div>
          <header >
            {res}
            <div id="player-button-session">
            <Button variant="contained"  style={{ background: '#2E3B55' }} onClick={handleLastSongButton}><FastRewind/></Button>
            <Button variant="contained"  style={{ background: '#2E3B55' }} onClick={handlePauseSongButton}><PlayArrow/></Button>
            <Button variant="contained"  style={{ background: '#2E3B55' }} onClick={handleStartSongButton}><PauseCircle/></Button>
            <Button variant="contained"  style={{ background: '#2E3B55' }} onClick={handleNextSongButton}><FastForward/></Button>
            </div>
          </header>
        </div>
      );
}
'use strict'

/* GUARDADO DE LAS CANCIONES */
const Musics = {
    "songs": [
        {
            "name": "Get Lucky",
            "artist": "Daft Punk",
            "dir-image": "images/daft-punk.jpg",
            "dir-song": "music/get-lucky.mp3"
        },
        {
            "name": "Instant Crush",
            "artist": "Daft Punk",
            "dir-image": "images/daft-punk.jpg",
            "dir-song": "music/instant-crush.mp3"
        },
        {
            "name": "One More Time",
            "artist": "Daft Punk",
            "dir-image": "images/daft-punk.jpg",
            "dir-song": "music/one-more-time.mp3"
        },
        {
            "name": "Around the World",
            "artist": "Daft Punk",
            "dir-image": "images/daft-punk.jpg",
            "dir-song": "music/around-the-world.mp3"
        },
        {
            "name": "Blinding Lights",
            "artist": "The Weeknd",
            "dir-image": "images/the-weeknd.jpg",
            "dir-song": "music/blinding-lights.mp3"
        },
        {
            "name": "Save Your Tears",
            "artist": "The Weeknd",
            "dir-image": "images/the-weeknd.jpg",
            "dir-song": "music/save-your-tears.mp3"
        },
        {
            "name": "Psycho",
            "artist": "Post Malone",
            "dir-image": "images/postmalone.jpg",
            "dir-song": "music/psycho.mp3"
        },
        {
            "name": "Imagination",
            "artist": "Foster The People",
            "dir-image": "images/imagination.jpg",
            "dir-song": "music/imagination.mp3"
        }
    ]
}

var currentSong = 0;

var audio;  //etiqueta <audio>
var image;  //etiqueta <img>
var songName;   //etiqueta <span> para el nombre de la cancion
var songArtist; //etiqueta <span> para el nombre deL artista de la cancion

var back, play, next;
var playing = false;
var changingTime = false;
var range;
var currentTime;
var totalTime;

var ul;

window.addEventListener('load', CreateElements);

function CreateElements(){
    console.log('Se ha Cargado el DOM!');

    audio = document.querySelector('#audio');
    image = document.querySelector('#artist_image');
    songName = document.querySelector('#song_name');
    songArtist = document.querySelector('#song_artist');

    play = document.querySelector('#playButton');
    back = document.querySelector('#backButton');
    next = document.querySelector('#nextButton');

    currentTime = document.querySelector('#currentTime');
    range = document.querySelector("#sliderTime");
    totalTime = document.querySelector('#totalTime');

    ul = document.querySelector('#song_list ul');

    CreateSongBoxes();

    AddEventsControlPlayer();

    ChangeSong(currentSong);
}


function AddEventsControlPlayer(){

    //evento para reproducir o pausar el audio
    play.addEventListener('mouseup', (e) => {
        if(playing){
            PauseSong();
            playing = false;
        }else{
            PlaySong();
            playing = true;
        }
    });
    back.addEventListener('mouseup', BackSong, false);
    next.addEventListener('mouseup', NextSong, false);

    /* EVENTOS PARA EL SLIDER */
    range.addEventListener('mousedown', (e) => {
        PauseSong();
    })
    range.addEventListener('input', (e) => {
        changingTime = true;
        audio.currentTime = range.value;
    });
    range.addEventListener('mouseup', (e) => {
        changingTime = false;
        if(playing){
            PlaySong();
        }
    })
    /**************************/
    audio.addEventListener('abort', (a) => {
        console.log('abort!');
    });

    audio.addEventListener('canplay', (a) => {
        if(playing && !changingTime){
            PlaySong();
        }
        console.log('Se puede empezar a reproducir el audio!');
    });

    audio.addEventListener('durationchange', (a) => {
        currentTime.innerHTML = secondsToMinutes(audio.currentTime);
        totalTime.innerHTML = secondsToMinutes(audio.duration);
        range.min = "0";
        range.max = audio.duration;
        range.value = audio.currentTime;
        console.log(range.max);
    });
    audio.addEventListener('ended', NextSong, false);

    //evento del updateTime
    audio.addEventListener('timeupdate', (a) => {
        currentTime.innerHTML = secondsToMinutes(audio.currentTime);
        range.value = audio.currentTime;
    });
}

function PlaySong(){
    audio.play();
    play.src = 'images/pause.png';
}
function PauseSong(){
    audio.pause();
    play.src = 'images/play.png';
}
function BackSong(){
    currentSong = (currentSong==0)?Musics.songs.length-1:currentSong-1;
    ChangeSong(currentSong);
}
function NextSong(){
    currentSong = (currentSong>=Musics.songs.length-1)?0:currentSong+1;
    ChangeSong(currentSong);
}

function ChangeSong(index){
    audio.src = Musics.songs[index]["dir-song"];
    image.src = Musics.songs[index]["dir-image"];
    songName.innerHTML = Musics.songs[index].name;
    songArtist.innerHTML = Musics.songs[index].artist;

    var id = '#'+Musics.songs[index].name+"-"+Musics.songs[index].artist;
    var id = QuitSpaces(id)
    var border = document.querySelector(id);

    var lis = ul.childNodes;

    for(let i = 0; i < lis.length; i++){
        var b = lis[i].firstChild;
        if(b.id == border.id){
            b.setAttribute('class', 'border-selected');
        }else{
            b.setAttribute('class', 'border');
        }
    }
}


function CreateSongBoxes(){
    for(let i = 0; i < Musics.songs.length; i++){
        CreateBox(ul, Musics.songs[i], i);
    }
}

function CreateBox(ul, song, i){
    var li = document.createElement('li');
    var border = document.createElement('div');
    var id = song.name+"-"+song.artist;
    border.setAttribute('id', QuitSpaces(id));
    border.setAttribute('class', 'border');
    border.addEventListener('click', function(){
        currentSong = i;
        ChangeSong(currentSong);
    });
    var infoSong = document.createElement('div');
    infoSong.setAttribute('class', 'info-song');
    var img = document.createElement('img');
    img.setAttribute('src', song['dir-image']);
    var p = document.createElement('p');
    var spanName = document.createElement('span');
    spanName.innerHTML = song.name;
    var br = document.createElement('br');
    var spanArtist = document.createElement('span');
    spanArtist.innerHTML = song.artist;

    p.append(spanName);
    p.append(br);
    p.append(spanArtist);

    infoSong.append(img);
    infoSong.append(p);

    border.append(infoSong);

    li.append(border);

    ul.append(li);

}

function secondsToMinutes(sec){
    const hours    = (Math.floor(sec / 0xE10)).toString();
    const minutes  = (Math.floor(sec / 0x3C ) % 0x3C).toString();
    const seconds = (Math.trunc(sec % 0x3C)).toString();
    //console.log(hours+':'+minutes+':'+seconds);
    if(hours == 0){
        return ((minutes.length>1)?minutes:"0"+minutes)+':'+((seconds.length>1)?seconds:"0"+seconds);
    }
    if(minutes == 0){
        return (seconds.length>1)?seconds:"0"+seconds;
    }
    return  (hours.length>1)?hours:"0"+hours+':'+((minutes.length>1)?minutes:"0"+minutes)+':'+((seconds.length>1)?seconds:"0"+seconds);
}

function QuitSpaces(text){
    return text.replace(/\s+/g, '');
}
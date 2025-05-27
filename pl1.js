console.log('lets write Javascript');
let songs;

let currentsong = new Audio();
let currfolder;

// Convert seconds to MM:SS format
function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingseconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedsecond = String(remainingseconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedsecond}`;
}

// Fetch the list of songs from the folder
async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      // Extract filename relative to folder
      let songName = element.href.split(`/${folder}/`)[1];
      if (songName) songs.push(songName);
    }
  }

  console.log("Songs found:", songs);

  // Show all songs in the playlist with data-song attribute
  let songul = document.querySelector(".list").getElementsByTagName("ul")[0];
  songul.innerHTML = '';
  for (const song of songs) {
    songul.innerHTML += `<li data-song="${song}">
      <img src="music.svg" alt="" srcset="">
      <div class="infosong">
        <div>${song.replaceAll("%20", " ")}</div>
        <div>-SurTaaL Music</div>
      </div>
      <div class="playnow">
        <span>Hit Me</span>
        <img src="playnow.svg" alt="" srcset="">
      </div>
    </li>`;
  }

  // Attach an event listener to each song item
  Array.from(document.querySelector(".list").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      let song = e.getAttribute("data-song");
      console.log("Playing song:", song);
      playmusic(song);
    });
  });

  return songs;
}

// Play the music track from the current folder
const playmusic = (track, pause = false) => {
  console.log("Current folder:", currfolder);
  console.log("Track:", track);

  if (!track) {
    console.error("Track is undefined or empty");
    return;
  }

  currentsong.src = `/${currfolder}/` + track;
  console.log("Audio source set to:", currentsong.src);

  if (!pause) {
    currentsong.play();
    play.querySelector('img').src = "pause.svg";
  }

  document.querySelector(".aboutsong").innerHTML = decodeURI(track).replace(".mp3", " ");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
  // List the songs
  await getsongs("songlist/hss");

  // Play the first song but don't autoplay
  playmusic(songs[0], true);

  // Play/pause button event listener
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.querySelector('img').src = 'pause.svg';
    } else {
      currentsong.pause();
      play.querySelector('img').src = 'playbar.svg';
    }
  });

  // Listen for timeupdate event to update UI
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentsong.currentTime)}/${secondsToMinutes(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // Listen for ended event to play next song
  currentsong.addEventListener("ended", () => {
    let currentTrack = currentsong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentTrack);
    if (index !== -1 && index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  // Seekbar click event
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  // Previous song button event
  prev.addEventListener("click", () => {
    currentsong.pause();
    let currentTrack = currentsong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentTrack);

    if (index > 0) {
      playmusic(songs[index - 1]);
    }
  });

  // Next song button event
  next.addEventListener("click", () => {
    currentsong.pause();
    let currentTrack = currentsong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentTrack);

    if (index !== -1 && index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  // Volume control event
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });
}

main();

console.log('lets write Javascript');

let songs = [];
let currentsong = new Audio();
let currfolder;

// Select DOM elements — adjust selectors if needed
const play = document.querySelector(".play-button");
const prev = document.querySelector(".prev-button");
const next = document.querySelector(".next-button");

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

// Fetch the list of songs from the folder assuming songs.json is an array of filenames
async function getsongs(folder) {
  currfolder = folder;
  let response = await fetch(`/${folder}/songs.json`);
  if (!response.ok) {
    console.error("Failed to load songs.json");
    return [];
  }
  songs = await response.json();

  console.log("Songs found:", songs);

  let songul = document.querySelector(".list ul");
  songul.innerHTML = '';

  for (const song of songs) {
    songul.innerHTML += `<li data-song="${song}">
      <img src="music.svg" alt="" />
      <div class="infosong">
        <div>${decodeURIComponent(song).replaceAll("%20", " ")}</div>
        <div>-SurTaaL Music</div>
      </div>
      <div class="playnow">
        <span>Hit Me</span>
        <img src="playnow.svg" alt="" />
      </div>
    </li>`;
  }

  document.querySelectorAll(".list li").forEach(e => {
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
  if (!track) {
    console.error("Track is undefined or empty");
    return;
  }

  console.log("Current folder:", currfolder);
  console.log("Track:", track);

  currentsong.src = `/${currfolder}/` + track;
  console.log("Audio source set to:", currentsong.src);

  document.querySelector(".aboutsong").innerHTML = decodeURI(track).replace(".mp3", " ");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

  if (!pause) {
    currentsong.play().catch(err => console.error("Play error:", err));
    if (play) play.querySelector('img').src = "pause.svg";
  }
}

async function main() {
  if (!play || !prev || !next) {
    console.error("One or more control buttons not found in DOM");
    return;
  }

  // Load songs from folder
  await getsongs("songlist/hss");

  if (!songs || songs.length === 0) {
    console.error("No songs found, cannot play.");
    return;
  }

  // Load first song, but don't autoplay
  playmusic(songs[0], true);

  // Play/pause toggle
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.querySelector('img').src = 'pause.svg';
    } else {
      currentsong.pause();
      play.querySelector('img').src = 'playbar.svg';
    }
  });

  // Update song time and seekbar circle position
  currentsong.addEventListener("timeupdate", () => {
    let duration = currentsong.duration || 0;
    let currentTime = currentsong.currentTime || 0;
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentTime)} / ${secondsToMinutes(duration)}`;
    if(duration > 0) {
      document.querySelector(".circle").style.left = (currentTime / duration) * 100 + "%";
    }
  });

  // Auto play next song when current ends
  currentsong.addEventListener("ended", () => {
    let currentTrack = currentsong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentTrack);
    if (index !== -1 && index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  // Seekbar click to seek song
  document.querySelector(".seekbar").addEventListener("click", e => {
    let seekbar = e.target;
    let rect = seekbar.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    let duration = currentsong.duration || 0;
    document.querySelector(".circle").style.left = (percent * 100) + "%";
    currentsong.currentTime = duration * percent;
  });

  // Previous song button
  prev.addEventListener("click", () => {
    currentsong.pause();
    let currentTrack = currentsong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentTrack);
    if (index > 0) {
      playmusic(songs[index - 1]);
    }
  });

  // Next song button
  next.addEventListener("click", () => {
    currentsong.pause();
    let currentTrack = currentsong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentTrack);
    if (index !== -1 && index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  // Volume slider change
  const volumeInput = document.querySelector(".range input");
  if (volumeInput) {
    volumeInput.addEventListener("change", (e) => {
      let volume = parseInt(e.target.value, 10) / 100;
      currentsong.volume = volume;
    });
  }
}

main();


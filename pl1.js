console.log('Let’s write JavaScript');

let songs;
let currentSong = new Audio();
let currFolder;

function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let response = await fetch(`/${folder}/`);
  let text = await response.text();
  let div = document.createElement("div");
  div.innerHTML = text;

  let anchors = div.getElementsByTagName("a");
  songs = [];

  for (let i = 0; i < anchors.length; i++) {
    const element = anchors[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // Display song list
  const songUl = document.querySelector(".list ul");
  songUl.innerHTML = '';

  for (const song of songs) {
    songUl.innerHTML += `
      <li>
        <img src="music.svg" alt="">
        <div class="infosong">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>- SurTaaL Music</div>
        </div>
        <div class="playnow">
          <span>Hit Me</span>
          <img src="playnow.svg" alt="">
        </div>
      </li>`;
  }

  // Attach event listener to each song
  Array.from(document.querySelectorAll(".list li")).forEach(e => {
    e.addEventListener("click", () => {
      const songName = e.querySelector(".infosong div").innerText.trim();
      playMusic(songName);
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/${track}`;
  console.log("Playing:", currentSong.src);

  if (!pause) {
    currentSong.play();
    document.querySelector("#play img").src = "pause.svg";
  }

  document.querySelector(".aboutsong").innerText = decodeURIComponent(track.replace(".mp3", ""));
  document.querySelector(".songtime").innerText = "00:00 / 00:00";
}

async function main() {
  await getSongs("songlist/hss");
  playMusic(songs[0], true);

  // Play button event
  document.querySelector("#play").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.querySelector("#play img").src = "pause.svg";
    } else {
      currentSong.pause();
      document.querySelector("#play img").src = "playbar.svg";
    }
  });

  // Update seekbar and time
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerText = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Autoplay next song
  currentSong.addEventListener("ended", () => {
    let index = songs.indexOf(currentSong.src.split("/").pop());
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Seekbar interaction
  document.querySelector(".seekbar").addEventListener("click", e => {
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Volume control
  document.querySelector(".range input").addEventListener("input", e => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  // Previous song
  document.querySelector("#prev").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").pop());
    if (index > 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Next song
  document.querySelector("#next").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").pop());
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
}

main();

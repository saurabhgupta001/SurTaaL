console.log('lets write Javascript');
let songs = [];
let currentsong = new Audio();
let currfolder = '';

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

async function getsongs(folder) {
  currfolder = folder;
  try {
    let response = await fetch(`/${folder}/songs.json`);
    let songList = await response.json();
    songs = songList;

    // Show all songs in the playlist
    let songul = document.querySelector(".list ul");
    songul.innerHTML = '';
    for (const song of songs) {
      songul.innerHTML += `
        <li>
          <img src="music.svg" alt="">
          <div class="infosong">
            <div>${decodeURIComponent(song.replaceAll("%20", " "))}</div>
            <div>- SurTaaL Music</div>
          </div>
          <div class="playnow">
            <span>Hit Me</span>
            <img src="playnow.svg" alt="">
          </div>
        </li>`;
    }

    // Attach event listeners to each song item
    Array.from(document.querySelectorAll(".list li")).forEach((e, i) => {
      e.addEventListener("click", () => {
        let songName = songs[i];
        playmusic(songName.trim());
      });
    });

    return songs;
  } catch (err) {
    console.error("Failed to load songs:", err);
    return [];
  }
}

const playmusic = (track, pause = false) => {
  const src = encodeURI(`/${currfolder}/${track}`);
  currentsong.src = src;

  if (!pause) {
    currentsong.play();
    document.querySelector(".play img").src = "pause.svg";
  }

  document.querySelector(".aboutsong").innerHTML = decodeURIComponent(track.replace(".mp3", " "));
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  const play = document.querySelector(".play");
  const next = document.querySelector(".next");
  const prev = document.querySelector(".prev");

  songs = await getsongs("songlist/tss");

  if (songs.length === 0) return;

  playmusic(songs[0], true);

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.querySelector("img").src = "pause.svg";
    } else {
      currentsong.pause();
      play.querySelector("img").src = "playbar.svg";
    }
  });

  prev.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(decodeURIComponent(currentsong.src.split("/").pop()));
    if (index > 0) {
      playmusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(decodeURIComponent(currentsong.src.split("/").pop()));
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    let current = currentsong.currentTime;
    let total = currentsong.duration;
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(current)} / ${secondsToMinutes(total)}`;

    document.querySelector(".circle").style.left = `${(current / total) * 100}%`;
  });

  currentsong.addEventListener("ended", () => {
    let index = songs.indexOf(decodeURIComponent(currentsong.src.split("/").pop()));
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  document.querySelector(".range input").addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });
}

main();

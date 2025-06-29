console.log("Let's write JavaScript");

let songs = [];
let currentsong = new Audio();
let currfolder = "";

function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

async function getsongs(folder) {
  currfolder = folder;

  try {
    const res = await fetch(`songlist/${folder}/songs.json`);
    songs = await res.json();

    const songul = document.querySelector(".list ul");
    songul.innerHTML = "";

    for (const song of songs) {
      songul.innerHTML += `
        <li>
          <img src="music.svg" alt="icon">
          <div class="infosong">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>-SurTaaL Music</div>
          </div>
          <div class="playnow">
            <span>Hit Me</span>
            <img src="playnow.svg" alt="play">
          </div>
        </li>`;
    }

    document.querySelectorAll(".list li").forEach((li, index) => {
      li.addEventListener("click", () => playmusic(songs[index]));
    });

  } catch (err) {
    console.error(`Error loading songs from ${folder}:`, err);
  }
}

function playmusic(track, pause = false) {
  currentsong.src = `songlist/${currfolder}/${track}`;

  if (!pause) {
    currentsong.play();
    document.querySelector("#play img").src = 'pause.svg';
  }

  document.querySelector(".aboutsong").textContent = track.replace(".mp3", "");
  document.querySelector(".songtime").textContent = "00:00 / 00:00";
}

async function main() {
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  // Load default playlist folder (hss)
  await getsongs("hss");
  playmusic(songs[0], true);

  playBtn.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      playBtn.querySelector('img').src = 'pause.svg';
    } else {
      currentsong.pause();
      playBtn.querySelector('img').src = 'playbar.svg';
    }
  });

  prevBtn.addEventListener("click", () => {
    const currentTrack = currentsong.src.split("/").pop();
    const index = songs.indexOf(currentTrack);
    if (index > 0) playmusic(songs[index - 1]);
  });

  nextBtn.addEventListener("click", () => {
    const currentTrack = currentsong.src.split("/").pop();
    const index = songs.indexOf(currentTrack);
    if (index + 1 < songs.length) playmusic(songs[index + 1]);
  });

  currentsong.addEventListener("timeupdate", () => {
    const current = currentsong.currentTime;
    const duration = currentsong.duration || 0;
    document.querySelector(".songtime").textContent = `${secondsToMinutes(current)} / ${secondsToMinutes(duration)}`;
    document.querySelector(".circle").style.left = `${(current / duration) * 100}%`;
  });

  currentsong.addEventListener("ended", () => {
    const currentTrack = currentsong.src.split("/").pop();
    const index = songs.indexOf(currentTrack);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  document.querySelector(".seekbar").addEventListener("click", e => {
    const percent = e.offsetX / e.target.getBoundingClientRect().width;
    if (!isNaN(currentsong.duration)) {
      currentsong.currentTime = percent * currentsong.duration;
    }
  });

  document.querySelector(".range input").addEventListener("input", e => {
    currentsong.volume = e.target.value / 100;
  });

  // Playlist switching logic via buttons
  document.querySelectorAll(".playlist-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const folder = btn.dataset.folder;
      await getsongs(folder);
      playmusic(songs[0], true);
    });
  });
}

main();

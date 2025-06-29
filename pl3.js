console.log("Let's write JavaScript");

let songs = [];
let currentsong = new Audio();
let currfolder = "";

function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
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
          <img src="music.svg" alt="">
          <div class="infosong">
            <div>${decodeURIComponent(song)}</div>
            <div>-SurTaaL Music</div>
          </div>
          <div class="playnow">
            <span>Hit Me</span>
            <img src="playnow.svg" alt="">
          </div>
        </li>`;
    }

    Array.from(document.querySelectorAll(".list li")).forEach((li, index) => {
      li.addEventListener("click", () => {
        playmusic(songs[index]);
      });
    });

  } catch (err) {
    console.error(`Error loading songs from ${folder}`, err);
  }
}

function playmusic(track, pause = false) {
  currentsong.src = `songlist/${currfolder}/${track}`;
  if (!pause) {
    currentsong.play();
    document.querySelector("#play img").src = "pause.svg";
  }

  document.querySelector(".aboutsong").innerHTML = decodeURIComponent(track.replace(".mp3", ""));
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
  await getsongs("ass"); // Load default playlist
  playmusic(songs[0], true);

  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  playBtn.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      playBtn.querySelector("img").src = "pause.svg";
    } else {
      currentsong.pause();
      playBtn.querySelector("img").src = "playbar.svg";
    }
  });

  prevBtn.addEventListener("click", () => {
    const currentFile = decodeURIComponent(currentsong.src.split("/").pop());
    const index = songs.indexOf(currentFile);
    if (index > 0) {
      playmusic(songs[index - 1]);
    }
  });

  nextBtn.addEventListener("click", () => {
    const currentFile = decodeURIComponent(currentsong.src.split("/").pop());
    const index = songs.indexOf(currentFile);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${secondsToMinutes(currentsong.currentTime)} / ${secondsToMinutes(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      `${(currentsong.currentTime / currentsong.duration) * 100}%`;
  });

  currentsong.addEventListener("ended", () => {
    const currentFile = decodeURIComponent(currentsong.src.split("/").pop());
    const index = songs.indexOf(currentFile);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const percent = e.offsetX / e.target.getBoundingClientRect().width;
    currentsong.currentTime = percent * currentsong.duration;
  });

  document.querySelector(".range input").addEventListener("input", (e) => {
    currentsong.volume = e.target.value / 100;
  });

  // Optional: playlist switching buttons
  document.querySelectorAll(".playlist-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const folder = btn.dataset.folder;
      await getsongs(folder);
      playmusic(songs[0], true);
    });
  });
}

main();


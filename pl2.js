console.log('lets write Javascript');
let songs;

let currentsong = new Audio();
let currfolder;
function secondsToMinutes(seconds) {
 if(isNaN(seconds) || seconds<0){
  return "00:00"
 }
 const minutes = Math.floor(seconds/60);
 const remainingseconds = Math.floor(seconds % 60);
 const formattedMinutes = String(minutes).padStart(2, '0');
 const formattedsecond = String(remainingseconds).padStart(2, '0');
 return `${formattedMinutes}:${formattedsecond}`;
}

async function getsongs(folder){
  currfolder = folder;
  let a = await fetch(`/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")){
      songs.push(element.href.split(`/${folder}/`)[1])
    }
    
  }
  //show all song in the playlist
  let songul = document.querySelector(".list").getElementsByTagName("ul")[0]
  songul.innerHTML = '';
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li>
    <img src="music.svg" alt="" srcset="">
    <div class="infosong">
      <div>${song.replaceAll("%20"," ")}</div>
      <div>-SurTaaL Music</div>
    </div>
    <div class="playnow">
      <span>Hit Me</span>
      <img src="playnow.svg" alt="" srcset="">
    </div></li>`;
    
  }
  //Aattached an event listener to each song
  Array.from(document.querySelector(".list").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click",element=>{
    console.log(e.querySelector(".infosong").firstElementChild.innerHTML)
    playmusic(e.querySelector(".infosong").firstElementChild.innerHTML.trim())

    
    })
  })
  return songs;
}
const playmusic = (track, pause=false)=>{
  //let audio = new Audio("/songlist/" + track)
  console.log(currfolder)

  currentsong.src = `/${currfolder}/` + track
  
  console.log(currentsong.src)
  if(!pause){
  currentsong.play()
  play.src = "pause.svg"
}
  
  document.querySelector(".aboutsong").innerHTML = decodeURI(track).replace(".mp3", " ")
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
  
}
async function main(){
   
  // list of the song
  await getsongs("songlist/tss")
 
  playmusic(songs[0], true)

  
  //Aattached an event listener to play,next and previous
 
  play.addEventListener("click",()=>{
    if(currentsong.paused){
      currentsong.play()
      //play.src = 'pause.svg';
      play.querySelector('img').src = 'pause.svg';
    }
    else{
      currentsong.pause()
      //play.src = 'next.svg';
      play.querySelector('img').src = 'playbar.svg';
      
    }
  })
  //listen for timeupdate event
  currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime,currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentsong.
      currentTime)}/${secondsToMinutes(currentsong.duration)}`
      document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)* 100 + "%";
      currentsong.addEventListener("ended", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
          playmusic(songs[index + 1]);
        }
      });
      
  })
  //add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) *100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime =( currentsong.duration* percent)/100
  })
  //Add an event listener for hamburger
  let count = 0;
  


//add event listener to previous and next
prev.addEventListener("click",()=>{
  currentsong.pause()
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]).replace("mp3","")
  
  if((index-1)>= 0){
    playmusic(songs[index-1])
  }
})
next.addEventListener("click",()=>{
  currentsong.pause()
  
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

  if((index+1)<=songs.length){
    playmusic(songs[index+1])

  }
  })
  //add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    currentsong.volume = parseInt(e.target.value)/100
  })
  
}
main()

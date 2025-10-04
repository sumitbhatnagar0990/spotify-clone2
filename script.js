// === FLOATING NOTES ON PAGE LOAD ===
window.addEventListener("load", () => {
  const notesContainer = document.getElementById("loadingNotes");
  const symbols = ["🎵","🎶","🎧","🎼"];
  
  for (let i = 0; i < 12; i++) {
    let note = document.createElement("span");
    note.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    note.style.left = Math.random() * 100 + "vw";
    note.style.animationDuration = (2 + Math.random() * 3) + "s";
    notesContainer.appendChild(note);
    
    // remove after animation
    setTimeout(() => note.remove(), 10000);
  }
});

 
 
 console.log("lets write some js code for our spotify project !!")



 let currentSong=new Audio();
let songs = [];
let currentIndex = 0;

const volumeSlider = document.getElementById("volumeSlider");

// Initialize volume
currentSong.volume = volumeSlider.value;

// Update volume when slider changes
volumeSlider.addEventListener("input", (e) => {
  currentSong.volume = e.target.value;
});


 async function getSongs(){
  console.log("Fetching songs from", window.location.href);
  let a = await fetch("./songs/");



  let response = await a.text();
  let div=document.createElement("div")
  div.innerHTML=response;
  let as=div.getElementsByTagName("a")
  let songs=[]
  for(let index=0;index<as.length;index++){
const element=as[index];
if(element.href.endsWith(".mp3")){
  songs.push(element.href.split("/songs/")[1])
}
  }
  return songs
 }

 const playMusic = (track) => {
  currentSong.src = "/songs/" + track;
  currentSong.play();
  play.src = "pause.svg";

  // Decode for clean display
  let cleanName = decodeURIComponent(track);
  document.querySelector(".songinfo").innerHTML = cleanName;

  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  if (secs < 10) secs = "0" + secs;  // add leading zero
  return `${minutes}:${secs}`;
}



 async function main(){
  
  //get the list of all songs 
  let songs=await getSongs()

  //show all the songs in playlist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
for ( const song of songs){
songUL.innerHTML =  songUL.innerHTML +  `<li> 
      <img class="invert" src="music.svg" alt=" ">
      <div class="info">
        <div>${song.replaceAll("%20"," ")}</div>
        <div></div>
      </div>
      <div class="playnow">
        <span>play Now</span>
        <img class="invert" src="play.svg" alt=" " height="24px" width="24px">
      </div>
 </li>`;
}
// attach an event listener to each song
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, i) => {
  e.addEventListener("click", () => {
    let track = e.querySelector(".info").firstElementChild.innerHTML.trim();
    currentIndex = i;   //  update the index correctly
    playMusic(track);
  });
});


// attach an event listener to play , next and previous
play.addEventListener("click", ()=>{
  if(currentSong.paused){
    currentSong.play()
    play.src="pause.svg"
  }
  else{
    currentSong.pause()
    play.src="play.svg"
  }
})


// listen for time update event
currentSong.addEventListener("timeupdate", () => {
  // update time display
  document.querySelector(".songtime").innerHTML =
    `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

  // move circle with progress
  let progress = (currentSong.currentTime / currentSong.duration) * 100;
  document.querySelector(".circle").style.left = progress + "%";
});

// allow clicking on seekbar to change time
document.querySelector(".seekbar").addEventListener("click", (e) => {
  let seekbar = e.currentTarget;
  let percent = (e.offsetX / seekbar.offsetWidth);
  currentSong.currentTime = percent * currentSong.duration;
});

// add event listener for hamberger
document.querySelector(".hamberger").addEventListener("click",()=>{
  document.querySelector(".left").style.left="0"
})

// add event listener for close button
document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left="-100%"
})

// Next button
document.querySelector("#next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  playMusic(songs[currentIndex]);
});

// Previous button
document.querySelector("#previous").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  playMusic(songs[currentIndex]);
});


// ===================== LOGIN FLOW =====================
document.getElementById("nextBtn").addEventListener("click", () => {
  const input = document.getElementById("userInput").value.trim();
  const loginBox = document.getElementById("loginBox");

  if (input.length > 0) {
    // Replace login form with welcome message
    loginBox.innerHTML = `
      <h1 style="color:#1db954; font-size:15px;">
       Welcome to Spotify (made by sumit ✨)
      </h1>
    `;

    // After 2.5s → hide login and show app
    setTimeout(() => {
      document.getElementById("loginScreen").style.display = "none";
      const appUI = document.getElementById("appUI");
      appUI.style.display = "block";
      appUI.style.opacity = "0";
      appUI.style.transition = "opacity 1s ease";
      setTimeout(() => appUI.style.opacity = "1", 50);
    }, 2500);
  } else {
    alert("Please enter your email or mobile number!");
  }
});






 }

 main()
 
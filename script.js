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
    setTimeout(() => note.remove(), 10000);
  }
});

console.log("Spotify Clone by Sumit 🎧");

// ================== GLOBALS ==================
let currentSong = new Audio();
let songs = [];
let currentIndex = 0;

// Volume slider
const volumeSlider = document.getElementById("volumeSlider");
currentSong.volume = volumeSlider.value;
volumeSlider.addEventListener("input", (e) => {
  currentSong.volume = e.target.value;
});

// ================== FETCH SONGS ==================
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/public/songs/");





  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(decodeURIComponent(element.href.split("/songs/")[1]));
    }
  }
  return songs;
}

// ================== PLAY MUSIC ==================
const playMusic = (track) => {
  currentSong.src = `public/songs/${encodeURIComponent(track)}`;
  currentSong.play();
  play.src = "pause.svg";
  document.querySelector(".songinfo").innerHTML = track.replace(".mp3", "");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// Format time
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  if (secs < 10) secs = "0" + secs;
  return `${minutes}:${secs}`;
}

// ================== MAIN FUNCTION ==================
async function main() {
  songs = await getSongs();

  // render songs
  let songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += `
      <li> 
        <img class="invert" src="music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div></div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="" height="24px" width="24px">
        </div>
      </li>`;
  }

  //  FIXED PLAY ON CLICK (CASE + TRIM SAFE)
  Array.from(document.querySelectorAll(".songList li")).forEach((item) => {
    item.addEventListener("click", () => {
      const songName = item.querySelector(".info div").innerText.trim().toLowerCase();
      const matched = songs.find(s => s.toLowerCase().trim() === songName + ".mp3" || s.toLowerCase().trim() === songName);
      if (matched) {
        currentIndex = songs.indexOf(matched);
        playMusic(matched);
      }
    });
  });

  // Play/pause button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  // Time update
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
    let progress = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".circle").style.left = progress + "%";
  });

  // Seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let seekbar = e.currentTarget;
    let percent = e.offsetX / seekbar.offsetWidth;
    currentSong.currentTime = percent * currentSong.duration;
  });

  // Menu buttons
  document.querySelector(".hamberger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  // Next/Prev
  document.querySelector("#next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    playMusic(songs[currentIndex]);
  });
  document.querySelector("#previous").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playMusic(songs[currentIndex]);
  });

  // Login transition
  document.getElementById("nextBtn").addEventListener("click", () => {
    const input = document.getElementById("userInput").value.trim();
    const loginBox = document.getElementById("loginBox");

    if (input.length > 0) {
      loginBox.innerHTML = `<h1 style="color:#1db954; font-size:15px;">Welcome to Spotify (made by sumit ✨)</h1>`;
      setTimeout(() => {
        document.getElementById("loginScreen").style.display = "none";
        const appUI = document.getElementById("appUI");
        appUI.style.display = "block";
        appUI.style.opacity = "0";
        appUI.style.transition = "opacity 1s ease";
        setTimeout(() => (appUI.style.opacity = "1"), 50);
      }, 2500);
    } else {
      alert("Please enter your email or mobile number!");
    }
  });
}

main();






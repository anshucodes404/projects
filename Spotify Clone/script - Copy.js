console.log("Let's write some javaScript");
let currentSong = new Audio();
let songs;
let currentFolder;
//This is the function to convert seconds to minutes:seconds
function convertSecondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  seconds = Math.floor(seconds); // Ensure no decimal values
  let minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  let remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}
async function getAllSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/songs/${folder}`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  console.log("I am all as");

  let songs = [];

  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songs.push(as[i].href.split(`Songs/`)[1].split(".mp3")[0]);
    }
  }

  return songs;
}

//Function to play music
const playMusic = (track, pause = false) => {
  currentSong.src = `/songs/${currentFolder}/` + track + ".mp3";
  if (!pause) {
    currentSong.play();
    play.src = "assets/pause.svg";
  }
  document.getElementsByClassName("songInfo")[0].innerHTML = decodeURI(track); //[0] is used b/c getElementsByClassName returns an array
  document.querySelector(".time").innerHTML = "00:00" + "/" + "00:00";
};

//Function for displaying all albums
async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  console.log(div);
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  //Not using async or foreach loop because it will run in background and not respond in real time
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      let folder = e.href
        .split("/songs/")[1]
        .replaceAll("%20", " ")
        .replace("/", "");
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
      document.querySelector(
        ".cardContainer"
      ).innerHTML += `<div data-folder="${response.title}" class="card">
              <div class="image">
                <img src="/songs/${folder}/cover.jpg" alt="">
                <div class="play">
                  <button class="play-button" aria-label="Play">
                    <div class="play-icon"></div>
                  </button>
                </div>
              </div>
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`;
    }
  }
}

//This is the main function
async function main() {
  //For displaying dynamic albums
  displayAlbums();

  // Clear the existing songs
  let songUL = document.querySelector(".songs").getElementsByTagName("ul")[0];
  songUL.innerHTML = ""; // Clear existing songs

  // Get and display new songs
  songs = await getAllSongs(e.dataset.folder);

  // Update the songUL with new songs
  for (const song of songs) {
    songUL.innerHTML += `<li>
                        <div class="music_card">
                          <img class="invert" src="assets/music.svg" alt="">
                          <div class="song_info">
                             <h3>${song.replaceAll("%20", " ")}</h3>
                             <div>Anshu</div>
                          </div>
                          <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" width="20" src="assets/playnow.svg" alt="">
                            </div>
                        </div>
       </li>`;
  }

  // Add click events to the new songs
  Array.from(
    document.querySelector(".songs").getElementsByTagName("li")
  ).forEach((li) => {
    li.addEventListener("click", () => {
      console.log("Song clicked");
      playMusic(
        li.querySelector(".song_info").firstElementChild.innerHTML.trim()
      );

      // Play the first song
      if (songs.length > 0) {
        playMusic(songs[0], true);
      }
    });
  });

  // Initial load with default folder
  let defaultFolder = "Hindi Songs";
  songs = await getAllSongs(defaultFolder);
  if (songs.length > 0) {
    playMusic(songs[0], true);

    // Display initial songs
    let songUL = document.querySelector(".songs").getElementsByTagName("ul")[0];
    for (const song of songs) {
      songUL.innerHTML += `<li>
                       <div class="music_card">
                         <img class="invert" src="assets/music.svg" alt="">
                         <div class="song_info">
                            <h3>${song.replaceAll("%20", " ")}</h3>
                            <div>Anshu</div>
                         </div>
                         <div class="playnow">
                           <span>Play Now</span>
                           <img class="invert" width="20" src="assets/playnow.svg" alt="">
                           </div>
                       </div>
      </li>`;
    }
  }

  //Logic for previous, pause and next butttons

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/pause.svg";
    } else {
      currentSong.pause();
      play.src = "assets/playnow.svg";
    }
  });

  //Add EventListener to previous button

  previous.addEventListener("click", () => {
    let index = songs.indexOf(
      currentSong.src.split("Songs/")[1].split(".mp3")[0]
    );
    if (index == 0) {
      playMusic(songs[songs.length - 1]);
    } else {
      playMusic(songs[index - 1]);
    }
  });

  //Add EventListener to next button

  next.addEventListener("click", () => {
    let index = songs.indexOf(
      currentSong.src.split("Songs/")[1].split(".mp3")[0]
    );
    // console.log(currentSong)
    // console.log(currentSong.src.split("/songs/")[1].split(".mp3")[0])
    // console.log(index)
    // console.log(songs)
    // console.log(songs.length)
    if (index == songs.length - 1) {
      playMusic(songs[0]);
    } else {
      playMusic(songs[index + 1]);
    }
  });

  //Time update feature

  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime)
    // console.log(currentSong.duration)
    let progress = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".time").innerHTML =
      convertSecondsToMinutes(currentSong.currentTime) +
      "/" +
      convertSecondsToMinutes(currentSong.duration);
    document.querySelector(".circle").style.left = progress + "%";
    document.querySelector(".progress").style.width = progress + 1 + "%";
  });

  //addEventListener to seekbar

  document.querySelector(".seek_bar").addEventListener("click", (e) => {
    // Calculate the click position relative to the seek bar's total width
    let seekBar = e.target.closest(".seek_bar");
    let rect = seekBar.getBoundingClientRect();
    let clickPosition = e.clientX - rect.left;
    let percent = (clickPosition / seekBar.clientWidth) * 100;

    // Ensure percent stays within 0-100 range
    percent = Math.min(100, Math.max(0, percent));

    // Update circle and progress bar position
    document.querySelector(".circle").style.left = percent + "%";
    document.querySelector(".progress").style.width = percent + "%";

    // Update song position
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add event loistener to hamburger icon
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
  });

  //Add EventListener to close icon
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  //Add eventListener to volume of song

  document.getElementById("volume").addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  //Add eventListener to playbutton on album
  document.querySelectorAll(".card").forEach((e) => {
    e.addEventListener("mouseenter", () => {
      e.querySelector(".play-button").style.opacity = 1;
      e.querySelector(".play-button").style.transform = "translateY(-10%)";
      e.style.backgroundColor = "rgb(63, 63, 63)";
    });

    e.addEventListener("mouseleave", () => {
      e.querySelector(".play-button").style.opacity = 0;
      e.querySelector(".play-button").style.transform = "translateY(0%)";
      e.style.backgroundColor = "rgb(31, 31, 31)";
    });
  });
}

main();

console.log("Let's write some javaScript");
let currentSong = new Audio();
let songs;

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

async function getAllSongs() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  console.log(as);

  let songs = [];

  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songs.push(as[i].href.split(`/songs/`)[1].split(".mp3")[0]);
      //Splits the string at /songs/ and takes the second part b/c splitting makes an array
    }
  }

  return songs;
}

//Function to play music
const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track + ".mp3";
  if (!pause) {
    currentSong.play();
    play.src = "assets/pause.svg";
  }
  document.getElementsByClassName("songInfo")[0].innerHTML = decodeURI(track); //[0] is used b/c getElementsByClassName returns an array
  document.querySelector(".time").innerHTML = "00:00" + "/" + "00:00";
};

//This is the main function
async function main() {
  songs = await getAllSongs();
  // console.log(songs)
  playMusic(songs[0], true);

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

  Array.from(
    document.querySelector(".songs").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      // console.log(e.querySelector(".song_info").firstElementChild.innerHTML)
      console.log(e);
      playMusic(
        e.querySelector(".song_info").firstElementChild.innerHTML.trim()
      ); //Fetches which song to play from library
    });
  });

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
      currentSong.src.split("/songs/")[1].split(".mp3")[0]
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
      currentSong.src.split("/songs/")[1].split(".mp3")[0]
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

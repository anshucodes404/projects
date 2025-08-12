import "./App.css";
import { useState, useEffect } from "react";
function App() {
  const [songs, setSongs] = useState([]);
  const [newSongsList, setNewSongsList] = useState([]);
  const [audiosrc, setAudiosrc] = useState(null);
  const [audio] = useState(new Audio());
  const [index, setIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [pause, setPause] = useState(true);
  const play = document.getElementById("play");

  // Add event listeners when component mounts
  useEffect(() => {
    // Update duration when metadata is loaded
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      // console.log(audio.duration);
    });

    // Update current time while playing
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      let progress = (audio.currentTime / audio.duration) * 100;
      console.log(progress);
      document.getElementById("seekbar-input").value = progress;
      // console.log(audio.currentTime);

      // if (audio.paused) {
      //   play.src = "/playnow.svg";
      // } else {
      //   play.src = "/pause.svg";
      // }
    });

    // Cleanup listeners
    return () => {
      audio.removeEventListener("loadedmetadata", () => {});
      audio.removeEventListener("timeupdate", () => {});
    };
  }, [audio, play]);

  // Format time in minutes:seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // can also use const files = [...e.target.files]
    //e.target.files contain all files inputed from input but it is not a real Array, so can't use .map, converting into array using Array.from()
    var newSongs = files.map((file) => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    const newSongsListarray = files.map((file) => file.name);
    setNewSongsList(newSongsListarray);

    setSongs(newSongs);
    if (newSongs.length > 0) {
      setAudiosrc(newSongs[0]);
      playMusic(newSongs[index], pause);
      console.log(audio);
    }
  };

  const playMusic = (song, pause) => {
    setAudiosrc(song);
    setIndex(newSongsList.indexOf(song.name));
    audio.src = song.url;
    if (!pause) {
      audio.play();
      play.src = "/pause.svg";
    }
  };

  const handlePlay = () => {
    if (audio.paused) {
      audio.play();
      setPause(true);
      play.src = "/pause.svg";
    } else {
      audio.pause();
      setPause(false);
      play.src = "/playnow.svg";
    }
  };

  const handlePrev = () => {
    if (index == 0) {
      playMusic(songs[songs.length - 1], pause);
      setIndex(songs.length - 1);
    } else {
      playMusic(songs[index - 1], pause);
      setIndex(index - 1);
    }
  };

  const handleNext = () => {
    if (index == songs.length - 1) {
      playMusic(songs[0], pause);
      setIndex(0);
    } else {
      playMusic(songs[index + 1], pause);
      setIndex(index + 1);
    }
  };

  const handleVolume = () => {
    document.getElementById("volume").addEventListener("change", (e) => {
      audio.volume = parseInt(e.target.value) / 100;
    });
  };

  const songTime = () => {
    document.getElementById("seekbar-input").addEventListener("click", (e) => {
      let updatedTime = (e.target.value * audio.duration) / 100;
      console.log(e.target.value);
      console.log(audio.duration);
      console.log(updatedTime);
      setCurrentTime(parseInt(updatedTime));
    });
  };
  return (
    <>
      <div className="window">
        <header className="background">
          <h1>MUSIC APP</h1>
        </header>
        <main>
          <aside className="left">
            {/* playlists */}
            <div className="playlist background">
              <div className="songs">
                {songs.length <= 0 ? (
                  <div className="nosongs">No songs to Play</div>
                ) : (
                  <div>
                    <ul>
                      {songs.map((song, index) => {
                        return (
                          <li
                            key={index}
                            className="background pointer"
                            onClick={() => playMusic(song)}
                          >
                            {song.name.split(".")[0]}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {/* links */}
            <footer>
              <div className="links background">
                <input
                  type="file"
                  accept="audio/*"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
            </footer>
          </aside>

          <div className="right">
            <div className="details background"></div>
            <div className="playbar background">
              <span className="songname">
                {audiosrc ? `${audiosrc.name.split(".")[0]}` : "No Songs"}
              </span>
              <div className="controls">
                <div className="time-control">
                  <span className="timestart">{formatTime(currentTime)}</span>
                  <div className="buttons">
                    <button>
                      <img
                        className="invert pointer"
                        onClick={() => handlePrev()}
                        src="/prevsong.svg"
                        alt=""
                      />
                    </button>
                    <button>
                      <img
                        id="play"
                        className="invert pointer"
                        onClick={() => handlePlay()}
                        src="/playnow.svg"
                        alt=""
                      />
                    </button>
                    <button>
                      <img
                        className="invert pointer"
                        onClick={() => handleNext()}
                        src="/nextsong.svg"
                        alt=""
                      />
                    </button>
                  </div>
                  <span className="timeend">{formatTime(duration)}</span>
                </div>

                <div className="seekbar">
                  <input
                    id="seekbar-input"
                    className="pointer"
                    onChange={songTime}
                    defaultValue={0}
                    type="range"
                  />
                </div>
              </div>
              <div className="volume">
                <div>
                  <img className="invert" src="volume.svg" alt="" />
                </div>
                <input
                  id="volume"
                  className="pointer"
                  type="range"
                  defaultValue={100}
                  onChange={handleVolume}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;

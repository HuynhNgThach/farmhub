import Song from "./components/Song";
import Player from "./components/Player";
import "./styles/app.scss";
import data from "./data";
import { useState, useRef } from "react";
import Library from "./components/Library";
import Nav from "./components/Nav";

function App() {
  //state
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: null,
    animationPercentage: 0,
  });
  const audioRef = useRef(null);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    const animation = Math.round(
      (Math.round(current) / Math.round(duration)) * 100
    );
    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };
  const songEndHandler = async () => {
    const currSongIndex = songs.findIndex((s) => s.id === currentSong.id);
    let newIndexSong = (currSongIndex + 1) % songs.length;

    await setCurrentSong(songs[newIndexSong]);
    if (isPlaying) {
      audioRef.current.play();
    }
    setSongs(
      songs.map((s, index) => {
        if (index === newIndexSong) {
          return {
            ...s,
            active: true,
          };
        }
        return {
          ...s,
          active: false,
        };
      })
    );
  };
  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} isPlaying={isPlaying} />
      <Player
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        audioRef={audioRef}
        setSongInfo={setSongInfo}
        songInfo={songInfo}
        songs={songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <Library
        libraryStatus={libraryStatus}
        isPlaying={isPlaying}
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <audio
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        onEnded={songEndHandler}
        ref={audioRef}
        src={currentSong.audio}
      ></audio>
    </div>
  );
}

export default App;

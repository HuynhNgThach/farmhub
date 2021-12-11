import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  setCurrentSong,
  songs,
  setSongs,
}) => {
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };
  const skipHandler = async (direction) => {
    const currSongIndex = songs.findIndex((s) => s.id === currentSong.id);
    let newIndexSong = currSongIndex;
    if (direction === "skip-forward") {
      newIndexSong = (currSongIndex + 1) % songs.length;
    } else if (direction === "skip-back") {
      if (currSongIndex === 0) {
        newIndexSong = songs.length - 1;
      } else {
        newIndexSong = currSongIndex - 1;
      }
    }
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
  //add style
  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  return (
    <div className="player">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div
          className="track"
          style={{
            background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
          }}
        >
          <input
            type="range"
            min={0}
            onChange={dragHandler}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
          />
          <div className="animate-track" style={trackAnim}></div>
        </div>

        <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
          onClick={() => skipHandler("skip-back")}
        />
        <FontAwesomeIcon
          className="play"
          onClick={playSongHandler}
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
          onClick={() => skipHandler("skip-forward")}
        />
      </div>
    </div>
  );
};

export default Player;

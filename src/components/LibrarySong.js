const LibrarySong = ({
  song,
  setCurrentSong,
  audioRef,
  isPlaying,
  songs,
  setSongs,
}) => {
  const songSelectHandler = async () => {
    await setCurrentSong(song);
    //check if the song is playing

    //add active song
    const newSongs = songs.map((s) => {
      if (song.id === s.id) {
        return {
          ...s,
          active: true,
        };
      }
      return {
        ...s,
        active: false,
      };
    });
    setSongs(newSongs);
    if (isPlaying) {
      audioRef.current.play();
    }
  };
  return (
    <div
      className={`library-song ${song.active ? "selected" : ""}`}
      onClick={songSelectHandler}
    >
      <img src={song.cover} alt="song cover" />
      <div className="song-description">
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div>
  );
};

export default LibrarySong;

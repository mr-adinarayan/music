import AnimationWrapper from "../common/page-animation";
import songs from "../songs/songs_metadata.json";
import { useState, useRef, useEffect } from "react";

const HomePage = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [audioKey, setAudioKey] = useState(0); // Added key to force remount
  const [bgColor, setBgColor] = useState("#ffffff"); // State for random background color
  const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing
  const [duration, setDuration] = useState(0); // Total duration of the audio
  const [currentTime, setCurrentTime] = useState(0); // Current position of the audio
  const [isShuffleMode, setIsShuffleMode] = useState(false); // State for shuffle mode
  const [songsState, setSongsState] = useState(songs); // State for songs list
  const audioRef = useRef(null); // Reference to the audio element
  const progressRef = useRef(null); // Reference to the progress bar element

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      // Update duration state when audio metadata is loaded
      const handleLoadedMetadata = () => {
        setDuration(audioElement.duration);
      };

      // Update current time state while audio is playing
      const handleTimeUpdate = () => {
        setCurrentTime(audioElement.currentTime);

        // Check if the current time is greater than or equal to duration
        if (audioElement.currentTime >= audioElement.duration) {
          handleNextSong(); // Play the next song
        }
      };

      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }

    songsState.forEach(song => {
      const likedStatus = localStorage.getItem(`liked_${song.id}`);
      song.liked = likedStatus === 'true'; // Convert string to boolean
    });

  }, [currentSong, songsState]); // Re-run effect when currentSong or songsState changes

  const handleSongClick = (song) => {
    setCurrentSong(song);
    setAudioKey(prevKey => prevKey + 1); // Update key to force remount
    setBgColor(generateRandomColor()); // Generate random color
    setIsPlaying(true); // Start playing when new song is selected
  };

  const handleLikeToggle = (song) => {
    const updatedSongs = songsState.map(s => {
      if (s.id === song.id) {
        const updatedSong = { ...s, liked: !s.liked };
        localStorage.setItem(`liked_${s.id}`, updatedSong.liked); // Save liked status to local storage
        return updatedSong;
      }
      return s;
    });
    setSongsState(updatedSongs);
    if (currentSong && currentSong.id === song.id) {
      setCurrentSong({ ...song, liked: !song.liked }); // Update current song's like status
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying); // Toggle play/pause state
    }
  };

  const handleNextSong = () => {
    let nextSongIndex;
    if (isShuffleMode) {
      nextSongIndex = getRandomIndex();
    } else {
      nextSongIndex = songsState.findIndex(song => song.id === currentSong.id) + 1;
    }
    if (nextSongIndex < songsState.length) {
      handleSongClick(songsState[nextSongIndex]);
    } else {
      // Loop back to the first song if reached end
      handleSongClick(songsState[0]);
    }
  };

  const handlePreviousSong = () => {
    let prevSongIndex;
    if (isShuffleMode) {
      prevSongIndex = getRandomIndex();
    } else {
      prevSongIndex = songsState.findIndex(song => song.id === currentSong.id) - 1;
    }
    if (prevSongIndex >= 0) {
      handleSongClick(songsState[prevSongIndex]);
    } else {
      // Loop to the last song if at the beginning
      handleSongClick(songsState[songsState.length - 1]);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.nativeEvent.offsetX / progressRef.current.clientWidth) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleToggleShuffle = () => {
    setIsShuffleMode(!isShuffleMode); // Toggle shuffle mode
  };

  // Function to generate a random color
  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  // Function to format time in MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Function to get a random index for shuffle mode
  const getRandomIndex = () => {
    return Math.floor(Math.random() * songsState.length);
  };

  return (
    <AnimationWrapper>
      <div className="flex h-screen overflow-hidden">
        <div className="w-1/3 p-4 border-r border-gray-300 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Music List</h2>
          <ul>
            {songsState.map((song) => (
              <li
                key={song.id}
                className="cursor-pointer truncate p-2 hover:bg-gray-200 transition duration-200"
              >
                <span onClick={() => handleLikeToggle(song)}>
                  {song.liked ? <i className="fi fi-sr-heart text-red mr-2"></i> : <i className="fi fi-sr-heart mr-2"></i>}
                </span>
                <span onClick={() => handleSongClick(song)}>
                  ..{song.title}
                </span>
                
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 p-4 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Music Player</h2>
          {currentSong ? (<>
            <div className="flex flex-col items-center w-full">
              <div className="marquee-container w-full overflow-hidden mb-2">
                <div className="marquee whitespace-nowrap">
                  <h3 className="text-lg font-semibold text-center">
                    Now Playing: {currentSong.title}
                  </h3>
                </div>
              </div>
              <div
                className="w-40 h-40 rounded-lg shadow-md mb-5"
                style={{ backgroundColor: bgColor }}
              ></div>

              <div className="w-full mt-4">
                <div
                  ref={progressRef}
                  className="bg-grey h-3 relative rounded cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="bg-black rounded h-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs">{formatTime(currentTime)}</span>
                  <span className="text-xs">{formatTime(duration)}</span>
                </div>
              </div>
              <audio ref={audioRef} key={audioKey} src={`/src/songs/${currentSong.url}.mp3`} autoPlay className="w-full">
                Your browser does not support the audio element.
              </audio>
              <div className="flex items-center justify-center space-x-4 ">
              <button onClick={() => handleLikeToggle(currentSong)} className="hover:bg-grey font-bold py-2 px-4 rounded">
                  {currentSong.liked ? <i className="fi fi-sr-heart text-red"></i> : <i className="fi fi-sr-heart text-black"></i>}
                </button>
                <button onClick={handlePreviousSong} className="hover:bg-grey font-bold py-2 px-4 rounded">
                  <i className="fi fi-sr-rewind"></i>
                </button>
                <button onClick={handlePlayPause} className="hover:bg-grey font-bold py-2 px-4 rounded">
                  {isPlaying ? <i className="fi fi-sr-pause"></i> : <i className="fi fi-sr-play"></i>}
                </button>
                <button onClick={handleNextSong} className="hover:bg-grey font-bold py-2 px-4 rounded">
                  <i className="fi fi-sr-forward"></i>
                </button>
                <button onClick={handleToggleShuffle} className="hover:bg-grey font-bold py-2 px-4 rounded">
                  {isShuffleMode ? <i className="fi fi-sr-shuffle"></i> : <i className="fi fi-sr-arrows-repeat"></i>}
                </button>
               
              </div>
            </div>
              </>
          ) : (
            <p>Select a song to play</p>
          )}
        </div>
      

      </div>
    </AnimationWrapper>
  );
};

export default HomePage;

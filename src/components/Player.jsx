import { useEffect, useRef, useState } from "react";
import { DEFAULT_VOL, SONGS, VIDEO_SRC } from "../data";

const readFileAsDataUrl = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

function Player() {
  const [open, setOpen] = useState(false);
  const [songs, setSongs] = useState(SONGS);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOL);
  const audioRef = useRef(null);

  const setVideo = (src) => {
    const video = document.getElementById("bgv");
    video.src = src;
    video.muted = true;
    video.style.opacity = 1;
    video.play().catch(() => {});
  };

  useEffect(() => {
    if (VIDEO_SRC) setVideo(VIDEO_SRC);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (playing && audioRef.current?.getAttribute("src")) {
      audioRef.current.play().catch(() => {});
    }
  }, [index, songs, playing]);

  const toggle = () => {
    if (!songs.length) {
      setOpen(true);
      return;
    }

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const addSongs = async (event) => {
    const added = [];
    for (const file of event.target.files) {
      added.push({
        n: file.name.replace(/\.[^.]+$/, ""),
        src: await readFileAsDataUrl(file),
      });
    }
    if (added.length) setSongs((current) => [...current, ...added]);
  };

  const addVideo = async (event) => {
    const file = event.target.files[0];
    if (file) setVideo(await readFileAsDataUrl(file));
  };

  return (
    <div className="player">
      <audio
        ref={audioRef}
        src={songs[index]?.src}
        onEnded={() => setIndex((value) => (value + 1) % songs.length)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />

      {open && (
        <div className="pbox" role="group" aria-label="Music player">
          <select
            aria-label="Choose song"
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
          >
            {songs.length ? (
              songs.map((song, songIndex) => (
                <option key={songIndex} value={songIndex}>
                  {song.n}
                </option>
              ))
            ) : (
              <option>No songs yet — add some below</option>
            )}
          </select>

          <div className="prow">
            <button className="pb" onClick={toggle}>
              {playing ? "❚❚ Pause" : "▶ Play"}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              aria-label="Volume"
              onInput={(event) => setVolume(Number(event.target.value))}
            />

            <span style={{ fontSize: 13, minWidth: 34, textAlign: "right" }}>
              {Math.round(volume * 100)}%
            </span>
          </div>

          <label className="pl">
            + Add songs
            <input
              type="file"
              accept="audio/*"
              multiple
              hidden
              onChange={addSongs}
            />
          </label>

          <label className="pl">
            + Set wallpaper (mp4)
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={addVideo}
            />
          </label>
        </div>
      )}

      <button
        className="pfab"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle music player"
      >
        {playing ? "♫" : "♪"}
      </button>
    </div>
  );
}

export default Player;

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    //muteBtn.innerText = "Mute";
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 5000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};
/*
const handleVolumUpDown = (event) => {
  if (event.which === 38 && video.volume < 1) {
    video.volume = (video.volume + 0.05).toFixed(2);
    volumeRange.value = video.volume;
  }
  if (event.which === 40 && video.volume > 0.1) {
    video.volume = (video.volume - 0.05).toFixed(2);
    volumeRange.value = video.volume;
  }
};
const handlePlayMove = (event) => {
  if (event.which === 37 && video.currentTime > 1) {
    video.currentTime = Math.floor(video.currentTime - 5);
  }
  let videoTotalTime = Math.floor(video.duration);
  if (event.which === 39 && video.currentTime < videoTotalTime) {
    video.currentTime = Math.floor(video.currentTime + 5);
  }
};

const handleKeydown = (event) => {
  if (event.which === 32) {
    //video play Or Stop
    event.preventDefault();
    handlePlayClick();
    handleMouseMove();
    //videoControls.classList.add("showing");
    //controlsMovementTimeout = setTimeout(hideControls, 5000);
  } else if (event.which === 37) {
    //left
    handlePlayMove(event);
    handleMouseMove();
  } else if (event.which === 39) {
    //right
    handlePlayMove(event);
    handleMouseMove();
  } else if (event.which === 38) {
    //up
    event.preventDefault();
    handleVolumUpDown(event);
    handleMouseMove();
  } else if (event.which === 40) {
    //down
    event.preventDefault();
    handleVolumUpDown(event);
    handleMouseMove();
  }
};*/
/*
Left Arrow	37	
	Up Arrow	38	
Right Arrow	39	
Down Arrow	40
*/
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
//window.addEventListener("keydown", handleKeydown);

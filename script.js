'use strict';

const player = document.querySelector('.player');
const playButton = document.getElementById('play-btn');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullScreenBtn = document.querySelector('.fullscreen');
const speedEl = document.querySelector('.player-speed');

// Play & Pause ----------------------------------- //

const showPlayIcon = function () {
  playButton.classList.replace('fa-pause', 'fa-play');
  playButton.title = 'Play';
};

const toggleVideo = function () {
  if (video.paused) {
    video.play();
    playButton.classList.replace('fa-play', 'fa-pause');
    playButton.title = 'Pause';
  } else {
    video.pause();
    showPlayIcon();
  }
};

[playButton, video].forEach(i => i.addEventListener('click', toggleVideo));
video.addEventListener('ended', showPlayIcon);

// Progress Bar ---------------------------------- //

const updateProgressBar = function () {
  const widthPercentage = (video.currentTime / video.duration) * 100;
  progressBar.style.width = `${widthPercentage}%`;
  let currentMinutes = Math.round(video.currentTime / 60);
  let currentSeconds = Math.round(video.currentTime % 60);
  if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
  currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
  let durationMinutes = Math.round(video.duration / 60);
  let durationSeconds = Math.round(video.duration % 60);
  if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
  duration.textContent = `${durationMinutes}:${durationSeconds}`;
};

const setProgressBar = function (e) {
  const newTime = e.offsetX / progressRange.offsetWidth;
  progressBar.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
};

['timeupdate', 'canplay'].forEach(i =>
  video.addEventListener(i, updateProgressBar)
);

progressRange.addEventListener('click', setProgressBar);

// Volume Controls --------------------------- //

const setVolume = function (e) {
  const newVolumeRate = e.offsetX / volumeRange.offsetWidth;
  volumeBar.style.width = `${newVolumeRate * 100}%`;
  video.volume = newVolumeRate;
  console.log(video.volume);

  if (newVolumeRate >= 0.5) {
    volumeIcon.classList.add('fa-volume-up');
    volumeIcon.classList.remove('fa-volume-down');
    volumeIcon.classList.remove('fa-volume-off');
  }

  if (0 < newVolumeRate && newVolumeRate < 0.5) {
    volumeIcon.classList.remove('fa-volume-up');
    volumeIcon.classList.add('fa-volume-down');
    volumeIcon.classList.remove('fa-volume-off');
  }

  if (newVolumeRate === 0) {
    volumeIcon.classList.remove('fa-volume-up');
    volumeIcon.classList.remove('fa-volume-down');
    volumeIcon.classList.add('fa-volume-off');
  }
};

const toggleMute = function () {
  video.muted = !video.muted;
  volumeIcon.classList.remove(
    'fa-volume-up',
    'fa-volume-down',
    'fa-volume-off'
  );
  if (video.muted) {
    volumeIcon.classList.add('fa-volume-off');
    volumeBar.style.width = 0;
    volumeIcon.title = 'Unmute';
  } else {
    if (video.volume >= 0.5) {
      volumeIcon.classList.add('fa-volume-up');
    } else if (video.volume > 0) {
      volumeIcon.classList.add('fa-volume-down');
    } else {
      volumeIcon.classList.add('fa-volume-off');
    }
    volumeBar.style.width = `${video.volume * 100}%`;
  }
};

volumeRange.addEventListener('click', setVolume);
volumeIcon.addEventListener('click', toggleMute);

// Change Playback Speed -------------------- //

const changeVideoSpeed = () => (video.playbackRate = speedEl.value);
speedEl.addEventListener('change', changeVideoSpeed);

// Fullscreen ------------------------------- //

function openFullscreen(element) {
    // Never User Sniffing (Do not use User Agent)
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    /* Firefox */
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE/Edge */
    element.msRequestFullscreen();
  }
  video.classList.add('video-fullscreen');
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
  video.classList.remove('video-fullscreen');
}

let fullscreen = false;

// Toggle fullscreen
function toggleFullscreen() {
  if (!fullscreen) {
    openFullscreen(player);
  } else {
    closeFullscreen();
  }
  fullscreen = !fullscreen;
}

fullScreenBtn.addEventListener('click', toggleFullscreen)
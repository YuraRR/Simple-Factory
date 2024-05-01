const sounds = {
  birds: { src: "/sounds/birds.mp3", volume: 0.5 },
  wind: { src: "/sounds/wind.mp3", volume: 0.7 },
  click1: { src: "/sounds/click1.mp3", volume: 0.3 },
  click2: { src: "/sounds/click2.mp3", volume: 0.3 },
  click3: { src: "/sounds/click3.mp3", volume: 0.3 },
  hammer: { src: "/sounds/hammer.mp3", volume: 0.1 },
  quarry: { src: "/sounds/buildingsSounds/quarry.mp3", volume: 0.3 },
  oreProcessing: { src: "/sounds/buildingsSounds/oreProcessing.mp3", volume: 0.3 },
  foundry: { src: "/sounds/buildingsSounds/foundry.mp3", volume: 0.1 },
  storage: { src: "/sounds/buildingsSounds/storage.mp3", volume: 0.1 },
  oilRefinery: { src: "/sounds/buildingsSounds/oilRefinery.mp3", volume: 1 },
  lumber: { src: "/sounds/buildingsSounds/lumber.mp3", volume: 0.3 },
};

// Создание и настройка аудио объектов
for (const key in sounds) {
  if (Object.hasOwnProperty.call(sounds, key)) {
    const sound = sounds[key];
    sounds[key] = new Audio(sound.src);
    sounds[key].volume = sound.volume;
  }
}
// setInterval(() => {
//   if (scale > 2.5) {
//     // Увеличиваем громкость плавно до 1
//     birds.volume = Math.min(1, birds.volume + 0.1);
//     wind.volume = Math.max(0, wind.volume - 0.1);

//     birds.play();
//     wind.pause();
//   } else if (scale < 2.5) {
//     // Увеличиваем громкость плавно до 1
//     wind.volume = Math.min(1, wind.volume + 0.1);
//     birds.volume = Math.max(0, birds.volume - 0.1);

//     setTimeout(() => {
//       birds.pause();
//     }, 1000);

//     wind.play();
//   }
// }, 3000);

const toolCategoryButtons = document.querySelectorAll(".tool-menu__category");
const toolMenuButtons = document.querySelectorAll(".tool-menu__btn");
const closeButtons = document.querySelectorAll(".close-button");

toolCategoryButtons.forEach((btn) => btn.addEventListener("click", () => sounds.click1.play()));
toolMenuButtons.forEach((btn) => btn.addEventListener("click", () => sounds.click2.play()));
closeButtons.forEach((btn) => btn.addEventListener("click", () => sounds.click3.play()));

function playConstructionSound() {
  switch (currentTool) {
    case "quarry":
    case "mineshaft":
      sounds.quarry.play();
      break;

    default:
      sounds.hammer.play();
      break;
  }
}
function playMenuOpenSound(menuType) {
  switch (menuType) {
    case "quarry":
    case "mineshaft":
      sounds.quarry.play();
      break;
    case "oreProcessing":
    case "powerPlant":
      sounds.oreProcessing.play();
      break;
    case "foundry":
    case "steelMill":
    case "smallFoundry":
      sounds.foundry.play();
      break;
    case "smallStorage":
    case "mediumStorage":
      sounds.storage.play();
      break;
    case "oilRefinery":
    case "chemicalPlant":
      sounds.oilRefinery.play();
      break;
    case "lumbermill":
      sounds.lumber.play();
      break;

    default:
      sounds.hammer.play();
      break;
  }
}
let errorSoundIsPlaying = false;

function errorSound() {
  if (!errorSoundIsPlaying) {
    const error1 = new Audio("/sounds/error1.mp3");
    error1.volume = 0.5;
    error1.play();

    errorSoundIsPlaying = true;

    error1.onended = () => (errorSoundIsPlaying = false);
  }
}

function questFinishedSound() {
  const randomNum = Math.random();

  const questSound = randomNum < 0.5 ? new Audio("/sounds/quest.mp3") : new Audio("/sounds/quest2.mp3");

  questSound.volume = 0.5;
  questSound.play();
}
const tracks = [
  { src: "/sounds/music/Engineer Dreams.mp3" },
  { src: "/sounds/music/Machines of Tranquility.mp3" },
  { src: "/sounds/music/Factory of Dreams.mp3" },
  { src: "/sounds/music/Dark Forest.mp3" },
];
let musicIsPlaying = false;
let currentMusic;

function playTracks(tracks) {
  let index = 0;
  function playNextTrack() {
    if (index < tracks.length) {
      const track = tracks[index];
      const audio = new Audio(track.src);
      audio.onended = function () {
        setTimeout(() => {
          index++;
          playNextTrack();
        }, 15000);
      };
      audio.volume = 0.2;
      audio.play();
      currentMusic = audio;
    }
  }

  playNextTrack();
}
function moneySound() {
  const moneySound = new Audio("/sounds/money.mp3");
  moneySound.volume = 0.4;
  moneySound.play();
}

function stopMusic() {
  const stopButton = document.querySelector(".musicBtn");
  stopButton.onclick = () => {
    stopButton.style.backgroundImage =
      stopButton.dataset.player == "stoped" ? "url(/img/buttonIcons/pause.png)" : "url(/img/buttonIcons/play.png)";
    if (stopButton.dataset.player == "stoped") {
      stopButton.dataset.player = "playing";
      currentMusic.volume = 0.2;
      currentMusic.play();
    } else {
      stopButton.dataset.player = "stoped";
      decreaseVolume(currentMusic);
    }
  };
}
function decreaseVolume(audioElement) {
  if (audioElement.volume > 0) {
    audioElement.volume = Math.max(0, audioElement.volume - 0.01);
    setTimeout(() => decreaseVolume(audioElement), 20);
  } else {
    currentMusic.pause();
  }
}

stopMusic();
// setTimeout(() => playTracks(tracks), 1000);

const sounds = {
  //CLICKS
  click1: { src: "/sounds/click1.mp3", volume: 0.3 },
  click2: { src: "/sounds/click2.mp3", volume: 0.3 },
  click3: { src: "/sounds/click3.mp3", volume: 0.3 },
  //CONSTRUCTION
  hammer: { src: "/sounds/tools/hammer.mp3", volume: 0.1 },
  saw: { src: "/sounds/tools/saw.mp3", volume: 0.1 },
  saw2: { src: "/sounds/tools/saw2.mp3", volume: 0.1 },
  saw3: { src: "/sounds/tools/saw3.mp3", volume: 0.1 },
  treeCut: { src: "/sounds/tools/treeCut.m4a", volume: 0.8 },
  treeCut2: { src: "/sounds/tools/treeCut2.mp3", volume: 0.8 },
  gravel: { src: "/sounds/tools/gravel.mp3", volume: 0.4 },
  gravel2: { src: "/sounds/tools/gravel2.mp3", volume: 0.4 },
  //BUILDINGS
  quarry: { src: "/sounds/buildingsSounds/quarry.mp3", volume: 0.3 },
  oreProcessing: { src: "/sounds/buildingsSounds/oreProcessing.mp3", volume: 0.3 },
  foundry: { src: "/sounds/buildingsSounds/foundry.mp3", volume: 0.1 },
  storage: { src: "/sounds/buildingsSounds/storage.mp3", volume: 0.1 },
  oilRefinery: { src: "/sounds/buildingsSounds/oilRefinery.mp3", volume: 1 },
  lumber: { src: "/sounds/buildingsSounds/lumber.mp3", volume: 0.3 },
  garage: { src: "/sounds/buildingsSounds/garage.mp3", volume: 0.1 },
  //AMBIENT
  birds: { src: "/sounds/ambient/birds.mp3", volume: 0.4 },
  wind: { src: "/sounds/ambient/wind.mp3", volume: 0.8 },
  factoryAmbient: { src: "/sounds/ambient/factoryAmbient.mp3", volume: 0.1 },
  lake: { src: "/sounds/ambient/lake.mp3", volume: 0.15 },
};

// Создание и настройка аудио объектов
for (const key in sounds) {
  if (Object.hasOwnProperty.call(sounds, key)) {
    const sound = sounds[key];
    sounds[key] = new Audio(sound.src);
    sounds[key].volume = sound.volume;
  }
}

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
    case "brickFactory":
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
    case "garage":
      sounds.garage.play();
      break;

    default:
      sounds.hammer.play();
      break;
  }
}
let currentSound;
function demolitionSound(type) {
  const randomNum = Math.random();
  switch (type) {
    case "tree":
      currentSound = sounds.treeCut;
      break;
    case "rock":
      currentSound = sounds.quarry;
      break;
  }
  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
  }
  currentSound.play();
}
function handProcessSound(materialType) {
  const randomNum = Math.random();
  switch (materialType) {
    case "Wood":
      currentSound = randomNum < 0.33 ? sounds.saw : randomNum < 0.66 ? sounds.saw2 : sounds.saw3;
      break;
    case "Stone":
      currentSound = randomNum < 0.5 ? sounds.gravel : sounds.gravel2;
      break;
  }
  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
  }
  currentSound.play();
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

  questSound.volume = 0.3;
  questSound.play();
}
const tracks = [
  { src: "/sounds/music/Engineer Dreams.mp3" },
  { src: "/sounds/music/Machines of Tranquility.mp3" },
  { src: "/sounds/music/Factory of Dreams.mp3" },
  { src: "/sounds/music/Dark Forest.mp3" },
  { src: "/sounds/music/Little Sadness.mp3" },
  { src: "/sounds/music/Factorevo.mp3" },
  { src: "/sounds/music/Steel and Steam.mp3" },
  { src: "/sounds/music/An Ocean of Stars  Reworked.mp3" },
  { src: "/sounds/music/Falling Through the Hourglass.mp3" },
  { src: "/sounds/music/Into Midnight.mp3" },
  { src: "/sounds/music/Stories from the Sky.mp3" },
  { src: "/sounds/music/Our World.mp3" },
];

let currentMusic;
let previousMusic;
let previousIndex;

function playTracks(tracks) {
  const nextMusicBtn = document.querySelector(".nextMusicBtn");
  const stopButton = document.querySelector(".playMusicBtn");
  let musicPlaylist = shuffleArray(tracks);
  let trackId = 0;

  function playNextTrack(trackId) {
    if (trackId >= musicPlaylist.length) {
      musicPlaylist = shuffleArray(tracks);
      trackId = 0;
    }

    const track = musicPlaylist[trackId];
    const audio = new Audio(track.src);

    // Остановить текущую музыку перед началом следующего трека
    if (currentMusic) {
      currentMusic.pause();
      currentMusic.currentTime = 0;
    }
    audio.onended = function () {
      if (stopButton.dataset.player != "stopped") {
        deltaTimeout(() => playNextTrack(++trackId), 10000);
      }
    };

    audio.volume = 0.2;
    audio.play();
    currentMusic = audio; // Обновить текущий трек
  }

  nextMusicBtn.onclick = () => {
    if (currentMusic) {
      decreaseVolume(currentMusic, "music");
    }
    playNextTrack(trackId++);
  };

  playNextTrack(trackId++);
}

function moneySound() {
  const moneySound = new Audio("/sounds/money.mp3");
  moneySound.volume = 0.2;
  moneySound.play();
}

function stopMusic() {
  const stopButton = document.querySelector(".playMusicBtn");
  stopButton.onclick = () => {
    stopButton.style.backgroundImage =
      stopButton.dataset.player == "stoped"
        ? "url(./img/buttonIcons/pause.png)"
        : "url(./img/buttonIcons/play.png)";
    if (stopButton.dataset.player == "stoped") {
      stopButton.dataset.player = "playing";
      currentMusic.volume = 0.2;
      currentMusic.play();
    } else {
      stopButton.dataset.player = "stoped";
      decreaseVolume(currentMusic, "music");
    }
  };
}

function decreaseVolume(audioElement, type) {
  if (audioElement && audioElement.volume > 0) {
    audioElement.volume = Math.max(0, audioElement.volume - 0.01);
    deltaTimeout(() => decreaseVolume(audioElement), 40);
  }
  type == "music" && currentMusic.pause();
}
function increaseVolume(audioElement, type) {
  if (audioElement.volume < 0.1) {
    audioElement.volume = Math.min(0.1, audioElement.volume + 0.01);
    deltaTimeout(() => increaseVolume(audioElement, type), 20);
  } else {
    // if (!currentAmbient) {
    //   audioElement.play();
    //   currentAmbient = audioElement;
    // }
  }
}

stopMusic();
deltaTimeout(() => playTracks(tracks), 1000);

let objectVisiable;
let currentAmbient;
function playAmbientSound(element, type) {
  let sound;
  switch (type) {
    case "factory":
      sound = sounds.factoryAmbient;
      break;
    case "birds":
      sound = sounds.birds;
      break;
    case "lake":
      sound = sounds.lake;
      break;
  }

  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        objectVisiable = true;
        if (scale >= 2.1) {
          // sound.volume = 0.1;
          sound.play();
          increaseVolume(sound, "sound");

          currentAmbient = sound;
        }
      } else {
        objectVisiable = false;
        currentAmbient = "";
        decreaseVolume(sound, "sound");
      }
    });
  });

  element && observer.observe(element);
}
setInterval(() => {
  if (scale >= 2.1 && objectVisiable && currentAmbient) {
    currentAmbient.volume = 0.1;
    currentAmbient.play();
  } else {
    decreaseVolume(currentAmbient, "sound");
  }
}, 1000);

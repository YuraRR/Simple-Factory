const birds = new Audio("/sounds/birds.mp3");
const wind = new Audio("/sounds/wind.mp3");
const click1 = new Audio("/sounds/click1.mp3");
const click2 = new Audio("/sounds/click2.mp3");
const click3 = new Audio("/sounds/click3.mp3");
const hammer = new Audio("/sounds/hammer.mp3");
const rocks = new Audio("/sounds/rocks.mp3");
const foundry = new Audio("/sounds/foundry.mp3");
// Начальная громкость для каждого аудио
birds.volume = 0.5; // Пример значения от 0 (без звука) до 1 (полный звук)
wind.volume = 0.7;
click1.volume = 0.3;
click2.volume = 0.3;
click3.volume = 0.3;
hammer.volume = 0.1;
rocks.volume = 0.3;
foundry.volume = 0.3;
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

toolCategoryButtons.forEach((btn) => btn.addEventListener("click", () => click1.play()));
toolMenuButtons.forEach((btn) => btn.addEventListener("click", () => click2.play()));
closeButtons.forEach((btn) => btn.addEventListener("click", () => click3.play()));

function playConstructionSound() {
  switch (currentTool) {
    case "quarry":
    case "mineshaft":
      rocks.play();
      break;

    default:
      hammer.play();
      break;
  }
}
function playMenuOpenSound(menuType) {
  console.log(menuType);
  switch (menuType) {
    case "quarry":
    case "mineshaft":
      rocks.play();
      break;
    case "oreProcessing":
    case "ironFoundry":
    case "steelFoundry":
      foundry.play();
      break;

    default:
      hammer.play();
      break;
  }
}

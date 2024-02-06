// const birds = new Audio("/sounds/birds.mp3");
// const wind = new Audio("/sounds/wind.mp3");

// // Начальная громкость для каждого аудио
// birds.volume = 0.5; // Пример значения от 0 (без звука) до 1 (полный звук)
// wind.volume = 0.5;

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

//     birds.pause();
//     wind.play();
//   }
// }, 3000);

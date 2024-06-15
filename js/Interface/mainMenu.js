const optionsMenu = document.querySelector(".optionsMenu");
const optionsButton = document.querySelector("#options");
const optionsCloseBtn = optionsMenu.querySelector(".close-button");

optionsButton.onclick = () => optionsMenu.classList.toggle("hidden");
optionsCloseBtn.onclick = () => {
  escapeButton();
  optionsMenu.classList.add("hidden");
};

function changeVolume() {
  const musicSlider = document.getElementById("music-volume");
  const soundsSlider = document.getElementById("sounds-volume");

  musicSlider.addEventListener("input", (e) => {
    currentMusic.volume = e.target.value;
  });

  soundsSlider.addEventListener("input", (e) => {
    soundsVolume = e.target.value;
  });
}
changeVolume();

const creditsMenu = document.querySelector(".creditsMenu");
const creditsButton = document.querySelector("#credits");
const creditsCloseBtn = creditsMenu.querySelector(".close-button");

creditsButton.onclick = () => creditsMenu.classList.toggle("hidden");
creditsCloseBtn.onclick = () => creditsMenu.classList.add("hidden");

const createSmoke = (tile, isSecondSmoke) => {
  const existingSmoke = tile.querySelector(`[data-visual-type="smoke"]`);
  const existingSmoke2 = tile.querySelector(`[data-visual-type="smoke2"]`);

  if (!existingSmoke && !isSecondSmoke) {
    const className = `${tile.dataset.buildingType}Smoke`;
    const smokeImg = createSmokeImage();
    smokeImg.classList.add(className);
    smokeImg.dataset.visualType = "smoke";
    tile.appendChild(smokeImg);
    tile.dataset.buildingState = "Working";
  }

  if (isSecondSmoke && !existingSmoke2) {
    const className = `${tile.dataset.buildingType}Smoke2`;
    const smokeImg2 = createSmokeImage();
    smokeImg2.classList.add(className);
    smokeImg2.dataset.visualType = "smoke2";
    tile.appendChild(smokeImg2);
    tile.dataset.buildingState = "Working";
  }
};

const createSmokeImage = () => {
  const smokeImg = document.createElement("img");
  smokeImg.src = "/img/animations/smoke.gif";
  return smokeImg;
};

function deleteSmoke(tile) {
  const smokeImg = tile.querySelector(`[data-visual-type='smoke']`);
  smokeImg && smokeImg.remove();
  const smokeImg2 = tile.querySelector(`[data-visual-type='smoke2']`);
  smokeImg2 && smokeImg2.remove();
  tile.dataset.buildingState = "Idle";
}

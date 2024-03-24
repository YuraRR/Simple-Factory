function createSmoke(tile) {
  const existingSmoke = tile.querySelector(`[data-visual-type="smoke"]`);
  if (existingSmoke == null) {
    const smokeImg = document.createElement("img");
    smokeImg.src = "/img/animations/smoke.gif";
    smokeImg.classList.add(`${tile.dataset.buildingType}Smoke`);
    smokeImg.dataset.visualType = "smoke";
    tile.appendChild(smokeImg);
    tile.dataset.buildingState = "Working";
  }
}

function deleteSmoke(tile) {
  const smokeImg = tile.querySelector(`[data-visual-type='smoke']`);
  smokeImg.remove();
  tile.dataset.buildingState = "Idle";
}

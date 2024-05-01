function energyUsing(tile, action) {
  const buildingInfo = findBldObjInList(tile.dataset.buildingType);
  const energyConsumption = buildingInfo.energyConsumption;
  switch (action) {
    case "on":
      //Power Plant
      if (tile.dataset.energyInNetwork == "false") {
        console.log(totalEnergy);
        tile.dataset.buildingState == "Working" ? (totalEnergy += 100) : "";
        updateEnergy();
        tile.dataset.energyInNetwork = "true";
      }
      //Buildings
      if (tile.dataset.energyConsumption == "false") {
        totalEnergy -= +energyConsumption;
        updateEnergy();
        tile.dataset.energyConsumption = "true";
      }
      break;

    case "off":
      //Power Plant
      if (tile.dataset.energyInNetwork == "true") {
        totalEnergy -= 100;
        updateEnergy();
        tile.dataset.energyInNetwork = "false";
      }
      //Buildings
      if (tile.dataset.energyConsumption == "true") {
        console.log("stop");
        totalEnergy += +energyConsumption;
        updateEnergy();
        tile.dataset.energyConsumption = "false";
      }
      break;
  }
}
function updateEnergy() {
  const energyAmountSpan = document.querySelector(".totalEnergyAmount");
  console.log(totalEnergy);
  totalEnergy = +totalEnergy;
  console.log(totalEnergy);
  totalEnergy = totalEnergy.toFixed(2);
  energyAmountSpan.textContent = `${totalEnergy} mW`;
  totalEnergy = +totalEnergy;
}

function energyUsing(tile, action) {
  const buildingInfo = findBldObjInList(tile.dataset.buildingType);
  const energyConsumption = buildingInfo.energyConsumption;
  console.log("use");
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
      if (tile.dataset.energyConsumption) {
        totalEnergy -= +energyConsumption;
        updateEnergy();
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

      console.log("stop");
      totalEnergy += +energyConsumption;
      updateEnergy();

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

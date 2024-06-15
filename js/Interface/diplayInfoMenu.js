function displayInfo() {
  const hoverBldTile = hoveredElement.classList.contains("clickArea")
    ? hoveredElement.parentElement.dataset
    : hoveredElement.dataset;

  let infoTitleText =
    hoverBldTile.buildingType ??
    hoverBldTile.featuresType ??
    hoverBldTile.groundItem ??
    hoverBldTile.oreType ??
    hoverBldTile.resType ??
    hoverBldTile.groundType ??
    "";

  if (infoTitleText == hoverBldTile.buildingType) {
    infoTitleText = `${hoverBldTile.buildingType} ${hoverBldTile.idByType || ""}`;
  }

  infoTitle.textContent = formatString(infoTitleText) == "Grass2" ? "Grass" : formatString(infoTitleText);

  infoTitleText ? infoMenu.classList.remove("hidden") : infoMenu.classList.add("hidden");

  infoList.innerHTML = "";

  const items = [
    { name: hoverBldTile.materialName1, value: hoverBldTile.materialAmount1 },
    { name: hoverBldTile.materialName2, value: hoverBldTile.materialAmount2 },
    { name: hoverBldTile.materialName3, value: hoverBldTile.materialAmount3 },
    { name: hoverBldTile.itemTypeOutput1, value: hoverBldTile.itemAmountOutput1 },
    { name: hoverBldTile.itemTypeOutput2, value: hoverBldTile.itemAmountOutput2 },
    { name: hoverBldTile.itemTypeOutput3, value: hoverBldTile.itemAmountOutput3 },
    { name: hoverBldTile.groundItem, value: hoverBldTile.groundItemAmount },
    { name: hoverBldTile.cargoStationItem && `Station Item`, value: hoverBldTile.cargoStationItem },
    { name: hoverBldTile.stationId && `Line`, value: hoverBldTile.routeId || "unset" },
    { name: hoverBldTile.stationId && `Station`, value: hoverBldTile.stationLetter },
  ];

  const outputRes = items
    .filter((item) => item.name !== undefined)
    .map((item) => `<li>${item.name} - ${item.value}</li>`)
    .join("");

  infoList.insertAdjacentHTML("beforeend", outputRes);
}

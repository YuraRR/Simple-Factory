const routesMenuList = document.querySelector(".routesInfo-menu__routesList");
const routesInfoMenu = document.querySelector("#routesInfo-menu");

function addRouteInfoToMenu({ id, stationA, stationB, drawRoutePointsList, drawDirectionsList, color }) {
  const stationAname = `${formatString(stationA.dataset.connectedTo)} ${stationA.dataset.stationId}`;
  const stationBname = `${formatString(stationB.dataset.connectedTo)} ${stationB.dataset.stationId}`;
  const itemName = stationA.dataset.cargoStationItem;
  const itemImage = findItemObjInList(itemName).imageSrc;
  const htmlContent = `
  <div class="routesInfo-menu__route" id="route_${id}">
    <div class="routesInfo-menu__info">
      <span class="routesInfo-menu__id" style="background-color: ${color}">${id} </span>
      <span class="routesInfo-menu__stations">${stationAname} — ${stationBname} </span>
      <span class="routesInfo-menu__itemName"> ${itemName} </span>
      <img class="routesInfo-menu__itemImg" src="${itemImage}" />
    </div>
    <div class="routesInfo-menu__trucksList"></div>
  </div>`;
  routesMenuList.insertAdjacentHTML("beforeend", htmlContent);

  const noRoutes = interfaceСont.querySelector(".noRoutes");
  allRoutesList.length > 0 ? noRoutes.classList.add("hidden") : noRoutes.classList.remove("hidden");
  // const buttonAddTruck = document.querySelector(`#route_${id} .routesInfo-menu__addTruckToRoute`);
  // buttonAddTruck.onclick = () => addTruckToExistRoute();

  // function addTruckToExistRoute() {
  //   const truckObj = new Truck(this.tile);
  //   const startMethods = startBuildingMethods.bind(truckObj, this.tile);
  //   startMethods();
  //   console.log(drawRoutePointsList);
  //   console.log(drawDirectionsList);
  //   truckObj.moveTransportImage(drawRoutePointsList, drawDirectionsList, "", 2);
  // }
}

function addTruckToRouteInfo({ truckId, routeId, resourcesLeft, truckBlock }) {
  const trucksList = routesMenuList.querySelector(`#route_${routeId} .routesInfo-menu__trucksList`);
  const truckElem = trucksList.querySelector(`#truck_${truckId}`);
  truckElem && truckElem.remove();
  const htmlContent = `
    <div class="routesInfo-menu__truck" id="truck_${truckId}">
      <div class="routesInfo-menu__truck-info ">
      <img class="truck-image__img" src="/img/transport/truckDown.png" >
         <span class="truck-info__id">Truck ID: ${truckId}</span>
         <span class="truck-info__resources-left">Resources Left: ${
           resourcesLeft < 1000 ? resourcesLeft : "Ꝏ"
         }</span>
         <button class="routesInfo-menu__deleteButton"></button>
      </div>
    </div>`;
  trucksList.insertAdjacentHTML("beforeend", htmlContent);
  const truckMenuBlock = trucksList.querySelector(`#truck_${truckId}`);
  const deleteTruckBtn = truckMenuBlock.querySelector(`.routesInfo-menu__deleteButton`);

  deleteTruckBtn.onclick = () => {
    truckBlock.dataset.toRemove = "true";
    truckMenuBlock.classList.add("redBg");
  };
}

interfaceСont.querySelector(".tool-menu__trucksBlock").onclick = () => {
  routesInfoMenu.classList.remove("hidden");
  allOpenedMenu.push(routesInfoMenu);
};

routesInfoMenu.querySelector(".close-button").onclick = () => routesInfoMenu.classList.add("hidden");
dragElement(routesInfoMenu.id);

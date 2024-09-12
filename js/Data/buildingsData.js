const allBuildings = [
  //SOURCE
  {
    name: "mineshaft",
    type: "source",
    xSize: 1,
    zSize: 1,
    cost: {
      Bricks: 20,
      Planks: 40,
      "Mechanical Parts": 10,
      "Steel Beams": 12,
    },
    energyConsumption: 0.5,
    isWaterNeeded: false,
    resources: ["Iron Ore", "Copper Ore", "Coal Ore"],
    description: `Provides resources like Iron, Copper, Coal`,
    unlockPrice: 800,
  },
  {
    name: "quarry",
    type: "source",
    xSize: 2,
    zSize: 2,
    cost: {
      Gravel: 25,
      "Mechanical Parts": 5,
      Planks: 20,
    },
    energyConsumption: 0,
    isWaterNeeded: false,
    resources: ["Sand", "Stone", "Clay", "Limestone"],
    description: `Produces material depending on the resource on the tile`,
    unlockPrice: 600,
  },
  {
    name: "waterPump",
    type: "energy",
    xSize: 1,
    zSize: 1,
    cost: {
      Bricks: 10,
      "Mechanical Parts": 5,
      "Iron Pipes": 30,
    },
    energyConsumption: 0,
    isWaterNeeded: false,
    resources: ["Water"],
    description: `Pumping water. Use pipes to connect pump with buildings`,
    unlockPrice: 600,
  },
  {
    name: "rubberTreePlantation",
    type: "source",
    xSize: 2,
    zSize: 2,
    cost: {
      Planks: 40,
    },
    resources: ["Latex"],
    energyConsumption: 0,
    isWaterNeeded: false,
    description: `Produces latex if the plantation is located on forest tiles `,
    unlockPrice: 700,
  },
  {
    name: "lumbermill",
    type: "source",
    xSize: 2,
    zSize: 1,
    cost: {
      Wood: 20,
      Planks: 10,
    },
    resources: ["Wood"],
    energyConsumption: 0,
    isWaterNeeded: false,
    description: `Produces wood from forests. Cut down tree in radius every 60s `,
    unlockPrice: 500,
  },
  // 1 MATERIAL FACTORIES
  {
    name: "oreProcessing",
    type: "metallurgy",
    xSize: 2,
    zSize: 2,
    cost: {
      Bricks: 40,
      "Mechanical Parts": 10,
      "Steel Beams": 25,
      Glass: 10,
      "Iron Pipes": 10,
    },
    energyConsumption: 0.8,
    isWaterNeeded: true,
    resources: ["Refined Iron", "Refined Copper", "Refined Coal", "Sulfur"],
    description: `Refines ores before smelting`,
    unlockPrice: 1000,
  },
  {
    name: "crushingPlant",
    type: "construction",
    xSize: 3,
    zSize: 3,
    cost: {
      Gravel: 20,
      "Steel Beams": 12,
      "Mechanical Parts": 12,
    },
    energyConsumption: 0.7,
    isWaterNeeded: false,
    resources: ["Crushed Limestone", "Gravel", "Crushed Iron", "Crushed Copper"],
    description: `Crushing big stones to smaller`,
    unlockPrice: 800,
  },
  {
    name: "brickFactory",
    type: "construction",
    xSize: 3,
    zSize: 3,
    cost: {
      Bricks: 50,
      "Steel Beams": 25,
      Glass: 10,
      "Iron Pipes": 5,
    },
    energyConsumption: 0.6,
    isWaterNeeded: true,
    resources: ["Bricks"],
    description: `Produces Bricks from Clay`,
    unlockPrice: 1200,
  },
  {
    name: "sawmill",
    type: "construction",
    xSize: 2,
    zSize: 2,
    cost: {
      Gravel: 20,
      Planks: 30,
      "Mechanical Parts": 15,
    },
    energyConsumption: 0.5,
    isWaterNeeded: false,
    resources: ["Planks"],
    description: `Produces Planks from Wood`,
    unlockPrice: 800,
  },
  {
    name: "steelMill",
    type: "metallurgy",
    xSize: 6,
    zSize: 3,
    cost: {
      "Concrete Block": 60,
      "Mechanical Parts": 40,
      "Steel Beams": 50,
      Glass: 15,
      "Iron Pipes": 25,
    },
    energyConsumption: 2,
    isWaterNeeded: true,
    resources: ["Molten Steel"],
    description: `Produces Steel Beams, Steel Bolts and Steel Plates from Iron Feedstock`,
    unlockPrice: 2000,
  },

  // 2 MATERIAL FACTORIES
  {
    name: "cementPlant",
    type: "construction",
    xSize: 3,
    zSize: 3,
    cost: {
      "Concrete Block": 30,
      Bricks: 40,
      "Steel Beams": 25,
      Glass: 10,
      "Iron Pipes": 10,
    },
    energyConsumption: 1,
    isWaterNeeded: false,
    resources: ["Cement"],
    description: `Produces Cement from Crushed Limestone and Clay`,
    unlockPrice: 1800,
  },
  {
    name: "glassFactory",
    type: "construction",
    xSize: 3,
    zSize: 5,
    cost: {
      "Concrete Block": 40,
      "Steel Beams": 30,
      Glass: 20,
      "Iron Pipes": 15,
    },
    energyConsumption: 1,
    isWaterNeeded: true,
    resources: ["Glass"],
    description: `Produces Glass from Sand and Crushed Limestone`,
    unlockPrice: 1800,
  },

  {
    name: "smallAssembly",
    type: "assemblyBlds",
    xSize: 4,
    zSize: 3,
    cost: {
      Bricks: 30,
      "Mechanical Parts": 20,
      "Steel Beams": 20,
      Glass: 20,
    },
    energyConsumption: 0.8,
    isWaterNeeded: false,
    resources: ["Mechanical Parts(copper)", "Mechanical Parts", "Electronic Parts"],
    description: `Produces different things from other things`,
    unlockPrice: 1600,
  },
  {
    name: "smallFoundry",
    type: "metallurgy",
    xSize: 2,
    zSize: 3,
    cost: {
      Bricks: 40,
      "Mechanical Parts": 10,
      "Iron Pipes": 25,
      Glass: 5,
    },
    energyConsumption: 0.8,
    isWaterNeeded: true,
    resources: ["Molten Iron(impure)", "Molten Copper(impure)"],
    description: `Produces Iron and Copper products`,
    unlockPrice: 1500,
  },
  {
    name: "oilRefinery",
    type: "petrochemical",
    xSize: 5,
    zSize: 5,
    cost: {
      "Concrete Block": 40,
      "Steel Beams": 30,
      "Iron Pipes": 50,
      "Steel Plates": 25,
      "Mechanical Parts": 30,
    },
    energyConsumption: 1.5,
    isWaterNeeded: false,
    resources: ["Oil"],
    description: `Produces Rubber and Plastic from Oil`,
    unlockPrice: 2500,
  },
  {
    name: "chemicalPlant",
    type: "petrochemical",
    xSize: 4,
    zSize: 4,
    cost: {
      "Concrete Block": 50,
      "Steel Beams": 50,
      Glass: 15,
      "Iron Pipes": 25,
      "Mechanical Parts": 20,
    },
    energyConsumption: 0.9,
    isWaterNeeded: true,
    resources: ["Rubber(natural)", "Explosives"],
    description: `Produces Rubber or Explosives`,
    unlockPrice: 1400,
  },
  // 3 MATERIAL FACTORIES
  {
    name: "foundry",
    type: "metallurgy",
    xSize: 4,
    zSize: 4,
    cost: {
      "Concrete Block": 60,
      "Mechanical Parts": 40,
      "Steel Beams": 50,
      Glass: 15,
      "Iron Pipes": 25,
    },
    energyConsumption: 3,
    isWaterNeeded: true,
    resources: ["Molten Iron", "Molten Copper"],
    description: `Produces Iron and Copper products. Iron Feedstock is needed for Steel`,
    unlockPrice: 3500,
  },
  {
    name: "assembly",
    type: "assemblyBlds",
    xSize: 6,
    zSize: 4,
    cost: {
      "Concrete Block": 50,
      "Mechanical Parts": 35,
      "Steel Beams": 50,
      Glass: 20,
      "Electronic Parts": 25,
    },
    energyConsumption: 2,
    isWaterNeeded: false,
    resources: ["Electronic", "Engine", "Chassis", "Car Body"],
    description: `Produces components for the cars`,
    unlockPrice: 3500,
  },
  {
    name: "concretePlant",
    type: "construction",
    xSize: 5,
    zSize: 5,
    cost: {
      "Concrete Block": 50,
      "Mechanical Parts": 20,
      "Steel Beams": 50,
      Glass: 15,
      "Iron Pipes": 25,
    },
    energyConsumption: 1,
    isWaterNeeded: true,
    resources: ["Concrete Block"],
    description: `Produces Concrete Blocks from Cement, Sand and Gravel`,
    unlockPrice: 2200,
  },
  {
    name: "carFactory",
    type: "assemblyBlds",
    xSize: 6,
    zSize: 6,
    cost: {
      "Concrete Block": 50,
      Bricks: 60,
      "Steel Beams": 50,
      Glass: 15,
      "Iron Pipes": 25,
    },
    energyConsumption: 5,
    isWaterNeeded: true,
    resources: ["Car"],
    description: `Produces Cars from Engine, Chassis and Car Body`,
    unlockPrice: 5000,
  },

  //STORAGE
  {
    name: "smallStorage",
    type: "storage",
    xSize: 2,
    zSize: 2,
    cost: {
      Planks: 20,
      Gravel: 20,
    },
    resources: [""],
    description: `Store small amount (75) of one item`,
    unlockPrice: 0,
  },
  {
    name: "mediumStorage",
    type: "storage",
    xSize: 2,
    zSize: 2,
    cost: {
      Bricks: 50,
      Planks: 30,
      Gravel: 20,
      "Steel Plates": 15,
    },
    description: `Store medium amount (200) of one item`,
    unlockPrice: 1200,
  },
  //TRANSPORTATION
  {
    name: "conveyor",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      "Mechanical Parts": 1,
      Rubber: 2,
    },
    imageSrc: {
      0: "./img/conveyors/conveyor-Up.gif",
      1: "./img/conveyors/conveyor-Right.gif",
      2: "./img/conveyors/conveyor-Down.gif",
      3: "./img/conveyors/conveyor-Left.gif",
    },
    description: `Moves items between factories. 
    First you need to place Connector direction from the building, after place Conveyors in in the right direction.
    Rotating by "R" button`,
    unlockPrice: 600,
  },

  {
    name: "connector",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      "Mechanical Parts": 3,
      Bricks: 4,
    },
    imageSrc: {
      0: "./img/conveyors/connectorTop-exp.png",
      1: "./img/conveyors/connectorRight-exp.png",
      2: "./img/conveyors/connectorDown-exp.png",
      3: "./img/conveyors/connectorLeft-exp.png",
    },
    description: `Used to move items between buildings and conveyors.
    An arrow towards the building imports it inside, an arrow away from the building exports the item to the conveyor.
    Can be placed between two buildings to move items from one to another, depending on direction`,
    unlockPrice: 0,
  },
  {
    name: "splitter",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      "Mechanical Parts": 5,
      "Steel Plates": 5,
      Rubber: 2,
    },
    imageSrc: {
      0: "./img/conveyors/splitterUp.png",
      1: "./img/conveyors/splitterRight.png",
      2: "./img/conveyors/splitterDown.png",
      3: "./img/conveyors/splitterLeft.png",
    },
    description: `Used to evenly split items from conveyors in 3 directions. Orange side is used to input items.`,
    unlockPrice: 600,
  },
  {
    name: "undergroundConveyor",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      "Mechanical Parts": 1,
      "Steel Plates": 5,
      Rubber: 2,
    },
    imageSrc: {
      0: "./img/conveyors/ugdConveyorImportTop.png",
      1: "./img/conveyors/ugdConveyorImportRight.png",
      2: "./img/conveyors/ugdConveyorImportDown.png",
      3: "./img/conveyors/ugdConveyorImportLeft.png",
    },
    description: `Moves items under the ground. To correct work need to place entrance and exit over highlighted tiles. 
    Max length is 4 tiles from the entrance `,
    unlockPrice: 600,
  },
  {
    name: "pipe",
    type: "energy",
    xSize: 1,
    zSize: 1,
    cost: {
      "Iron Pipes": 2,
    },
    imageSrc: {
      0: "./img/pipes/pipe-vertical.png",
      1: "./img/pipes/pipe-horizontal.png",
      2: "./img/pipes/pipe-vertical.png",
      3: "./img/pipes/pipe-horizontal.png",
    },
    description: `Pipes are used to connect buildings to water. Need to start pipeline from the Water Pump`,
    unlockPrice: 300,
  },
  {
    name: "gravelRoad",
    type: "transport",
    xSize: 1,
    zSize: 1,
    cost: {
      Gravel: 2,
    },
    description: `Used to connect Cargo Stations with each others. 
    You can place several at once by holding "Shift" before the "Left click".`,
    unlockPrice: 0,
  },
  {
    name: "concreteRoad",
    type: "transport",
    xSize: 1,
    zSize: 1,
    cost: {
      "Concrete Block": 2,
    },
    description: `Faster version of Gravel Road. Used to connect Cargo Stations with each others. 
    You can place several at once by holding "Shift" before the "Left click".`,
    unlockPrice: 1200,
  },
  {
    name: "cargoStation",
    type: "transport",
    xSize: 1,
    zSize: 1,
    cost: {
      Gravel: 20,
      Planks: 15,
    },
    description: `Used to delivery resources to others Cargo Stations. 
    Can be placed only near buildings. The station should be placed towards the building.`,
    imageSrc: {
      0: "./img/buildings/cargoStationUp.webp",
      1: "./img/buildings/cargoStationRight.webp",
      2: "./img/buildings/cargoStationDown.webp",
      3: "./img/buildings/cargoStationLeft.webp",
    },
    unlockPrice: 0,
  },

  {
    name: "garage",
    type: "transport",
    xSize: 2,
    zSize: 2,
    cost: {
      Gravel: 20,
      Planks: 25,
    },
    description: `Used to buy trucks. Can store up to 5 trucks`,
    unlockPrice: 0,
  },
  {
    name: "tradingTerminal",
    type: "transport",
    xSize: 6,
    zSize: 3,
    cost: {
      "Concrete Block": 0,
    },
    unlockPrice: 0,
  },
  {
    name: "powerPlant",
    type: "energy",
    xSize: 5,
    zSize: 5,
    resources: ["Energy"],
    description: `Consumes coal to produce energy. Gives 100 mW <img src="./img/resourcesIcons/energy.png"></img> during Refined Coal consumption.`,
    cost: {
      "Concrete Block": 60,
      Bricks: 70,
      "Steel Beams": 50,
      Glass: 20,
      "Iron Pipes": 40,
      "Mechanical Parts": 15,
    },
    unlockPrice: 2500,
  },
  {
    name: "windTurbine",
    type: "energy",
    xSize: 1,
    zSize: 1,
    resources: ["Energy"],
    description: `Wind Turbine is spinning and giving energy. Gives 2.5 mW <img src="./img/resourcesIcons/energy.png"></img> permanent.`,
    cost: {
      Gravel: 10,
      "Steel Beams": 14,
      "Mechanical Parts": 14,
    },
    unlockPrice: 800,
  },
  //MISC
  {
    name: "demolition",
    xSize: 1,
    zSize: 1,
    cost: {
      "": 0,
    },
  },
];
const buildingResources = {
  Wood: 0,
  Planks: 0,
  Stone: 0,
  Gravel: 0,
  Bricks: 0,
  Glass: 0,
  "Mechanical Parts": 0,
  Cement: 0,
  Rubber: 0,
  "Concrete Block": 0,
  "Steel Beams": 0,
  "Steel Plates": 0,
  "Steel Bolts": 0,
  "Iron Pipes": 0,
  "Iron Gears": 0,
  "Iron Feedstock": 0,
  Explosives: 0,
  "Copper Plates": 0,
  "Copper Coil": 0,
  Plastic: 0,
  "Electronic Parts": 0,
};

const storageResources = [];
function createStorageResources() {
  const buildingResourcesMenu = document.querySelector(".resources-menu");
  for (const item in buildingResources) {
    const { name, imageSrc } = findItemObjInList(item);
    const materialHTML = `
    <div class="resBlock hidden" >
      <img src="${imageSrc}" class="resImage" id="${name}"/>
      <span class="resAmount" data-res="${name}">0</span>
      <div id="${name}Tip" role="tooltip">${name}</div>
    </div>`;
    deltaTimeout(() => setTipes(`${name}`), 1000);
    buildingResourcesMenu.insertAdjacentHTML("beforeend", materialHTML);
  }
  for (let i = 0; i <= 3; i++) buildingResourcesMenu.children[i].classList.remove("hidden");
}
createStorageResources();
function updateStorageResources() {
  for (const key in buildingResources) {
    if (Object.hasOwnProperty.call(buildingResources, key)) {
      const totalItemAmount = storageResources
        .filter((e) => e.resName === key)
        .reduce((acc, value) => acc + value.resAmount, 0);

      buildingResources[key] = totalItemAmount;
      const resElem = document.querySelector(`[data-res="${key}"]`);
      totalItemAmount > 0 ? resElem.parentElement.classList.remove("hidden") : "";
      resElem ? (resElem.textContent = totalItemAmount) : "";
    }
  }
}
setInterval(() => updateStorageResources(), 5000);

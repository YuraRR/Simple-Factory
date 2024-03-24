const allBuildings = [
  //SOURCE
  {
    name: "mineshaft",
    type: "source",
    xSize: 1,
    zSize: 1,
    cost: {
      "Concrete Block": 15,
      Bricks: 20,
      Steel: 10,
      Planks: 40,
    },
    resources: ["Iron Ore", "Copper Ore", "Coal Ore"],
    description: `Provides resources like Iron, Copper, Coal`,
  },
  {
    name: "quarry",
    type: "source",
    xSize: 2,
    zSize: 2,
    cost: {
      "Concrete Block": 10,
      Steel: 10,
      Planks: 40,
    },
    resources: ["Sand", "Stone", "Clay", "Limestone"],
    description: `Produces material depending on the resource on the tile`,
  },
  {
    name: "waterPump",
    type: "source",
    xSize: 1,
    zSize: 1,
    cost: {
      "Concrete Block": 10,
      Bricks: 15,
      Steel: 5,
      "Iron Pipes": 30,
    },
    resources: ["Water"],
    description: `Pumping water. Use pipes to connect pump with buildings`,
  },
  // 1 MATERIAL FACTORIES
  {
    name: "oreProcessing",
    type: "processing",
    xSize: 2,
    zSize: 2,
    cost: {
      "Concrete Block": 30,
      Bricks: 40,
      Steel: 25,
      Glass: 10,
      "Iron Pipes": 10,
    },
    resources: ["Refined Iron", "Refined Copper", "Refined Coal"],
    description: `Refines ores before smelting`,
  },
  {
    name: "brickFactory",
    type: "processing",
    xSize: 2,
    zSize: 2,
    cost: {
      "Concrete Block": 20,
      Bricks: 50,
      Steel: 25,
      Glass: 10,
      "Iron Pipes": 5,
    },
    energyConsumption: 0.1,
    resources: ["Bricks"],
    description: `Produces Bricks from Clay`,
  },
  {
    name: "steelFoundry",
    type: "processing",
    xSize: 3,
    zSize: 2,
    cost: {
      "Concrete Block": 20,
      Bricks: 50,
      Steel: 25,
      Glass: 10,
      "Iron Pipes": 5,
    },
    resources: ["Steel"],
    description: `Produces Steel from Cast Iron`,
  },
  // 2 MATERIAL FACTORIES
  {
    name: "cementPlant",
    type: "processing",
    xSize: 3,
    zSize: 3,
    cost: {
      "Concrete Block": 30,
      Bricks: 40,
      Steel: 25,
      Glass: 10,
      "Iron Pipes": 10,
    },
    resources: ["Cement"],
    description: `Produces Cement from Crushed Limestone and Clay`,
  },
  {
    name: "glassFactory",
    type: "processing",
    xSize: 2,
    zSize: 3,
    cost: {
      "Concrete Block": 40,
      Bricks: 30,
      Steel: 30,
      Glass: 20,
      "Iron Pipes": 15,
    },
    resources: ["Glass"],
    description: `Produces Glass from Sand and Crushed Limestone`,
  },
  // 3 MATERIAL FACTORIES
  {
    name: "ironFoundry",
    type: "processing",
    xSize: 3,
    zSize: 3,
    cost: {
      "Concrete Block": 50,
      Bricks: 60,
      Steel: 50,
      Glass: 15,
      "Iron Pipes": 25,
    },
    resources: ["Cast Iron"],
    description: `Produces Cast Iron from Refined Iron, Coal and Crushed Limestone`,
  },
  {
    name: "assembler",
    type: "processing",
    xSize: 6,
    zSize: 4,
    cost: {
      "Concrete Block": 50,
      Bricks: 60,
      Steel: 50,
      Glass: 15,
      "Iron Pipes": 25,
    },
    resources: ["Iron Frame"],
    description: `text`,
  },
  {
    name: "concretePlant",
    type: "processing",
    xSize: 3,
    zSize: 3,
    cost: {
      "Concrete Block": 50,
      Bricks: 60,
      Steel: 50,
      Glass: 15,
      "Iron Pipes": 25,
    },
    resources: ["Concrete Block"],
    description: `Produces Concrete Blocks from Cement, Sand and Gravel`,
  },

  //STORAGE
  {
    name: "smallStorage",
    type: "storage",
    xSize: 2,
    zSize: 2,
    cost: {
      Planks: 10,
      Gravel: 10,
    },
    resources: [""],
    description: `Store small amount of one item`,
  },
  {
    name: "mediumStorage",
    type: "storage",
    xSize: 2,
    zSize: 2,
    cost: {
      "Concrete Block": 20,
      Bricks: 50,
      Steel: 10,
      Glass: 5,
    },
    description: `Store medium amount of one item`,
  },
  //TRANSPORTATION
  {
    name: "conveyor",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      Steel: 1,
      Rubber: 2,
    },
    imageSrc: {
      0: "/img/conveyors/conveyorTop.gif",
      1: "/img/conveyors/conveyorRight.gif",
      2: "/img/conveyors/conveyorDown.gif",
      3: "/img/conveyors/conveyorLeft.gif",
    },
    description: `Moves items between factories. 
    First you need to place Connector direction from the building, after place Conveyors in in the right direction.
    Rotating by "R" button`,
  },
  {
    name: "connector",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      Steel: 1,
      Rubber: 2,
    },
    imageSrc: {
      0: "/img/conveyors/connectorTop-exp.png",
      1: "/img/conveyors/connectorRight-exp.png",
      2: "/img/conveyors/connectorDown-exp.png",
      3: "/img/conveyors/connectorLeft-exp.png",
    },
    description: `Used to move items between buildings and conveyors.
    An arrow towards the building imports it inside, an arrow away from the building exports the item to the conveyor.
    Can be placed between two buildings to move items from one to another, depending on direction`,
  },
  {
    name: "splitter",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      Steel: 1,
      Rubber: 2,
    },
    imageSrc: {
      0: "/img/conveyors/splitterUp.png",
      1: "/img/conveyors/splitterRight.png",
      2: "/img/conveyors/splitterDown.png",
      3: "/img/conveyors/splitterLeft.png",
    },
    description: `Used to evenly split items from conveyors in 3 directions`,
  },
  {
    name: "undergroundConveyor",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      Steel: 1,
      Rubber: 2,
    },
    imageSrc: {
      0: "/img/conveyors/ugdConveyorImportTop.png",
      1: "/img/conveyors/ugdConveyorImportRight.png",
      2: "/img/conveyors/ugdConveyorImportDown.png",
      3: "/img/conveyors/ugdConveyorImportLeft.png",
    },
    description: `Moves items under the ground. To correct work need to place entrance and exit over highlighted tiles. 
    Max length is 4 tiles from the entrance `,
  },
  {
    name: "pipe",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      "Iron Pipes": 1,
    },
    imageSrc: {
      0: "/img/pipes/vertical.png",
      1: "/img/pipes/horizontal.png",
      2: "/img/pipes/vertical.png",
      3: "/img/pipes/horizontal.png",
    },
    description: `Pipes are used to connect buildings to water. Need to start pipeline from the Water Pump`,
  },
  {
    name: "road",
    type: "transport",
    xSize: 1,
    zSize: 1,
    cost: {
      "Concrete Block": 2,
    },
    description: `Used to connect Cargo Stations with each others. 
    You can place several at once by holding "Shift" before the "Left click".`,
  },
  {
    name: "cargoStation",
    type: "transport",
    xSize: 1,
    zSize: 1,
    cost: {
      "Concrete Block": 5,
    },
    description: `Used to delivery resources to others Cargo Stations. 
    Can be placed only near buildings. The station should be placed towards the building. 
    First need to choose mode of working "Export" or "Import", and pick the resource type.
    After in a list of other stations need to choose right station to export or import items.
    Further buy a truck and set it to the route.`,
  },

  {
    name: "tradingTerminal",
    type: "transport",
    xSize: 4,
    zSize: 3,
    cost: {
      "Concrete Block": 0,
    },
  },
  {
    name: "powerPlant",
    type: "energy",
    xSize: 3,
    zSize: 3,
    resources: ["Energy"],
    description: `Consumes coal to produce energy`,
    cost: {
      "Concrete Block": 50,
      Bricks: 60,
      Steel: 50,
      Glass: 15,
      "Iron Pipes": 25,
    },
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
  "Concrete Block": 0,
  Bricks: 0,
  Steel: 0,
  Glass: 0,
  "Iron Pipes": 0,
  Planks: 0,
  Rubber: 0,
  Gravel: 0,
};

const storageResources = [];

function updateStorageResources() {
  setInterval(() => {
    for (const key in buildingResources) {
      if (Object.hasOwnProperty.call(buildingResources, key)) {
        const totalItemAmount = storageResources
          .filter((e) => e.resName === key)
          .reduce((acc, value) => acc + value.resAmount, 0);

        buildingResources[key] = totalItemAmount;
      }
    }
  }, 4000);
}

updateStorageResources();

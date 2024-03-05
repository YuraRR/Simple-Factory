const allBuilding = [
  //SOURCE
  {
    name: "mineshaft",
    type: "source",
    xSize: 1,
    zSize: 1,
    cost: {
      "Concrete Slab": 15,
      Bricks: 20,
      Steel: 10,
      Planks: 40,
    },
  },
  {
    name: "quarry",
    type: "source",
    xSize: 2,
    zSize: 2,
    cost: {
      "Concrete Slab": 10,
      Steel: 10,
      Planks: 40,
    },
  },
  {
    name: "waterPump",
    type: "source",
    xSize: 1,
    zSize: 1,
    cost: {
      "Concrete Slab": 10,
      Bricks: 15,
      Steel: 5,
      Pipes: 30,
    },
  },
  {
    name: "oreProcessing",
    type: "processing",
    xSize: 2,
    zSize: 2,
    cost: {
      "Concrete Slab": 30,
      Bricks: 40,
      Steel: 25,
      Glass: 10,
      Pipes: 10,
    },
  },
  {
    name: "smelter",
    type: "processing",
    xSize: 3,
    zSize: 3,
    cost: {
      "Concrete Slab": 50,
      Bricks: 60,
      Steel: 50,
      Glass: 15,
      Pipes: 25,
    },
  },
  {
    name: "assembler",
    type: "processing",
    xSize: 6,
    zSize: 4,
    cost: {},
  },
  // ... и так далее
  {
    name: "cementPlant",
    type: "processing",
    xSize: 3,
    zSize: 3,
    cost: {
      "Concrete Slab": 30,
      Bricks: 40,
      Steel: 25,
      Glass: 10,
      Pipes: 10,
    },
  },
  {
    name: "concretePlant",
    type: "processing",
    xSize: 3,
    zSize: 3,
    cost: {
      "Concrete Slab": 50,
      Bricks: 60,
      Steel: 50,
      Glass: 15,
      Pipes: 25,
    },
  },
  {
    name: "brickFactory",
    type: "processing",
    xSize: 2,
    zSize: 2,
    cost: {
      "Concrete Slab": 20,
      Bricks: 50,
      Steel: 25,
      Glass: 10,
      Pipes: 5,
    },
  },
  {
    name: "glassFactory",
    type: "processing",
    xSize: 2,
    zSize: 3,
    cost: {
      "Concrete Slab": 40,
      Bricks: 30,
      Steel: 30,
      Glass: 20,
      Pipes: 15,
    },
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
  },
  {
    name: "storage",
    type: "storage",
    xSize: 2,
    zSize: 2,
    cost: {
      "Concrete Slab": 20,
      Bricks: 50,
      Steel: 10,
      Glass: 5,
    },
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
      0: "/img/conveyors/connectorRight.png",
      1: "/img/conveyors/connectorRight.png",
      2: "/img/conveyors/connectorRight.png",
      3: "/img/conveyors/connectorRight.png",
    },
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
  },
  {
    name: "pipe",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      Pipe: 1,
    },
  },
  {
    name: "fluidSplitter",
    type: "conveyors",
    xSize: 1,
    zSize: 1,
    cost: {
      Pipe: 1,
    },
  },
  {
    name: "road",
    type: "transport",
    xSize: 1,
    zSize: 1,
    cost: {
      "Concrete Slab": 2,
    },
  },
  {
    name: "cargoStation",
    type: "transport",
    xSize: 1,
    zSize: 1,
    cost: {
      "Concrete Slab": 5,
    },
  },

  {
    name: "tradingTerminal",
    type: "transport",
    xSize: 4,
    zSize: 3,
    cost: {
      "Concrete Slab": 0,
    },
  },
  {
    name: "powerPlant",
    type: "energy",
    xSize: 3,
    zSize: 3,
  },
  //MISC
  {
    name: "demolition",
    xSize: 1,
    zSize: 1,
  },
];
const buildingResources = {
  "Concrete Slab": 0,
  Bricks: 0,
  Steel: 0,
  Glass: 0,
  Pipes: 0,
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

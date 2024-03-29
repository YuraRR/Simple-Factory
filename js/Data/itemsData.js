const allItems = [
  //RAW ORES
  {
    name: "Iron Ore",
    type: "rawOre",
    producedIn: "mineshaft",
    processingIn: "oreProcessing",
    consumptionFor: "Refined Iron",
    imageSrc: "img/resourcesIcons/ironOre-icon.svg",
    materials: {
      time: 8000,
      prodAmount: 1,
    },
    price: 10,
  },
  {
    name: "Copper Ore",
    type: "rawOre",
    producedIn: "mineshaft",
    processingIn: "oreProcessing",
    consumptionFor: "Refined Copper",
    imageSrc: "img/resourcesIcons/copperOre-icon.svg",
    materials: {
      time: 4000,
      prodAmount: 1,
    },
    price: 10,
  },
  {
    name: "Coal Ore",
    type: "rawOre",
    producedIn: "mineshaft",
    processingIn: "oreProcessing",
    consumptionFor: "Refined Coal",
    imageSrc: "img/resourcesIcons/coalOre.png",
    materials: {
      time: 4000,
      prodAmount: 1,
    },
    price: 10,
  },
  //REFINED ORES
  {
    name: "Refined Iron",
    type: "refinedOre",
    producedIn: "oreProcessing",
    processingIn: "smelter",
    consumptionFor: "Cast Iron",
    materials: {
      res1Name: "Iron Ore",
      res1Amount: 2,
      isWaterNeeded: true,
      time: 8000,
      prodAmount: 1,
    },
    imageSrc: "img/resourcesIcons/RefinedIronOre.svg",
    price: 20,
  },
  {
    name: "Refined Copper",
    type: "refinedOre",
    producedIn: "oreProcessing",
    processingIn: "smelter",
    consumptionFor: "",
    materials: {
      res1Name: "Copper Ore",
      res1Amount: 2,
      isWaterNeeded: true,
      time: 8000,
      prodAmount: 1,
    },
    imageSrc: "img/resourcesIcons/copperOre-icon.svg",
    price: 20,
  },
  {
    name: "Refined Coal",
    type: "refinedOre",
    producedIn: "oreProcessing",
    processingIn: "steelFoundry",
    consumptionFor: "Coke",
    materials: {
      res1: "Coal Ore",
      res1Amount: 2,
      isWaterNeeded: true,
      time: 8000,
      prodAmount: 1,
    },
    imageSrc: "img/resourcesIcons/coalOre.png",
    price: 20,
  },
  //INTERMEDIATE MATERIALS
  {
    name: "Coke",
    type: "intermediateMat",
    producedIn: "smelter",
    processingIn: "smelter",
    consumptionFor: "Cast Iron",
    materials: {
      res1: "Refined Coal",
      res1Amount: 2,
    },
    imageSrc: "img/resourcesIcons/coalOre.png",
    price: 30,
  },
  //IRON PARTS
  {
    name: "Cast Iron",
    type: "semiFinished",
    producedIn: "smelter",
    processingIn: "steelFoundry",
    consumptionFor: "Steel",
    materials: {
      res1: "Refined Iron",
      res1Amount: 4,
      res2: "Coke",
      res2Amount: 2,
      res3: "Crushed Limestone",
      res3Amount: 1,
      isWaterNeeded: true,
    },
    imageSrc: "img/resourcesIcons/ironIngot.svg",
    price: 60,
  },
  // {
  //   name: "Iron Plate",
  //   processingIn: "assembler",
  //   imageSrc: "img/resourcesIcons/ironIngot.svg",
  //   price: 40,
  // },
  // {
  //   name: "Iron Rod",
  //   processingIn: "assembler",
  //   imageSrc: "img/resourcesIcons/ironIngot.svg",
  //   price: 40,
  // },
  //COPPER PARTS
  {
    name: "Copper Ingot",
    processingIn: "assembler",
    imageSrc: "img/resourcesIcons/copperIngot.svg",
    price: 40,
  },
  {
    name: "Copper Wire",
    processingIn: "assembler",
    imageSrc: "img/resourcesIcons/copperIngot.svg",
    price: 40,
  },
  {
    name: "Copper Pipe",
    processingIn: "assembler",
    imageSrc: "img/resourcesIcons/copperIngot.svg",
    price: 40,
  },
  //BUILDING MATERIALS
  {
    name: "Stone",
    producedIn: "stoneQuarry",
    processingIn: "grinder",
    consumptionFor: ["Gravel"],
    imageSrc: "img/resourcesIcons/stone.png",
    materials: {
      time: 4000,
      prodAmount: 1,
    },
    price: 5,
  },
  {
    name: "Gravel",
    producedIn: "crusher",
    processingIn: "concretePlant",
    consumptionFor: ["Concrete Block"],
    imageSrc: "img/resourcesIcons/gravel.png",
    amountPerOp: 1,
  },
  {
    name: "Sand",
    producedIn: "sandQuarry",
    processingIn: ["concretePlant", "glassFactory"],
    consumptionFor: ["Concrete Block", "Glass"],
    imageSrc: "img/resourcesIcons/sand.png",
    materials: {
      time: 4000,
      prodAmount: 1,
    },
    price: 10,
  },
  {
    name: "Limestone",
    producedIn: "limestoneQuarry",
    consumptionFor: ["Crushed Limestone"],
    imageSrc: "img/resourcesIcons/limestone.png",
    materials: {
      time: 4000,
      prodAmount: 1,
    },
    price: 10,
  },
  {
    name: "Crushed Limestone",
    producedIn: "limestoneQuarry",
    processingIn: "cementPlant",
    consumptionFor: ["Cement", "Cast Iron"],
    imageSrc: "img/resourcesIcons/crushedLimestone.png",
    price: 15,
  },
  {
    name: "Clay",
    producedIn: "clayQuarry",
    processingIn: ["cementPlant", "brickFactory"],
    consumptionFor: ["Cement", "Bricks"],
    imageSrc: "img/resourcesIcons/clay.png",
    materials: {
      time: 4000,
      prodAmount: 1,
    },
    price: 10,
  },
  {
    name: "Cement",
    producedIn: "cementPlant",
    processingIn: "concretePlant",
    consumptionFor: ["Concrete Block"],
    imageSrc: "img/resourcesIcons/Cement.png",
    materials: {
      res1Name: "Crushed Limestone",
      res1Amount: 3,
      res2Name: "Clay",
      res2Amount: 1,
      time: 8000,
      prodAmount: 1,
    },
    price: 20,
  },
  {
    name: "Concrete Block",
    producedIn: "concretePlant",
    processingIn: "building",
    consumptionFor: "",
    producedFrom: ["Cement", "Gravel", "Sand"],
    imageSrc: "img/resourcesIcons/concreteBlock.png",
    materials: {
      res1Name: "Cement",
      res1Amount: 1,
      res2Name: "Sand",
      res2Amount: 2,
      res3Name: "Gravel",
      res3Amount: 3,
      isWaterNeeded: true,
      time: 16000,
      prodAmount: 1,
    },
    price: 50,
  },
  {
    name: "Bricks",
    producedIn: "brickFactory",
    processingIn: "building",
    materials: {
      res1Name: "Clay",
      res1Amount: 10,
      isWaterNeeded: true,
      time: 24000,
      prodAmount: 8,
    },
    imageSrc: "img/resourcesIcons/brick.png",
    price: 40,
  },
  {
    name: "Glass",
    producedIn: "glassFactory",
    processingIn: "building",
    materials: {
      res1Name: "Sand",
      res1Amount: 10,
      res2Name: "Crushed Limestone",
      res2Amount: 2,
      isWaterNeeded: true,
      time: 12000,
      prodAmount: 8,
    },
    imageSrc: "img/resourcesIcons/glass.png",
    price: 40,
  },
  //WOOD MATERIALS
  {
    name: "Wood",
    producedIn: "timbermill",
    processingIn: "sawMill",
    consumptionFor: "Planks",
    imageSrc: "img/resourcesIcons/noItem.svg",
    price: 10,
  },
];

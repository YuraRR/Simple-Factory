class BuildingMenu {
  constructor(tile, id, matAmount) {
    this.tile = tile;
    this.id = id;
    this.clickArea = tile.querySelector(".clickArea");
    this.tileData = tile.dataset;
    this.matAmount = matAmount;
    this.name = tile.dataset.buildingType;
  }
  closeButton(menu) {
    const closeBtn = menu.querySelector(".close-button");
    closeBtn.addEventListener("click", () => this.closeMenu());
    document.addEventListener("keydown", (event) => (event.code === "Escape" ? (this.menuOpened = false) : ""));
    this.closeMenu = () => {
      sounds.click3.play();
      menu.classList.add("hidden");
      this.menuOpened = false;
      resetGhost();
      hideRoutes();
    };
  }

  menuCreation(buildingObj) {
    const container = document.querySelector("#menu-container");
    this.buildingObj = buildingObj;
    this.title = this.name.replace(/([A-Z])/g, " $1");

    function createMaterialItem(dataMaterial) {
      console.log(dataMaterial);
      return `
    <div class="buildingMenu__item">
      <img src="img/resourcesIcons/noItem.webp" class="materialImage" data-material-img="${dataMaterial}" />
      <div class="buildingMenu__amounts">
        <span class="materialAmount" data-material="${dataMaterial}">0</span>
        <span class="materialAmountPerMin">(0/0)</span>
      </div>
    </div>
  `;
    }

    const createBuildingMenuItems = (materialCount) => {
      const materials = [];
      const materialNames = ["first", "second", "third"];
      for (let i = 0; i < materialCount; i++) {
        materials.push(createMaterialItem(materialNames[i]));
      }
      console.log(materials);
      return `<div class="buildingMenu__materials">${materials.join("")}</div>`;
    };

    const htmlContent = `
    <div class="buildingMenu hidden" 
    data-menu-id="${this.id}" data-menu-type="${this.name}" data-parent-tile-id="${this.tile.id}">
      <h3>${this.title} ${this.id}</h3>
      <div class="mainProcess">
        <div class="buildingMenu__items">
          ${createBuildingMenuItems(this.matAmount)}
          <div class="buildingMenu__timeBlock">
            <div class="buildingMenu__clock">
              <img src="/img/buttonIcons/whiteClock.png" class="timeImage" draggable="false" />
              <span class="resTime">0s / 60s</span>
            </div>
            <div class="buildingMenu__arrow">
              <img src="img/buttonIcons/arrow.png" />
            </div>
          </div>
          <div class="buildingMenu__product">
            <div class="buildingMenu__item">
              <img src="img/resourcesIcons/noItem.webp" class="productImage"/>
              <div class="buildingMenu__amounts">
                <span class="productAmount">0</span>
                <span class="productAmountPerMin">(0/0)</span>
              </div>
            </div>
            <span class="recipeTip">Select Recipe</span>
          </div>
          <div class="recipeSelect hidden"></div>
          <div class="indicatorsBlock">
            <img src="img/resourcesIcons/water.png" class="waterImage"/>
            <img src="img/resourcesIcons/energy.png" class="energyImage"/>
          </div>
        </div>
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
      </div>
      <div class="factoryStructures"></div>
      <button class="close-button"></button>
    </div>`;

    container.insertAdjacentHTML("beforeend", htmlContent);
    const menu = container.querySelector(`[data-menu-id="${this.id}"][data-menu-type="${this.name}"]`);
    this.menuUpdate(menu);
    this.closeButton(menu);
    this.recipeSelect(menu);
    switch (menu.dataset.menuType) {
      case "steelMill":
        this.extraRecipiesBlock(menu, buildingObj, "Molten Steel");
        break;
      case "oilRefinery":
        this.extraRecipiesBlock(menu, buildingObj, "Oil");
        break;
      case "foundry":
      case "smallFoundry":
        this.extraRecipiesBlock(menu, buildingObj, "");
        break;
    }
  }

  extraRecipiesBlock(menu, buildingObj, materialName) {
    const structureBlock = menu.querySelector(".factoryStructures");
    const structureInfo = structuresList.find((elem) => elem.factoryName == menu.dataset.menuType);
    const currentRecipes = structureInfo.recipesList;
    structureBlock.innerHTML = "";
    for (const recipe in currentRecipes) {
      const recipeObj = currentRecipes[recipe];
      console.log(currentRecipes[recipe]);
      if (recipeObj.material != materialName) continue;
      console.log(findItemObjInList(recipeObj));
      const materialImageSrc = findItemObjInList(recipeObj.material).imageSrc;
      const productImageSrc = findItemObjInList(recipeObj.product).imageSrc;
      const structureId = structureBlockId++;
      console.log(recipeObj.material);
      const htmlContent = `
        <div class="extraRecipe" id="structure_${structureId}">
          <h3>${recipeObj.product}</h3>
          <div class="structureBlock">
            <div class="structureBlock__materials">
              <div class="structureBlock__item" id="${recipe}_${recipeObj.material}_${menu.id}">
                <img src="${materialImageSrc}" class="materialImage"/>
                <div class="structureBlock__amounts">
                  <span class="materialAmount">0</span>
                  <span class="materialAmountPerMin">(0)</span>
                </div>
                <span id="${recipe}_${recipeObj.material}_${menu.id}Tip" role="tooltip">${recipeObj.material}</span>
              </div>
            </div>
            <div class="structureBlock__arrow">
              <img src="img/buttonIcons/arrow.png" />
            </div>
            <div class="structureBlock__product">
              <div class="structureBlock__item" id="${recipe}_${recipeObj.product}_${menu.id}">
                <img src="${productImageSrc}" class="productImage"/>
                <div class="structureBlock__amounts">
                  <span class="productAmount">0</span>
                  <span class="productAmountPerMin">(0)</span>
                </div>
                <span id="${recipe}_${recipeObj.product}_${menu.id}Tip" role="tooltip">${recipeObj.product}</span>
              </div>
            </div>
          </div>
          <div class="progressBarBlock">
            <div class="progressBar"></div>
            <span></span>
          </div>
        </div>`;
      structureBlock.insertAdjacentHTML("beforeend", htmlContent);
      setTipes(`${recipe}_${recipeObj.material}_${menu.id}`);
      setTipes(`${recipe}_${recipeObj.product}_${menu.id}`);
      const materialAmountPerMin = structureBlock.querySelector(`#structure_${structureId} .materialAmountPerMin`);
      const productAmountPerMin = structureBlock.querySelector(`#structure_${structureId} .productAmountPerMin`);

      const productObj = findItemObjInList(recipeObj.product);

      const itemMaterials = productObj.materials;

      const opPerMin = 60000 / itemMaterials.time;

      materialAmountPerMin.textContent = `(${itemMaterials.res1Amount} / ${opPerMin * itemMaterials.res1Amount})`;
      productAmountPerMin.textContent = `(${itemMaterials.prodAmount} / ${opPerMin * itemMaterials.prodAmount})`;
      extraProcessesStarting(structureId, recipeObj, buildingObj);
    }
    function extraProcessesStarting(structureId, recipeObj, buildingObj) {
      const menu = structureBlock.querySelector(`#structure_${structureId}`);
      const productRecipeObj = findItemObjInList(recipeObj.product);
      buildingObj.itemProcessingOneMaterial(buildingObj.findTargetTile(), menu, productRecipeObj, true);
    }
  }

  recipeSelect(menu) {
    const buildingName = this.tileData.buildingType;
    const recipeSelect = menu.querySelector(".recipeSelect");
    const bldCat = this.tileData.buildingCategory;
    console.log(bldCat);
    const items =
      bldCat == "in2Out2" || bldCat == "in1Out2" || bldCat == "in3Out3"
        ? allItems.filter((item) => item.producedIn == buildingName && item.type == "semiFinished")
        : allItems.filter((item) => item.producedIn == buildingName);
    console.log(items);
    const productButton = menu.querySelector(".buildingMenu__product");

    items.forEach((item) => {
      // const itemName = item.name.replace("(impure)", "");
      const itemBlock = document.createElement("div");
      itemBlock.classList.add("recipeItem");
      itemBlock.innerHTML = `
          <button class="selectItem-button">
            <img src="${item.imageSrc}"/>
          </button>
          <span>${item.name}</span>`;
      recipeSelect.appendChild(itemBlock);

      itemBlock.querySelector(".selectItem-button").onclick = () => {
        const itemMaterials = item.materials;
        if (
          +this.tileData.materialAmount1 > 0 ||
          +this.tileData.materialAmount2 > 0 ||
          +this.tileData.materialAmount3 > 0
        ) {
          this.sellItemsHalfPrice();
        }

        console.log(item.itemName);
        this.tileData.materialName1 = itemMaterials.res1Name;
        if (menu.dataset.menuType == "smallFoundry" || menu.dataset.menuType == "oilRefinery") {
          this.tileData.materialName2 = itemMaterials.res2Name;
          this.tileData.semiFinishedType = item.itemName;
          this.tileData.itemTypeOutput1 = item.consumptionFor[0];
          this.tileData.itemTypeOutput2 = item.consumptionFor[1];
        } else if (menu.dataset.menuType == "foundry") {
          this.tileData.materialName2 = itemMaterials.res2Name;
          this.tileData.materialName3 = itemMaterials.res3Name;
          this.tileData.semiFinishedType = item.name;
          this.tileData.itemTypeOutput1 = item.consumptionFor[0];
          this.tileData.itemTypeOutput2 = item.consumptionFor[1];
          this.tileData.itemTypeOutput3 = item.consumptionFor[2];
        } else if (menu.dataset.menuType == "smallAssembly" || menu.dataset.menuType == "chemicalPlant") {
          this.tileData.materialName2 = itemMaterials.res2Name;
          console.log(item);
          this.tileData.itemTypeOutput1 = item.isAltRecipe == true ? item.itemName : item.name;
        } else if (menu.dataset.menuType == "assembly") {
          this.tileData.materialName2 = itemMaterials.res2Name;
          this.tileData.materialName3 = itemMaterials.res3Name;
          this.tileData.itemTypeOutput1 = item.name;
        } else {
          this.tileData.itemTypeOutput1 = item.name;
        }
        recipeSelect.classList.add("hidden");

        productButton.parentElement.parentElement.classList.add("clear-after");
        buildingName == "smallFoundry" || buildingName == "foundry" || buildingName == "oilRefinery"
          ? this.extraRecipiesBlock(menu, this.buildingObj, item.name)
          : "";
        clearInterval(this.tile.dataset.intervalId);
        this.buildingObj.itemProcessingMaterial(this.tile, menu, item);
      };
    });
    console.log(productButton);
    productButton.onclick = () => {
      console.log("hui");
      recipeSelect.classList.remove("hidden");
    };
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".recipeSelect") && !event.target.closest(".buildingMenu__product")) {
        recipeSelect.classList.add("hidden");
      }
    });
  }
  sellItemsHalfPrice() {
    for (let i = 0; i <= 4; i++) {
      let materialName = this.tileData[`materialName${i}`];
      let materialAmount = this.tileData[`materialAmount${i}`];
      let productName = this.tileData[`itemTypeOutput${i}`];
      let productAmount = this.tileData[`itemAmountOutput${i}`];
      if (i == 4) {
        materialName = this.tileData.semiFinishedType;
        materialAmount = this.tileData.semiFinishedAmount;
      }

      if (materialName) {
        const itemObj = findItemObjInList(materialName);
        showMoneyChange((itemObj.price * materialAmount) / 1.5, "plus");
        this.tileData[`materialAmount${i}`] = 0;
      }
      if (productName) {
        const itemObj = findItemObjInList(productName);
        showMoneyChange((itemObj.price * productAmount) / 1.5, "plus");
        this.tileData[`itemAmountOutput${i}`] = 0;
      }
    }
  }
  menuUpdate(menu) {
    const firstMaterialAmount = menu.querySelector(`[data-material="first"]`);
    const firstMaterialImg = menu.querySelector(`[data-material-img="first"]`);
    const firstMaterialAmountPerMin = firstMaterialAmount.nextElementSibling;

    const secondMaterialAmount = menu.querySelector(`[data-material="second"]`);
    const secondMaterialImg = menu.querySelector(`[data-material-img="second"]`);
    const secondMaterialAmountPerMin = secondMaterialAmount && secondMaterialAmount.nextElementSibling;

    const materialAmount3 = menu.querySelector(`[data-material="third"]`);
    const thirdMaterialImg = menu.querySelector(`[data-material-img="third"]`);
    const materialAmount3PerMin = materialAmount3 && materialAmount3.nextElementSibling;

    const productAmount = menu.querySelector(".productAmount");
    const productImg = menu.querySelector(".productImage");
    const productAmountPerMin = productAmount.nextElementSibling;

    const resTime = menu.querySelector(".resTime");

    const intervalId = setInterval(() => {
      this.indicatorsState(menu);
      if (this.menuOpened == false) return;

      const firstMaterialObj = findItemObjInList(this.tileData.materialName1);
      const secondMaterialObj = findItemObjInList(this.tileData.materialName2);
      const thirdMaterialObj = findItemObjInList(this.tileData.materialName3);
      firstMaterialObj && (firstMaterialImg.src = firstMaterialObj.imageSrc);
      secondMaterialObj && (secondMaterialImg.src = secondMaterialObj.imageSrc);
      thirdMaterialObj && (thirdMaterialImg.src = thirdMaterialObj.imageSrc);

      if (this.tileData.itemTypeOutput1 || this.tileData.semiFinishedType) {
        productImg.src = this.tileData.semiFinishedType
          ? findItemObjInList(this.tileData.semiFinishedType).imageSrc
          : findItemObjInList(this.tileData.itemTypeOutput1).imageSrc;

        let productObj = findItemObjInList(this.tileData.semiFinishedType)
          ? findItemObjInList(this.tileData.semiFinishedType)
          : findItemObjInList(this.tileData.itemTypeOutput1);

        if (this.tileData.buildingType == "chemicalPlant" && this.tileData.itemTypeOutput1 == "Rubber") {
          productObj = findItemObjInList("Rubber(natural)");
        }

        const itemMaterials = productObj.materials;
        firstMaterialAmount.textContent = this.tileData.materialAmount1;
        secondMaterialAmount && (secondMaterialAmount.textContent = this.tileData.materialAmount2);
        materialAmount3 && (materialAmount3.textContent = this.tileData.materialAmount3);

        productAmount.textContent = findItemObjInList(this.tileData.semiFinishedType)
          ? this.tileData.semiFinishedAmount
          : this.tileData.itemAmountOutput1;

        const opPerMin = 60000 / itemMaterials.time;

        firstMaterialAmountPerMin.textContent = `(${itemMaterials.res1Amount} / ${
          opPerMin * itemMaterials.res1Amount
        })`;

        console.log(itemMaterials.res2Amount);
        secondMaterialAmountPerMin &&
          (secondMaterialAmountPerMin.textContent = `(${itemMaterials.res2Amount} / ${
            opPerMin * itemMaterials.res2Amount
          })`);
        materialAmount3PerMin &&
          (materialAmount3PerMin.textContent = `(${itemMaterials.res3Amount} / ${
            opPerMin * itemMaterials.res3Amount
          })`);

        if (this.tile.dataset.buildingType == "smallFoundry") {
          productAmountPerMin.textContent = "(10 / 25)";
          resTime.textContent = `24s / 60s`;
        } else {
          productAmountPerMin.textContent = `(${itemMaterials.prodAmount} / ${
            opPerMin * itemMaterials.prodAmount
          })`;
          resTime.textContent = `${itemMaterials.time / 1000}s / 60s`;
        }

        const extraOutput1 = menu.querySelector("#structure_1 .productAmount");
        const extraOutput2 = menu.querySelector("#structure_2 .productAmount");
        const extraOutput3 = menu.querySelector("#structure_3 .productAmount");

        if (extraOutput1) extraOutput1.textContent = this.tileData.itemAmountOutput1;
        if (extraOutput2) extraOutput2.textContent = this.tileData.itemAmountOutput2;
        if (extraOutput3) extraOutput3.textContent = this.tileData.itemAmountOutput3;

        const extraSemiElements = [
          menu.querySelector("#structure_1 .materialAmount"),
          menu.querySelector("#structure_2 .materialAmount"),
          menu.querySelector("#structure_3 .materialAmount"),
        ];
        extraSemiElements.forEach((e) => e && (e.textContent = this.tileData.semiFinishedAmount));
      }
    }, 500);
    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);

    menu.dataset.updateInterval = intervalId;
  }
  indicatorsState(menu) {
    const waterImage = menu.querySelector(".waterImage");
    const energyImage = menu.querySelector(".energyImage");
    const waterImageBld = this.tile.querySelector(".waterImage");
    const energyImageBld = this.tile.querySelector(".energyImage");

    this.tileData.waterRequired == "true" && waterImage.classList.remove("hidden");
    if (this.tileData.fluidType == "water") {
      waterImage.style.setProperty("background-color", "var(--transGreen)");
      waterImage.style.animation = "none";
      waterImageBld.classList.add("hidden");
    }

    this.tileData.energyConsumption && energyImage.classList.remove("hidden");
    if (totalEnergy >= +this.tileData.energyConsumption) {
      energyImage.style.setProperty("background-color", "var(--transGreen)");
      energyImage.style.animation = "none";
      energyImageBld.classList.add("hidden");
    } else if (this.tileData.processItemStarted == "false") {
      energyImage.style.setProperty("background-color", "var(--transRed)");
      energyImage.style.animation = "flash 1s infinite";
      energyImageBld.classList.remove("hidden");
    }
  }
}

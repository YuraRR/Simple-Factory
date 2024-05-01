class BuildingMenu {
  constructor(tile, id) {
    this.tile = tile;
    this.id = id;
    this.clickArea = tile.querySelector(".clickArea");
    this.tileData = tile.dataset;
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

  extraRecipiesBlock(menu, buildingObj, materialName) {
    const structureBlock = menu.querySelector(".factoryStructures");
    const structureInfo = structuresList.find((elem) => elem.factoryName == menu.dataset.menuType);
    const currentRecipes = structureInfo.recipesList;
    structureBlock.innerHTML = "";
    for (const recipe in currentRecipes) {
      const recipeObj = currentRecipes[recipe];

      if (recipeObj.material != materialName) continue;
      console.log(findItemObjInList(recipeObj.material).imageSrc);
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

      const itemMaterials =
        this.tileData.buildingType == productObj.producedIn2 ? productObj.materials2 : productObj.materials;

      const opPerMin = 60000 / itemMaterials.time;

      materialAmountPerMin.textContent = `(${itemMaterials.res1Amount} / ${opPerMin * itemMaterials.res1Amount})`;
      productAmountPerMin.textContent = `(${itemMaterials.prodAmount} / ${opPerMin * itemMaterials.prodAmount})`;
      extraProcessesStarting(structureId, recipeObj, buildingObj);
    }
    function extraProcessesStarting(structureId, recipeObj, buildingObj) {
      const menu = structureBlock.querySelector(`#structure_${structureId}`);
      const productRecipeObj = findItemObjInList(recipeObj.product);
      console.log(buildingObj);
      buildingObj.itemProcessingOneMaterial(buildingObj.findTargetTile(), menu, productRecipeObj, true);
    }
  }

  recipeSelect(menu) {
    if (
      menu.dataset.menuType != "oreProcessing" &&
      menu.dataset.menuType != "crushingPlant" &&
      menu.dataset.menuType != "smallFoundry" &&
      menu.dataset.menuType != "foundry" &&
      menu.dataset.menuType != "smallAssembly" &&
      menu.dataset.menuType != "assembly"
    ) {
      return;
    }

    const buildingName = this.tileData.buildingType;
    const recipeSelect = menu.querySelector(".recipeSelect");
    const bldCat = this.tileData.buildingCategory;

    const items =
      bldCat == "in2Out2" || bldCat == "in1Out2" || bldCat == "in3Out3"
        ? allItems.filter(
            (item) =>
              (item.producedIn == buildingName || item.producedIn2 == buildingName) && item.type == "semiFinished"
          )
        : allItems.filter((item) => item.producedIn == buildingName);
    const productButton = menu.querySelector(".productImage");

    items.forEach((item) => {
      const itemBlock = document.createElement("div");
      itemBlock.classList.add("recipeItem");

      itemBlock.innerHTML = `
          <button class="exportItem-button">
            <img src="${item.imageSrc}"/>
          </button>
          <span>${item.name}</span>`;
      recipeSelect.appendChild(itemBlock);

      itemBlock.querySelector(".exportItem-button").onclick = () => {
        const itemMaterials = this.tileData.buildingType == item.producedIn ? item.materials : item.materials2;
        if (
          +this.tileData.firstMatAmount > 0 ||
          +this.tileData.secondMatAmount > 0 ||
          +this.tileData.thirdMatAmount > 0
        )
          return notyf.error("Can't change recipe when factory is not empty");
        this.tileData.firstMatName = itemMaterials.res1Name;
        if (menu.dataset.menuType == "smallFoundry" || menu.dataset.menuType == "oilRefinery") {
          this.tileData.secondMatName = itemMaterials.res2Name;
          this.tileData.semiFinishedType = item.name;
          this.tileData.itemTypeOutput1 = item.consumptionFor[0];
          this.tileData.itemTypeOutput2 = item.consumptionFor[1];
        } else if (menu.dataset.menuType == "foundry") {
          this.tileData.secondMatName = itemMaterials.res2Name;
          this.tileData.thirdMatName = itemMaterials.res3Name;
          this.tileData.semiFinishedType = item.name;
          this.tileData.itemTypeOutput1 = item.consumptionFor[0];
          this.tileData.itemTypeOutput2 = item.consumptionFor[1];
          this.tileData.itemTypeOutput3 = item.consumptionFor[2];
        } else if (menu.dataset.menuType == "smallAssembly") {
          this.tileData.secondMatName = itemMaterials.res2Name;
        } else if (menu.dataset.menuType == "assembly") {
          this.tileData.secondMatName = itemMaterials.res2Name;
          this.tileData.thirdMatName = itemMaterials.res3Name;
        } else {
          this.tileData.itemTypeOutput1 = item.name;
        }
        recipeSelect.classList.add("hidden");
        productButton.parentElement.parentElement.classList.add("clear-after");
        buildingName == "smallFoundry" || buildingName == "foundry" || buildingName == "oilRefinery"
          ? this.extraRecipiesBlock(menu, this.buildingObj, item.name)
          : "";
      };
    });
    productButton.onclick = () => recipeSelect.classList.remove("hidden");

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".recipeSelect") && !event.target.closest(".buildingMenu__product")) {
        recipeSelect.classList.add("hidden");
      }
    });
  }
  menuUpdate(menu) {
    const firstMaterialAmount = menu.querySelector(`[data-material="first"]`);
    const firstMaterialImg = menu.querySelector(`[data-material-img="first"]`);
    const firstMaterialAmountPerMin = firstMaterialAmount.nextElementSibling;

    const secondMaterialAmount = menu.querySelector(`[data-material="second"]`);
    const secondMaterialImg = menu.querySelector(`[data-material-img="second"]`);
    const secondMaterialAmountPerMin = secondMaterialAmount && secondMaterialAmount.nextElementSibling;

    const thirdMaterialAmount = menu.querySelector(`[data-material="third"]`);
    const thirdMaterialImg = menu.querySelector(`[data-material-img="third"]`);
    const thirdMaterialAmountPerMin = thirdMaterialAmount && thirdMaterialAmount.nextElementSibling;

    const productAmount = menu.querySelector(".productAmount");
    const productImg = menu.querySelector(".productImage");
    const productAmountPerMin = productAmount.nextElementSibling;

    const resTime = menu.querySelector(".resTime");

    const intervalId = setInterval(() => {
      const firstMaterialObj = findItemObjInList(this.tileData.firstMatName);
      const secondMaterialObj = findItemObjInList(this.tileData.secondMatName);
      const thirdMaterialObj = findItemObjInList(this.tileData.thirdMatName);
      this.tileData.firstMatName && (firstMaterialImg.src = firstMaterialObj.imageSrc);
      this.tileData.secondMatName && (secondMaterialImg.src = secondMaterialObj.imageSrc);
      this.tileData.thirdMatName && (thirdMaterialImg.src = thirdMaterialObj.imageSrc);

      if (this.tileData.itemTypeOutput1 || this.tileData.semiFinishedType) {
        productImg.src = this.tileData.semiFinishedType
          ? findItemObjInList(this.tileData.semiFinishedType).imageSrc
          : findItemObjInList(this.tileData.itemTypeOutput1).imageSrc;

        const productObj = findItemObjInList(this.tileData.semiFinishedType)
          ? findItemObjInList(this.tileData.semiFinishedType)
          : findItemObjInList(this.tileData.itemTypeOutput1);

        const itemMaterials =
          this.tileData.buildingType == productObj.producedIn ? productObj.materials : productObj.materials2;
        firstMaterialAmount.textContent = this.tileData.firstMatAmount;
        secondMaterialAmount && (secondMaterialAmount.textContent = this.tileData.secondMatAmount);
        thirdMaterialAmount && (thirdMaterialAmount.textContent = this.tileData.thirdMatAmount);

        productAmount.textContent = findItemObjInList(this.tileData.semiFinishedType)
          ? this.tileData.semiFinishedAmount
          : this.tileData.itemAmountOutput1;

        const opPerMin = 60000 / itemMaterials.time;

        firstMaterialAmountPerMin.textContent = `(${itemMaterials.res1Amount} / ${
          opPerMin * itemMaterials.res1Amount
        })`;

        secondMaterialAmountPerMin &&
          (secondMaterialAmountPerMin.textContent = `(${itemMaterials.res2Amount} / ${
            opPerMin * itemMaterials.res2Amount
          })`);
        thirdMaterialAmountPerMin &&
          (thirdMaterialAmountPerMin.textContent = `(${itemMaterials.res3Amount} / ${
            opPerMin * itemMaterials.res3Amount
          })`);

        productAmountPerMin.textContent = `(${itemMaterials.prodAmount} / ${opPerMin * itemMaterials.prodAmount})`;
        resTime.textContent = `${itemMaterials.time / 1000}s / 60s`;

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

      const waterImage = menu.querySelector(".waterImage");
      const energyImage = menu.querySelector(".energyImage");

      this.tileData.waterRequired == "true" && waterImage.classList.remove("hidden");
      if (this.tileData.fluidType == "water") {
        waterImage.style.setProperty("background-color", "var(--transGreen)");
        waterImage.style.animation = "none";
      }

      this.tileData.energyConsumption && energyImage.classList.remove("hidden");
      if (totalEnergy >= String(parseFloat(this.tileData.energyConsumption))) {
        energyImage.style.setProperty("background-color", "var(--transGreen)");
        energyImage.style.animation = "none";
      } else {
        energyImage.style.setProperty("background-color", "var(--transRed)");
        energyImage.style.animation = "flash 1s infinite";
      }
    }, 500);
    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);

    menu.dataset.updateInterval = intervalId;
  }
}

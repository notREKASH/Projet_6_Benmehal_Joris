const gallery = document.querySelector(".gallery");

// Function génératrice pour l'apparation et modification des travaux

async function generateWorks(category) {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const works = await response.json();
    let worksFiltrees;

    if (category) {
      worksFiltrees = works.filter((work) => work.category.name === category);
    } else {
      worksFiltrees = works;
    }

    gallery.innerHTML = "";

    for (let i = 0; i < worksFiltrees.length; i++) {
      const work = worksFiltrees[i];
      const sectionFigure = document.createElement("figure");
      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;
      imageElement.alt = work.title;
      const descriptionElement = document.createElement("figcaption");
      descriptionElement.innerHTML = work.title;
      sectionFigure.appendChild(imageElement);
      sectionFigure.appendChild(descriptionElement);
      gallery.appendChild(sectionFigure);
    }
    return worksFiltrees;
  } catch (error) {
    console.error(
      "Un problème est survenu lors de l'opération de récupération avec fetch:",
      error
    );
  }
}

// -- Boutons pour les filtres

const btnTous = document.querySelector("#button-tous");
btnTous.addEventListener("click", () => {
  generateWorks();
});

const btObjets = document.querySelector("#button-objets");
btObjets.addEventListener("click", () => {
  generateWorks("Objets");
});

const btnAppartements = document.querySelector("#button-appartements");
btnAppartements.addEventListener("click", () => {
  generateWorks("Appartements");
});

const btnHotelsRestaurants = document.querySelector(
  "#button-hotelsrestaurants"
);
btnHotelsRestaurants.addEventListener("click", () => {
  generateWorks("Hotels & restaurants");
});

generateWorks();

// Listeners pour verifier si localStorage possède Admin True et le token

const crossClose = document.createElement("i");
crossClose.innerHTML = `<i class="fa-sharp fa-solid fa-xmark"></i>`;
crossClose.classList.add("close-edition-mode");

window.addEventListener("load", () => {
  if (
    sessionStorage.getItem("isAdmin") === "true" &&
    sessionStorage.getItem("token") !== ""
  ) {
    const editMode = document.createElement("div");
    editMode.classList.add("edition-mode");
    const layoutEditModeOnly = document.createElement("div");
    layoutEditModeOnly.classList.add("layout-edit-mode");
    const iconEdit = document.createElement("i");
    iconEdit.innerHTML = `<i class="fa-sharp fa-regular fa-pen-to-square"></i>`;
    const pEditMode = document.createElement("p");
    pEditMode.innerHTML = "Mode édition";
    const editModeButton = document.createElement("button");
    editModeButton.innerHTML = "publier les changements";
    editMode.style.display = "flex";

    const headerLogin = document.querySelector("#login");
    headerLogin.textContent = "logout";
    headerLogin.removeAttribute("href");
    headerLogin.addEventListener("click", closeAdminMenu);

    layoutEditModeOnly.appendChild(iconEdit);
    layoutEditModeOnly.appendChild(pEditMode);
    editMode.appendChild(layoutEditModeOnly);
    editMode.appendChild(editModeButton);
    editMode.appendChild(crossClose);
    document.body.appendChild(editMode);

    const headerEditMode = document.querySelector(".header-edit-mode");
    headerEditMode.style.paddingTop = "7em";

    const layoutEditMode = document.querySelectorAll(".layout-edit-mode");
    for (let i = 0; i < layoutEditMode.length; i++) {
      const layoutDisplay = layoutEditMode[i];
      layoutDisplay.style.display = "flex";
    }
  }
});

function closeAdminMenu() {
  const popupWarning = document.createElement("div");
  const popupContainer = document.createElement("div");
  const popupTitle = document.createElement("h3");
  const popupButtonContainer = document.createElement("div");
  const popupButtonYes = document.createElement("button");
  const popupButtonNo = document.createElement("button");

  popupWarning.setAttribute("id", "pop-up-warning");
  popupWarning.style.display = "flex";
  popupTitle.innerHTML = "Voulez-vous vraiment quitter sans enregistrer ?";
  popupButtonYes.innerHTML = `<i class="fa-solid fa-check"></i>`;
  popupButtonNo.innerHTML = `<i class="fa-solid fa-ban"></i>`;

  popupButtonContainer.appendChild(popupButtonYes);
  popupButtonContainer.appendChild(popupButtonNo);
  popupContainer.appendChild(popupTitle);
  popupContainer.appendChild(popupButtonContainer);
  popupWarning.appendChild(popupContainer);
  document.body.appendChild(popupWarning);

  popupButtonYes.addEventListener("click", () => {
    const editMode = document.querySelector(".edition-mode");
    editMode.style.display = "none";

    const layoutEditMode = document.querySelectorAll(".layout-edit-mode");
    for (let i = 0; i < layoutEditMode.length; i++) {
      const layoutDisplay = layoutEditMode[i];
      layoutDisplay.style.display = "none";
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("isAdmin");
      const headerLogin = document.querySelector("#login");
      headerLogin.setAttribute("href", "login.html");
      headerLogin.textContent = "login";
    }

    const headerEditMode = document.querySelector(".header-edit-mode");
    headerEditMode.style.paddingTop = "2em";

    document.body.removeChild(popupWarning);
  });

  popupButtonNo.addEventListener("click", () => {
    document.body.removeChild(popupWarning);
  });
}
crossClose.addEventListener("click", closeAdminMenu);

const layoutEditMode = document.querySelectorAll(".layout-edit-mode");
layoutEditMode[1].addEventListener("click", async () => {
  let worksFiltrees = await generateWorks();
  galeryModal(worksFiltrees);
});

function galeryModal(works) {
  const modal = document.createElement("div");
  const modalContainer = document.createElement("div");
  const modalTitle = document.createElement("h3");
  const closeModal = document.createElement("div");
  closeModal.innerHTML = `<i class="fa-sharp fa-solid fa-xmark close-modal"></i>`;

  const modalGalleryContainer = document.createElement("div");
  modalGalleryContainer.classList.add("gallery-modal");

  works.forEach((work) => {
    const modalFigure = document.createElement("figure");
    const figureContainer = document.createElement("div");
    const editButton = document.createElement("button");
    const modalImage = document.createElement("img");

    const modalEditButton = document.createElement("div");
    modalEditButton.classList.add("modal-edit-button");
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "modal-delete-button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    editButton.innerHTML = "éditer";

    modalImage.src = work.imageUrl;
    modalImage.alt = work.title;

    figureContainer.appendChild(modalImage);
    figureContainer.appendChild(modalEditButton);
    modalEditButton.appendChild(deleteButton);
    modalFigure.appendChild(figureContainer);
    modalFigure.appendChild(editButton);
    modalGalleryContainer.appendChild(modalFigure);

    editButton.addEventListener("click", () => {
      modalEditButton.innerHTML = "";
      const mooveButton = document.createElement("button");
      mooveButton.setAttribute("class", "modal-moove-button");
      mooveButton.innerHTML = `<i class="fa-solid fa-arrows-up-down-left-right"></i>`;
      modalEditButton.appendChild(mooveButton);
      modalEditButton.appendChild(deleteButton);
    });

    deleteButton.addEventListener("click", async () => {
      const token = sessionStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:5678/api/works/" + work.id,
          {
            method: "DELETE",
            headers: { Authorization: "Bearer " + token },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        generateWorks();
        document.body.removeChild(modal);
      } catch (error) {
        console.error(
          "Un problème est survenu lors de l'opération de récupération avec fetch:",
          error
        );
      }
    });
  });

  const modalButton = document.createElement("div");
  const popupButtonAdd = document.createElement("button");
  popupButtonAdd.setAttribute("id", "add-picture");
  popupButtonAdd.setAttribute("class", "button-filter");
  const popupButtonRemove = document.createElement("button");
  popupButtonRemove.setAttribute("id", "delete-all-picture");

  modal.setAttribute("id", "modal");
  modal.style.display = "flex";
  modalTitle.innerHTML = "Galerie photo";
  popupButtonAdd.innerHTML = "Ajouter une photo";
  popupButtonRemove.innerHTML = "Supprimer la galerie";

  modalContainer.appendChild(closeModal);
  modalButton.appendChild(popupButtonAdd);
  modalButton.appendChild(popupButtonRemove);
  modalContainer.appendChild(modalTitle);
  modalContainer.appendChild(modalGalleryContainer);
  modalContainer.appendChild(modalButton);
  modal.appendChild(modalContainer);
  document.body.appendChild(modal);

  document.querySelector(".close-modal").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  popupButtonAdd.addEventListener("click", () => {
    document.body.removeChild(modal);
    modalPicture();
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function modalPicture() {
  const modal = document.createElement("div");
  modal.setAttribute("id", "modal");
  const modalContainer = document.createElement("div");
  const modalTitle = document.createElement("h3");
  modalTitle.innerHTML = "Ajout photo";

  const closeModal = document.createElement("div");
  closeModal.innerHTML = `<i class="fa-sharp fa-solid fa-xmark close-modal"></i>`;
  const backReturnModal = document.createElement("div");
  backReturnModal.innerHTML = `<i class="fa-solid fa-arrow-left go-back-modal"></i>`;

  const modalForm = document.createElement("form");
  modalForm.action = "action";
  modalForm.method = "POST";

  const formContainer = document.createElement("div");
  formContainer.setAttribute("class", "modal-file-layout");

  const iconFile = document.createElement("div");
  iconFile.innerHTML = `<i class="fa-solid fa-image"></i>`;

  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.setAttribute("id", "file");
  inputFile.setAttribute("class", "input-file");
  inputFile.accept = "image/png, image/jpeg, image/jpg";
  inputFile.required = true;

  const imageFile = document.createElement("img");
  imageFile.setAttribute("class", "modal-file-layout");
  imageFile.style.display = "none";

  inputFile.addEventListener("change", function (event) {
    const selectedFile = event.target.files[0];
    const maxSizeFile = 4194304; // 4mo
    if (selectedFile.size >= maxSizeFile) {
      alert("Le fichier est trop lourd, 4mo max");
      this.value = "";
    } else {
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const imageUrl = event.target.result;
          imageFile.setAttribute("src", imageUrl);
          modalForm.removeChild(formContainer);
          imageFile.style.display = "flex";
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  });

  const labelFile = document.createElement("label");
  labelFile.htmlFor = "file";
  labelFile.innerHTML = "+ Ajouter photo";
  const fileType = document.createElement("p");
  fileType.innerHTML = "jpg, png : 4mo max";

  const labelTitle = document.createElement("label");
  labelTitle.htmlFor = "title";
  labelTitle.innerHTML = "Titre";

  const inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.name = "title";
  inputFile.required = true;
  inputTitle.setAttribute("id", "title");

  const labelCategory = document.createElement("label");
  labelCategory.htmlFor = "category";
  labelCategory.innerHTML = "Catégorie";

  const selectCategory = document.createElement("select");
  selectCategory.name = "category";
  selectCategory.setAttribute("id", "category");

  const optionCategory = [
    { id: 0, name: "Sélectionner une catégorie" },
    { id: 1, name: "Objets" },
    { id: 2, name: "Appartements" },
    { id: 3, name: "Hôtels & Restaurants" },
  ];

  for (let i = 0; i < optionCategory.length; i++) {
    const option = document.createElement("option");
    option.value = optionCategory[i].id;
    option.text = optionCategory[i].name;
    if (optionCategory[i].id === 0) {
      option.setAttribute("selected", "selected");
      option.setAttribute("disabled", "disabled");
    }
    selectCategory.appendChild(option);
  }

  const submitContainer = document.createElement("div");
  const submitBtn = document.createElement("input");
  submitBtn.type = "submit";
  submitBtn.value = "Valider";
  submitBtn.disabled = true;
  if (submitBtn.disabled) {
    submitBtn.style.backgroundColor = "#A7A7A7";
  }
  submitBtn.setAttribute("id", "submit");

  modalContainer.appendChild(modalTitle);
  formContainer.appendChild(iconFile);
  formContainer.appendChild(inputFile);
  formContainer.appendChild(labelFile);
  formContainer.appendChild(fileType);
  modalForm.appendChild(formContainer);
  modalForm.appendChild(imageFile);
  modalForm.appendChild(labelTitle);
  modalForm.appendChild(inputTitle);
  modalForm.appendChild(labelCategory);
  modalForm.appendChild(selectCategory);
  submitContainer.appendChild(submitBtn);
  modalForm.appendChild(submitContainer);
  modalContainer.appendChild(modalForm);
  modalContainer.appendChild(closeModal);
  modalContainer.appendChild(backReturnModal);
  modal.appendChild(modalContainer);
  document.body.appendChild(modal);

  document.querySelector(".close-modal").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  backReturnModal.addEventListener("click", async () => {
    let category;
    let worksFiltrees = await generateWorks(category);
    document.body.removeChild(modal);
    galeryModal(worksFiltrees);
  });

  const form = {
    image: document.querySelector("#file"),
    title: document.querySelector("#title"),
  };

  inputFile.addEventListener("change", checkInput);
  inputTitle.addEventListener("input", checkInput);
  selectCategory.addEventListener("change", checkInput);

  function checkInput() {
    const isFileSelected = form.image.files.length > 0;
    const isTitleFilled = form.title.value.trim() !== "";
    const isCategorySelected = selectCategory.value !== "0";

    if (isFileSelected && isTitleFilled && isCategorySelected) {
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = "#1d6154";
    } else {
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = "#A7A7A7";
    }
  }

  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const sendWorks = "http://localhost:5678/api/works";
    const token = sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", form.image.files[0]);
    formData.append("title", form.title.value);
    formData.append("category", selectCategory.value);

    try {
      const response = await fetch(sendWorks, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      generateWorks();
      document.body.removeChild(modal);
    } catch (error) {
      console.error(
        "Un problème est survenu lors de l'opération de récupération avec fetch:",
        error
      );
    }
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

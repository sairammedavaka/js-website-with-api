// COLLECTIONS / FAVORITES CONTAINER ELEMENTS
const collectionsContainerEl = document.getElementById("collections");
const favoritesContainerEl = document.getElementById("favorites");

// CONSTANT VARIABLES
const collectionsVar = "collections";
const toCollectVar = "toCollect";
const toFavsVar = "toFavs";

// GENERATING TOTAL SUM OF GENRES
const totalSumOfGenres = (genresArr) => {
  let newArr = [];

  for (let i = 0; i < genresArr.length; i++) {
    for (let j = 0; j < genresArr[i].length; j++) {
      if (newArr.length) {
        if (newArr.some((item) => genresArr[i][j] === Object.keys(item)[0])) {
          const index = newArr.findIndex(
            (index) => genresArr[i][j] === Object.keys(index)[0]
          );
          newArr.splice(index, 1, {
            [genresArr[i][j]]: newArr[index][genresArr[i][j]] + 1,
          });
        } else {
          newArr = [...newArr, { [genresArr[i][j]]: 1 }];
        }
      } else {
        newArr.push({ [genresArr[i][j]]: 1 });
      }
    }
  }

  if (newArr.length) {
    const totalGenresContainerEl = document.querySelector(
      ".total-genres-container"
    );

    newArr.forEach((item) => {
      const pEl = document.createElement("p");
      pEl.textContent = `${Object.keys(item)[0]}: ${
        item[Object.keys(item)[0]]
      }`;
      pEl.classList.add("sub-header", "total-genres-sub-header");
      totalGenresContainerEl.appendChild(pEl);
    });
  }
};

// CREATING CARDS
const createCards = (data) => {
  const cardContainerEl = document.createElement("div");
  cardContainerEl.id = data.id;
  cardContainerEl.classList.add("card-container");
  cardContainerEl.setAttribute("data-name", data.primaryTitle);

  const imgWrapperEl = document.createElement("div");
  imgWrapperEl.classList.add("image-wrapper");

  const imgEl = document.createElement("img");
  imgEl.src = data.primaryImage;

  const contentWrapper = document.createElement("div");
  contentWrapper.classList.add("content-wrapper");

  const contentTextWrapper = document.createElement("div");
  contentTextWrapper.classList.add("content-text-wrapper");

  const titleEl = document.createElement("h3");
  titleEl.textContent = data.primaryTitle;
  titleEl.classList.add("header-md");

  const descEl = document.createElement("p");
  descEl.textContent = data.description;
  descEl.classList.add("sub-header");

  const buttonEl = document.createElement("button");
  buttonEl.type = "button";
  buttonEl.classList.add("card-button");

  const iconEl = document.createElement("i");
  iconEl.classList.add("fa-regular", "fa-star");

  const spanEl = document.createElement("span");
  spanEl.textContent = "Favorties";

  buttonEl.appendChild(iconEl);
  buttonEl.appendChild(spanEl);

  collectionsContainerEl.appendChild(cardContainerEl);
  cardContainerEl.appendChild(imgWrapperEl);
  imgWrapperEl.appendChild(imgEl);

  cardContainerEl.appendChild(contentWrapper);
  contentWrapper.appendChild(contentTextWrapper);
  contentTextWrapper.appendChild(titleEl);
  contentTextWrapper.appendChild(descEl);
  contentWrapper.appendChild(buttonEl);
};

// FETCHING MOVIES LIST USING API
const getMoviesList = async () => {
  const url = "https://imdb236.p.rapidapi.com/api/imdb/most-popular-tv";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "c912d78425msh401c209bc37b99fp148829jsn7f877fe56c0d",
      "x-rapidapi-host": "imdb236.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    let genresArr = [];

    if (result) {
      for (let i = 0; i < 30; i++) {
        createCards({
          id: result[i].id,
          primaryImage: result[i].primaryImage,
          primaryTitle: result[i].primaryTitle,
          description: result[i].description,
        });
        genresArr.push(result[i].genres);
      }
      addEventListenerToCardBtns();
      totalSumOfGenres(genresArr);
    }
  } catch (error) {
    console.error(error);
  }
};
getMoviesList();

// UPDATING MOVIES TO RESPECTIVE SECTION
const updateCollections = (element, direction) => {
  const container =
    direction === toCollectVar ? collectionsContainerEl : favoritesContainerEl;

  const icon = element.querySelector("i");
  if (direction === toCollectVar) {
    icon.classList.replace("fa-solid", "fa-regular");
  } else {
    icon.classList.replace("fa-regular", "fa-solid");
  }

  container.appendChild(element);
};

// ADDING EVENT LISTENERS TO FAVORITES BTN
const addEventListenerToCardBtns = () => {
  const cardBtns = document.querySelectorAll(".card-button");
  cardBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const direction =
        this.parentElement.parentElement.parentElement.id === collectionsVar
          ? toFavsVar
          : toCollectVar;

      updateCollections(this.parentElement.parentElement, direction);
    });
  });
};

// SORTING CARDS OF COLLECTIONS / FAVORITES
const sortCards = (containerName, sortDir) => {
  const container =
    containerName === collectionsVar
      ? collectionsContainerEl
      : favoritesContainerEl;

  const childrensList = [];

  for (let child of container.children) {
    childrensList.push(child);
  }

  childrensList.sort((a, b) => {
    const nameA = a.dataset.name[0].toLowerCase();
    const nameB = b.dataset.name[0].toLowerCase();

    if (sortDir === "asc" ? nameA < nameB : nameA > nameB) {
      return -1;
    }

    if (sortDir === "asc" ? nameA > nameB : nameA < nameB) {
      return 1;
    }

    return 0;
  });

  container.innerHTML = "";
  childrensList.forEach((item) => container.appendChild(item));
};

// EVENT LISTENERS TO SORT BTNS
const buttons = document.querySelectorAll(".sort-button");
buttons.forEach((btn) => {
  btn.addEventListener("click", function () {
    this.dataset.name === collectionsVar
      ? sortCards(this.dataset.name, this.id)
      : sortCards(this.dataset.name, this.id);
  });
});

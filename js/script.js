console.log("Hello this is a test to see if the js is even running");

const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
  },
  api: {
    api_url: "https://api.jikan.moe/v4/",
  },
};

const path = global.currentPage;

async function displayPopularAnimes() {
  const { data } = await fetchApiData("top/anime");
  console.log(data);
  data.forEach((anime) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <a href="anime-details.html?id=${anime.mal_id}">
      <img 
      src="${anime.images?.jpg?.large_image_url || "images/no-image.jpg"}" 
      class="card-img-top" 
      alt="${anime.title || "No Image Available"}" 
    />
    </a>
    <div class="card-body">
      <h5 class="card-title">${anime.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${anime.aired.from.slice(
          0,
          10
        )}</small>
      </p>
    </div>`;
    document.querySelector("#popular-animes").appendChild(div);
  });
}

async function displayPopularMangas() {
  const { data } = await fetchApiData("top/manga");

  console.log(data);
  data.forEach((manga) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <a href="manga-details.html?id=${manga.mal_id}">
      <img 
        src="${manga.images?.jpg?.large_image_url || "images/no-image.jpg"}" 
        class="card-img-top" 
        alt="${manga.title || "No Image Available"}" 
      />
    </a>
    <div class="card-body">
      <h5 class="card-title">${manga.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${manga.published.from.slice(
          0,
          10
        )}</small>
      </p>
    </div>`;
    document.querySelector("#popular-mangas").appendChild(div);
  });
}

async function displayAnimeDetails() {
  const animeId = window.location.search.split("=")[1];
  const { data } = await fetchApiData(`anime/${animeId}/full`);
  console.log(data);
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
  <div>
      <img 
        src="${data.images?.jpg?.large_image_url || "images/no-image.jpg"}" 
        class="card-img-top" 
        alt="${data.title || "No Image Available"}" 
      />
  </div>
  <div>
      <h2>${data.title}</h2>
      <h3>${
        data.title_english ||
        data.titles.english ||
        data.titles.synonym ||
        data.title
      }</h3>
      <p>
          <i class="fas fa-star text-primary"></i>
          ${data.score}/10
      </p>
      <p class="text-muted">Release Date: ${data.aired.from.slice(0, 10)}</p>
      <p>
          ${data.synopsis}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
          ${data.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href="${
        data.external[0].name != "Official Site"
          ? data.url
          : data.external[0].url
      }" target="_blank" class="btn">Visit Anime Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Anime Info</h2>
  <ul>
      <li><span class="text-secondary">Episodes:</span> ${
        data.episodes
      } episode</li>
      <li><span class="text-secondary">Rating:</span> ${data.rating}</li>
      <li><span class="text-secondary">Duration:</span> ${data.duration}</li>
      <li><span class="text-secondary">Status:</span> ${data.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${data.producers
    .map((producer) => producer.name)
    .join(" | ")}</div>
</div>`;

  document.querySelector("#Anime-details").appendChild(div);
}

async function displayMangaDetails() {
  const mangaId = window.location.search.split("=")[1];
  const { data } = await fetchApiData(`manga/${mangaId}/full`);
  console.log(data);
  console.log(data.images.jpg.large_image_url);
  const div = document.createElement("div");
  div.innerHTML = ` <div class="details-top">
  <div>
    <img
      src="${data.images?.jpg?.large_image_url || "images/no-image.jpg"}"
      class="card-img-top"
      alt="${data.title || "No Image Available"}"
    />
  </div>
  <div>
    <h2>${data.title}</h2>
    <h3>${
      data.title_english ||
      data.titles.english ||
      data.titles.synonym ||
      data.title
    }</h3>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${data.score} / 10
    </p>
    <p class="text-muted">Release Date: ${data.published.from.slice(0, 10)}</p>
    <p>
      ${data.synopsis}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${data.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      data.external[0].name != "Official Site" ? data.url : data.external[0].url
    }" target="_blank" class="btn">Visit Anime Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Manga Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Volumes:</span> ${
      data.volumes ? data.volumes : "N/A"
    }</li>
    <li>
      <span class="text-secondary">Number Of Chapters:</span> ${
        data.chapters ? data.chapters : "N/A"
      }
    </li>
    <li><span class="text-secondary">Status:</span> ${data.status}</li>
  </ul>
  <h4>Author</h4>
  <div class="list-group">${data.authors[0].name}</div>
</div>`;

  document.querySelector("#manga-details").appendChild(div);
}

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  // i have no idea why is this always running the else statement
  if (global.search.term !== "" && global.search.term !== null) {
    const {
      data,
      pagination: {
        items: { total },
        current_page,
      },
    } = await searchApiData();
    console.log(data, total, current_page);
    if (data.length === 0) {
      showAlert("No results found");
      return;
    }
    displaySearchResults(data);

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please Enter Search Term");
  }
}

function displaySearchResults(data) {
  data.forEach((data) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${data.mal_id}"> 
      <img 
      src="${data.images?.jpg?.large_image_url || "images/no-image.jpg"}" 
      class="card-img-top" 
      alt="${data.title || "No Image Available"}" 
    />
    </a>
    <div class="card-body">
      <h5 class="card-title">${data.title}</h5>
      <p class="card-text">
        <small class="text-muted">${
          global.search.type === "anime"
            ? "Release Date"
            : "Published Date" /* same here as below but for the naming */
        }: ${
      global.search.type === "anime"
        ? data.aired.from.slice(0, 10)
        : global.search.type === "manga"
        ? data.published.from.slice(0, 10)
        : "Unknown"
    }  
        </small>
      </p>
    </div>`;
    /* checks if type is anime or manga and gets the date appropriately from the api  cause api have different namings for anime and manga */
    document.querySelector("#search-results").appendChild(div);
  });
}

function getRandomItems(data, numItems) {
  // Fisher-Yates shuffle algorithm
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }
  // Return the first numItems elements
  return data.slice(0, numItems);
}

// display slider
async function displayAnimeSlider() {
  let { data } = await fetchApiData("recommendations/anime");

  data = getRandomItems(data, 10);
  data.forEach((anime) => {
    // Access entry 0 and 1 for each anime
    [0, 1].forEach((entryIndex) => {
      const imageUrl = anime.entry[entryIndex].images.webp.large_image_url;

      // Now you can use imageUrl for further processing, e.g., creating HTML elements
      const div = document.createElement("div");
      div.classList.add("swiper-slide");

      div.innerHTML = `
              <a href="anime-details.html?id=${anime.entry[entryIndex].mal_id}">
                  <img src="${imageUrl}" alt="${anime.entry[entryIndex].title}" />
              </a>
              <h4 class="swiper-rating">
                  <p>${anime.entry[entryIndex].title}</p>
              </h4>
          `;

      // Append the created div to the swiper wrapper
      document.querySelector(".swiper-wrapper").appendChild(div);

      initSwiper();
    });
  });
}

async function displayMangaSlider() {
  let { data } = await fetchApiData("recommendations/manga");
  data = getRandomItems(data, 10);
  data.forEach((anime) => {
    // Access entry 0 and 1 for each anime
    [0, 1].forEach((entryIndex) => {
      const imageUrl = anime.entry[entryIndex].images.webp.large_image_url;

      // Now you can use imageUrl for further processing, e.g., creating HTML elements
      const div = document.createElement("div");
      div.classList.add("swiper-slide");

      div.innerHTML = `
              <a href="manga-details.html?id=${anime.entry[entryIndex].mal_id}">
                  <img src="${imageUrl}" alt="${anime.entry[entryIndex].title}" />
              </a>
              <h4 class="swiper-rating">
                  <p>${anime.entry[entryIndex].title}</p>
              </h4>
          `;

      // Append the created div to the swiper wrapper
      document.querySelector(".swiper-wrapper").appendChild(div);

      initSwiper();
    });
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 3,
    freeMode: true,
    loop: true,
    breakpoints: {
      700: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  });
}

// gets the base api link ( then we concatenate with the endpoint )
async function fetchApiData(endpoint) {
  const API_URL = global.api.api_url;
  showSpinner();
  const respone = await fetch(`${API_URL}${endpoint}`);
  const data = await respone.json();
  hideSpinner();
  return data;
}

// gets the search results from the api
async function searchApiData() {
  const API_URL = global.api.api_url;
  showSpinner();
  const respone = await fetch(
    `${API_URL}${global.search.type}?q=${global.search.term}`
  );
  const data = await respone.json();
  hideSpinner();
  return data;
}

//show spinner
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
// hide the spinner
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.href === window.location.origin + global.currentPage) {
      link.classList.add("active");
    }
  });
}

function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

//a simple router function
function init() {
  if (/^\/(Animio\/)?(index\.html)?$/.test(path)) {
    displayPopularAnimes();
    displayAnimeSlider();
  } else if (/^\/(Animio\/)?manga\.html(\/)?$/.test(path)) {
    displayPopularMangas();
    displayMangaSlider();
  } else if (/^\/(Animio\/)?anime-details\.html(\/)?$/.test(path)) {
    displayAnimeDetails();
    // displayAnimeImages();
  } else if (/^\/(Animio\/)?manga-details\.html(\/)?$/.test(path)) {
    displayMangaDetails();
    console.log("manga-details");
  } else if (/^\/(Animio\/)?search\.html(\/)?$/.test(path)) {
    search();
  }
  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);

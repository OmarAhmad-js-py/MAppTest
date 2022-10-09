console.log(window.localStorage)

const API_KEY = "api_key=0a2c754df24f03f4197199045aedf7de";
const BASE_URL = "https://api.themoviedb.org/3";

const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + '/search/movie?' + API_KEY;




const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]


const mainEl = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags")

const prev = document.getElementById("prev")
const next = document.getElementById("next")
const current = document.getElementById("current")






let currentPage = 1;
let NextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalpages = 100;


let selectedGenre = [];
setGenre();
function setGenre() {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if (selectedGenre.length === 0) {
                selectedGenre.push(genre.id);
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if (id === genre.id) {
                            selectedGenre.splice(idx, 1);
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            console.log(encodeURI(selectedGenre.
                join(',')))
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.
                join(',')))
            highlightSelections();

        })
        tagsEl.append(t);
    })
}

function highlightSelections() {
    const tags = document.querySelectorAll(".tag");
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    })
    ClearBtn()
    if (selectedGenre.length !== 0) {

        selectedGenre.forEach(id => {
            const highlightTag = document.getElementById(id);
            highlightTag.classList.add('highlight');
        })
    }
}
function ClearBtn() {
    let ClearBtn = document.getElementById("clear");
    if (ClearBtn) {
        ClearBtn.classList.add('highlight');

    } else {
        let clear = document.createElement("div");
        clear.classList.add("tag", "highlight");
        clear.id = "clear";
        clear.innerText = "Clear";
        clear.addEventListener("click", () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tagsEl.append(clear)
    }
}

getMovies(API_URL);




function getMovies(url) {
    lastUrl = url;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data.results);
            if (data.results.length !== 0) {
                showMovies(data.results);
                currentPage = data.page;
                NextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalpages = data.total_pages;

                current.innerText = currentPage;
                if (currentPage <= 1) {
                    prev.classList.add('disabled');
                    next.classList.remove("disabled")
                } else if (currentPage >= totalpages) {
                    prev.classList.remove('disabled');
                    next.classList.add("disabled")
                } else {
                    prev.classList.remove('disabled');
                    next.classList.remove("disabled")

                }
                form.scrollIntoView({ behavior: 'smooth' })
            }
        });
}

function showMovies(data) {
    main.innerHTML = " ";

    data.forEach((movie) => {
        const { title, release_date, vote_average, overview, poster_path, id } = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie", "col-lg-4", "col-m6", "col-s12");
        movieEl.id = id;
        movieEl.innerHTML = `
      <div class="card-content">
          <img
          style="height: auto; width: 100%;"  src="${poster_path ? IMG_URL + poster_path : "https://via.placeholder.com/500x750"}"
          />
          </div>
       
      <div class="movie-content">
        <h2>
          <a href="#" id="${id}" class="link_video"
            >${title}</a
          >
        </h2>
        <span class="movie-meta">
          <span class="movie-meta-item"
            ><i class="fas fa-clock"></i> ${release_date}</span
          >
          <a href="#" class="movie-meta-item"
            ><i class="fas fa-star"></i> ${vote_average}</a
          >
        </span>
        <p>
        ${overview.substring(0, 200)}
        </p>
      </div>    
    `;

        mainEl.appendChild(movieEl);
        document.getElementById(id).addEventListener("click", () => {
            console.log(id);
            const movieid = [];
            window.location.href = "/singlemovie?id=" + id;
        })
    });
}










search.addEventListener("keyup", () => {
    const searchTerm = search.value;
    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm);
    }
});



next.addEventListener("click", () => {
    if (NextPage <= totalpages) {
        pageCall(NextPage);
    }
})

prev.addEventListener("click", () => {
    if (prevPage > 0) {
        pageCall(prevPage);
    }
})


function pageCall(page) {
    let urlsplit = lastUrl.split('?');
    let queryParams = urlsplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if (key[0] !== "page") {
        let url = lastUrl + "&page=" + page
        getMovies(url)
    } else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlsplit[0] + '?' + b
        getMovies(url);
    }

}


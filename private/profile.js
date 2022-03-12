 const API_KEY = "api_key=0a2c754df24f03f4197199045aedf7de";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/tv/";
const IMG_size = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/tv?" + API_KEY;

const row = document.getElementById("row");
const bio = document.getElementById("Bio");



getrecommendedData();
function getrecommendedData() {
    const uri = "/Wathclater";
    let h = new Headers();
    h.append("Accept", "application/json");

    let req = new Request(uri, {
        method: "GET",
        headers: h,
        mode: "cors",
    });

    fetch(req)
        .then(res => res.json())
        .then(data => {
            console.log(data.Recommended)
            getRecommended(data.Recommended);
        })
        .catch(err => {
            console.log("ERROR: " + err.message);
        });
}

function getRecommended(data) {
    const RecomUID = JSON.parse(data)

    console.log(data)
    const Recomlistdata = [];

    for (let i = 0; i < RecomUID.length; i++) {
        fetch(API_URL + RecomUID[i] + "?" + API_KEY + "&language=en-US")
            .then(res => res.json())
            .then(Tvshowdata => {
                Recomlistdata.push(Tvshowdata);
                showRecomlist(Recomlistdata, Tvshowdata);
            })
    }


}

function showRecomlist(Recomlistdata, Tvshowdata) {
    row.innerHTML =
        ' ';

    Recomlistdata.slice(-6).forEach(movie => {
        const { poster_path, id } = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("row");
        movieEl.innerHTML = `
       
        <div class="image">
          <img id="${id}" style="width: 120px;"
            src="${poster_path
                ? IMG_size + poster_path
                : "https://via.placeholder.com/500x750"
            }" alt="Card image cap" />
                    
        </div> 
        
        `;
        row.appendChild(movieEl);
        document.getElementById(id).addEventListener("click", () => {
            var movieid = [];
            movieid.push(id);
            window.localStorage.setItem("id", JSON.stringify(id));
            location.href = "/singletvshow";

        });
    });
}

const uri = "/profile";
let h = new Headers();
h.append("Accept", "application/json");

let req = new Request(uri, {
    method: "GET",
    headers: h,
    mode: "cors",
});

fetch(req)
    .then(res => res.json())
    .then(data => {
        handlebarsHelper(data);
    })
    .catch(err => {
        console.log("ERROR: " + err.message);
    });

function handlebarsHelper(res) {
    const RecomUID = JSON.parse(data.Recommended);
    console.log(RecomUID);
}

const profile_img = document.getElementById("profile-output");

profile_img.addEventListener("click", () => {
    location.href = "/profile"

})


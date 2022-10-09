const API_KEY = "api_key=0a2c754df24f03f4197199045aedf7de";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/tv/";
const IMG_size = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/tv?" + API_KEY;

const row = document.getElementById("row");
const bio = document.getElementById("Bio");
const profile = document.getElementById("output");
const file = document.getElementById("file");


//get data from server "/getblob" 
function getData() {
    fetch(`/getBlob`)
        .then(res => res.text())
        .then(data => {
            profile.src = data;
        })
}
getData();

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
            console.log(data)
            getRecommended(data.Recommended);
        })
        .catch(err => {
            console.log("ERROR: " + err.message);
        });
}

function getRecommended(data) {
    const RecomUID = JSON.parse(data)
    const Recomlistdata = [];

    for (let i = 0; i < RecomUID.length; i++) {
        fetch(API_URL + RecomUID[i] + "?" + API_KEY + "&language=en-US")
            .then(res => res.json())
            .then(Tvshowdata => {
                Recomlistdata.push(Tvshowdata);
                showRecomlist(Recomlistdata);
            })
    }


}

function showRecomlist(Recomlistdata) {
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
            }" alt="${movie.name}" />    
        </div> 
        
        `;
        row.appendChild(movieEl);
        document.getElementById(id).addEventListener("click", () => {
            const movieid = [];
            movieid.push(id);
            window.localStorage.setItem("id", JSON.stringify(id));
            location.href = "/singletvshow";
        });
        document.getElementById(id).addEventListener("auxclick", (event) => {
            const ids = []
            ids.push(JSON.parse(movie.id))
            console.log(JSON.stringify(ids))
            const StoredRecommended = JSON.parse(localStorage.getItem("Recommended"))
            const changed = StoredRecommended.splice(ids, 1)
            console.log(JSON.stringify(changed))

            const options = {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(ids)
            }


            fetch("/delRecommended", options).then(res => {
                console.log(res.message);
            })
            window.location.reload();
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


//check if file is selected or not
file.addEventListener("change", (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
        const formData = new FormData();
        //cheack if img file is png and is not bigger than 1024kb
        if (file.type === "image/png" && file.size <= 102900) {

            formData.append("file", file);
            const options = {
                method: "POST",
                body: formData
            }
            fetch("/send", options).then(res => {
                console.log(res.message);
            }).catch(err => {
                console.log(err);
            })
        } else {
            //prompt "selected file is not png"
            alert("selected file must be png and less then 1024kb")
        }
    }
});





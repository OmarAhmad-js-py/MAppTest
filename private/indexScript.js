
// 
const circleImages = document.querySelectorAll(".rounded-img")
const underline = document.querySelectorAll(".fancy-underline")
const navbar = document.querySelectorAll(".profile-pic")
const profileImg = document.getElementById("profile-output")


// this is the observer for the images to slide in when they are in view 
const Imgobserver = new IntersectionObserver(entries => {
    // each entry is an image
    entries.forEach(entry => {
        // toggle the slidein class on the image
        entry.target.classList.toggle("slidein", entry.isIntersecting)
        // if the image is in view, stop observing it
        if (entry.isIntersecting) Imgobserver.unobserve(entry.target)
    })
    console.log(entries)
}, {
    threshold: 0.2,
}
)
// each image is observed
circleImages.forEach(circleImages => {
    Imgobserver.observe(circleImages)
})

const drawObserve = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle("draw", entry.isIntersecting)
        if (entry.isIntersecting) drawObserve.unobserve(entry.target)
    })
    console.log(entries)
}, {
    threshold: .5,
}
)


underline.forEach(underline => {
    drawObserve.observe(underline)
})

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle("slidein", entry.isIntersecting)
        if (entry.isIntersecting) navObserver.unobserve(entry.target)
    })
}
)

navbar.forEach(navbar => {
    navObserver.observe(navbar)
})

function getData() {
    fetch(`/getBlob`)
        .then(res => res.text())
        .then(data => {
            profileImg.src = data;
        })
}
getData();

profileImg.addEventListener("click", () => {
    window.location.href = "/profile"
})
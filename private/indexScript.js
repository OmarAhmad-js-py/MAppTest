const circleImages = document.querySelectorAll(".rounded-img")
const underline = document.querySelectorAll(".fancy-underline")
const navbar = document.querySelectorAll(".profile-pic")
const profileImg = document.getElementById("profile-output")

const Imgobserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle("slidein", entry.isIntersecting)
        if (entry.isIntersecting) Imgobserver.unobserve(entry.target)
    })
    console.log(entries)
}, {
    threshold: 0.2,
}
)

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
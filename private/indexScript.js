const circleImages = document.querySelectorAll(".rounded-img")
const underline = document.querySelectorAll(".fancy-underline")
const Imgobserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle("show", entry.isIntersecting)
        if (entry.isIntersecting) Imgobserver.unobserve(entry.target)
    })
    console.log(entries)
}, {
    threshold: 1,
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

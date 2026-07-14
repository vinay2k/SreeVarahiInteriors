// ============================
// GALLERY LOADER
// Automatically loads images from gallery-data.json
// ============================

(async function () {

    const container = document.querySelector(".gallery");

    if (!container) return;

    const projectKey = container.dataset.project;

    if (!projectKey) {
        console.warn("Missing data-project attribute.");
        return;
    }

    const url =
        `https://raw.githubusercontent.com/${SITE_CONFIG.owner}/${SITE_CONFIG.repo}/${SITE_CONFIG.branch}/gallery-data.json?t=${Date.now()}`;

    try {

        const response = await fetch(url);

        if (!response.ok)
            throw new Error("Unable to load gallery.");

        const data = await response.json();

        const project = data[projectKey];

        if (!project) {
            container.innerHTML = "<p>No project found.</p>";
            return;
        }

        container.innerHTML = "";

        project.images.forEach((imagePath, index) => {

            const img = document.createElement("img");

            img.src = "../" + imagePath;

            img.alt = `${project.name} ${index + 1}`;

            container.appendChild(img);

        });

        initPopup(container);

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p style='color:white'>Gallery unavailable.</p>";

    }

})();


// ============================
// POPUP VIEWER
// ============================

function initPopup(gallery) {

    const popup = document.getElementById("popup");

    if (!popup) return;

    const popupImg = popup.querySelector("img");

    const nextBtn = document.getElementById("next");

    const prevBtn = document.getElementById("prev");

    let currentIndex = 0;

    function images() {
        return gallery.querySelectorAll("img");
    }

    function show(index) {

        const imgs = images();

        popupImg.classList.add("fade-out");

        setTimeout(() => {

            popupImg.src = imgs[index].src;

            popupImg.classList.remove("fade-out");

        }, 200);

    }

    gallery.addEventListener("click", function (e) {

        if (e.target.tagName !== "IMG")
            return;

        const imgs = [...images()];

        currentIndex = imgs.indexOf(e.target);

        popup.classList.add("active");

        popupImg.src = e.target.src;

    });

    popup.addEventListener("click", function (e) {

        if (e.target === popup)
            popup.classList.remove("active");

    });

    nextBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        currentIndex = (currentIndex + 1) % images().length;

        show(currentIndex);

    });

    prevBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        currentIndex =
            (currentIndex - 1 + images().length) %
            images().length;

        show(currentIndex);

    });

    document.addEventListener("keydown", function (e) {

        if (!popup.classList.contains("active"))
            return;

        if (e.key === "Escape")
            popup.classList.remove("active");

        if (e.key === "ArrowRight")
            nextBtn.click();

        if (e.key === "ArrowLeft")
            prevBtn.click();

    });

}
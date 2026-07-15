// ============================
// GALLERY LOADER (GitHub API)
// Automatically loads all images from GitHub folder
// ============================

(async function () {

    const container = document.querySelector(".gallery");

    if (!container) return;

    const projectKey = container.dataset.project;

    if (!projectKey) return;

    const url = `https://api.github.com/repos/${SITE_CONFIG.owner}/${SITE_CONFIG.repo}/contents/imgs/${projectKey}?ref=${SITE_CONFIG.branch}`;

    try {

        const response = await fetch(url);

        if (!response.ok)
            throw new Error("Unable to load gallery.");

        const files = await response.json();

        container.innerHTML = "";

        files
            .filter(file =>
                file.type === "file" &&
                /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
            )
            .forEach((file, index) => {

                const img = document.createElement("img");

                img.src = file.download_url;

                img.alt = `${projectKey} ${index + 1}`;

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

        popupImg.src = imgs[index].src;

    }

    gallery.addEventListener("click", function (e) {

        if (e.target.tagName !== "IMG") return;

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

        if (!popup.classList.contains("active")) return;

        if (e.key === "Escape")
            popup.classList.remove("active");

        if (e.key === "ArrowRight")
            nextBtn.click();

        if (e.key === "ArrowLeft")
            prevBtn.click();

    });

}

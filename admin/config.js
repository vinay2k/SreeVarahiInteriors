// =====================================
// ADMIN CONFIGURATION
// GitHub connection & storage settings
// =====================================


const CONFIG = {

    KEYS: {

        OWNER: "svdb_owner",

        REPO: "svdb_repo",

        BRANCH: "svdb_branch",

        TOKEN: "svdb_token"

    },


    // gallery-data.json location in GitHub repo
    MANIFEST_PATH: "gallery-data.json",


    // Images upload folder
    IMAGE_FOLDER: "imgs"

};



// =====================================
// GET GITHUB SETTINGS
// =====================================

function getSettings() {

    return {

        owner: localStorage.getItem(CONFIG.KEYS.OWNER) || "",

        repo: localStorage.getItem(CONFIG.KEYS.REPO) || "",

        branch: localStorage.getItem(CONFIG.KEYS.BRANCH) || "main"

    };

}



// =====================================
// SAVE GITHUB SETTINGS
// =====================================

function saveSettings(owner, repo, branch) {


    localStorage.setItem(
        CONFIG.KEYS.OWNER,
        owner.trim()
    );


    localStorage.setItem(
        CONFIG.KEYS.REPO,
        repo.trim()
    );


    localStorage.setItem(
        CONFIG.KEYS.BRANCH,
        (branch || "main").trim()
    );

}



// =====================================
// GITHUB TOKEN
// Stored only for current browser session
// =====================================

function getToken() {

    return sessionStorage.getItem(
        CONFIG.KEYS.TOKEN
    ) || "";

}



function setToken(token) {

    sessionStorage.setItem(
        CONFIG.KEYS.TOKEN,
        token.trim()
    );

}



function clearToken() {

    sessionStorage.removeItem(
        CONFIG.KEYS.TOKEN
    );

}



// =====================================
// CHECK GITHUB CONNECTION
// =====================================

function isConfigured() {


    const settings = getSettings();


    return Boolean(

        settings.owner &&

        settings.repo &&

        getToken()

    );

}

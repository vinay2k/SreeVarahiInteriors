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


    // File stored in repository root
    MANIFEST_PATH: "gallery-data.json",


    // Image upload location
    IMAGE_FOLDER: "imgs"

};



// =====================================
// GET SAVED SETTINGS
// =====================================

function getSettings(){

    return {

        owner:
        localStorage.getItem(CONFIG.KEYS.OWNER) || "",


        repo:
        localStorage.getItem(CONFIG.KEYS.REPO) || "",


        branch:
        localStorage.getItem(CONFIG.KEYS.BRANCH) || "main"

    };

}



// =====================================
// SAVE GITHUB SETTINGS
// =====================================

function saveSettings(owner, repo, branch){


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
// TOKEN HANDLING
// Stored only while browser tab is open
// =====================================


function getToken(){

    return sessionStorage.getItem(
        CONFIG.KEYS.TOKEN
    ) || "";

}



function setToken(token){

    sessionStorage.setItem(
        CONFIG.KEYS.TOKEN,
        token.trim()
    );

}



function clearToken(){

    sessionStorage.removeItem(
        CONFIG.KEYS.TOKEN
    );

}



// =====================================
// CHECK CONNECTION
// =====================================

function isConfigured(){

    const settings = getSettings();


    return (
        settings.owner &&
        settings.repo &&
        getToken()
    );

}
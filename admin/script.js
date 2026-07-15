const GITHUB_API = "https://api.github.com";

function apiUrl(path){
    const {owner, repo} = getSettings();
    return `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
}

function authHeaders(){
    return {
        Authorization: `Bearer ${getToken()}`,
        Accept: "application/vnd.github+json"
    };
}

function fileToBase64(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function sanitizeFilename(name){
    return name
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.\-_]/g, "");
}

function toast(message, error = false){
    alert(error ? "⚠ " + message : message);
}

async function getJsonFile(path){
    const {branch} = getSettings();
    const res = await fetch(`${apiUrl(path)}?ref=${branch}`, {
        headers: authHeaders()
    });
    if(res.status === 404){
        return { data: null, sha: null };
    }
    if(!res.ok) throw new Error("GitHub read failed");
    const json = await res.json();
    const decoded = decodeURIComponent(escape(atob(json.content)));
    return { data: JSON.parse(decoded), sha: json.sha };
}

async function putJsonFile(path, data, sha, message){
    const {branch} = getSettings();
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    const body = { message, content, branch };
    if(sha) body.sha = sha;
    const res = await fetch(apiUrl(path), {
        method: "PUT",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if(!res.ok) throw new Error("Unable to update JSON");
    return res.json();
}

async function putImageFile(path, base64, message){

    const {branch} = getSettings();

    const res = await fetch(apiUrl(path), {
        method: "PUT",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message,
            content: base64,
            branch
        })
    });

    const result = await res.json();

    if(!res.ok){

        console.log(result);

        alert(JSON.stringify(result, null, 2));

        throw new Error(result.message || "Upload failed");

    }

    return result;

}
    return res.json();}

function setSettingsToUI(){
    const settings = getSettings();
    const owner = document.getElementById("owner");
    const repo = document.getElementById("repo");
    const branch = document.getElementById("branch");
    if(owner) owner.value = settings.owner;
    if(repo) repo.value = settings.repo;
    if(branch) branch.value = settings.branch;
}

function saveSettingsHandler(){
    const owner = document.getElementById("owner")?.value || "";
    const repo = document.getElementById("repo")?.value || "";
    const branch = document.getElementById("branch")?.value || "main";
    if(!owner.trim() || !repo.trim()){
        toast("GitHub owner and repo are required", true);
        return;
    }
    saveSettings(owner, repo, branch);
    toast("GitHub settings saved");
    setSettingsToUI();
}

async function connectGitHubHandler(){
    const token = prompt("Enter GitHub Personal Access Token (repo scope required):");
    if(!token) return;
    setToken(token);
    try{
        const res = await fetch(`${GITHUB_API}/user`, { headers: authHeaders() });
        if(!res.ok){
            clearToken();
            throw new Error("GitHub authentication failed");
        }
        const user = await res.json();
        toast(`Connected to GitHub as ${user.login}`);
    }
    catch(err){
        toast(err.message, true);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setSettingsToUI();
    const upload = document.getElementById("uploadForm");
    if(upload) upload.addEventListener("submit", uploadImages);
    const saveButton = document.getElementById("saveSettings");
    if(saveButton) saveButton.addEventListener("click", saveSettingsHandler);
    const githubButton = document.getElementById("githubLogin");
    if(githubButton) githubButton.addEventListener("click", connectGitHubHandler);
});

async function uploadImages(e){
    e.preventDefault();
    if(!isConfigured()){
        toast("Connect GitHub first", true);
        return;
    }
    const project = document.getElementById("projectSelect").value;
    const files = [...document.getElementById("images").files];
    if(files.length === 0){
        toast("Select images first", true);
        return;
    }
    try{
        let manifest = await getJsonFile(CONFIG.MANIFEST_PATH);
        if(!manifest.data){
            manifest.data = {
                kitchen:{ name:"Kitchen", images:[] },
                bedroom:{ name:"Bedroom", images:[] },
                hall:{ name:"Hall", images:[] },
                aluminum:{ name:"Aluminum", images:[] },
                artworks:{ name:"Artworks", images:[] },
                elevations:{ name:"Elevations", images:[] },
                "false-ceiling":{ name:"False Ceiling", images:[] },
                flooring:{ name:"Flooring", images:[] },
                painting:{ name:"Painting", images:[] },
                steelframe:{ name:"Steel Art", images:[] }
            };
            manifest.sha = null;
        }
        if(!manifest.data[project]){
            throw new Error("Project not found: " + project);
        }
        const uploaded = [];
        for(const file of files){
            const base64 = await fileToBase64(file);
            const filename = Date.now() + "-" + sanitizeFilename(file.name);
            const path = `${CONFIG.IMAGE_FOLDER}/${project}/${filename}`;
            await putImageFile(path, base64, "Upload gallery image");
            uploaded.push(path);
        }
        manifest.data[project].images.push(...uploaded);
        await putJsonFile(CONFIG.MANIFEST_PATH, manifest.data, manifest.sha, "Update gallery data");
        toast("Images uploaded successfully");
    }
    catch(error){
        toast(error.message, true);
    }
}

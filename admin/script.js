async function uploadImages(e){

    e.preventDefault();


    if(!isConfigured()){

        toast(
            "Connect GitHub first",
            true
        );

        return;

    }



    const project =
    document.getElementById("projectSelect").value;



    const files =
    [
        ...document.getElementById("images").files
    ];



    if(files.length === 0){

        toast(
            "Select images first",
            true
        );

        return;

    }



    try{


        let manifest =
        await getJsonFile(
            CONFIG.MANIFEST_PATH
        );



        // Create gallery-data.json if missing

        if(!manifest.data){


            manifest.data = {

                kitchen:{
                    name:"Kitchen",
                    images:[]
                },

                bedroom:{
                    name:"Bedroom",
                    images:[]
                },

                hall:{
                    name:"Hall",
                    images:[]
                },

                aluminum:{
                    name:"Aluminum",
                    images:[]
                },

                artworks:{
                    name:"Artworks",
                    images:[]
                },

                elevations:{
                    name:"Elevations",
                    images:[]
                },

                "false-ceiling":{
                    name:"False Ceiling",
                    images:[]
                },

                flooring:{
                    name:"Flooring",
                    images:[]
                },

                painting:{
                    name:"Painting",
                    images:[]
                },

                steelframe:{
                    name:"Steel Art",
                    images:[]
                }

            };


            manifest.sha=null;

        }



        // Check project exists

        if(!manifest.data[project]){

            throw new Error(
                "Project not found: "+project
            );

        }



        const uploaded=[];



        for(const file of files){


            const base64 =
            await fileToBase64(file);



            const filename =
            Date.now()
            +
            "-"
            +
            sanitizeFilename(file.name);



            const path =
            `${CONFIG.IMAGE_FOLDER}/${project}/${filename}`;



            await putImageFile(

                path,

                base64,

                "Upload gallery image"

            );



            uploaded.push(path);


        }



        manifest.data[project].images.push(
            ...uploaded
        );



        await putJsonFile(

            CONFIG.MANIFEST_PATH,

            manifest.data,

            manifest.sha,

            "Update gallery data"

        );



        toast(
            "Images uploaded successfully"
        );


    }
    catch(error){


        toast(
            error.message,
            true
        );


    }

}
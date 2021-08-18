import Video from "../models/Video"; 

/* 
console.log("start")
Video.find({},(error, videos)=>{
    if(error){
        return res.render("server-error")
    }
    return res.render("home", {pageTitle: "Home", videos});
});
console.log("finish")
*/
//async js의 위에서 아래로 실행하여 callback이 빠른 순으로부터 실행하나 async와 await를 사용하게 되면 기다림.
export const home = async (req,res) => {
    //await는 db를 기다려 주는 함수
    const videos = await Video.find({}).sort({title: "asc"});
    return res.render("home",{pageTitle : "Home", videos});
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", { pageTitle: "Vdieo not found."});    
    }
    return res.render("watch", { pageTitle: video.title, video});

};

export const getEdit = async (req, res)=> {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.render("404", { pageTitle: "Video not found."});    
    }
    return res.render("edit", {pageTitle :`Editing ${video.title}`, video});
};

export const postEdit = async(req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id : id});
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    await Video.findByIdAndUpdate(id, {
        title, 
        description, 
        hashtags: Video.formatHashtags(hashtags),
    })
    return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await Video.findByIdAndDelete(id);

    return res.redirect("/")
};

export const getUpload = (req, res) => {
    return res.render("upload",{pageTitle : `Upload video `});
};

export const postUpload = async(req, res) => {
    //here we will add a vdieo to the videos array.
    const { path:fileUrl } = req.file;
    const {title,  description, hashtags} = req.body;

    try{
        await Video.create ({
            title,
            description,
            fileUrl,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    }catch(error){
        console.log(error);
        return res.status(400).render("upload", {pageTitle: "Upload Video", errorMessage: error._message,});
    }
};

export const search = async (req, res) => {
    const {keyword} = req.query;

    let videos =[];
    
    if(keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"), //i 옵션은 대소문자 구문 x 
            },
        });
    }
    return res.render("search", {pageTitle:"Search", videos});
}
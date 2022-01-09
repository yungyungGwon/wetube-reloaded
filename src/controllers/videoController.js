import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
import { ContextExclusionPlugin } from "webpack";

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
export const home = async (req, res) => {
  //await는 db를 기다려 주는 함수
  const videos = await Video.find({}).sort({ title: "asc" }).populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  const videos = await Video.find({}).sort({ title: "asc" }).populate("owner");
  
  /*console.log(video);*/
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Vdieo not found." });
  }
  return res.render("watch", { pageTitle: video.title, video, videos});
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findOne({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `Upload video ` });
};

export const postUpload = async (req, res) => {
  //here we will add a vdieo to the videos array.
  const {
    user: { _id },
  } = req.session;

  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : video[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const search = async (req, res) => {
  const { keyword } = req.query;

  let videos = [];

  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"), //i 옵션은 대소문자 구문 x
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos, keyword });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  console.log(comment.owner.avatarUrl);
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  //파라미터로 던진 commentId id변수로 받음.
  const { id } = req.params;
  //sessionId를 통해 로그인 userId를 구함.
  const {
    user: { _id },
  } = req.session;

  //Comment collection에서 파라미터 값이랑 동일한 commentId가 있는지 확인.
  const comment = await Comment.findById(id);

  //commentId가 존재한다면 commentId의 OwnerId와 삭제하고자 하는 UserId가 동일한지 비교.
  if (String(comment.owner) !== String(_id)) {
    return res.sendStatus(404);
  }
  //위 if문을 통해 동일하면 해당 코멘트 삭제.
  await Comment.findByIdAndDelete(id);

  return res.sendStatus(201);
};

import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

//console.log(process.cwd());//현재 작업 디렉토리를 알려주는 명령어

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); //view engine  tpxld ans
app.set("views", process.cwd() + "/src/views"); //디폴트 디렉토리가 아닌 설정 디렉토리에서 views에서 파일을 불러옴.
app.use(logger);
app.use(express.urlencoded({ extended: true })); //express application이 form의 value들을 이해할 수 있도록 하고, js형식으로 변경해줌.
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use((req, res, next) => {
  //res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  //res.header("Cross-Origin-Embedder-Policy", "cross-origin");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
/*app.use((req,res,next) => {
    req.sessionStore.all((error, sessions) => {
        console.log(sessions);
        next();
    });
});
reload 숫자를 알려줌
app.get("/add-one", (req,res,next) => {
    req.session.potato += 1;
    return res.send(`${req.session.id}\n ${req.session.potato}`);
});*/
app.use(flash());
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/core", express.static("node_modules/@ffmpeg/core/dist"));

export default app;

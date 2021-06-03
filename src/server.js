import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import usersRouter from "./routers/userRouter";

const PORT = 4000;

//console.log(process.cwd());//현재 작업 디렉토리를 알려주는 명령어

const app = express();
const logger= morgan("dev");

app.set("view engine","pug");//view engine  tpxld ans
app.set("views", process.cwd() +"/src/views");//디폴트 디렉토리가 아닌 설정 디렉토리에서 views에서 파일을 불러옴. 
app.use(logger);
app.use(express.urlencoded({extended:true}));//express application이 form의 value들을 이해할 수 있도록 하고, js형식으리ㅗ 변경해줌.   
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", usersRouter); 

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT,handleListening);

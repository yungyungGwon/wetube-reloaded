import express from "express";
import {join, login} from "../controllers/userController";
import {trending, search} from "../controllers/videoController"; 

const globalRouter = express.Router();

globalRouter.get("/", trending); //videoRouter
globalRouter.get("/join", join); //userRouter
globalRouter.get("/login", login);
export default globalRouter;

//Router : 엔드포인트와 해당 엔드포인트에서 실행되야 할 로직을 연결해주는 역할
//Controller : 미들웨어의 일종이지만 메인 로직을 담당하므로 분리해서 관리
//Middleware : 메인 로직의 컨트롤러 앞뒤로 추가적인 일을 담당

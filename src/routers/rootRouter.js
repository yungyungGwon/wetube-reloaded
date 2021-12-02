import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home); //videoRouter
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);
export default rootRouter;

//Router : 엔드포인트와 해당 엔드포인트에서 실행되야 할 로직을 연결해주는 역할
//Controller : 미들웨어의 일종이지만 메인 로직을 담당하므로 분리해서 관리
//Middleware : 메인 로직의 컨트롤러 앞뒤로 추가적인 일을 담당

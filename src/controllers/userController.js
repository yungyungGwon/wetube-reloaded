export const join = (req, res) => res.send("Join");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Log in");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User"); 

//Router : 엔드포인트와 해당 엔드포인트에서 실행되야 할 로직을 연결해주는 역할
//Controller : 미들웨어의 일종이지만 메인 로직을 담당하므로 분리해서 관리
//Middleware : 메인 로직의 컨트롤러 앞뒤로 추가적인 일을 담당

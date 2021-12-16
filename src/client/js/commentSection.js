const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComment = document.getElementById("video__comment");
const deleteCommentList = document.querySelectorAll("#deleteComment");
const commentAdd = document.getElementById("wirteComment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment-dots";
  const span = document.createElement("span");
  span.innerText = `${text}`;
  const icon2 = document.createElement("i");
  icon2.className = "fas fa-trash-alt";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(icon2);
  videoComments.prepend(newComment); //prepend()는 reverse()기능과 유사하다.
  //추가한 comment는 세션 리로드 없이는 삭제가 이뤄지지 않는 문제를 아래 클릭이벤트로 해결.
  videoComments.addEventListener("click", handleDeleteComment);
};

const handleSubmit = async (event) => {
  event.preventDefault(); //브라우저가 항상 하는 행동을 멈추게 하는 함수
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDeleteComment = async (event) => {
  //commentId를 파라미터 값으로 던지기
  const commentId = event.target.parentElement.dataset.id;
  event.target.parentElement.remove();
  await fetch(`/api/videos/${commentId}/delete`, {
    method: "DELETE",
  });
};

const handleTextarea = (event) => {
  let height = commentAdd.scrollHeight; // 높이
  commentAdd.style.height = `${height - 20}px`;
  
};
//handleSumbit Event
if (form) {
  form.addEventListener("submit", handleSubmit);
}

//handledeleteComment Event
for (const deletecomment of deleteCommentList) {
  deletecomment.addEventListener("click", handleDeleteComment);
}
commentAdd.addEventListener("keydown", handleTextarea);
//commentAdd.addEventListener("keyup", handleTextarea);

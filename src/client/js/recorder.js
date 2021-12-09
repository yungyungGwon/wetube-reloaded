const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
    const a = documnet.createElment("a");
    a.href = videoFile;
    a.download = "MyRecording.webm"; //확장자를 지정해줘야 다운로드 시 text파일이 열리지 않음!
    document.body.appendChild(a);
    a.click();
}

const handleStop = () => {
  startBtn.innerText = "Start Recording";
  startBtn.addEventListener("click", handleStart);
  startBtn.removeEventListener("click", handleDownload);
  setTimeout(() => {
    recorder.stop();
  }, 1000);
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream); //녹화 하기
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 200, height: 200 },
  });
  video.srcObject = stream;
  video.play();
};

init();
startBtn.addEventListener("click", handleStart);

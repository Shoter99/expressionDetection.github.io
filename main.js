const video = document.getElementById("video")
const btn = document.querySelector("button")
var isOn = false

btn.addEventListener('click', enableVideo)

function enableVideo(){
    if(isOn){
        const canvas = document.querySelector("canvas")
        video.style.display="none"
        video.pause()

    }
    else{
        
        video.style.display="flex"
        video.play()
    }
    isOn = !isOn
}


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo(){
    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.getElementById("video-wrapper").append(canvas)
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () =>{
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi
            .TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            console.log(detections)
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 50)
})
video.addEventListener('pause', () => {
    const canvas = document.querySelector('canvas')
    canvas.remove()
})
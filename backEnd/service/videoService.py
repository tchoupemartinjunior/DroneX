from flask import Response
import cv2


def gen_frames():
    camera = cv2.VideoCapture(0) # webcam
    while True:
        success, frame = camera.read()  # read the camera frame
   
        resize = cv2.resize(frame, (500, 200))
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', resize)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result


def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


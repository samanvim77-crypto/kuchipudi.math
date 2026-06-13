import cv2
import os

video_path = "images/kuchipudi_dancer_video.mp4"
cap = cv2.VideoCapture(video_path)

face_cascade_path = os.path.join(cv2.data.haarcascades, 'haarcascade_frontalface_default.xml')
face_cascade = cv2.CascadeClassifier(face_cascade_path)

if not cap.isOpened():
    print("Error opening video")
    exit(1)

total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.FPS) if hasattr(cap, 'FPS') else cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

print(f"Video Info: {width}x{height}, {total_frames} frames, {fps} FPS")

detected = 0
for i in range(0, total_frames, int(fps)):  # Check 1 frame per second
    cap.set(cv2.CAP_PROP_POS_FRAMES, i)
    ret, frame = cap.read()
    if not ret:
        break
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    if len(faces) > 0:
        detected += 1

print(f"Detected faces in {detected} out of {int(total_frames/fps)} checked frames")
cap.release()

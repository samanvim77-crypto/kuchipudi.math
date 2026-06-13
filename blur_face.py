import cv2
import os

video_path = 'images/kuchipudi_dancer_video.mp4'
output_path = 'images/kuchipudi_dancer_video_blurred.mp4'

cap = cv2.VideoCapture(video_path)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

face_cascade_path = os.path.join(cv2.data.haarcascades, 'haarcascade_frontalface_default.xml')
face_cascade = cv2.CascadeClassifier(face_cascade_path)

last_rect = None

print(f"Processing video: {width}x{height} at {fps} fps")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) > 0:
        last_rect = faces[0]
    
    if last_rect is not None:
        x, y, w, h = last_rect
        x1 = max(0, x - int(w * 0.2))
        y1 = max(0, y - int(h * 0.2))
        x2 = min(width, x + int(w * 1.2))
        y2 = min(height, y + int(h * 1.2))

        if x2 > x1 and y2 > y1:
            face_region = frame[y1:y2, x1:x2]
            blurred_face = cv2.GaussianBlur(face_region, (99, 99), 30)
            frame[y1:y2, x1:x2] = blurred_face

    out.write(frame)

cap.release()
out.release()
print("Face blurring completed! Video saved to", output_path)

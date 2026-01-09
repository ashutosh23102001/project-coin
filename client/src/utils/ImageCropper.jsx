import Cropper from "react-easy-crop";
import { useState } from "react";
import "./ImageCropper.css"; // ✅ REQUIRED

const ImageCropper = ({ image, aspect, onDone, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const onCropComplete = (_, pixels) => {
    setCroppedPixels(pixels);
  };

  const createBlob = async () => {
    if (!croppedPixels) return;

    const img = new Image();
    img.src = image;
    await new Promise(res => (img.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = croppedPixels.width;
    canvas.height = croppedPixels.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      croppedPixels.x,
      croppedPixels.y,
      croppedPixels.width,
      croppedPixels.height,
      0,
      0,
      croppedPixels.width,
      croppedPixels.height
    );

    canvas.toBlob(blob => blob && onDone(blob), "image/jpeg", 0.9);
  };

  return (
    <div className="cropper-overlay">
      <div className="cropper-container">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />

        <div className="cropper-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={createBlob} disabled={!croppedPixels}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;

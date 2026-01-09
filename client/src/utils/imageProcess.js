// // src/utils/imageProcess.js

// export async function processImage(
//   file,
//   targetWidth,
//   targetHeight,
//   blurBackground = false
// ) {
//   const img = document.createElement("img");
//   img.src = URL.createObjectURL(file);

//   await new Promise((res) => (img.onload = res));

//   const canvas = document.createElement("canvas");
//   canvas.width = targetWidth;
//   canvas.height = targetHeight;

//   const ctx = canvas.getContext("2d");

//   // 🧠 Auto-center crop
//   const imgRatio = img.width / img.height;
//   const targetRatio = targetWidth / targetHeight;

//   let sx, sy, sw, sh;

//   if (imgRatio > targetRatio) {
//     sh = img.height;
//     sw = sh * targetRatio;
//     sx = (img.width - sw) / 2;
//     sy = 0;
//   } else {
//     sw = img.width;
//     sh = sw / targetRatio;
//     sx = 0;
//     sy = (img.height - sh) / 2;
//   }

//   // 🖼 Blur background
//   if (blurBackground) {
//     ctx.filter = "blur(20px)";
//     ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
//     ctx.filter = "none";
//   }

//   // 🎯 Draw focused image
//   ctx.drawImage(
//     img,
//     sx,
//     sy,
//     sw,
//     sh,
//     0,
//     0,
//     targetWidth,
//     targetHeight
//   );

//   return new Promise((resolve) =>
//     canvas.toBlob(
//       (blob) =>
//         resolve(
//           new File([blob], file.name, { type: "image/jpeg" })
//         ),
//       "image/jpeg",
//       0.9
//     )
//   );
// }

export const processImage = async (file, width, height) => {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  await new Promise(res => (img.onload = res));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(new File([blob], "cover.jpg", { type: "image/jpeg" }));
    }, "image/jpeg", 0.9);
  });
};

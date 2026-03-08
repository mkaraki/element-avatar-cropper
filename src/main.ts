import "./style.scss";
import Cropper from "cropperjs";

const MAX_SIZE = 120;

const fileInput = document.getElementById("fileInput") as HTMLInputElement;
let cropperView = document.getElementById("cropperView") as HTMLImageElement;
const cropperViewContainer = document.getElementById(
  "cropperViewContainer",
) as HTMLDivElement;
const dlAvaterBtn = document.getElementById("dl-avater") as HTMLButtonElement;
const elementSizings = document.getElementsByClassName("element-sizings")[0];
const darkCheck = document.getElementById("darkCheck") as HTMLInputElement;

darkCheck.onchange = () => {
  if (darkCheck.checked) {
    elementSizings.classList.add("dark");
  } else {
    elementSizings.classList.remove("dark");
  }
};

const resetCropperView = () => {
  cropperViewContainer.innerHTML = "";
  cropperView = document.createElement("img");
  cropperView.id = "cropperView";
  // p-image-container__image cropper-view
  cropperView.classList.add("cropper-view");
  cropperView.classList.add("p-image-container__image");
  cropperViewContainer.appendChild(cropperView);
};

const prepareCropperView = () => {
  const cropper = new Cropper(cropperView, {
    template: `
<cropper-canvas background class="cropper-view">
  <cropper-image initial-center-size="contain" style="width: 100%; height: 100%;" rotatable scalable skewable translatable></cropper-image>
  <cropper-shade hidden></cropper-shade>
  <cropper-handle action="move" plain></cropper-handle>
  <cropper-selection initial-coverage="0.8" movable resizable aspect-ratio="1" initial-aspect-ratio="1">
    <cropper-grid role="grid" bordered covered></cropper-grid>
    <cropper-crosshair centered></cropper-crosshair>
    <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
    <cropper-handle action="n-resize"></cropper-handle>
    <cropper-handle action="e-resize"></cropper-handle>
    <cropper-handle action="s-resize"></cropper-handle>
    <cropper-handle action="w-resize"></cropper-handle>
    <cropper-handle action="ne-resize"></cropper-handle>
    <cropper-handle action="nw-resize"></cropper-handle>
    <cropper-handle action="se-resize"></cropper-handle>
    <cropper-handle action="sw-resize"></cropper-handle>
  </cropper-selection>
</cropper-canvas>`,
  });

  const cropperSelection = cropper.getCropperSelection();
  const cropperImage = cropper.getCropperImage();
  
  if (cropperSelection === null || cropperImage === null) {
    alert("処理系エラー: クロッピングシステムの要素を取得できませんでした。");
    return;
  }

  const onChange = async () => {
    dlAvaterBtn.disabled = true;

    const canvas: HTMLCanvasElement = await cropperSelection.$toCanvas({
      width: MAX_SIZE,
      height: MAX_SIZE,
    });
    const dataUrl = canvas.toDataURL("image/webp", 0.5);

    document.querySelectorAll(".element-sizings img").forEach((v: any) => {
      v = v as HTMLImageElement;
      v.src = dataUrl;
    });

    dlAvaterBtn.onclick = () => {
      var image = dataUrl.replace("image/png", "image/octet-stream");
      var link = document.createElement("a");
      link.download = "avater_image.webp";
      link.href = image;
      link.click();
    };
    dlAvaterBtn.disabled = false;
  };

  cropperSelection.addEventListener("change", onChange);
  cropperImage.addEventListener("transform", onChange);
};

fileInput.addEventListener("change", (event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (cropperView.src) resetCropperView();

      cropperView.src = e.target?.result as string;

      if (cropperView.parentElement?.classList.contains("hide"))
        cropperView.parentElement?.classList.remove("hide");

      setTimeout(prepareCropperView, 0);

      location.hash = "cropperViewContainer";
    };
    reader.readAsDataURL(file);
  }
});

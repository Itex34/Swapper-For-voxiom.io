(function () {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.padding = "10px";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    container.style.color = "white";
    container.style.zIndex = "9999";
    document.body.appendChild(container);

    //upload button
    const uploadLabel = document.createElement("label");
    uploadLabel.textContent = "Upload Custom Skin:";
    uploadLabel.style.display = "block";
    uploadLabel.style.marginBottom = "5px";
    container.appendChild(uploadLabel);

    const uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.accept = "image/png, image/jpeg";
    uploadInput.style.marginBottom = "10px";
    container.appendChild(uploadInput);

    //reset button
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset to Default Skin";
    resetButton.style.marginTop = "5px";
    resetButton.style.padding = "5px";
    resetButton.style.cursor = "pointer";
    container.appendChild(resetButton);

    //handle image upload
    uploadInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        //validate file type and size
        if (!["image/png", "image/jpeg"].includes(file.type)) {
            alert("Invalid file type. Please upload a PNG or JPEG image.");
            return;
        }
        if (file.size > 1024 * 1024) {
            alert("File size too large. Please upload an image smaller than 1MB.");
            return;
        }

        //load and store the image
        const reader = new FileReader();
        reader.onload = function () {
            const imageUrl = reader.result; //base64 URL
            localStorage.setItem("customSkin", imageUrl);
            alert("Custom skin uploaded successfully!");
        };
        reader.readAsDataURL(file);
    });

    //handle reset button
    resetButton.addEventListener("click", () => {
        localStorage.removeItem("customSkin");
        alert("Skin reset to default!");
        location.reload();
    });

    //override WebGLRenderingContext
    if (window.WebGLRenderingContext) {
        const originalTexImage2D = WebGLRenderingContext.prototype.texImage2D;

        WebGLRenderingContext.prototype.texImage2D = function (...args) {
            const customSkin = localStorage.getItem("customSkin");
            const source = args[5];

            if (customSkin && source instanceof HTMLImageElement) {
                const customImage = new Image();
                customImage.src = customSkin;

                //wait for the image to load before applying it
                customImage.onload = () => {
                    args[5] = customImage;
                    originalTexImage2D.apply(this, args);
                };
            } else {
                originalTexImage2D.apply(this, args);
            }
        };
    }
})();


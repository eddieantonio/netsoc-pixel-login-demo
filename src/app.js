const palette = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
    "#FF00FF",
    "#C0C0C0",
    "#808080",
];

init();
async function init() {
    const imgElement = document.getElementById("logo");
    const header = imgElement.parentElement;

    let bitmap = await createImageBitmap(imgElement);
    const width = bitmap.width;
    const height = bitmap.height;

    // Create a canvas and blit the image to it.
    let canvas = document.createElement("canvas");
    canvas.width = width
    canvas.height = height;
    header.appendChild(canvas);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    // Remove the original image.
    header.removeChild(imgElement);

    // How's that for progressive enhancement!

    // Every frame, change a random pixel to a random color.
    let loop = () => {
        drawRandomPixel();
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    function drawRandomPixel() {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const color = randomChoice(palette);

        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


/**
 * Smooths a ratio between 0 and 1.
 * See what the function looks like: https://www.desmos.com/calculator/yejbljkzfy
 */
function ease(x) {
    return (1 + Math.atan(Math.PI * (x - .5))) / 2;
}

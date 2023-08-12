const palette = [
    "#FFFFFF",
    "#191919",
    "#EB5529",
    "#F2AC00",
    "#F9D758",
    "#5AC75C",
    "#508EE3",
    "#A750BA",
];

init();
async function init() {
    const imgElement = document.getElementById("logo");
    const header = imgElement.parentElement;

    const bitmap = await createImageBitmap(imgElement);
    const width = bitmap.width;
    const height = bitmap.height;
    const pixelCount = width * height;

    // Play around with these:
    const maximumMessedUpPixels = pixelCount * 0.0075;
    const probabilityOfModifyingAPixel = 0.2; // per frame

    // Create a canvas, copying the image's attributes...
    const canvas = document.createElement("canvas");
    canvas.width = width
    canvas.height = height;
    canvas.classList.add("logo");
    canvas.setAttribute("aria-label", imgElement.getAttribute("alt"));
    header.appendChild(canvas);

    /// ...and blit the image to it:
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    // Hide the original image.
    imgElement.style.display = "none";
    // The canvas has replaced the static logo image.
    // How's that for progressive enhancement!

    // Clone the image data, so that we can restore the pixels.
    const originalImageData = cloneImageDataFromContext(ctx);
    // Keep track of which pixels we've messed up.
    const messedUpPixels = [];

    // Okay, time for the animation:
    requestAnimationFrame(loop);
    function loop() {
        if (Math.random() < probabilityOfModifyingAPixel) {
            modifyOnePixel();
        }
        requestAnimationFrame(loop);
    };

    /* ===================================================================== */

    /**
     * Either mess up or restore a single pixel.
     */
    function modifyOnePixel() {
        if (shouldMessUpAPixel()) {
            // Mess up a random pixel
            const { x, y, color } = randomPixel();
            messedUpPixels.push({ x, y });
            drawPixel(x, y, color);
        } else {
            // Restore a pixel from the original image data.
            const { x, y } = randomPop(messedUpPixels);
            ctx.putImageData(originalImageData, 0, 0, x, y, 1, 1);
        }
    }

    /**
     * @returns {boolean} true if a pixel should be messed up, false if a pixel
     * should be restored
     */
    function shouldMessUpAPixel() {
        // Always mess up a pixel if the canvas is clean.
        if (messedUpPixels.length === 0) return true;
        // Never mess up a pixel if the canvas is too messed up.
        if (messedUpPixels.length >= maximumMessedUpPixels) return false;

        // Smoothly increase the probability of cleaning up a pixel.
        const ratio = messedUpPixels.length / maximumMessedUpPixels;
        const random = Math.random();
        return random > ease(ratio);
    }

    /**
     * Returns a random pixel's x & y coordinate and a random color.
     */
    function randomPixel() {
        return {
            x: randomZeroTo(width),
            y: randomZeroTo(height),
            color: randomChoice(palette),
        };
    }

    /**
     * Draw a single pixel on the canvas.
     *
     * @param {number} x x-coordinate of the pixel
     * @param {number} y y-coordinate of the pixel
     * @param {string} color color of the pixel as a CSS color string
     */
    function drawPixel(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }
}

/**
 * Makes a copy of the image data from the canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx 
 * @returns {ImageData} a copy of the image data
 */
function cloneImageDataFromContext(ctx) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const newImageData = ctx.createImageData(imageData);
    newImageData.data.set(imageData.data);
    return newImageData;
}

/**
 * Smooths a ratio between 0 and 1.
 * See what the function looks like: https://www.desmos.com/calculator/yejbljkzfy
 */
function ease(x) {
    return (1 + Math.atan(Math.PI * (x - .5))) / 2;
}

/**
 * Returns a random element from the array.
 *
 * @param {Array<T>} arr
 * @returns {T} a random element from the array
 */
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a random integer between 0 and max, excluding max.
 *
 * @param {number} max upper bound (exclusive)
 * @returns {number} a random integer in [0, max)
 */
function randomZeroTo(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Pops a random element from the array. Will rearrange the array.
 * 
 * @param {Array<T>} arr
 * @returns {T} a random element from the array
 */
function randomPop(arr) {
    // Get a random position in the array.
    const index = randomZeroTo(arr.length);
    // This is what we're ultimately going to return.
    const choice = arr[index];
    // However... we need to swap it with the last element in the array.
    const replacement = arr.pop();
    arr[index] = replacement;

    // There we go! O(1) pop from a random position in the array.
    return choice;
}
document.addEventListener('DOMContentLoaded', function () {
    const movingImage = document.getElementById('myImage');
    const animation = movingImage.getAnimations();
    console.log(movingImage);
    console.log(animation);

    movingImage.addEventListener('animationiteration', function () {
        const keyframes = animation[0].effect.getKeyframes(); // Assuming there is only one animation in the list

        // Check if the keyframes contain a keyframe at 75%
        //   console.log(keyframes);
        if (keyframes.some(frame => frame.offset === 1)) {
            var randomImageNumber = Math.floor(Math.random() * 3) + 1;
            var newImageSrc = "Hakos" + randomImageNumber + ".png";
            movingImage.src = newImageSrc;
        }
    });
});

(function mahmoudCat() {

    const catElement = document.createElement("div");

    let catPosX = 32;
    let catPosY = 32;

    let cursorX = 0;
    let cursorY = 0;

    let animationFrameCount = 0;

    let idleCounter = 0;
    let currentIdleState = null;
    let idleFrameIndex = 0;

    const movementSpeed = 10;

    const spriteMap = {
        idle: [[-3, -3]],
        alert: [[-7, -3]],
        scratch: [
            [-5, 0],
            [-6, 0],
            [-7, 0],
        ],
        tired: [[-3, -2]],
        sleeping: [
            [-2, 0],
            [-2, -1],
        ],
        N: [[-1, -2], [-1, -3]],
        NE: [[0, -2], [0, -3]],
        E: [[-3, 0], [-3, -1]],
        SE: [[-5, -1], [-5, -2]],
        S: [[-6, -3], [-7, -2]],
        SW: [[-5, -3], [-6, -1]],
        W: [[-4, -2], [-4, -3]],
        NW: [[-1, 0], [-1, -1]],
    };

    function initCat() {
        catElement.id = "mahmoud-cat";

        catElement.style.width = "32px";
        catElement.style.height = "32px";
        catElement.style.position = "fixed";

        catElement.style.backgroundImage = "url('./cat.gif')";
        catElement.style.imageRendering = "pixelated";

        catElement.style.left = "16px";
        catElement.style.top = "16px";

        document.body.appendChild(catElement);

        document.onmousemove = (event) => {
            cursorX = event.clientX;
            cursorY = event.clientY;
        };

        window.catLoop = setInterval(updateFrame, 100);
    }

    function updateSprite(state, frame) {
        const sprite = spriteMap[state][frame % spriteMap[state].length];

        catElement.style.backgroundPosition = `
            ${sprite[0] * 32}px ${sprite[1] * 32}px
        `;
    }

    function resetIdleState() {
        currentIdleState = null;
        idleFrameIndex = 0;
    }

    function handleIdleState() {
        idleCounter++;

        if (
            idleCounter > 10 &&
            Math.floor(Math.random() * 200) === 0 &&
            currentIdleState === null
        ) {
            currentIdleState = ["sleeping", "scratch"][
                Math.floor(Math.random() * 2)
            ];
        }

        switch (currentIdleState) {
            case "sleeping":
                if (idleFrameIndex < 8) {
                    updateSprite("tired", 0);
                    break;
                }

                updateSprite("sleeping", Math.floor(idleFrameIndex / 4));

                if (idleFrameIndex > 192) {
                    resetIdleState();
                }
                break;

            case "scratch":
                updateSprite("scratch", idleFrameIndex);

                if (idleFrameIndex > 9) {
                    resetIdleState();
                }
                break;

            default:
                updateSprite("idle", 0);
                return;
        }

        idleFrameIndex++;
    }

    function updateFrame() {
        animationFrameCount++;

        const deltaX = catPosX - cursorX;
        const deltaY = catPosY - cursorY;

        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        if (distance < movementSpeed || distance < 48) {
            handleIdleState();
            return;
        }

        currentIdleState = null;
        idleFrameIndex = 0;

        if (idleCounter > 1) {
            updateSprite("alert", 0);

            idleCounter = Math.min(idleCounter, 7);
            idleCounter--;

            return;
        }

        let direction = "";

        direction += deltaY / distance > 0.5 ? "N" : "";
        direction += deltaY / distance < -0.5 ? "S" : "";
        direction += deltaX / distance > 0.5 ? "W" : "";
        direction += deltaX / distance < -0.5 ? "E" : "";

        updateSprite(direction, animationFrameCount);

        catPosX -= (deltaX / distance) * movementSpeed;
        catPosY -= (deltaY / distance) * movementSpeed;

        catElement.style.left = `${catPosX - 16}px`;
        catElement.style.top = `${catPosY - 16}px`;
    }

    initCat();

})();
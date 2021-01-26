const colors = [];
colors[-1] = "#ff00ee";
colors[0] = "#ffffff";
colors[1] = "#F00000";
colors[2] = "#429bf4";
colors[3] = "#42f453";
colors[4] = "#ef950e";

const map = [
    [2, 2, 1, 2, 1, 1, 2],
    [2, 0, 0, 0, 0, 0, 2],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 4],
    [1, 0, 0, 3, 1, 0, 4],
    [1, 0, 0, 0, 0, 0, 4],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 4, 3, 4, 0, 4, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 2, 2, 2, 1]
];

const turningSpeed = 15;
const movementSpeed = 0.25;

const initialPosition = new Vector2D(2, 2);
const initialAngle = 0;
const player = new Player(initialPosition, initialAngle);

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) {
        player.rotate(-turningSpeed);
    } else if (event.keyCode == 68) {
        player.rotate(turningSpeed);
    } else if (event.keyCode == 87) {
        player.move(movementSpeed);
    } else if (event.keyCode == 83) {
        player.move(-movementSpeed);
    }
}, true);

const minimap = document.getElementById("minimapCanvas");
const minimapContext = minimap.getContext("2d");
const minimapWidth = minimap.width;
const minimapHeight = minimap.height;
const minimapCellWidth = minimapWidth / map.length;
const minimapCellHeight = minimapHeight / map[0].length;

const viewport = document.getElementById("viewportCanvas");
const viewportContext = viewport.getContext("2d");
const viewportWidth = viewport.width;
const viewportHeight = viewport.height;

setInterval(function () {
    drawMinimapGrid(map, minimapContext, minimapWidth, minimapHeight);
    drawPlayerOnMinimap(minimapContext, player);
    drawRectangle(viewportContext, viewportWidth, viewportHeight, "#000000");
    renderView(map);
}, 10);

function renderView(map) {
    for (screenX = 1; screenX <= viewportWidth; screenX++) {

        //Calculate ray direction
        const positionInPane = (2 * screenX / viewportWidth) - 1;
        const rayDir = new Vector2D(
            player.direction.x + (player.cameraPlane.x * positionInPane),
            player.direction.y + (player.cameraPlane.y * positionInPane)
        );

        // Raycast
        const rayPos = new Vector2D(player.position.x, player.position.y);
        const nextStep = new Vector2D(null, null);

        // Compute first step
        if (rayDir.x < 0) {
            nextStep.x = Math.floor(rayPos.x);
        } else {
            nextStep.x = Math.ceil(rayPos.x);
        }

        if (rayDir.y < 0) {
            nextStep.y = Math.floor(rayPos.y);
        } else {
            nextStep.y = Math.ceil(rayPos.y);
        }


        let sideHit;
        let hitPosition;
        let hit = 0;
        while (hit == 0) {

            // Compute which side is the closest
            // X distance
            const xDeltaX = nextStep.x - rayPos.x;
            const xDeltaY = rayDir.y * xDeltaX / rayDir.x;
            const distanceX = Math.sqrt(Math.pow(xDeltaX, 2), Math.pow(xDeltaY, 2));
            // Y distance
            const yDeltaY = nextStep.y - rayPos.y;
            const yDeltaX = rayDir.x * yDeltaY / rayDir.y;
            const distanceY = Math.sqrt(Math.pow(yDeltaX, 2), Math.pow(yDeltaY, 2));

            if (distanceX <= distanceY) {
                sideHit = "x";
                hitPosition = new Vector2D(
                    rayPos.x + xDeltaX,
                    rayPos.y + xDeltaY
                );
            } else {
                sideHit = "y";
                hitPosition = new Vector2D(
                    rayPos.x + yDeltaX,
                    rayPos.y + yDeltaY
                );
            }

            // Check if the ray hit a wall
            try {
                if (sideHit == "x") {
                    if (rayDir.x < 0) {
                        hit = map[nextStep.x - 1][Math.floor(hitPosition.y)];
                    } else {
                        hit = map[nextStep.x][Math.floor(hitPosition.y)];
                    }
                } else {
                    if (rayDir.y < 0) {
                        hit = map[Math.floor(hitPosition.x)][nextStep.y - 1];
                    } else {
                        hit = map[Math.floor(hitPosition.x)][nextStep.y];
                    }
                }
            } catch (err) {
                hit = -1;
            }

            if (hit > 0) {
                drawDot(minimapContext, hitPosition.x * minimapCellWidth, hitPosition.y * minimapCellHeight);
            }

            // Compute ray forward movement
            if (sideHit == "x") {
                rayPos.x = rayPos.x + xDeltaX;
                rayPos.y = rayPos.y + xDeltaY;
            } else {
                rayPos.x = rayPos.x + yDeltaX;
                rayPos.y = rayPos.y + yDeltaY;
            }

            // Compute next step
            if (sideHit == "x") {
                if (rayDir.x < 0) {
                    nextStep.x -= 1;
                } else {
                    nextStep.x += 1;
                }

                if (rayDir.y < 0) {
                    nextStep.y = Math.floor(nextStep.y);
                } else {
                    nextStep.y = Math.ceil(nextStep.y);
                }
            } else {
                if (rayDir.x < 0) {
                    nextStep.x = Math.floor(nextStep.x);
                } else {
                    nextStep.x = Math.ceil(nextStep.x);
                }

                if (rayDir.y < 0) {
                    nextStep.y -= 1;
                } else {
                    nextStep.y += 1;
                }
            }

        }

        // Compute hit distance to player
        let hitDistance;
        if (sideHit == "x") {
            hitDistance = Math.abs(hitPosition.x - player.position.x) / rayDir.x;
        } else {
            hitDistance = Math.abs(hitPosition.y - player.position.y) / rayDir.y;
        }

        if (colors[hit] != undefined) {
            const columnHeight = viewportHeight / (hitDistance);
            const columnColor = sideHit == "y" ? shadeColor(colors[hit], -30):colors[hit];
            drawColumn(viewportContext, columnColor, screenX, viewportHeight, columnHeight);
        }
    }
}

function drawMinimapGrid(map, minimapContext, minimapWidth, minimapHeight) {
    minimapContext.clearRect(0, 0, minimapWidth, minimapHeight);

    const minimapCellWidth = minimapWidth / map.length;
    const minimapCellHeight = minimapHeight / map[0].length;

    for (x = 0; x < map.length; x++) {
        const currentColumn = minimapCellWidth * x;
        for (y = 0; y < map[0].length; y++) {
            const currentRow = minimapCellHeight * y
            minimapContext.lineWidth = 1;
            minimapContext.beginPath();
            minimapContext.moveTo(minimapCellWidth * x, 0);
            minimapContext.fillStyle = colors[map[x][y]];
            minimapContext.fillRect(currentColumn, currentRow, minimapCellWidth, minimapCellHeight);
            minimapContext.stroke();

            minimapContext.beginPath();
            minimapContext.moveTo(minimapCellWidth * x, 0);
            minimapContext.rect(currentColumn, currentRow, minimapCellWidth, minimapCellHeight);
            minimapContext.stroke();
        }
    }
}

function drawPlayerOnMinimap(minimapContext, player) {
    // Draw player circle
    minimapContext.beginPath();
    const radius = 10;
    minimapContext.arc(player.position.x * minimapCellWidth, player.position.y * minimapCellHeight, radius, 0, 2 * Math.PI);
    minimapContext.stroke();

    // Draw field of view
    // Front right
    const frontRightStart = [
        (player.position.x + player.direction.x) * minimapCellWidth,
        (player.position.y + player.direction.y) * minimapCellHeight
    ];
    const frontRightEnd = [
        (player.position.x + player.direction.x + player.cameraPlane.x) * minimapCellWidth,
        (player.position.y + player.direction.y + player.cameraPlane.y) * minimapCellHeight
    ];
    drawLine(minimapContext, frontRightStart, frontRightEnd, 4);

    // Right side
    const rightSideStart = [
        (player.position.x) * minimapCellWidth,
        (player.position.y) * minimapCellHeight
    ];
    const rightSideEnd = [
        (player.position.x + player.direction.x + player.cameraPlane.x) * minimapCellWidth,
        (player.position.y + player.direction.y + player.cameraPlane.y) * minimapCellHeight
    ];
    drawLine(minimapContext, rightSideStart, rightSideEnd, 4);

    // Front left
    const frontLeftStart = [
        (player.position.x + player.direction.x) * minimapCellWidth,
        (player.position.y + player.direction.y) * minimapCellHeight
    ];
    const frontLeftEnd = [
        (player.position.x + player.direction.x - player.cameraPlane.x) * minimapCellWidth,
        (player.position.y + player.direction.y - player.cameraPlane.y) * minimapCellHeight
    ];
    drawLine(minimapContext, frontLeftStart, frontLeftEnd, 4);

    // Left side
    const leftSideStart = [
        (player.position.x) * minimapCellWidth,
        (player.position.y) * minimapCellHeight
    ];
    const leftSideEnd = [
        (player.position.x + player.direction.x - player.cameraPlane.x) * minimapCellWidth,
        (player.position.y + player.direction.y - player.cameraPlane.y) * minimapCellHeight
    ];
    drawLine(minimapContext, leftSideStart, leftSideEnd, 4);
}

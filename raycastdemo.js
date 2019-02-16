var colors = [];
colors[0] = "#ffffff";
colors[1] = "#F00000";
colors[2] = "#429bf4";

var map = [
    [2, 2, 1, 2, 1, 2],
    [2, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1]
];

var turningSpeed = 15;
var movementSpeed = 0.25;

var playerPos = new Vector2D(1.5, 2);
var playerDir = new Vector2D(0, -1);
var cameraPlane = new Vector2D(1, 0);
var player = new Player(playerPos, playerDir, cameraPlane);

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

//TODO TEMP
player.rotate(-8);

var canvasMinimap = document.getElementById("minimapCanvas");
var ctxMinimap = canvasMinimap.getContext("2d");
var canvasMinimapWidth = canvasMinimap.width;
var canvasMinimapHeight = canvasMinimap.height;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;


var time = 0;   // TODO
var oldTime = 0;// TODO

setInterval(function () {
    drawMinimapGrid(map, ctxMinimap, canvasMinimapWidth, canvasMinimapHeight);
    drawMinimapPlayer(map, canvasMinimapWidth, canvasMinimapHeight, ctxMinimap, playerPos, playerDir, cameraPlane);
    drawBackground("#000000");    // Clear screen
    renderView(map);
}, 10);



function renderView(map) {
    for (screenX = 1; screenX <= canvasWidth; screenX++) {

        //Calculate ray direction TODO à simplifier
        var rayDir;
        if (screenX < canvasWidth / 2) {
            rayDir = new Vector2D(
                (player.cameraPlane.x / (canvasWidth / 2)) * screenX + player.direction.x - player.cameraPlane.x,
                (player.cameraPlane.y / (canvasWidth / 2)) * screenX + player.direction.y - player.cameraPlane.y
            );
        } else {
            rayDir = new Vector2D(
                (player.cameraPlane.x / (canvasWidth / 2)) * (screenX - canvasWidth / 2) + player.direction.x,
                (player.cameraPlane.y / (canvasWidth / 2)) * (screenX - canvasWidth / 2) + player.direction.y
            );
        }

        //Raycast
        var rayPos = new Vector2D(player.position.x, player.position.y);
        var nextStep = new Vector2D(null, null);

        //Calcul du premier step 
        if (rayDir.x < 0) {
            nextStep.x = Math.floor(rayPos.x) - 1;
        } else {
            nextStep.x = Math.ceil(rayPos.x);
        }

        if (rayDir.y < 0) {
            nextStep.y = Math.floor(rayPos.y) - 1;
        } else {
            nextStep.y = Math.ceil(rayPos.y);
        }

        if(nextStep.x < 0){
            nextStep.x = 0;
        }
        if(nextStep.y < 0){
            nextStep.y = 0;
        }

        var sideHit;
        var hitPosition;
        var hit = 0;
        while (hit == 0) {

            //Calculer quel side est le plus proche
            // Distance X
            var xdx = nextStep.x - rayPos.x;
            var xdy = rayDir.y * xdx / rayDir.x;
            var distanceX = Math.sqrt(Math.pow(xdx, 2), Math.pow(xdy, 2));
            // Distance Y
            var ydy = nextStep.y - rayPos.y;
            var ydx = rayDir.x * ydy / rayDir.y;
            var distanceY = Math.sqrt(Math.pow(ydx, 2), Math.pow(ydy, 2));

            if (distanceX <= distanceY) {
                sideHit = "x";
                hitPosition = new Vector2D(
                    rayPos.x + xdx,
                    rayPos.y + xdy
                );
            } else {
                sideHit = "y";
                hitPosition = new Vector2D(
                    rayPos.x + ydx,
                    rayPos.y + ydy
                );
            }


            //Checker hit
            if (sideHit == "x") {
                hit = map[nextStep.x][Math.floor(rayPos.y)];
            } else {
                hit = map[Math.floor(rayPos.x)][nextStep.y];
            }

            //Calcul du changement de position
            if (sideHit == "x") {
                rayPos.x = rayPos.x + xdx;
                rayPos.y = rayPos.y + xdy;
            } else {
                rayPos.x = rayPos.x + ydx;
                rayPos.y = rayPos.y + ydy;
            }

            //Calcul du next step
            if (sideHit == "x") {
                if (rayDir.x < 0) {
                    nextStep.x = rayPos.x - 1;
                } else {
                    nextStep.x = rayPos.x + 1;
                }

                if (rayDir.y < 0) {
                    nextStep.y = Math.floor(rayPos.y) - 1;
                } else {
                    nextStep.y = Math.ceil(rayPos.y);
                }
            } else {
                if (rayDir.x < 0) {
                    nextStep.x = Math.floor(rayPos.x) - 1;
                } else {
                    nextStep.x = Math.ceil(rayPos.x);
                }

                if (rayDir.y < 0) {
                    nextStep.y = rayPos.y - 1;
                } else {
                    nextStep.y = rayPos.y + 1;
                }
            }
            if(nextStep.x < 0){
                nextStep.x = 0;
            }
            if(nextStep.y < 0){
                nextStep.y = 0;
            }
        }

        //Calculer distance du hit pour le rendu
        var perpDistance;
        if (sideHit == "x") {
            perpDistance = Math.abs(hitPosition.x - player.position.x)/rayDir.x;
        } else {
            perpDistance = Math.abs(hitPosition.y - player.position.y)/rayDir.y;
        }

        var columnHeight = canvasHeight/(perpDistance);

        var columnColor = colors[hit];
        //TEMP
        if(columnColor == undefined){
            throw new Error('Whoops!');
        }

        //TEMP

        if(sideHit == "y"){
            columnColor = shadeColor(columnColor, -30);
        }
        drawColumn(columnColor, screenX, columnHeight);
    }
}

function drawBackground(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawColumn(color, xPos, columnHeight) {
    ctx.beginPath();
    var startPosY = (canvasHeight - columnHeight) / 2;
    var endPosY = startPosY + columnHeight;
    ctx.moveTo(xPos, startPosY);
    ctx.lineTo(xPos, endPosY);
    ctx.strokeStyle = color;
    ctx.stroke();
}



function drawMinimapGrid(map, minimapContext, minimapWidth, minimapHeight) {

    minimapContext.clearRect(0, 0, minimapWidth, minimapHeight);

    var minimapCellWidth = minimapWidth / map.length;
    var minimapCellHeight = minimapHeight / map[0].length;

    for (x = 0; x < map.length; x++) {
        var currentColumn = minimapCellWidth * x;
        for (y = 0; y < map[0].length; y++) {
            var currentRow = minimapCellHeight * y
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

function drawMinimapPlayer(map, minimapWidth, minimapHeight, minimapContext, playerPos, playerDir, cameraPlane) {
    var minimapCellWidth = minimapWidth / map.length;
    var minimapCellHeight = minimapHeight / map[0].length;

    //Dessiner player
    minimapContext.beginPath();
    var radius = 10;
    minimapContext.arc(player.position.x * minimapCellWidth, player.position.y * minimapCellHeight, radius, 0, 2 * Math.PI);
    minimapContext.stroke();

    //Dessiner ligne Dir 
    var start = [
        player.position.x * minimapCellWidth,
        player.position.y * minimapCellHeight
    ];
    var end = [
        (player.position.x + player.direction.x) * minimapCellWidth,
        (player.position.y + player.direction.y) * minimapCellHeight
    ];
    drawLine(minimapContext, start, end, 4);

    // Dessiner pane
    // Coté droit haut
    var start = [
        (player.position.x + player.direction.x) * minimapCellWidth,
        (player.position.y + player.direction.y) * minimapCellHeight
    ];
    var end = [
        (player.position.x + player.direction.x + player.cameraPlane.x) * minimapCellWidth,
        (player.position.y + player.direction.y + player.cameraPlane.y) * minimapCellHeight
    ];
    drawLine(minimapContext, start, end, 4);

    // Coté droit diagonal
    var start = [
        (player.position.x) * minimapCellWidth,
        (player.position.y) * minimapCellHeight
    ];
    var end = [
        (player.position.x + player.direction.x + player.cameraPlane.x) * minimapCellWidth,
        (player.position.y + player.direction.y + player.cameraPlane.y) * minimapCellHeight
    ];
    drawLine(minimapContext, start, end, 4);

    // Coté gauche haut
    var start = [
        (player.position.x + player.direction.x) * minimapCellWidth,
        (player.position.y + player.direction.y) * minimapCellHeight
    ];
    var end = [
        (player.position.x + player.direction.x - player.cameraPlane.x) * minimapCellWidth,
        (player.position.y + player.direction.y - player.cameraPlane.y) * minimapCellHeight
    ];
    drawLine(minimapContext, start, end, 4);

    // Coté gauche diagonal
    var start = [
        (player.position.x) * minimapCellWidth,
        (player.position.y) * minimapCellHeight
    ];
    var end = [
        (player.position.x + player.direction.x - player.cameraPlane.x) * minimapCellWidth,
        (player.position.y + player.direction.y - player.cameraPlane.y) * minimapCellHeight
    ];
    drawLine(minimapContext, start, end, 4);
}

function drawLine(context, start, end, width) {
    context.beginPath();
    context.moveTo(start[0], start[1]);
    context.lineWidth = width;
    context.lineTo(end[0], end[1]);
    context.stroke();
}

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}
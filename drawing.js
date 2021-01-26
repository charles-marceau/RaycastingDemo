function drawLine(context, start, end, width) {
    context.beginPath();
    context.moveTo(start[0], start[1]);
    context.lineWidth = width;
    context.lineTo(end[0], end[1]);
    context.stroke();
}

function drawRectangle(context, width, height, color) {
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
}

function drawColumn(context, color, xPosition, viewportHeight, columnHeight) {
    context.beginPath();
    var startPosY = (viewportHeight - columnHeight) / 2;
    var endPosY = startPosY + columnHeight;
    context.moveTo(xPosition, startPosY);
    context.lineTo(xPosition, endPosY);
    context.strokeStyle = color;
    context.stroke();
}

function drawDot(context, x, y) {
    const radius = 2;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = "black";
    context.fill();
}

function shadeColor(color, percent) {
    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function rotateVector(vector, angleDeg) {
    var angleRad = angleDeg * Math.PI / 180;
    var vectorR = new Vector2D(0, 0);
    vectorR.x = Math.cos(angleRad) * vector.x - Math.sin(angleRad) * vector.y;
    vectorR.y = Math.sin(angleRad) * vector.x + Math.cos(angleRad) * vector.y;
    return vectorR;
}
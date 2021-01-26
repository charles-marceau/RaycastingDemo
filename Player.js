class Player {
    constructor(position, directionDeg) {
        this.position = position;
        this.direction = new Vector2D(1, 0);
        this.direction.rotate(directionDeg);
        this.cameraPlane = this.direction.getPerpendicularVector();
    }

    rotate(angleDeg) {
        this.direction.rotate(angleDeg);
        this.cameraPlane.rotate(angleDeg);
    }

    move(distance) {
        var xRatio = this.direction.y / this.direction.x;
        var xComponent = findComponent(xRatio, distance);
        var yRatio = this.direction.x / this.direction.y;
        var yComponent = findComponent(yRatio, distance);
        if (distance < 0) {
            xComponent = -xComponent;
            yComponent = -yComponent;
        }
        if (this.direction.x < 0) {
            this.position.x -= xComponent;
        }
        else {
            this.position.x += xComponent;
        }
        if (this.direction.y < 0) {
            this.position.y -= yComponent;
        }
        else {
            this.position.y += yComponent;
        }
    }
}

function findComponent(ratio, distance) {
    return Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(ratio, 2)));
}
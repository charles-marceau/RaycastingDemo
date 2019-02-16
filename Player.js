class Player {
    constructor(vectorPos, vectorDir, vectorPlane) {
        this.position = vectorPos;
        this.direction = vectorDir;
        this.cameraPlane = vectorPlane;
    }

    rotate(angleDeg) {
        this.direction = rotateVector(this.direction, angleDeg);
        this.cameraPlane = rotateVector(this.cameraPlane, angleDeg);
    }

    move(distance) {
        //Trouver composante X
        var rapportX = this.direction.y / this.direction.x;
        var xComp = findComponent(rapportX, distance);
        //Trouver composante Y
        var rapportY = this.direction.x / this.direction.y;
        var yComp = findComponent(rapportY, distance);
        if (distance < 0) {
            xComp = -xComp;
            yComp = -yComp;
        }
        if (this.direction.x < 0) {
            this.position.x -= xComp;
        }
        else {
            this.position.x += xComp;
        }
        if (this.direction.y < 0) {
            this.position.y -= yComp;
        }
        else {
            this.position.y += yComp;
        }
    }

}



// Utils
function findComponent(rapport, distance) {
    return Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(rapport, 2)));
}
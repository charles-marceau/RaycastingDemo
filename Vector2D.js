class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    rotate(angleDeg) {
        const angleRad = angleDeg * Math.PI / 180;
        const rotatedX = Math.cos(angleRad) * this.x - Math.sin(angleRad) * this.y;
        const rotatedY = Math.sin(angleRad) * this.x + Math.cos(angleRad) * this.y;
        this.x = rotatedX;
        this.y = rotatedY;
    }

    normalize() {
        const length = this.length()
        this.x = this.x / length;
        this.y = this.y / length;
    }

    getPerpendicularVector() {
        return new Vector2D(-this.y, this.x);
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

}



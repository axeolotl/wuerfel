package net.wuenschenswert.wuerfel;

/**
 * Created by axel on 04.05.14.
 */
public class RotatedPlate implements Plate {
    Plate plate;
    Rotate2D rotate;

    public RotatedPlate(Plate plate, Rotate2D rotate) {
        this.plate = plate;
        this.rotate = rotate;
    }

    public boolean isSet(Point2D point) {
        return plate.isSet(rotate.inverseRotate(point));
    }

    public char getName() {
        return plate.getName();
    }
}

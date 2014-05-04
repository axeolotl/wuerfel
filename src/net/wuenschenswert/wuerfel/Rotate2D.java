package net.wuenschenswert.wuerfel;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by axel on 04.05.14.
 */
public class Rotate2D {
    int xx,xy,yx,yy;

    public Rotate2D(int xx, int xy, int yx, int yy) {
        this.xx = xx;
        this.xy = xy;
        this.yx = yx;
        this.yy = yy;
    }

    Point2D rotate(Point2D point) {
        return new Point2D(xx*point.getX()+xy*point.getY(), yx*point.getX()+yy*point.getY());
    }
    Point2D inverseRotate(Point2D point) {
        int x = xx * point.getX() + yx * point.getY();
        int y = xy * point.getX() + yy * point.getY();
        return new Point2D(x, y);
    }
    public static final List<Rotate2D> DEG_0_90_180_270 = Collections.unmodifiableList(Arrays.asList(
            new Rotate2D(1, 0, 0, 1),
            new Rotate2D(0, -1, 1, 0),
            new Rotate2D(-1, 0, 0, -1),
            new Rotate2D(0, 1, -1, 0)
    ));
}

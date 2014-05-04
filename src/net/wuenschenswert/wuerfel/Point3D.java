package net.wuenschenswert.wuerfel;

/**
 * Created by axel on 04.05.14.
 */
public class Point3D {
    private final int x,y,z;

    public Point3D(int x, int y, int z) {
        assert -2 <= x;
        assert x <= 2;
        assert -2 <= y;
        assert y <= 2;
        assert -2 <= z;
        assert z <= 2;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int getZ() {
        return z;
    }
}

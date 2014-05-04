package net.wuenschenswert.wuerfel;

/**
 * Created by axel on 04.05.14.
 */
public class Point2D {
    private final int x,y;

    public Point2D(int x, int y) {
        assert -2 <= x;
        assert x <= 2;
        assert -2 <= y;
        assert y <= 2;
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Point2D point2D = (Point2D) o;

        if (x != point2D.x) return false;
        if (y != point2D.y) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = x;
        result = 31 * result + y;
        return result;
    }
}

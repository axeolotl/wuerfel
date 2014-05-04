package net.wuenschenswert.wuerfel;

/**
 * Created by axel on 04.05.14.
 */
public interface Cube<T> {
    /**
     * Is the cube filled at position (x,y,z) with x and y and z in {-2,-1,0,1,2}
     */
    boolean isSet(Point3D point3D);

    void set(Point3D transform, T value);

    T get(Point3D transform);
}

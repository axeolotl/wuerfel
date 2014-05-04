package net.wuenschenswert.wuerfel;

/**
 * Created by axel on 04.05.14.
 */
public class CubeImpl<T> implements Cube<T> {
    T[][][] voxels = (T[][][]) new Object[5][5][5];
    public boolean isSet(Point3D p) {
        return get(p) != null;
    }
    public T get(Point3D p) {
        return voxels[p.getX()+2][p.getY()+2][p.getZ()+2];
    }
    public void set(Point3D p, T value) {
        voxels[p.getX()+2][p.getY()+2][p.getZ()+2] = value;
    }
}

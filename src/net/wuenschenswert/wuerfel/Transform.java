package net.wuenschenswert.wuerfel;

/**
 * integer matrix multiplication from 2D into 3D points, with prior translation to the bottom.
 */
public class Transform {
    final int xx,xy,xz,yx,yy,yz,zx,zy,zz;
    public int transformX(int x, int y, int z) {
        return xx*x+xy*y+xz*z;
    }
    public int transformY(int x, int y, int z) {
        return yx*x+yy*y+yz*z;
    }
    public int transformZ(int x, int y, int z) {
        return zx*x+zy*y+zz*z;
    }

    public Transform(int xx, int xy, int xz, int yx, int yy, int yz, int zx, int zy, int zz) {
        this.xx = xx;
        this.xy = xy;
        this.xz = xz;
        this.yx = yx;
        this.yy = yy;
        this.yz = yz;
        this.zx = zx;
        this.zy = zy;
        this.zz = zz;
    }

    public Point3D transform(Point2D p2d) {
        return new Point3D(transformX(p2d.getX(), p2d.getY(),-2),transformY(p2d.getX(), p2d.getY(),-2),transformZ(p2d.getX(), p2d.getY(),-2));
    }
}

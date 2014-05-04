package net.wuenschenswert.wuerfel;

/**
 * integer matrix multiplication from 2D into 3D points, with translation.
 */
public class Transform {
    final int xx,xy,xt,yx,yy,yt,zx,zy,zt;
    public int transformX(int x, int y) {
        return xx*x+xy*y+xt;
    }
    public int transformY(int x, int y) {
        return yx*x+yy*y+yt;
    }
    public int transformZ(int x, int y) {
        return zx*x+zy*y+zt;
    }

    public Transform(int xx, int xy, int xt, int yx, int yy, int yt, int zx, int zy, int zt) {
        this.xx = xx;
        this.xy = xy;
        this.xt = xt;
        this.yx = yx;
        this.yy = yy;
        this.yt = yt;
        this.zx = zx;
        this.zy = zy;
        this.zt = zt;
    }

    public Point3D transform(Point2D p2d) {
        return new Point3D(transformX(p2d.getX(), p2d.getY()),transformY(p2d.getX(), p2d.getY()),transformZ(p2d.getX(), p2d.getY()));
    }
}

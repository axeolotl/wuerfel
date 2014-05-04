package net.wuenschenswert.wuerfel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by axel on 04.05.14.
 */
public interface Plate {
    /**
     * Is the plate filled at position (x,y) with x and y in {-2,-1,0,1,2}
     * always true for (-1<=x<=1 && -1<=y<=1)
     */
    boolean isSet(Point2D point);

    char getName();
}

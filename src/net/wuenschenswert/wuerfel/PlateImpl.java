package net.wuenschenswert.wuerfel;

/**
 * Created by axel on 04.05.14.
 */
public class PlateImpl implements Plate {
    String[] lines;
    char name;

    public PlateImpl(char name, String... lines) {
        this.lines = lines;
        this.name = name;
    }


    @Override
    public String toString() {
        return "Plate{" + name +'}';
    }

    public boolean isSet(Point2D point) {
        return lines[2-point.getY()].charAt(point.getX()+2) != ' ';
    }

    public char getName() {
        return name;
    }
}

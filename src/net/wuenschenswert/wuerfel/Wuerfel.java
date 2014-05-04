package net.wuenschenswert.wuerfel;

import java.util.*;

/**
 * Created by axel on 04.05.14.
 */
public class Wuerfel {
    private List<Plate> plates;
    private Cube<Plate> cube;

    public Wuerfel(List<Plate> plates) {
        this.plates = plates;
        this.cube = new CubeImpl<Plate>();
    }

    public static void main(String[] args) {
        List<Plate> plates=new ArrayList<Plate>();
        plates.add(new PlateImpl('a',
                "x x  ",
                "xxxx ",
                " xxxx",
                "xxxx ",
                " x x "
                ));
        plates.add(new PlateImpl('b',
                "xxx  ",
                " xxx ",
                "xxxxx",
                " xxx ",
                " x xx"
                ));
        plates.add(new PlateImpl('c',
                "xx   ",
                " xxxx",
                "xxxx ",
                " xxxx",
                " x x "
                ));
        plates.add(new PlateImpl('d',
                "x x x",
                "xxxxx",
                " xxx ",
                "xxxxx",
                "x x  "
                ));
        plates.add(new PlateImpl('e',
                "xx x ",
                " xxx ",
                "xxxxx",
                " xxx ",
                " x x "
                ));
        plates.add(new PlateImpl('f',
                " x x ",
                "xxxx ",
                " xxxx",
                "xxxx ",
                "  x  "
                ));
        new Wuerfel(plates).solve();
    }

    public void solve() {
        List<Plate> unusedPlates = new ArrayList<Plate>(plates);
        CubeSide side = CubeSide.values()[0];
        solve(side, unusedPlates);
    }

    private void solve(CubeSide side, List<Plate> unusedPlates) {
        System.out.println("(enter "+side+" with unused plates "+unusedPlates);
        for(Plate plate: unusedPlates) {
            int deg=0;
            for(Rotate2D rotate: Rotate2D.DEG_0_90_180_270) {
                RotatedPlate rotatedPlate = new RotatedPlate(plate, rotate);
                if(plateFits(rotatedPlate, side)) {
                    System.out.println("Plate "+plate.getName()+" fits into "+side+" at "+deg+" degrees");
                    setPlate(rotatedPlate, side, true);
                    if(isLast(side)) {
                        assert unusedPlates.size() == 1;
                        solution();
                    } else {
                        dumpCube();
                        CubeSide nextSide = next(side);
                        List<Plate> nextUnusedPlates = new ArrayList<Plate>(unusedPlates);
                        nextUnusedPlates.remove(plate);
                        solve(nextSide, nextUnusedPlates);
                    }
                    setPlate(rotatedPlate, side, false);
                }
                deg += 90;
            }
        }
        System.out.println(")leave "+side);
    }

    private void solution() {
        System.out.println("========\nSOLUTION:");
        dumpCube();
    }
    private void dumpCube()
    {
        for(CubeSide side: CubeSide.values()) {
            System.out.println(side.name());
            Transform t = TRANSFORM_FOR_CUBE_SIDE.get(side);
            for(int y=2;y>=-2;--y) {
                for(int x=-2;x<=2;++x) {
                    Plate plate = cube.get(t.transform(new Point2D(x, y)));
                    System.out.print(plate != null ? plate.getName() : ' ');
                }
                System.out.println();
            }
            System.out.println();
        }
    }

    private static void dumpPlate(Plate plate) {
        for(int y=2;y>=-2;--y) {
            for(int x=-2;x<=2;++x) {
                System.out.print(plate.isSet(new Point2D(x,y)) ? plate.getName() : ' ');
            }
            System.out.println();
        }
        System.out.println();
    }

    private boolean isLast(CubeSide side) {
        return side.ordinal() == CubeSide.values().length-1;
    }

    private CubeSide next(CubeSide side) {
        return CubeSide.values()[side.ordinal()+1];
    }

    boolean plateFits(Plate plate, CubeSide side) {
        Transform t = TRANSFORM_FOR_CUBE_SIDE.get(side);
        for(Point2D point: PLATE_RIM) {
            if(plate.isSet(point)) {
                boolean occupied = cube.isSet(t.transform(point));
                if(occupied) {
                    return false;
                }
            }
        }
        return true;
    }

    void setPlate(Plate plate, CubeSide side, boolean doSet) {
        Transform t = TRANSFORM_FOR_CUBE_SIDE.get(side);
        for(Point2D point: PLATE_RIM) {
            if(plate.isSet(point)) {
                cube.set(t.transform(point), doSet ? plate : null);
            }
        }
        cube.set(t.transform(new Point2D(0,0)), doSet ? plate : null);
    }

    static final List<Point2D> PLATE_RIM = computeRim();

    static List<Point2D> computeRim() {
        List<Point2D> result = new ArrayList<Point2D>(16);
        int x,y;
        for(int side=0;side<=3;++side) {
            for(int i=-2;i<=1;++i) {
                switch(side){
                    case 0: x= i;y=-2; break;
                    case 1: x= 2;y= i; break;
                    case 2: x=-i;y= 2; break;
                    case 3: x=-2;y=-i; break;
                    default: throw new RuntimeException();
                }
                result.add(new Point2D(x,y));
            }
        }
        return Collections.unmodifiableList(result);
    }


    static public final Transform TRANSFORM_BOTTOM = new Transform(
            1, 0, 0,
            0, 1, 0,
            0, 0,-2
    );
    static public final Transform TRANSFORM_TOP = new Transform(
            1, 0, 0,
            0, 1, 0,
            0, 0, 2
    );
    static public final Transform TRANSFORM_FRONT = new Transform(
            1, 0, 0,
            0, 0,-2,
            0, 1, 0
    );
    static public final Transform TRANSFORM_BACK = new Transform(
            1, 0, 0,
            0, 0, 2,
            0, 1, 0
    );
    static public final Transform TRANSFORM_LEFT = new Transform(
            0, 0,-2,
            0, 1, 0,
            1, 0, 0
    );
    static public final Transform TRANSFORM_RIGHT = new Transform(
            0, 0, 2,
            0, 1, 0,
            1, 0, 0
    );

    static public final EnumMap<CubeSide,Transform> TRANSFORM_FOR_CUBE_SIDE = computeTransformForCubeSide();

    private static EnumMap<CubeSide, Transform> computeTransformForCubeSide() {
        EnumMap<CubeSide, Transform> result = new EnumMap<CubeSide, Transform>(CubeSide.class);
        result.put(CubeSide.BOTTOM, TRANSFORM_BOTTOM);
        result.put(CubeSide.TOP, TRANSFORM_TOP);
        result.put(CubeSide.LEFT, TRANSFORM_LEFT);
        result.put(CubeSide.RIGHT, TRANSFORM_RIGHT);
        result.put(CubeSide.FRONT, TRANSFORM_FRONT);
        result.put(CubeSide.BACK, TRANSFORM_BACK);
        // TODO: make immutable
        return result;
    }


}

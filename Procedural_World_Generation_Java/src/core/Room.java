package core;

/**
 * Represents a rectangular room in the world grid.
 * Stores position, dimensions, and provides overlap detection.
 */
public class Room {
    private final int width;
    private final int height;
    private int startX;
    private int startY;

    public Room(int width, int height) {
        this.width = width;
        this.height = height;
    }

    public void setStart(int startX1, int startY1) {
        startX = startX1;
        startY = startY1;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public int getStartX() {
        return startX;
    }

    public int getStartY() {
        return startY;
    }

    public boolean isCollision(Room other) {

        int thisRight = startX + width;
        int thisBottom = startY + height;
        int otherRight = other.getStartX() + other.getWidth();
        int otherBottom = other.getStartY() + other.getHeight();


        boolean xOverlap = (thisRight > other.getStartX()) && (startX < otherRight);


        boolean yOverlap = (thisBottom > other.getStartY()) && (startY < otherBottom);


        return xOverlap && yOverlap;
    }
}

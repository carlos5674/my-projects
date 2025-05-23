package core;

import java.util.Objects;

/**
 * A simple tuple class to store x and y integer coordinates.
 * Used for positions and direction handling in world generation.
 */
public class Tuple {
    private int x;
    private int y;

    public Tuple(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Tuple tuple = (Tuple) o;
        return (x == tuple.x && y == tuple.y) || (x == tuple.y && y == tuple.x);
    }

    @Override
    public int hashCode() {
        return Objects.hash(Math.min(x, y), Math.max(x, y));
    }
}

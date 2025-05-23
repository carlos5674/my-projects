package deque;

import java.util.Comparator;

/**
 * An extension of ArrayDeque that allows finding the maximum element using a comparator.
 * Supports optional user-provided or default comparator logic.
 */
public class MaxArrayDeque<T> extends ArrayDeque<T> {
    private Comparator<T> comparator;
    public MaxArrayDeque(Comparator<T> c) {
        super();
        comparator = c;
    }

    public T max() {
        if (!isEmpty()) {
            T value = this.get(0);
            for (T i: this) {
                if (comparator.compare(i, value) > 0) {
                    value = i;
                }
            }
            return value;
        }
        return null;
    }

    public T max(Comparator<T> c) {
        if (!isEmpty()) {
            T value = this.get(0);
            for (T i: this) {
                if (c.compare(i, value) > 0) {
                    value = i;
                }
            }
            return value;
        }
        return null;
    }
}
package deque;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * An array-based double-ended queue (deque).
 * Dynamically resizes and allows constant-time add/remove at both ends.
 */
public class ArrayDeque<T> implements Deque<T> {
    private T[] items;
    private int first;
    private int last;
    private int size;
    public static final int SIZE = 15;

    public void resize(int r) {
        T[] temp = (T[]) new Object[r];
        int actual = (first + 1) % items.length;
        for (int i = 0; i < items.length; i++) {
            if (items[(actual + i) % items.length] != null) {
                temp[i] = items[(actual + i) % items.length];
            }
        }
        items = temp;
        first = items.length - 1;
        last = size;
    }

    @Override
    public void addFirst(T x) {
        if (size == items.length) {
            resize(items.length * 2);
        }
        items[first] = x;
        first = (((first - 1) + items.length) % items.length);
        size++;
    }

    @Override
    public void addLast(T x) {
        if (size == items.length) {
            resize(items.length * 2);
        }
        items[last] = x;
        last = (last + 1) % items.length;
        size++;
    }

    @Override
    public List<T> toList() {
        List<T> returnList = new ArrayList<>();
        for (int i = last; i < items.length; i++) {
            if (items[i] != null) {
                returnList.add(items[i]);
            }
        }
        for (int y = 0; y < last; y++) {
            if (items[y] != null) {
                returnList.add(items[y]);
            }
        }
        return returnList;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public T removeFirst() {
        if (!isEmpty()) {
            T value = get(0);
            size--;
            if (size * 4 < items.length && items.length > SIZE) {
                resize(Math.max((size * 4), SIZE));
                last++;
            }
            first = ((first + 1) + items.length) % items.length;
            items[first] = null;
            return value;
        }
        return null;
    }

    @Override
    public T removeLast() {
        if (!isEmpty()) {
            T value = get(size - 1);
            size--;
            if (size * 4 < items.length && items.length > SIZE) {
                resize(Math.max((size * 4), SIZE));
                last++;
            }
            last = ((last - 1) + items.length) % items.length;
            items[last] = null;
            return value;
        }
        return null;
    }

    @Override
    public T get(int index) {
        if (index < 0 || index >= items.length) {
            return null;
        }
        index = ((first + 1) + index) % items.length;
        return items[index];
    }

    @Override
    public T getRecursive(int index) {
        throw new UnsupportedOperationException("No need to implement getRecursive for proj 1b");
    }

    public ArrayDeque() {
        items = (T[]) new Object[8];
        size = 0;
        first = 0;
        last = 1;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Deque obj1) {
            if (obj1.size() != this.size()) {
                return false;
            }
            for (int i = 0; i < this.size(); i++) {
                if (!this.get(i).equals(obj1.get(i))) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    @Override
    public String toString() {
        return this.toList().toString();
    }

    @Override
    public Iterator<T> iterator() {
        return new ArrayDequeIterator();
    }

    private class ArrayDequeIterator implements Iterator<T> {
        private int pos;
        public ArrayDequeIterator() {
            pos = 0;
        }
        @Override
        public boolean hasNext() {
            return pos < size;
        }

        @Override
        public T next() {
            T nextitem = get(pos);
            pos++;
            return nextitem;
        }
    }
}
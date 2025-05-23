package deque;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * A double-ended queue (deque) implemented using a circular sentinel linked list.
 * Supports constant-time addition and removal at both ends.
 * Implements Iterable<T> for for-each loop support.
 */
public class LinkedListDeque<T> implements Deque<T> {
    private int size;
    private IntNode sentinel;

    @Override
    public Iterator<T> iterator() {
        return new LinkedListIterator();
    }

    private class LinkedListIterator implements Iterator<T> {
        private int pos;
        public LinkedListIterator() {
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

    public class IntNode {
        private IntNode prev;
        private T item;
        private IntNode next;
        public IntNode(IntNode p, T i, IntNode n) {
            prev = p;
            item = i;
            next = n;
        }
    }
    @Override
    public void addFirst(T x) {
        sentinel.next = new IntNode(sentinel, x, sentinel.next);
        sentinel.next.next.prev = sentinel.next;
        size++;
    }

    @Override
    public void addLast(T x) {
        sentinel.prev = new IntNode(sentinel.prev, x, sentinel);
        sentinel.prev.prev.next = sentinel.prev;
        size++;
    }

    @Override
    public List<T> toList() {
        List<T> returnList = new ArrayList<>();
        sentinel = sentinel.next;
        while (sentinel.item != null) {
            returnList.add(sentinel.item);
            sentinel = sentinel.next;
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
            T value = sentinel.next.item;
            sentinel.next.next.prev = sentinel;
            sentinel.next = sentinel.next.next;
            size--;
            return value;
        }
        return null;
    }

    @Override
    public T removeLast() {
        if (!isEmpty()) {
            T value = sentinel.prev.item;
            sentinel.prev.prev.next = sentinel;
            sentinel.prev = sentinel.prev.prev;
            size--;
            return value;
        }
        return null;
    }

    @Override
    public T get(int index) {
        if (index < 0 || index > size) {
            return null;
        }
        IntNode node = sentinel.next;
        for (int i = 0; i < index; i++) {
            node = node.next;
        }
        return node.item;
    }

    @Override
    public T getRecursive(int index) {
        if (index < 0 || index > size) {
            return null;
        }
        return helper(index, sentinel.next);
    }
    public T helper(int i, IntNode node) {
        if (i == 0) {
            return node.item;
        }
        return helper(i - 1, node.next);
    }
    public LinkedListDeque() {
        sentinel = new IntNode(null, null, null);
        sentinel.prev = sentinel;
        sentinel.next = sentinel;
        size = 0;
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
}


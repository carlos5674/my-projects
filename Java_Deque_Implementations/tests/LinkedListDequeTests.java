import deque.Deque;
import deque.LinkedListDeque;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static com.google.common.truth.Truth.assertThat;

public class LinkedListDequeTests {

    @Test
    public void iteratortest() {
        Deque<Integer> lld1 = new LinkedListDeque<>();
        lld1.addLast(5);
        lld1.addLast(4);
        lld1.addLast(3);
        lld1.addLast(2);
        Iterator<Integer> iter = lld1.iterator();
        int x = iter.next();
        assertThat(x).isEqualTo(5);
        int y = iter.next();
        assertThat(y).isEqualTo(4);
        int z = iter.next();
        assertThat(z).isEqualTo(3);
        int a = iter.next();
        assertThat(a).isEqualTo(2);
        assertThat(iter.hasNext()).isFalse();
        List<Integer> temp = new ArrayList<>();
        for (int i: lld1) {
            temp.add(i);
        }
        assertThat(temp).containsExactly(5, 4, 3, 2).inOrder();
    }

    @Test
    public void equalstest() {
        Deque<Integer> lld1 = new LinkedListDeque<>();
        lld1.addLast(5);
        lld1.addLast(4);
        lld1.addLast(3);
        lld1.addLast(2);
        Deque<Integer> lld2 = new LinkedListDeque<>();
        lld2.addLast(5);
        lld2.addLast(4);
        lld2.addLast(3);
        lld2.addLast(2);
        assertThat(lld1.equals(lld2)).isTrue();
        lld2.removeLast();
        assertThat(lld2.equals(lld1)).isFalse();
    }

    @Test
    public void toStringtest() {
        Deque<String> lld1 = new LinkedListDeque<>();

        lld1.addFirst("back");
        assertThat(lld1.toList()).containsExactly("back").inOrder();

        lld1.addFirst("middle");
        assertThat(lld1.toList()).containsExactly("middle", "back").inOrder();

        lld1.addFirst("front");
        assertThat(lld1.toList()).containsExactly("front", "middle", "back").inOrder();
        assertThat(lld1.toString()).isEqualTo("[front, middle, back]");
    }
}

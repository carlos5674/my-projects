import deque.ArrayDeque;
import deque.Deque;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static com.google.common.truth.Truth.assertThat;

public class ArrayDequeTests {

    @Test
    public void iteratortest() {
        Deque<Integer> ad1 = new ArrayDeque<>();
        ad1.addLast(5);
        ad1.addLast(4);
        ad1.addLast(3);
        ad1.addLast(2);
        Iterator<Integer> iter = ad1.iterator();
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
        for (int i: ad1) {
            temp.add(i);
        }
        assertThat(temp).containsExactly(5, 4, 3, 2).inOrder();
    }

    @Test
    public void equalstest() {
        Deque<Integer> ad1 = new ArrayDeque<>();
        ad1.addLast(5);
        ad1.addLast(4);
        ad1.addLast(3);
        ad1.addLast(2);
        Deque<Integer> ad2 = new ArrayDeque<>();
        ad2.addLast(5);
        ad2.addLast(4);
        ad2.addLast(3);
        ad2.addLast(2);
        assertThat(ad1.equals(ad2)).isTrue();
        ad2.removeLast();
        assertThat(ad2.equals(ad1)).isFalse();
    }

    @Test
    public void toStringtest() {
        Deque<String> ad1 = new ArrayDeque<>();

        ad1.addFirst("back");
        assertThat(ad1.toList()).containsExactly("back").inOrder();

        ad1.addFirst("middle");
        assertThat(ad1.toList()).containsExactly("middle", "back").inOrder();

        ad1.addFirst("front");
        assertThat(ad1.toList()).containsExactly("front", "middle", "back").inOrder();
        assertThat(ad1.toString()).isEqualTo("[front, middle, back]");
    }
}

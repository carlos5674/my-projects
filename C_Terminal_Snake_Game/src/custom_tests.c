#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "asserts.h"
// Necessary due to static functions in state.c
#include "state.c"

/* Look at asserts.c for some helpful assert functions */

int greater_than_forty_two(int x) { return x > 42; }

bool is_vowel(char c) {
  char *vowels = "aeiouAEIOU";
  for (int i = 0; i < strlen(vowels); i++) {
    if (c == vowels[i]) {
      return true;
    }
  }
  return false;
}

/*
  Example 1: Returns true if all test cases pass. False otherwise.
    The function greater_than_forty_two(int x) will return true if x > 42. False otherwise.
    Note: This test is NOT comprehensive
*/
bool test_greater_than_forty_two() {
  int testcase_1 = 42;
  bool output_1 = greater_than_forty_two(testcase_1);
  if (!assert_false("output_1", output_1)) {
    return false;
  }

  int testcase_2 = -42;
  bool output_2 = greater_than_forty_two(testcase_2);
  if (!assert_false("output_2", output_2)) {
    return false;
  }

  int testcase_3 = 4242;
  bool output_3 = greater_than_forty_two(testcase_3);
  if (!assert_true("output_3", output_3)) {
    return false;
  }

  return true;
}

/*
  Example 2: Returns true if all test cases pass. False otherwise.
    The function is_vowel(char c) will return true if c is a vowel (i.e. c is a,e,i,o,u)
    and returns false otherwise
    Note: This test is NOT comprehensive
*/
bool test_is_vowel() {
  char testcase_1 = 'a';
  bool output_1 = is_vowel(testcase_1);
  if (!assert_true("output_1", output_1)) {
    return false;
  }

  char testcase_2 = 'e';
  bool output_2 = is_vowel(testcase_2);
  if (!assert_true("output_2", output_2)) {
    return false;
  }

  char testcase_3 = 'i';
  bool output_3 = is_vowel(testcase_3);
  if (!assert_true("output_3", output_3)) {
    return false;
  }

  char testcase_4 = 'o';
  bool output_4 = is_vowel(testcase_4);
  if (!assert_true("output_4", output_4)) {
    return false;
  }

  char testcase_5 = 'u';
  bool output_5 = is_vowel(testcase_5);
  if (!assert_true("output_5", output_5)) {
    return false;
  }

  char testcase_6 = 'k';
  bool output_6 = is_vowel(testcase_6);
  if (!assert_false("output_6", output_6)) {
    return false;
  }

  return true;
}

/* Task 4.1 */

bool test_is_tail() {
  // TODO: Implement this function.
  char test1 = 'a';
  bool out1 = is_tail(test1);
  if (!assert_equals_bool("out1", true, out1)){
      return false;
  }
  char test2 = 'w';
  bool out2 = is_tail(test2);
  if (!assert_equals_bool("out2", true, out2)) {
    return false;
  }
  char test3 = 's';
  bool out3 = is_tail(test3);
  if (!assert_equals_bool("out3", true, out3)) {
    return false;
  }
  char test4 = 'd';
  bool out4 = is_tail(test4);
  if (!assert_equals_bool("out4", true, out4)) {
    return false;
  }
  char test5 = 'A';
  bool out5 = is_tail(test5);
  if (!assert_equals_bool("out5", false, out5)) {
    return false;
  }
  return true;
}

bool test_is_head() {
  // TODO: Implement this function.
  char test1 = 'A';
  bool out1 = is_head(test1);
  if (!assert_equals_bool("out1", true, out1)) {
    return false;
  }
  char test2 = 'W';
  bool out2 = is_head(test2);
  if (!assert_equals_bool("out2", true, out2)) {
    return false;
  }
  char test3 = 'S';
  bool out3 = is_head(test3);
  if (!assert_equals_bool("out3", true, out3)) {
    return false;
  }
  char test4 = 'D';
  bool out4 = is_head(test4);
  if (!assert_equals_bool("out4", true, out4)) {
    return false;
  }
  char test5 = 'a';
  bool out5 = is_head(test5);
  if (!assert_equals_bool("out5", false, out5)) {
    return false;
  }
  return true;
}

bool test_is_snake() {
  // TODO: Implement this function.
  char test1 = 'a';
  bool out1 = is_snake(test1);
  if (!assert_equals_bool("out1", true, out1)) {
    return false;
  }
  char test2 = 'w';
  bool out2 = is_snake(test2);
  if (!assert_equals_bool("out2", true, out2)) {
    return false;
  }
  char test3 = 's';
  bool out3 = is_snake(test3);
  if (!assert_equals_bool("out3", true, out3)) {
    return false;
  }
  char test4 = 'd';
  bool out4 = is_snake(test4);
  if (!assert_equals_bool("out4", true, out4)) {
    return false;
  }
  char test5= 'A';
  bool out5 = is_snake(test5);
  if (!assert_equals_bool("out5", true, out5)) {
    return false;
  }
  char test6 = 'W';
  bool out6 = is_snake(test6);
  if (!assert_equals_bool("out6", true, out6)) {
    return false;
  }
  char test7 = 'S';
  bool out7 = is_snake(test7);
  if (!assert_equals_bool("out7", true, out7)) {
    return false;
  }
  char test8 = 'D';
  bool out8 = is_snake(test8);
  if (!assert_equals_bool("out8", true, out8)) {
    return false;
  }
  char test9 = '^';
  bool out9 = is_snake(test9);
  if (!assert_equals_bool("out9", true, out9)) {
    return false;
  }
  char test10 = '<';
  bool out10 = is_snake(test10);
  if (!assert_equals_bool("out10", true, out10)) {
    return false;
  }
  char test11 = '>';
  bool out11 = is_snake(test11);
  if (!assert_equals_bool("out11", true, out11)) {
    return false;
  }
  char test12 = 'v';
  bool out12 = is_snake(test12);
  if (!assert_equals_bool("out12", true, out12)) {
    return false;
  }
  char test13 = 'x';
  bool out13 = is_snake(test13);
  if (!assert_equals_bool("out13", true, out13)) {
    return false;
  }
  char test14 = 'b';
  bool out14 = is_snake(test14);
  if (!assert_equals_bool("out14", false, out14)) {
    return false;
  }
  return true;
}

bool test_body_to_tail() {
  // TODO: Implement this function.
  char test1 = '^';
  char out1 = body_to_tail(test1);
  if (!assert_equals_char("out1", 'w', out1)) {
    return false;
  }
  char test2 = 'v';
  char out2 = body_to_tail(test2);
  if (!assert_equals_char("out2", 's', out2)) {
    return false;
  }
  char test3 = '<';
  char out3 = body_to_tail(test3);
  if (!assert_equals_char("out3", 'a', out3)) {
    return false;
  }
  char test4 = '>';
  char out4 = body_to_tail(test4);
  if (!assert_equals_char("out4", 'd', out4)) {
    return false;
  }
  char test5 = '^';
  char out5 = body_to_tail(test5);
  if (assert_equals_char("out5", 'a', out5)) {
    return false;
  }
  return true;
}

bool test_head_to_body() {
  // TODO: Implement this function.
  char test1 = 'W';
  char out1 = head_to_body(test1);
  if (!assert_equals_char("out1", '^', out1)) {
    return false;
  }
  char test2 = 'A';
  char out2 = head_to_body(test2);
  if (!assert_equals_char("out2", '<', out2)) {
    return false;
  }
  char test3 = 'S';
  char out3 = head_to_body(test3);
  if (!assert_equals_char("out3", 'v', out3)) {
    return false;
  }
  char test4 = 'D';
  char out4 = head_to_body(test4);
  if (!assert_equals_char("out4", '>', out4)) {
    return false;
  }
  char test5 = 'S';
  char out5 = head_to_body(test5);
  if (assert_equals_char("out5", '^', out5)) {
    return false;
  }
  return true;
}

bool test_get_next_row() {
  // TODO: Implement this function.
  unsigned int row = 4;
  char test1 = 'v';
  unsigned int out1 = get_next_row(row, test1);
  if (!assert_equals_unsigned_int("out1", 5, out1)) {
    return false;
  }
  char test2 = 's';
  unsigned int out2 = get_next_row(row, test2);
  if (!assert_equals_unsigned_int("out2", 5, out2)) {
    return false;
  }
  char test3 = 'S';
  unsigned int out3 = get_next_row(row, test3);
  if (!assert_equals_unsigned_int("out3", 5, out3)) {
    return false;
  }
  char test4 = '^';
  unsigned int out4 = get_next_row(row, test4);
  if (!assert_equals_unsigned_int("out4", 3, out4)) {
    return false;
  }
  char test5 = 'w';
  unsigned int out5 = get_next_row(row, test5);
  if (!assert_equals_unsigned_int("out5", 3, out5)) {
    return false;
  }
  char test6 = 'W';
  unsigned int out6 = get_next_row(row, test6);
  if (!assert_equals_unsigned_int("out6", 3, out6)) {
    return false;
  }
  char test7 = 'A';
  unsigned int out7 = get_next_row(row, test7);
  if (!assert_equals_unsigned_int("out7", 4, out7)) {
    return false;
  }
  char test8 = 'D';
  unsigned int out8 = get_next_row(row, test8);
  if (assert_equals_unsigned_int("out8", 5, out8)) {
    return false;
  }
  return true;
}

bool test_get_next_col() {
  // TODO: Implement this function.
  unsigned int col = 6;
  char test1 = '>';
  unsigned int out1 = get_next_col(col, test1);
  if (!assert_equals_unsigned_int("out1", 7, out1)) {
    return false;
  }
  char test2 = 'd';
  unsigned int out2 = get_next_col(col, test2);
  if (!assert_equals_unsigned_int("out2", 7, out2)) {
    return false;
  }
  char test3 = 'D';
  unsigned int out3 = get_next_col(col, test3);
  if (!assert_equals_unsigned_int("out3", 7, out3)) {
    return false;
  }
  char test4 = '<';
  unsigned int out4 = get_next_col(col, test4);
  if (!assert_equals_unsigned_int("out4", 5, out4)) {
    return false;
  }
  char test5 = 'a';
  unsigned int out5 = get_next_col(col, test5);
  if (!assert_equals_unsigned_int("out5", 5, out5)) {
    return false;
  }
  char test6 = 'A';
  unsigned int out6 = get_next_col(col, test6);
  if (!assert_equals_unsigned_int("out6", 5, out6)) {
    return false;
  }
  char test7 = 'W';
  unsigned int out7 = get_next_col(col, test7);
  if (!assert_equals_unsigned_int("out7", 6, out7)) {
    return false;
  }
  char test8 = 'S';
  unsigned int out8 = get_next_col(col, test8);
  if (assert_equals_unsigned_int("out8", 5, out8)) {
    return false;
  }
  return true;
}

bool test_customs() {
  if (!test_greater_than_forty_two()) {
    printf("%s\n", "test_greater_than_forty_two failed.");
    return false;
  }
  if (!test_is_vowel()) {
    printf("%s\n", "test_is_vowel failed.");
    return false;
  }
  if (!test_is_tail()) {
    printf("%s\n", "test_is_tail failed");
    return false;
  }
  if (!test_is_head()) {
    printf("%s\n", "test_is_head failed");
    return false;
  }
  if (!test_is_snake()) {
    printf("%s\n", "test_is_snake failed");
    return false;
  }
  if (!test_body_to_tail()) {
    printf("%s\n", "test_body_to_tail failed");
    return false;
  }
  if (!test_head_to_body()) {
    printf("%s\n", "test_head_to_body failed");
    return false;
  }
  if (!test_get_next_row()) {
    printf("%s\n", "test_get_next_row failed");
    return false;
  }
  if (!test_get_next_col()) {
    printf("%s\n", "test_get_next_col failed");
    return false;
  }
  return true;
}

int main(int argc, char *argv[]) {
  init_colors();

  if (!test_and_print("custom", test_customs)) {
    return 0;
  }

  return 0;
}

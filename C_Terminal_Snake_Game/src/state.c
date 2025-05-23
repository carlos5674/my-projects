/*
 * state.c
 * Implements the game state including the board, food, and snake movement logic.
 */

#include "state.h"

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "snake_utils.h"

/* Helper function definitions */
static void set_board_at(game_state_t *state, unsigned int row, unsigned int col, char ch);
static bool is_tail(char c);
static bool is_head(char c);
static bool is_snake(char c);
static char body_to_tail(char c);
static char head_to_body(char c);
static unsigned int get_next_row(unsigned int cur_row, char c);
static unsigned int get_next_col(unsigned int cur_col, char c);
static void find_head(game_state_t *state, unsigned int snum);
static char next_square(game_state_t *state, unsigned int snum);
static void update_tail(game_state_t *state, unsigned int snum);
static void update_head(game_state_t *state, unsigned int snum);

/* Task 1 */
game_state_t *create_default_state() {
  // TODO: Implement this function.
  game_state_t* start = (game_state_t*)malloc(sizeof(game_state_t));
  (*start).num_rows = 18;
  (*start).num_snakes = 1;
  (*start).board = (char**)malloc((*start).num_rows * sizeof(char*));;
  for (int i=0; i<18; i++){
      (*start).board[i] = (char*)malloc(22 * sizeof(char));
      if (i == 0 || i == 17) {
          strcpy((*start).board[i], "####################\n\0");
      }
      else{
          strcpy((*start).board[i], "#                  #\n\0");
      }
  }
  (*start).snakes = (snake_t*)malloc(sizeof(snake_t));
  snake_t stsnake;
  stsnake.tail_row = 2;
  stsnake.tail_col = 2;
  stsnake.head_row = 2;
  stsnake.head_col = 4;
  stsnake.live = true;
  (*start).snakes[0] = stsnake;
  strcpy((*start).board[2], "# d>D    *         #\n\0");
  return start;
}
/* Task 2 */
void free_state(game_state_t *state) {
  // TODO: Implement this function.
  for (int i=0; i < state->num_rows; i++){
      free(state->board[i]);
  }
  free(state->snakes);
  free(state->board);
  free(state);
  return;
}

/* Task 3 */
void print_board(game_state_t *state, FILE *fp) {
  // TODO: Implement this function.
  for (unsigned int i=0; i < (state->num_rows); i++) {
      fprintf(fp, "%s", state->board[i]);
  }
  return;
}

/*
  Saves the current state into filename. Does not modify the state object.
  (already implemented for you).
*/
void save_board(game_state_t *state, char *filename) {
  FILE *f = fopen(filename, "w");
  print_board(state, f);
  fclose(f);
}

/* Task 4.1 */

/*
  Helper function to get a character from the board
  (already implemented for you).
*/
char get_board_at(game_state_t *state, unsigned int row, unsigned int col) { return state->board[row][col]; }

/*
  Helper function to set a character on the board
  (already implemented for you).
*/
static void set_board_at(game_state_t *state, unsigned int row, unsigned int col, char ch) {
  state->board[row][col] = ch;
}

/*
  Returns true if c is part of the snake's tail.
  The snake consists of these characters: "wasd"
  Returns false otherwise.
*/
static bool is_tail(char c) {
  // TODO: Implement this function.
  if (c == 'a'|| c == 'w'|| c == 's'|| c == 'd'){
      return true;
  }
  return false;
}

/*
  Returns true if c is part of the snake's head.
  The snake consists of these characters: "WASDx"
  Returns false otherwise.
*/
static bool is_head(char c) {
  // TODO: Implement this function.
  if (c == 'A'|| c == 'W'|| c == 'S'|| c == 'D'){
      return true;
  }
  return false;
}

/*
  Returns true if c is part of the snake.
  The snake consists of these characters: "wasd^<v>WASDx"
*/
static bool is_snake(char c) {
  // TODO: Implement this function.
  if (is_head(c)|| is_tail(c)|| c == '^'|| c == '<'|| c == 'v'|| c == '>'|| c == 'x') {
      return true;
  }
  return false;
}

/*
  Converts a character in the snake's body ("^<v>")
  to the matching character representing the snake's
  tail ("wasd").
*/
static char body_to_tail(char c) {
  // TODO: Implement this function.
  char output;
  if (c == '^'){
      output = 'w';
  }
  if (c == 'v'){
      output = 's';
  }
  if (c == '<'){
      output = 'a';
  }
  if (c == '>'){
      output = 'd';
  }
  return output;
}

/*
  Converts a character in the snake's head ("WASD")
  to the matching character representing the snake's
  body ("^<v>").
*/
static char head_to_body(char c) {
  // TODO: Implement this function.
  char output;
  if (c == 'W'){
      output = '^';
  }
  if (c == 'A'){
      output = '<';
  }
  if (c == 'S'){
      output = 'v';
  }
  if (c == 'D'){
      output = '>';
  }
  return output;
}

/*
  Returns cur_row + 1 if c is 'v' or 's' or 'S'.
  Returns cur_row - 1 if c is '^' or 'w' or 'W'.
  Returns cur_row otherwise.
*/
static unsigned int get_next_row(unsigned int cur_row, char c) {
  // TODO: Implement this function.
  if (c == 'v'|| c == 's'|| c == 'S'){
      cur_row++;
  }
  if (c == '^'|| c == 'w'|| c == 'W'){
      cur_row--;
  }
  return cur_row;
}

/*
  Returns cur_col + 1 if c is '>' or 'd' or 'D'.
  Returns cur_col - 1 if c is '<' or 'a' or 'A'.
  Returns cur_col otherwise.
*/
static unsigned int get_next_col(unsigned int cur_col, char c) {
  // TODO: Implement this function.
  if (c == '>'|| c == 'd'|| c == 'D'){
      cur_col++;
  }
  if (c == '<'|| c == 'a'|| c == 'A'){
      cur_col--;
  }
  return cur_col;
}

/*
  Task 4.2

  Helper function for update_state. Return the character in the cell the snake is moving into.

  This function should not modify anything.
*/
static char next_square(game_state_t *state, unsigned int snum) {
  // TODO: Implement this function.
  snake_t snake = state->snakes[snum];
  unsigned int h_row = snake.head_row;
  unsigned int h_col = snake.head_col;
  char h_char = get_board_at(state, h_row, h_col);
  h_col = get_next_col(h_col, h_char);
  h_row = get_next_row(h_row, h_char);
  return get_board_at(state, h_row, h_col);
}

/*
  Task 4.3

  Helper function for update_state. Update the head...

  ...on the board: add a character where the snake is moving

  ...in the snake struct: update the row and col of the head

  Note that this function ignores food, walls, and snake bodies when moving the head.
*/
static void update_head(game_state_t *state, unsigned int snum) {
  // TODO: Implement this function.
  char s_char = get_board_at(state, state->snakes[snum].head_row, state->snakes[snum].head_col);
  set_board_at(state, state->snakes[snum].head_row, state->snakes[snum].head_col, head_to_body(s_char)); 
  state->snakes[snum].head_col = get_next_col(state->snakes[snum].head_col, s_char);
  state->snakes[snum].head_row = get_next_row(state->snakes[snum].head_row, s_char);
  set_board_at(state, state->snakes[snum].head_row, state->snakes[snum].head_col, s_char);
  return;
}

/*
  Task 4.4

  Helper function for update_state. Update the tail...

  ...on the board: blank out the current tail, and change the new
  tail from a body character (^<v>) into a tail character (wasd)

  ...in the snake struct: update the row and col of the tail
*/
static void update_tail(game_state_t *state, unsigned int snum) {
  // TODO: Implement this function.
  char t_char = get_board_at(state, state->snakes[snum].tail_row, state->snakes[snum].tail_col);
  set_board_at(state, state->snakes[snum].tail_row, state->snakes[snum].tail_col, ' ');
  state->snakes[snum].tail_col = get_next_col(state->snakes[snum].tail_col, t_char);
  state->snakes[snum].tail_row = get_next_row(state->snakes[snum].tail_row, t_char);
  char b_char = get_board_at(state, state->snakes[snum].tail_row, state->snakes[snum].tail_col);
  set_board_at(state, state->snakes[snum].tail_row, state->snakes[snum].tail_col, body_to_tail(b_char));
  return;
}

/* Task 4.5 */
void update_state(game_state_t *state, int (*add_food)(game_state_t *state)) {
  // TODO: Implement this function.
  for (unsigned int i=0; i < state->num_snakes; i++){
      char s_next = next_square(state, i);
      if (s_next == '#'|| is_snake(s_next)){
          state->snakes[i].live = false;
          set_board_at(state, state->snakes[i].head_row, state->snakes[i].head_col, 'x');
      }
      else if (s_next == '*'){
          update_head(state, i);
          add_food(state);
      }
      else {
          update_head(state, i);
          update_tail(state, i);
      }
  }
  return;
}

/* Task 5.1 */
char *read_line(FILE *fp) {
  // TODO: Implement this function.
  size_t size = 1;
  char* store = NULL;
  char buff[10];
  while(fgets(buff, sizeof(buff), fp) != NULL){
      char* end = strchr(buff, '\n');
      size_t len = strlen(buff);
      char* temp = (char*)realloc(store, size + len);
      store = temp;
      strcpy(store + size - 1, buff);
      size += len;
      if (end){
          break;
      }
  }
  if (feof(fp)|| ferror(fp)){
      return NULL;
  }
  return store;
}

/* Task 5.2 */
game_state_t *load_board(FILE *fp) {
  // TODO: Implement this function.
  game_state_t* game = (game_state_t*)malloc(sizeof(game_state_t));
  game->num_snakes = 0;
  game->snakes = NULL;
  game->board = NULL;
  unsigned int rows = 0;
  char* line;
  while ((line = read_line(fp)) != NULL){
      rows++;
      char** temp = (char**)realloc(game->board, rows * sizeof(char*));
      game->board = temp;
      game->board[rows-1] = line;
  }
  game->num_rows = rows;
  if (ferror(fp)){
      return NULL;
  }
  return game;
}

/*
  Task 6.1

  Helper function for initialize_snakes.
  Given a snake struct with the tail row and col filled in,
  trace through the board to find the head row and col, and
  fill in the head row and col in the struct.
*/
static void find_head(game_state_t *state, unsigned int snum) {
  // TODO: Implement this function.
  unsigned int row = state->snakes[snum].tail_row;
  unsigned int col = state->snakes[snum].tail_col;
  char sym = get_board_at(state, row, col);
  while (!is_head(sym)){
      row = get_next_row(row, sym);
      col = get_next_col(col, sym);
      sym = get_board_at(state, row, col);
  }
  if (is_head(sym)){
      state->snakes[snum].head_row = row;
      state->snakes[snum].head_col = col;
  }
  return;
}

/* Task 6.2 */
game_state_t *initialize_snakes(game_state_t *state) {
  // TODO: Implement this function.
  unsigned int count = 0;
  for (unsigned int i=0; i < state->num_rows; i++){
      for (unsigned int x=0; x < strlen(state->board[i]); x++){
          if (is_tail(get_board_at(state, i, x))){
              count++;
              snake_t* temp = (snake_t*)realloc(state->snakes, count * sizeof(snake_t));
              state->snakes = temp;
              snake_t tsnake;
              tsnake.tail_row = i;
              tsnake.tail_col = x;
              state->snakes[count - 1] = tsnake;
          }
      }
  }
  state->num_snakes = count;
  for (unsigned int y=0; y < count; y++){
      find_head(state, y);
  }
  return state;
}

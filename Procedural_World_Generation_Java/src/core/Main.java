package core;


import edu.princeton.cs.algs4.StdDraw;
import tileengine.TETile;
import tileengine.Tileset;

import java.awt.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import static java.awt.Color.black;
import static java.awt.Color.blue;

/**
 * Entry point for launching the procedural world generator.
 * Initializes the renderer and passes control to world generation.
 */
/**
 * Entry point for launching the procedural world generator.
 * Initializes the renderer and passes control to world generation.
 */
public class Main {
    private static final int WIDTH = 100;
    private static final int HEIGHT = 60;
    private static final int SEED_MULT = 10;
    private static final int FONT_SIZE_MENU = 30;
    private static final int FONT_SIZE_SEED = 15;
    private static final int FONT_SIZE_MENU_OPTIONS = 20;
    private static final int FONT_POS_X = 50;
    private static final int FONT_POS_Y_TITLE = 42;
    private static final int FONT_POS_Y_INP = 23;
    private static final int FONT_POS_Y_N = 30;
    private static final int FONT_POS_Y_L = 28;
    private static final int FONT_POS_Y_Q = 26;
    private static final int PAUSE_TIME = 100;

    private static TETile[][] tiles;

    private static String[] coordsStrings;
    public static void main(String[] args) {




        long choice = displayMainMenu();

        if (choice > 0) {
            World world = new World(choice, false);
            world.rooms();
            world.placeRooms();
            world.generateHallways();
            world.cleanUp();
            world.allDone();
            world.addUser();
            world.runGame();
        } else if (choice == -1) {
            tiles = restoreTiles(WIDTH, HEIGHT);
            World world = new World(tiles, coordsStrings, false);
            world.runGame();
        }




    }

    public static long displayMainMenu() {



        StdDraw.clear(StdDraw.BLACK);
        StdDraw.setXscale(0, WIDTH);
        StdDraw.setYscale(0, HEIGHT);

        StdDraw.setFont(new Font("Arial", Font.BOLD, FONT_SIZE_MENU));
        StdDraw.setPenColor(StdDraw.WHITE);
        StdDraw.text(FONT_POS_X, FONT_POS_Y_TITLE, "CS61B: THE GAME");


        StdDraw.setFont(new Font("Arial", Font.PLAIN, FONT_SIZE_MENU_OPTIONS));
        StdDraw.text(FONT_POS_X, FONT_POS_Y_N, "New Game (N)");
        StdDraw.text(FONT_POS_X, FONT_POS_Y_L, "Load Game (L)");
        StdDraw.text(FONT_POS_X, FONT_POS_Y_Q, "Quit (Q)");


        StdDraw.show();


        while (true) {
            if (StdDraw.hasNextKeyTyped()) {
                char key = StdDraw.nextKeyTyped();
                if (key == 'n' || key == 'N') {

                    StdDraw.clear(new Color(0, 0, 0));
                    long seed  = seedPage();
                    return seed;
                } else if (key == 'l' || key == 'L') {

                    StdDraw.clear(new Color(0, 0, 0));
                    return -1;
                } else if (key == 'q' || key == 'Q') {

                    StdDraw.clear(new Color(0, 0, 0));
                    System.exit(0);
                }
            }


            StdDraw.pause(PAUSE_TIME);
        }

    }

    public static long seedPage() {
        StdDraw.setFont(new Font("Arial", Font.BOLD, FONT_SIZE_SEED));
        StdDraw.setPenColor(StdDraw.WHITE);
        StdDraw.text(FONT_POS_X, FONT_POS_Y_TITLE, "Enter a seed. Press s when you're done.");
        StdDraw.setXscale(0, WIDTH);
        StdDraw.show();
        long inp = 0;
        Set<Character> nums = new TreeSet<>();
        nums.add('0');
        nums.add('1');
        nums.add('2');
        nums.add('3');
        nums.add('4');
        nums.add('5');
        nums.add('6');
        nums.add('7');
        nums.add('8');
        nums.add('9');
        StdDraw.text(FONT_POS_X, FONT_POS_Y_INP, String.valueOf(inp));
        StdDraw.show();

        while (true) {
            if (StdDraw.hasNextKeyTyped()) {
                char key = StdDraw.nextKeyTyped();
                if (key == 's' || key == 'S') {
                    break;
                } else if (nums.contains(key)) {
                    int keyInt = key - '0';
                    inp = inp * SEED_MULT + keyInt;
                    StdDraw.clear(new Color(0, 0, 0));
                    StdDraw.text(FONT_POS_X, FONT_POS_Y_TITLE, "Enter a seed. Press s when you're done.");
                    StdDraw.text(FONT_POS_X, FONT_POS_Y_INP, String.valueOf(inp));
                    StdDraw.show();
                }
            }
        }
        return inp;
    }

    public static TETile[][] restoreTiles(int rows, int cols) {
        TETile you = new TETile('@', blue, black, "You");
        Map<String, TETile> reversePairs = new HashMap<>();
        reversePairs.put("wall", Tileset.WALL);
        reversePairs.put("floor", Tileset.FLOOR);
        reversePairs.put("you", you);
        reversePairs.put("nothing", Tileset.NOTHING);

        tiles = new TETile[rows][cols];
        rows++;
        try (BufferedReader reader = new BufferedReader(new FileReader("tiles.txt"))) {
            String line;
            int row = 0;
            while ((line = reader.readLine()) != null && row < rows) {
                if (row == rows - 1) {
                    coordsStrings = line.split(",");
                } else {
                    String[] tileStrings = line.split(", ");
                    for (int col = 0; col < tileStrings.length && col < cols; col++) {
                        tiles[row][col] = reversePairs.getOrDefault(tileStrings[col], Tileset.NOTHING);
                    }
                    row++;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return tiles;
    }


}

package core;

import edu.princeton.cs.algs4.WeightedQuickUnionUF;
import tileengine.TERenderer;
import tileengine.TETile;
import tileengine.Tileset;
import edu.princeton.cs.algs4.StdDraw;

import java.awt.*;
import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

import static java.awt.Color.black;
import static java.awt.Color.blue;

/**
 * Generates and manages a 2D tile-based world using procedural room and hallway generation.
 * Contains logic for layout, rendering integration, and seed-based reproducibility.
 */
/**
 * Generates and manages a 2D tile-based world using procedural room and hallway generation.
 * Contains logic for layout, rendering integration, and seed-based reproducibility.
 */
public class World {

    private static final int WIDTH = 100;
    private static final int TOO_FAR = 60;
    private static final int HEIGHT = 60;
    private static final int FONT_SIZE_TOP = 13;
    private static final int TEXT_LEFT_X = 0;
    private static final int TEXT_RIGHT_X = 99;
    private static final int TEXT_LEFT_Y = 59;
    private static final int TEXT_RIGHT_Y = 59;
    private TETile[][] tiles;
    private long SEED;
    private Random RANDOM;
    private int numRooms;
    Set<Tuple> tupleSet = new HashSet<>();
    private Room[] rooms;
    private WeightedQuickUnionUF roomConnect;
    private static final int ROOMS_MIN = 5;
    private static final int ROOMS_MAX = 11;
    private static final int WIDTH_MIN = 10;
    private static final int WIDTH_MAX = 17;
    private TETile you = new TETile('@', blue, black, "You");
    private int[] currCoords;
    private TETile currTile = Tileset.FLOWER;
    TERenderer ter = new TERenderer();
    private boolean isPrevColon;
    private boolean isAutoGrader;
    private boolean vis;

    public World(long seed, boolean isAutograders) {
        SEED = seed;
        RANDOM = new Random(SEED);
        tiles = new TETile[WIDTH][HEIGHT];
        for (int i = 0; i < WIDTH; i++) {
            for (int j = 0; j < HEIGHT; j++) {
                tiles[i][j] = Tileset.NOTHING;
            }
        }
        numRooms = RANDOM.nextInt(ROOMS_MIN, ROOMS_MAX);
        roomConnect = new WeightedQuickUnionUF(numRooms);
        if (!isAutograders) {
            ter.initialize(WIDTH, HEIGHT);
        }
        isAutoGrader = isAutograders;
        vis = true;
    }

    public World(TETile[][] tiles, String[] coordsStrings, boolean isAutograders) {
        this.tiles = tiles;
        currCoords = new int[2];
        currCoords[0] = Integer.parseInt(coordsStrings[0]);
        currCoords[1] = Integer.parseInt(coordsStrings[1]);
        if (!isAutograders) {
            ter.initialize(WIDTH, HEIGHT);
            ter.renderFrame(tiles);
        }
        isAutoGrader = isAutograders;
        vis = true;
    }

    public void rooms() {
        rooms = setRoomArray();
    }


    public boolean fixDeadEnds() {
        boolean changed = false;
        int rows = tiles.length;
        int cols = tiles[0].length;

        for (int i = 1; i < rows - 1; i++) {
            for (int j = 1; j < cols - 1; j++) {

                if (Tileset.FLOOR.equals(tiles[i][j])) {

                    int wallCount = 0;
                    if (Tileset.WALL.equals(tiles[i - 1][j]) || Tileset.NOTHING.equals(tiles[i - 1][j])) {
                        wallCount++;
                    }
                    if (Tileset.WALL.equals(tiles[i + 1][j]) || Tileset.NOTHING.equals(tiles[i + 1][j])) {
                        wallCount++;
                    }
                    if (Tileset.WALL.equals(tiles[i][j - 1]) || Tileset.NOTHING.equals(tiles[i][j - 1])) {
                        wallCount++;
                    }
                    if (Tileset.WALL.equals(tiles[i][j + 1]) || Tileset.NOTHING.equals(tiles[i][j + 1])) {
                        wallCount++;
                    }


                    if (wallCount >= 3) {
                        tiles[i][j] = Tileset.WALL;
                        changed = true;
                    }
                }
            }
        }
        return changed;
    }




    public Room[] setRoomArray() {
        Room[] roomArr = new Room[numRooms];
        for (int i = 0; i < numRooms; i++) {
            Room newRoom = new Room(RANDOM.nextInt(WIDTH_MIN, WIDTH_MAX), RANDOM.nextInt(WIDTH_MIN, WIDTH_MAX));
            int roomX = RANDOM.nextInt(WIDTH - newRoom.getWidth());
            int roomY = RANDOM.nextInt(HEIGHT - newRoom.getHeight());
            newRoom.setStart(roomX, roomY);
            roomArr[i] = newRoom;
        }
        return roomArr;
    }

    public void placeRooms() {
        for (int i = 0; i < numRooms; i++) {
            Room currentRoom = rooms[i];
            boolean placed = false;

            while (!placed) {
                int roomX = currentRoom.getStartX();
                int roomY = currentRoom.getStartY();

                if (isRoomPlacementValid(roomX, roomY, currentRoom)) {
                    currentRoom.setStart(roomX, roomY);



                    for (int x = roomX; x < roomX + currentRoom.getWidth(); x++) {
                        for (int y = roomY; y < roomY + currentRoom.getHeight(); y++) {
                            if (x == roomX || x == roomX + currentRoom.getWidth() - 1
                                    || y == roomY || y == roomY + currentRoom.getHeight() - 1) {
                                tiles[x][y] = Tileset.WALL;
                            } else {
                                tiles[x][y] = Tileset.FLOOR;
                            }
                        }
                    }
                    placed = true;
                } else {
                    currentRoom = new Room(RANDOM.nextInt(WIDTH_MIN, WIDTH_MAX), RANDOM.nextInt(WIDTH_MIN, WIDTH_MAX));
                    int newX = RANDOM.nextInt(WIDTH - currentRoom.getWidth());
                    int newY = RANDOM.nextInt(HEIGHT - currentRoom.getHeight());
                    currentRoom.setStart(newX, newY);
                    rooms[i] = currentRoom;
                }
            }
        }
    }



    private boolean isRoomPlacementValid(int roomX, int roomY, Room currentRoom) {

        for (Room room : rooms) {
            if (room != currentRoom && currentRoom.isCollision(room)) {
                return false;
            }
        }
        return true;
    }

    public int findRoomIndex(int x, int y) {
        for (int i = 0; i < numRooms; i++) {
            Room currentRoom = rooms[i];
            int roomX = currentRoom.getStartX();
            int roomY = currentRoom.getStartY();
            int roomWidth = currentRoom.getWidth();
            int roomHeight = currentRoom.getHeight();


            if (x >= roomX && x < roomX + roomWidth && y >= roomY && y < roomY + roomHeight) {
                return i;
            }
        }
        return -1;
    }


    public Set<Integer> getAllCornerXCoordinates() {
        Set<Integer> cornerXCoordinates = new HashSet<>();

        for (Room room : rooms) {
            int roomX = room.getStartX();
            int roomWidth = room.getWidth();


            cornerXCoordinates.add(roomX);
            cornerXCoordinates.add(roomX + roomWidth - 1);
        }

        return cornerXCoordinates;
    }

    public Set<Integer> getAllCornerYCoordinates() {
        Set<Integer> cornerYCoordinates = new HashSet<>();

        for (Room room : rooms) {
            int roomY = room.getStartY();
            int roomHeight = room.getHeight();


            cornerYCoordinates.add(roomY);
            cornerYCoordinates.add(roomY + roomHeight - 1);
        }

        return cornerYCoordinates;
    }


    public boolean allConnected(WeightedQuickUnionUF weightedQuickUnion) {

        for (int i = 1; i < numRooms; i++) {
            if (!weightedQuickUnion.connected(0, i)) {
                return false;
            }
        }

        return true;
    }

    public void generateHallways() {
        Tuple currTuple;
        while (!allConnected(roomConnect)) {
            int room1 = RANDOM.nextInt(0, numRooms);
            int room2 = RANDOM.nextInt(0, numRooms);
            currTuple = new Tuple(room1, room2);
            if (!tupleSet.contains(currTuple) && room1 != room2) {
                tupleSet.add(currTuple);
                connectRooms(room1, room2);
            }

        }
    }

    public ArrayList<Integer> getStarterValues(int roomA, int roomB) {
        Room room1 = rooms[roomA];
        Room room2 = rooms[roomB];

        int room1X1 = room1.getStartX();
        int room1Y1 = room1.getStartY();

        int room2X1 = room2.getStartX();
        int room2Y1 = room2.getStartY();

        int randomX1 = room1X1 + RANDOM.nextInt(1, room1.getWidth() - 1);
        int randomY1 = room1Y1 + RANDOM.nextInt(1, room1.getHeight() - 1);
        int randomX2 = room2X1 + RANDOM.nextInt(1, room2.getWidth() - 1);
        int randomY2 = room2Y1 + RANDOM.nextInt(1, room2.getHeight() - 1);
        Set<Integer> yCoords = getAllCornerYCoordinates();
        Set<Integer> xCoords = getAllCornerXCoordinates();
        while (yCoords.contains(randomY2)) {
            randomY2 = room2Y1 + RANDOM.nextInt(1, room2.getHeight() - 1);
        }
        while (yCoords.contains(randomY1)) {
            randomY1 = room1Y1 + RANDOM.nextInt(1, room1.getHeight() - 1);
        }

        while (xCoords.contains(randomX1)) {
            randomX1 = room1X1 + RANDOM.nextInt(1, room1.getWidth() - 1);
        }

        while (xCoords.contains(randomX2)) {
            randomX2 = room2X1 + RANDOM.nextInt(1, room2.getWidth() - 1);
        }

        int dx = randomX2 - randomX1;
        int dy = randomY2 - randomY1;
        return new ArrayList<>(Arrays.asList(randomX1, randomY1, dx, dy));

    }

    public void connectRooms(int roomA, int roomB) {
        boolean inRoom = true;
        int currRoom = roomA;
        ArrayList<Integer> starterVals = getStarterValues(roomA, roomB);
        int randomX1 = starterVals.get(0);
        int randomY1 = starterVals.get(1);
        int dx = starterVals.get(2);
        int dy = starterVals.get(3);
        boolean dyInd = dy > 0;
        int currX = randomX1;
        int currY = randomY1;
        boolean corner = false;
        if (dy == 0) {
            corner = true;
        }
        while (dy != 0 || dx != 0) {
            if (dy < 0) {
                List<Boolean> checkers = dyPos(currX, currY, inRoom, currRoom, roomB);
                inRoom = checkers.get(1);
                if (checkers.get(0)) {
                    break;
                }
                currY--;
                dy++;
            } else if (dy > 0) {
                List<Boolean> checkers = dyPos(currX, currY, inRoom, currRoom, roomB);
                inRoom = checkers.get(1);
                if (checkers.get(0)) {
                    break;
                }
                currY++;
                dy--;
            } else if (dx < 0) {
                List<Boolean> checkers = dxNeg(currX, currY, inRoom, currRoom, roomB, corner, dyInd);
                inRoom = checkers.get(1);
                if (checkers.get(0)) {
                    break;
                }
                currX--;
                dx++;
                corner = true;
            } else if (dx > 0) {
                if (tiles[currX][currY] == Tileset.NOTHING) {
                    if (!corner) {
                        cornerDxPos(corner, dyInd, currX, currY);
                    } else {
                        tiles[currX][currY] = Tileset.FLOOR;
                        tiles[currX][currY - 1] = Tileset.WALL;
                        tiles[currX][currY + 1] = Tileset.WALL;
                    }
                } else if (tiles[currX][currY] == Tileset.WALL) {
                    tiles[currX][currY] = Tileset.FLOOR;
                    if (findRoomIndex(currX, currY) != -1) {
                        inRoom = !inRoom;
                        if (inRoom) {
                            tiles[currX][currY] = Tileset.FLOOR;

                            roomConnect.union(currRoom, findRoomIndex(currX, currY));
                            currRoom = findRoomIndex(currX, currY);
                            if (roomConnect.connected(findRoomIndex(currX, currY), roomB)) {
                                break;
                            }
                        }
                    } else {
                        tiles[currX][currY - 1] = Tileset.WALL;
                        tiles[currX][currY + 1] = Tileset.WALL;
                        tiles[currX][currY] = Tileset.FLOOR;
                    }
                }
                currX++;
                dx--;
                corner = true;
            }
        }

    }

    public void cleanUp() {
        while (true) {
            if (!this.fixDeadEnds()) {
                break;
            }
        }
        /*
        while (true) {
            if (checkRoomConnections().size() != 0) {
                for (int i = 0; i < WIDTH; i++) {
                    for (int j = 0; j < HEIGHT; j++) {
                        tiles[i][j] = Tileset.NOTHING;
                    }
                }
                numRooms = RANDOM.nextInt(ROOMS_MIN, ROOMS_MAX);
                roomConnect = new WeightedQuickUnionUF(numRooms);
                rooms();
                placeRooms();
                generateHallways();

                while (true) {
                    if (!this.fixDeadEnds()) {
                        break;
                    }
                }

            } else {
                break;
            }
        }
*/



        List<Integer> val = checkRoomConnections();

        while (val.size() != 0) {
            for (int i = 0; i < val.size(); i++) {
                int newRoom = RANDOM.nextInt(numRooms);
                if (newRoom == val.get(i)) {
                    newRoom = RANDOM.nextInt(numRooms);
                }
                connectRooms(val.get(i), newRoom);
                val = checkRoomConnections();
                if (val.isEmpty()) {
                    break;
                } else {
                    cleanUp();
                }
            }


        }


    }


    public void allDone() {
        while (true) {
            if (!this.fixDeadEnds()) {
                break;
            }
        }

        while (!checkRoomConnections().isEmpty()) {
            for (int i = 0; i < WIDTH; i++) {
                for (int j = 0; j < HEIGHT; j++) {
                    tiles[i][j] = Tileset.NOTHING;
                }
            }

            rooms();
            placeRooms();
            generateHallways();
            cleanUp();

            while (true) {
                if (!this.fixDeadEnds()) {
                    break;
                }
            }
        }
    }

    public int findClosestRoomIndex(int roomIndex) {
        if (roomIndex < 0 || roomIndex >= rooms.length) {
            throw new IllegalArgumentException("Room index out of bounds");
        }

        Room targetRoom = rooms[roomIndex];
        int closestRoomIndex = -1;
        double closestDistance = Double.MAX_VALUE;

        for (int i = 0; i < rooms.length; i++) {
            if (i == roomIndex) {
                continue;
            }

            Room otherRoom = rooms[i];
            double distance = calculateDistanceBetweenRooms(targetRoom, otherRoom);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestRoomIndex = i;
            }
        }

        return closestRoomIndex;
    }

    private double calculateDistanceBetweenRooms(Room room1, Room room2) {
        double room1CenterX = room1.getStartX() + room1.getWidth() / 2.0;
        double room1CenterY = room1.getStartY() + room1.getHeight() / 2.0;
        double room2CenterX = room2.getStartX() + room2.getWidth() / 2.0;
        double room2CenterY = room2.getStartY() + room2.getHeight() / 2.0;

        return Math.sqrt(Math.pow(room1CenterX - room2CenterX, 2) + Math.pow(room1CenterY - room2CenterY, 2));
    }


    public boolean cornerDxNeg(boolean corner, boolean dyInd, int currX, int currY) {
        if (dyInd) {
            tiles[currX][currY] = Tileset.FLOOR;
            tiles[currX][currY - 1] = Tileset.FLOOR;
            tiles[currX + 1][currY] = Tileset.WALL;
            tiles[currX + 1][currY + 1] = Tileset.WALL;
            tiles[currX][currY + 1] = Tileset.WALL;
            corner = true;
        } else {
            tiles[currX][currY] = Tileset.FLOOR;
            tiles[currX][currY + 1] = Tileset.FLOOR;
            tiles[currX + 1][currY] = Tileset.WALL;
            tiles[currX + 1][currY - 1] = Tileset.WALL;
            tiles[currX][currY - 1] = Tileset.WALL;
            corner = true;
        }
        return corner;
    }
    public boolean cornerDxPos(boolean corner, boolean dyInd, int currX, int currY) {
        if (dyInd) {
            tiles[currX][currY] = Tileset.FLOOR;
            tiles[currX][currY - 1] = Tileset.FLOOR;
            tiles[currX - 1][currY] = Tileset.WALL;
            tiles[currX - 1][currY + 1] = Tileset.WALL;
            tiles[currX][currY + 1] = Tileset.WALL;
            corner = true;
        } else {
            tiles[currX][currY] = Tileset.FLOOR;
            tiles[currX][currY + 1] = Tileset.FLOOR;
            tiles[currX - 1][currY] = Tileset.WALL;
            tiles[currX][currY - 1] = Tileset.WALL;
            tiles[currX - 1][currY - 1] = Tileset.WALL;
            corner = true;
        }
        return corner;
    }

    public List<Boolean> dyNeg(int currX, int currY, boolean inRoom, int currRoom, int roomB) {
        boolean isBreak = false;
        if (tiles[currX][currY] == Tileset.NOTHING) {
            tiles[currX - 1][currY] = Tileset.WALL;
            tiles[currX + 1][currY] = Tileset.WALL;
            tiles[currX][currY] = Tileset.FLOOR;
        }
        if (tiles[currX][currY] == Tileset.WALL) {
            if (findRoomIndex(currX, currY) != -1) {
                tiles[currX][currY] = Tileset.FLOOR;
                inRoom = !inRoom;
                if (inRoom) {
                    roomConnect.union(currRoom, findRoomIndex(currX, currY));
                    currRoom = findRoomIndex(currX, currY);
                    if (roomConnect.connected(findRoomIndex(currX, currY), roomB)) {
                        isBreak = true;
                    }
                }

            } else {
                tiles[currX - 1][currY] = Tileset.WALL;
                tiles[currX + 1][currY] = Tileset.WALL;
                tiles[currX][currY] = Tileset.FLOOR;
            }
        }
        return new ArrayList<Boolean>(Arrays.asList(isBreak, inRoom));
    }

    public List<Boolean> dyPos(int currX, int currY, boolean inRoom, int currRoom, int roomB) {
        boolean isBreak = false;
        if (tiles[currX][currY] == Tileset.NOTHING) {
            tiles[currX][currY] = Tileset.FLOOR;
            tiles[currX + 1][currY] = Tileset.WALL;
            tiles[currX - 1][currY] = Tileset.WALL;
        } else if (tiles[currX][currY] == Tileset.WALL) {
            if (findRoomIndex(currX, currY) != -1) {
                tiles[currX][currY] = Tileset.FLOOR;
                inRoom = !inRoom;
                if (inRoom) {
                    roomConnect.union(currRoom, findRoomIndex(currX, currY));
                    currRoom = findRoomIndex(currX, currY);
                    if (roomConnect.connected(findRoomIndex(currX, currY), roomB)) {
                        isBreak = true;
                    }
                }
            } else {
                tiles[currX - 1][currY] = Tileset.WALL;
                tiles[currX + 1][currY] = Tileset.WALL;
                tiles[currX][currY] = Tileset.FLOOR;
            }
        }
        return new ArrayList<Boolean>(Arrays.asList(isBreak, inRoom));
    }

    public List<Boolean> dxNeg(int currX, int currY, boolean inRoom, int currRoom, int roomB,
                               boolean corner, boolean dyInd) {
        boolean isBreak = false;
        if (tiles[currX][currY] == Tileset.NOTHING) {
            if (!corner) {
                corner = cornerDxNeg(corner, dyInd, currX, currY);
            } else {
                tiles[currX][currY] = Tileset.FLOOR;
                tiles[currX][currY - 1] = Tileset.WALL;
                tiles[currX][currY + 1] = Tileset.WALL;
            }
        } else if (tiles[currX][currY] == Tileset.WALL) {
            tiles[currX][currY] = Tileset.FLOOR;
            if (findRoomIndex(currX, currY) != -1) {

                inRoom = !inRoom;
                if (inRoom) {
                    roomConnect.union(currRoom, findRoomIndex(currX, currY));
                    currRoom = findRoomIndex(currX, currY);
                    if (roomConnect.connected(findRoomIndex(currX, currY), roomB)) {
                        isBreak = true;
                    }
                }

            } else {
                tiles[currX][currY] = Tileset.FLOOR;
                tiles[currX][currY + 1] = Tileset.WALL;
                tiles[currX][currY - 1] = Tileset.WALL;
            }
        }
        return new ArrayList<Boolean>(Arrays.asList(isBreak, inRoom));
    }


    public List<Boolean> dxPos(int currX, int currY, boolean inRoom, int currRoom, int roomB,
                               boolean corner, boolean dyInd) {
        boolean isBreak = false;
        if (tiles[currX][currY] == Tileset.NOTHING) {
            if (!corner) {
                cornerDxPos(corner, dyInd, currX, currY);
            } else {
                tiles[currX][currY] = Tileset.FLOOR;
                tiles[currX][currY - 1] = Tileset.WALL;
                tiles[currX][currY + 1] = Tileset.WALL;
            }
        } else if (tiles[currX][currY] == Tileset.WALL) {
            tiles[currX][currY] = Tileset.FLOOR;
            if (findRoomIndex(currX, currY) != -1) {
                inRoom = !inRoom;
                if (inRoom) {
                    tiles[currX][currY] = Tileset.FLOOR;

                    roomConnect.union(currRoom, findRoomIndex(currX, currY));
                    currRoom = findRoomIndex(currX, currY);
                    if (roomConnect.connected(findRoomIndex(currX, currY), roomB)) {
                        isBreak = true;
                    }
                }
            } else {
                tiles[currX][currY - 1] = Tileset.WALL;
                tiles[currX][currY + 1] = Tileset.WALL;
                tiles[currX][currY] = Tileset.FLOOR;
            }
        }
        return new ArrayList<Boolean>(Arrays.asList(isBreak, inRoom));
    }

    public List<Integer> checkRoomConnections() {
        boolean[][] visited = new boolean[WIDTH][HEIGHT];
        ArrayList<Integer> notConnect = new ArrayList<Integer>();

        floodFill(rooms[0].getStartX() + 1, rooms[0].getStartY() + 1, visited);

        for (int i = 0; i < rooms.length; i++) {
            if (!isRoomConnected(rooms[i], visited)) {
                notConnect.add(i);
            }
        }


        return notConnect;
    }

    private void floodFill(int x, int y, boolean[][] visited) {
        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) {
            return;
        }
        if (!Tileset.FLOOR.equals(tiles[x][y]) || visited[x][y]) {
            return;
        }
        visited[x][y] = true;


        floodFill(x + 1, y, visited);
        floodFill(x - 1, y, visited);
        floodFill(x, y + 1, visited);
        floodFill(x, y - 1, visited);
    }

    private boolean isRoomConnected(Room room, boolean[][] visited) {

        for (int x = room.getStartX(); x < room.getStartX() + room.getWidth(); x++) {
            for (int y = room.getStartY(); y < room.getStartY() + room.getHeight(); y++) {
                if (visited[x][y]) {
                    return true;
                }
            }
        }
        return false;
    }


    public int[] getRandomCoordinateInsideRoom(Room room) {


        int randomX = 1 + RANDOM.nextInt(room.getWidth() - 2);
        int randomY = 1 + RANDOM.nextInt(room.getHeight() - 2);

        randomX += room.getStartX();
        randomY += room.getStartY();

        return new int[]{randomX, randomY};
    }

    public void addUser() {
        int roomSelected = RANDOM.nextInt(numRooms);
        currCoords = getRandomCoordinateInsideRoom(rooms[roomSelected]);
        tiles[currCoords[0]][currCoords[1]] = you;
        if (!isAutoGrader) {
            ter.renderFrame(getTiles());
        }
    }

    public void tryMove(int dx, int dy) {
        int currentX = currCoords[0];
        int currentY = currCoords[1];
        int newX = currentX + dx;
        int newY = currentY + dy;

        if (newX < 0 || newY < 0 || newX >= tiles.length || newY >= tiles[0].length) {
            return;
        }


        if (tiles[newX][newY].equals(Tileset.WALL)) {
            return;
        }


        tiles[newX][newY] = you;
        tiles[currentX][currentY] = Tileset.FLOOR;
        currCoords[0] = newX;
        currCoords[1] = newY;
    }

    public void draw() {
        if (vis) {
            ter.drawTiles(getTiles());
        } else {
            ter.drawSquare(getTiles(), currCoords);
        }
    }

    public boolean updateGame() {

        boolean returnVal = false;
        if (StdDraw.hasNextKeyTyped()) {
            char nextKey = StdDraw.nextKeyTyped();
            if (nextKey == 'w' || nextKey == 'W') {
                tryMove(0, 1);
                draw();
                isPrevColon = false;
            } else if (nextKey == 'a' || nextKey == 'A') {
                tryMove(-1, 0);
                draw();
                isPrevColon = false;
            } else if (nextKey == 's' || nextKey == 'S') {
                tryMove(0, -1);
                draw();
                isPrevColon = false;
            } else if (nextKey == 'd' || nextKey == 'D') {
                tryMove(1, 0);
                draw();
                isPrevColon = false;
            } else if (nextKey == 't' || nextKey == 'T') {
                vis = false;
                isPrevColon = false;
            } else if (nextKey == 'r' || nextKey == 'R') {
                vis = true;
                isPrevColon = false;
            } else if (nextKey == ':') {
                isPrevColon = true;
            } else if ((nextKey == 'q' || nextKey == 'Q') && isPrevColon) {
                saveTiles();
                returnVal = true;
            } else {
                isPrevColon = false;
            }
        }
        Map<TETile, String> pairs = new HashMap<>();
        pairs.put(Tileset.WALL, "wall");
        pairs.put(Tileset.FLOOR, "floor");
        pairs.put(you, "you");
        pairs.put(Tileset.NOTHING, "nothing");

        int currX = (int) (StdDraw.mouseX());
        int currY = (int) (StdDraw.mouseY());

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        String formattedDateTime = now.format(formatter);

        StdDraw.clear(Color.BLACK);
        draw();
        StdDraw.setFont(new Font("Arial", Font.BOLD, FONT_SIZE_TOP));
        StdDraw.setPenColor(StdDraw.WHITE);
        StdDraw.textLeft(TEXT_LEFT_X, TEXT_LEFT_Y, "Current Tile: " + pairs.get(currTile));
        StdDraw.textRight(TEXT_RIGHT_X, TEXT_RIGHT_Y, formattedDateTime);
        StdDraw.show();

        currTile = tiles[currX][currY];

        if (currY != TOO_FAR && !currTile.equals(tiles[currX][currY])) {
            StdDraw.clear(Color.BLACK);
            if (vis) {
                ter.drawTiles(getTiles());
            } else {
                ter.drawSquare(getTiles(), currCoords);
            }
            StdDraw.setFont(new Font("Arial", Font.BOLD, FONT_SIZE_TOP));
            StdDraw.setPenColor(StdDraw.WHITE);
            StdDraw.textLeft(TEXT_LEFT_X, TEXT_LEFT_Y, "Current Tile: " + pairs.get(currTile));
            StdDraw.textRight(TEXT_RIGHT_X, TEXT_RIGHT_Y, formattedDateTime);
            StdDraw.show();
            currTile = tiles[currX][currY];
        }
        return returnVal;
    }



    public void runGame() {
        boolean quit;
        while (true) {
            quit = updateGame();
            if (quit) {
                System.exit(0);
            }
        }
    }

    public void saveTiles() {

        Map<TETile, String> pairs = new HashMap<>();
        pairs.put(Tileset.WALL, "wall");
        pairs.put(Tileset.FLOOR, "floor");
        pairs.put(you, "you");
        pairs.put(Tileset.NOTHING, "nothing");

        try (BufferedWriter writer = new BufferedWriter(new FileWriter("tiles.txt"))) {
            for (int i = 0; i < tiles.length; i++) {
                for (int j = 0; j < tiles[i].length; j++) {
                    String tileString = pairs.get(tiles[i][j]);
                    if (tileString == null) {
                        tileString = "unknown";
                    }
                    writer.write(tileString);
                    if (j < tiles[i].length - 1) {
                        writer.write(", ");
                    }
                }
                writer.newLine();
            }

            String coordString = currCoords[0] + "," + currCoords[1];
            writer.write(coordString);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public TETile[][] getTiles() {
        return tiles;
    }


}

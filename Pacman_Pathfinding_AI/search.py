# search.py
# Implements uninformed and informed search algorithms (DFS, BFS, UCS, A*) for intelligent agents.



"""
In search.py, you will implement generic search algorithms which are called by
Pacman agents (in searchAgents.py).
"""

import util
from game import Directions
from typing import List

class SearchProblem:
    """
    This class outlines the structure of a search problem, but doesn't implement
    any of the methods (in object-oriented terminology: an abstract class).

    You do not need to change anything in this class, ever.
    """

    def getStartState(self):
        """
        Returns the start state for the search problem.
        """
        util.raiseNotDefined()

    def isGoalState(self, state):
        """
          state: Search state

        Returns True if and only if the state is a valid goal state.
        """
        util.raiseNotDefined()

    def getSuccessors(self, state):
        """
          state: Search state

        For a given state, this should return a list of triples, (successor,
        action, stepCost), where 'successor' is a successor to the current
        state, 'action' is the action required to get there, and 'stepCost' is
        the incremental cost of expanding to that successor.
        """
        util.raiseNotDefined()

    def getCostOfActions(self, actions):
        """
         actions: A list of actions to take

        This method returns the total cost of a particular sequence of actions.
        The sequence must be composed of legal moves.
        """
        util.raiseNotDefined()




def tinyMazeSearch(problem: SearchProblem) -> List[Directions]:
    """
    Returns a sequence of moves that solves tinyMaze.  For any other maze, the
    sequence of moves will be incorrect, so only use this for tinyMaze.
    """
    s = Directions.SOUTH
    w = Directions.WEST
    return  [s, s, w, s, w, w, s, w]

def depthFirstSearch(problem: SearchProblem) -> List[Directions]:
    """
    Search the deepest nodes in the search tree first.

    Your search algorithm needs to return a list of actions that reaches the
    goal. Make sure to implement a graph search algorithm.

    To get started, you might want to try some of these simple commands to
    understand the search problem that is being passed in:

    print("Start:", problem.getStartState())
    print("Is the start a goal?", problem.isGoalState(problem.getStartState()))
    print("Start's successors:", problem.getSuccessors(problem.getStartState()))
    """
    startstate = problem.getStartState()
    stack = util.Stack()
    stack.push((startstate, []))
    visited = []
    actions = []
    while not stack.isEmpty():
        curstate = stack.pop()
        if problem.isGoalState(curstate[0]):
            actions = curstate[1]
            return actions
        if curstate[0] not in visited:
            visited.append(curstate[0])
            suc = problem.getSuccessors(curstate[0])
            for x in suc:
                if x[0] not in visited:
                    stack.push((x[0], curstate[1] + [x[1]]))
    return actions

def breadthFirstSearch(problem: SearchProblem) -> List[Directions]:
    """Search the shallowest nodes in the search tree first."""
    startstate = problem.getStartState()
    queue = util.Queue()
    queue.push((startstate, []))
    visited = []
    actions = []
    while not queue.isEmpty():
        curstate = queue.pop()
        if problem.isGoalState(curstate[0]):
            actions = curstate[1]
            return actions
        if curstate[0] not in visited:
            visited.append(curstate[0])
            suc = problem.getSuccessors(curstate[0])
            for x in suc:
                if x[0] not in visited:
                    queue.push((x[0], curstate[1] + [x[1]]))
    return actions

def uniformCostSearch(problem: SearchProblem) -> List[Directions]:
    """Search the node of least total cost first."""
    startstate = problem.getStartState()
    pqueue = util.PriorityQueue()
    pqueue.push((startstate, [], 0), 0)
    visited = []
    actions = []
    while not pqueue.isEmpty():
        curstate = pqueue.pop()
        if problem.isGoalState(curstate[0]):
            actions = curstate[1]
            return actions
        if curstate[0] not in visited:
            visited.append(curstate[0])
            suc = problem.getSuccessors(curstate[0])
            for x in suc:
                if x[0] not in visited:
                    pqueue.push((x[0], curstate[1] + [x[1]], curstate[2] + x[2]), curstate[2] + x[2])
    return actions

def nullHeuristic(state, problem=None) -> float:
    """
    A heuristic function estimates the cost from the current state to the nearest
    goal in the provided SearchProblem.  This heuristic is trivial.
    """
    return 0

def aStarSearch(problem: SearchProblem, heuristic=nullHeuristic) -> List[Directions]:
    """Search the node that has the lowest combined cost and heuristic first."""
    startstate = problem.getStartState()
    pqueue = util.PriorityQueue()
    pqueue.push((startstate, [], heuristic(startstate, problem)), heuristic(startstate, problem))
    visited = {}
    actions = []
    while not pqueue.isEmpty():
        curstate = pqueue.pop()
        if problem.isGoalState(curstate[0]):
            actions = curstate[1]
            return actions
        if curstate[0] not in visited or visited[curstate[0]] > curstate[2]:
            visited[curstate[0]] = curstate[2]
            suc = problem.getSuccessors(curstate[0])
            for x in suc:
                pqueue.push((x[0], curstate[1] + [x[1]], (curstate[2] + x[2])), (curstate[2] + x[2]) + heuristic(x[0], problem))
    return actions

# Abbreviations
bfs = breadthFirstSearch
dfs = depthFirstSearch
astar = aStarSearch
ucs = uniformCostSearch
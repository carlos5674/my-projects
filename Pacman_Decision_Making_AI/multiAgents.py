# multiAgents.py
# Implements decision-making agents for adversarial search in a Pacman environment.



from util import manhattanDistance
from game import Directions
import random, util

from game import Agent
from pacman import GameState

class ReflexAgent(Agent):
    """
    A reflex agent chooses an action at each choice point by examining
    its alternatives via a state evaluation function.

    The code below is provided as a guide.  You are welcome to change
    it in any way you see fit, so long as you don't touch our method
    headers.
    """


    def getAction(self, gameState: GameState):
        """
        You do not need to change this method, but you're welcome to.

        getAction chooses among the best options according to the evaluation function.

        Just like in the previous project, getAction takes a GameState and returns
        some Directions.X for some X in the set {NORTH, SOUTH, WEST, EAST, STOP}
        """
        # Collect legal moves and successor states
        legalMoves = gameState.getLegalActions()

        # Choose one of the best actions
        scores = [self.evaluationFunction(gameState, action) for action in legalMoves]
        bestScore = max(scores)
        bestIndices = [index for index in range(len(scores)) if scores[index] == bestScore]
        chosenIndex = random.choice(bestIndices) # Pick randomly among the best

        "Add more of your code here if you want to"

        return legalMoves[chosenIndex]

    def evaluationFunction(self, currentGameState: GameState, action):
        """
        Design a better evaluation function here.

        The evaluation function takes in the current and proposed successor
        GameStates (pacman.py) and returns a number, where higher numbers are better.

        The code below extracts some useful information from the state, like the
        remaining food (newFood) and Pacman position after moving (newPos).
        newScaredTimes holds the number of moves that each ghost will remain
        scared because of Pacman having eaten a power pellet.

        Print out these variables to see what you're getting, then combine them
        to create a masterful evaluation function.
        """
        # Useful information you can extract from a GameState (pacman.py)
        successorGameState = currentGameState.generatePacmanSuccessor(action)
        newPos = successorGameState.getPacmanPosition()
        newFood = successorGameState.getFood()
        newGhostStates = successorGameState.getGhostStates()
        newScaredTimes = [ghostState.scaredTimer for ghostState in newGhostStates]
        foodLoc = newFood.asList()
        dist = [util.manhattanDistance(newPos, x) for x in foodLoc]
        ghosts = [y.getPosition() for y in newGhostStates]
        gdist = [util.manhattanDistance(newPos, z) for z in ghosts]
        val = successorGameState.getScore() + currentGameState.getScore()
        if len(dist) > 0:
            val += 1/min(dist)
        if min(gdist) < 2:
            val -= 500
        return val

def scoreEvaluationFunction(currentGameState: GameState):
    """
    This default evaluation function just returns the score of the state.
    The score is the same one displayed in the Pacman GUI.

    This evaluation function is meant for use with adversarial search agents
    (not reflex agents).
    """
    return currentGameState.getScore()

class MultiAgentSearchAgent(Agent):
    """
    This class provides some common elements to all of your
    multi-agent searchers.  Any methods defined here will be available
    to the MinimaxPacmanAgent, AlphaBetaPacmanAgent & ExpectimaxPacmanAgent.

    You *do not* need to make any changes here, but you can if you want to
    add functionality to all your adversarial search agents.  Please do not
    remove anything, however.

    Note: this is an abstract class: one that should not be instantiated.  It's
    only partially specified, and designed to be extended.  Agent (game.py)
    is another abstract class.
    """

    def __init__(self, evalFn = 'scoreEvaluationFunction', depth = '2'):
        self.index = 0 # Pacman is always agent index 0
        self.evaluationFunction = util.lookup(evalFn, globals())
        self.depth = int(depth)

class MinimaxAgent(MultiAgentSearchAgent):
    """
    Your minimax agent (question 2)
    """

    def getAction(self, gameState: GameState):
        """
        Returns the minimax action from the current gameState using self.depth
        and self.evaluationFunction.

        Here are some method calls that might be useful when implementing minimax.

        gameState.getLegalActions(agentIndex):
        Returns a list of legal actions for an agent
        agentIndex=0 means Pacman, ghosts are >= 1

        gameState.generateSuccessor(agentIndex, action):
        Returns the successor game state after an agent takes an action

        gameState.getNumAgents():
        Returns the total number of agents in the game

        gameState.isWin():
        Returns whether or not the game state is a winning state

        gameState.isLose():
        Returns whether or not the game state is a losing state
        """
        def value(state, depth, agentIndex):
            if state.isWin() or state.isLose() or depth == 0:
                return (self.evaluationFunction(state), None)
            if agentIndex == 0:
                return maxValue(state, depth, agentIndex)
            else:
                return minValue(state, depth, agentIndex)

        def maxValue(state, depth, agentIndex):
            v = float('-inf')
            action = 0
            for x in state.getLegalActions(agentIndex):
                successor = state.generateSuccessor(agentIndex, x)
                val = value(successor, depth, agentIndex + 1)[0]
                if val > v:
                    v = val
                    action = x
            return (v, action)

        def minValue(state, depth, agentIndex):
            v = float('inf')
            action = 0
            for x in state.getLegalActions(agentIndex):
                successor = state.generateSuccessor(agentIndex, x)
                if agentIndex < state.getNumAgents() - 1:
                    val = value(successor, depth, agentIndex + 1)[0]
                else:
                    val = value(successor, depth - 1, 0)[0]
                if val < v:
                    v = val
                    action = x
            return (v, action)
        return value(gameState, self.depth, 0)[1]


class AlphaBetaAgent(MultiAgentSearchAgent):
    """
    Your minimax agent with alpha-beta pruning (question 3)
    """

    def getAction(self, gameState: GameState):
        """
        Returns the minimax action using self.depth and self.evaluationFunction
        """
        def value(state, depth, agentIndex, alpha, beta):
            if state.isWin() or state.isLose() or depth == 0:
                return (self.evaluationFunction(state), None)
            if agentIndex == 0:
                return maxValue(state, depth, agentIndex, alpha, beta)
            else:
                return minValue(state, depth, agentIndex, alpha, beta)

        def maxValue(state, depth, agentIndex, alpha, beta):
            v = float('-inf')
            action = 0
            for x in state.getLegalActions(agentIndex):
                successor = state.generateSuccessor(agentIndex, x)
                val = value(successor, depth, agentIndex + 1, alpha, beta)[0]
                if val > v:
                    v = val
                    action = x
                if v > beta:
                    return (v, action)
                else:
                    alpha = max(alpha, v)
            return (v, action)

        def minValue(state, depth, agentIndex, alpha, beta):
            v = float('inf')
            action = 0
            for x in state.getLegalActions(agentIndex):
                successor = state.generateSuccessor(agentIndex, x)
                if agentIndex < state.getNumAgents() - 1:
                    val = value(successor, depth, agentIndex + 1, alpha, beta)[0]
                else:
                    val = value(successor, depth - 1, 0, alpha, beta)[0]
                if val < v:
                    v = val
                    action = x
                if v < alpha:
                    return (v, action)
                else:
                    beta = min(beta, v)
            return (v, action)
        return value(gameState, self.depth, 0, float('-inf'), float('inf'))[1]

class ExpectimaxAgent(MultiAgentSearchAgent):
    """
      Your expectimax agent (question 4)
    """

    def getAction(self, gameState: GameState):
        """
        Returns the expectimax action using self.depth and self.evaluationFunction

        All ghosts should be modeled as choosing uniformly at random from their
        legal moves.
        """
        def value(state, depth, agentIndex):
            if state.isWin() or state.isLose() or depth == 0:
                return (self.evaluationFunction(state), None)
            if agentIndex == 0:
                return maxValue(state, depth, agentIndex)
            else:
                return expValue(state, depth, agentIndex)

        def maxValue(state, depth, agentIndex):
            v = float('-inf')
            action = 0
            for x in state.getLegalActions(agentIndex):
                successor = state.generateSuccessor(agentIndex, x)
                val = value(successor, depth, agentIndex + 1)[0]
                if val > v:
                    v = val
                    action = x
            return (v, action)

        def expValue(state, depth, agentIndex):
            v = 0
            action = 0
            for x in state.getLegalActions(agentIndex):
                successor = state.generateSuccessor(agentIndex, x)
                prob = 1/len(state.getLegalActions(agentIndex))
                if agentIndex < state.getNumAgents() - 1:
                    v += prob * value(successor, depth, agentIndex + 1)[0]
                else:
                    v += prob * value(successor, depth - 1, 0)[0]
            return (v, None)
        return value(gameState, self.depth, 0)[1]

def betterEvaluationFunction(currentGameState: GameState):
    """
    Your extreme ghost-hunting, pellet-nabbing, food-gobbling, unstoppable
    evaluation function (question 5).

    DESCRIPTION: <write something here so we know what you did>
    """
    pos = currentGameState.getPacmanPosition()
    food = currentGameState.getFood()
    ghostStates = currentGameState.getGhostStates()
    scaredTimes = [ghostState.scaredTimer for ghostState in ghostStates]
    foodLoc = food.asList()
    dist = [util.manhattanDistance(pos, x) for x in foodLoc]
    ghosts = [y.getPosition() for y in ghostStates]
    gdist = [util.manhattanDistance(pos, z) for z in ghosts]
    val = currentGameState.getScore() + currentGameState.getScore()
    if len(dist) > 0:
        val += 1/min(dist)
    if min(gdist) < 11:
        val -= 100
    if sum(scaredTimes) > 0:
        val += 100
    return val



# Abbreviation
better = betterEvaluationFunction
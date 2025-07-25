# valueIterationAgents.py
# Implements value iteration for solving Markov Decision Processes (MDPs) in a grid-based environment.



# valueIterationAgents.py
# -----------------------

import mdp, util

from learningAgents import ValueEstimationAgent
import collections

class ValueIterationAgent(ValueEstimationAgent):
    """
        * Please read learningAgents.py before reading this.*

        A ValueIterationAgent takes a Markov decision process
        (see mdp.py) on initialization and runs value iteration
        for a given number of iterations using the supplied
        discount factor.
    """
    def __init__(self, mdp: mdp.MarkovDecisionProcess, discount = 0.9, iterations = 100):
        """
          Your value iteration agent should take an mdp on
          construction, run the indicated number of iterations
          and then act according to the resulting policy.

          Some useful mdp methods you will use:
              mdp.getStates()
              mdp.getPossibleActions(state)
              mdp.getTransitionStatesAndProbs(state, action)
              mdp.getReward(state, action, nextState)
              mdp.isTerminal(state)
        """
        self.mdp = mdp
        self.discount = discount
        self.iterations = iterations
        self.values = util.Counter() # A Counter is a dict with default 0
        self.runValueIteration()

    def runValueIteration(self):
        """
          Run the value iteration algorithm. Note that in standard
          value iteration, V_k+1(...) depends on V_k(...)'s.
        """
        for x in range(self.iterations):
            vals = util.Counter()
            for y in self.mdp.getStates():
                if not self.mdp.isTerminal(y):
                    act_vals = []
                    for z in self.mdp.getPossibleActions(y):
                        act_vals.append(self.computeQValueFromValues(y, z))
                    vals[y] = max(act_vals) if act_vals else 0
            self.values = vals



    def getValue(self, state):
        """
          Return the value of the state (computed in __init__).
        """
        return self.values[state]

    def computeQValueFromValues(self, state, action):
        """
          Compute the Q-value of action in state from the
          value function stored in self.values.
        """
        v = 0
        for x in self.mdp.getTransitionStatesAndProbs(state, action):
            v += x[1] * (self.mdp.getReward(state, action, x[0]) + (self.discount * self.getValue(x[0])))
        return v

    def computeActionFromValues(self, state):
        """
          The policy is the best action in the given state
          according to the values currently stored in self.values.

          You may break ties any way you see fit.  Note that if
          there are no legal actions, which is the case at the
          terminal state, you should return None.
        """
        if self.mdp.isTerminal(state):
            return None
        v = float('-inf')
        action = None
        for x in self.mdp.getPossibleActions(state):
            qval = self.computeQValueFromValues(state, x)
            if qval > v:
                v = qval
                action = x
        return action
    def getPolicy(self, state):
        return self.computeActionFromValues(state)

    def getAction(self, state):
        "Returns the policy at the state (no exploration)."
        return self.computeActionFromValues(state)

    def getQValue(self, state, action):
        return self.computeQValueFromValues(state, action)
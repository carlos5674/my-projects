package main;

import edu.princeton.cs.algs4.In;

import java.util.*;

public class Graph {
    private List<Node> nodes;
    private Map<String, List<Node>> words;
    private Map<Node, List<Node>> V;

    private class Node {
        private int index;
        private String[] w;

        private Node(String[] s) {
            this.index = Integer.valueOf(s[0]);
            this.w = s[1].split("\\s+");
        }
    }

    public Graph(String synsets, String hyponyms) {
        nodes = new ArrayList<>();
        words = new HashMap<>();
        V = new HashMap<>();
        In syn = new In(synsets);
        In hyp = new In(hyponyms);
        while (syn.hasNextLine()) {
            String[] ssplit = syn.readLine().split(",");
            Node sNode = new Node(ssplit);
            nodes.add(sNode);
            for (String x : sNode.w) {
                if (words.containsKey(x)) {
                    words.get(x).add(sNode);
                } else {
                    List<Node> temp = new ArrayList<>();
                    temp.add(sNode);
                    words.put(x, temp);
                }
            }
        }
        while (hyp.hasNextLine()) {
            String[] hsplit = hyp.readLine().split(",");
            for (int i = 1; i < hsplit.length; i++) {
                Node parent = nodes.get(Integer.valueOf(hsplit[0]));
                Node child = nodes.get(Integer.valueOf(hsplit[i]));
                if (V.containsKey(parent)) {
                    V.get(parent).add(child);
                } else {
                    List<Node> nlist = new ArrayList<>();
                    nlist.add(child);
                    V.put(parent, nlist);
                }
            }
        }
    }

    public List<Node> nodesList(String wrd) {
        return words.get(wrd);
    }

    public Node nodeIndex(int index) {
        return nodes.get(index);
    }

    public String[] wordList(Node n) {
        return n.w;
    }

    public List<String> hypList(String word) {
        Set<String> temp = new HashSet<>();
        if (words.containsKey(word)) {
            Set<Node> visited = new HashSet<>();
            for (Node y : words.get(word)) {
                Stack<Node> stack = new Stack<>();
                stack.push(y);
                while (!stack.isEmpty()) {
                    Node node = stack.pop();
                    if (!visited.contains(node)) {
                        visited.add(node);
                        for (String wo : node.w) {
                            if (!temp.contains(wo)) {
                                temp.add(wo);
                            }
                        }
                        if (V.get(node) != null) {
                            for (Node z : V.get(node)) {
                                stack.push(z);
                            }
                        }
                    }
                }
            }
        }
        List<String> copy = new ArrayList<>(temp);
        copy.sort(Comparator.naturalOrder());
        return copy;
    }

    public List<String> listHandler(List<String> inputs) {
        Set<String> inall = new HashSet<>();
        if (!inputs.isEmpty()) {
            for (int i = 0; i < inputs.size(); i++) {
                List<String> temp = new ArrayList<>();
                if (i == 0) {
                    temp = hypList(inputs.get(i));
                }
                for (String x: hypList(inputs.get(i))) {
                    if (inall.contains(x)) {
                        temp.add(x);
                    }
                }
                inall = new HashSet<>(temp);
            }
        }
        List<String> copy = new ArrayList<>(inall);
        copy.sort(Comparator.naturalOrder());
        return copy;
    }
}


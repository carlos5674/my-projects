package main;

import browser.NgordnetQuery;
import browser.NgordnetQueryHandler;
import ngrams.NGramMap;
import ngrams.TimeSeries;

import java.util.*;

public class HyponymsHandler extends NgordnetQueryHandler {
    private Graph g;
    private NGramMap grammap;
    public HyponymsHandler(String x, String y, String z, String w) {
        g = new Graph(x, y);
        grammap = new NGramMap(z, w);
    }
    @Override
    public String handle(NgordnetQuery q) {
        Map<Double, Set<String>> kmap = new HashMap<>();
        Set<String> kwords = new HashSet<>();
        List<String> h = g.listHandler(q.words());
        if (q.k() == 0) {
            return h.toString();
        } else if (!h.isEmpty()) {
            for (String w: h) {
                Double score = popularity(w, q.startYear(), q.endYear());
                if (kmap.containsKey(score)) {
                    kmap.get(score).add(w);
                } else {
                    Set<String> sw = new HashSet<>();
                    sw.add(w);
                    kmap.put(score, sw);
                }
            }
            List<Double> keys = new ArrayList<>(kmap.keySet());
            keys.sort(Comparator.reverseOrder());
            for (Double i: keys) {
                if (i > 0) {
                    for (String x: kmap.get(i)) {
                        if (kwords.size() < q.k()) {
                            kwords.add(x);
                        } else {
                            break;
                        }
                    }
                } else {
                    break;
                }
            }
        }
        List<String> copy = new ArrayList<>(kwords);
        copy.sort(Comparator.naturalOrder());
        return copy.toString();
    }

    private Double popularity(String i, int startyear, int endyear) {
        TimeSeries temp = grammap.countHistory(i, startyear, endyear);
        Double result = 0.0;
        for (Double d: temp.values()) {
            result += d;
        }
        return result;
    }
}


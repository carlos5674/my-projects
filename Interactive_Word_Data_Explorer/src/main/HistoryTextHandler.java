package main;

import browser.NgordnetQuery;
import browser.NgordnetQueryHandler;
import ngrams.NGramMap;

public class HistoryTextHandler extends NgordnetQueryHandler {
    private NGramMap n;

    public HistoryTextHandler(NGramMap map) {
        this.n = map;
    }

    public String handle(NgordnetQuery query) {
        String response = "";
        for (String word : query.words()) {
            response += word + ": " + n.weightHistory(word, query.startYear(), query.endYear()).toString() + "\n";
        }
        return response;
    }
}

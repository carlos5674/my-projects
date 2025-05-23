package main;

import browser.NgordnetQuery;
import browser.NgordnetQueryHandler;
import ngrams.NGramMap;
import ngrams.TimeSeries;
import org.knowm.xchart.XYChart;
import plotting.Plotter;

import java.util.ArrayList;

public class HistoryHandler extends NgordnetQueryHandler {
    private NGramMap n;

    public HistoryHandler(NGramMap map) {
        this.n = map;
    }

    @Override
    public String handle(NgordnetQuery q) {
        ArrayList<TimeSeries> lts = new ArrayList<>();
        ArrayList<String> labels = new ArrayList<>();
        for (String word: q.words()) {
            labels.add(word);
            lts.add(n.weightHistory(word, q.startYear(), q.endYear()));
        }
        XYChart chart = Plotter.generateTimeSeriesChart(labels, lts);
        return Plotter.encodeChartAsString(chart);
    }
}

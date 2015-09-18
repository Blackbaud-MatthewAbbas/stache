/*global phantom */

(function () {
    'use strict';

    var casper = phantom.casper,
        phantomcss = phantom.phantomcss;

    casper.thenOpen(phantom.rootUrl + 'grids/fixtures/test.full.html')
    .then(function () {
        casper.then(function () {
            phantomcss.screenshot('#screenshot-grid', 'grid state');
        })
        .then(function () {
            phantomcss.screenshot('#screenshot-grid-pagination', 'grid pagination state');
        })
        .then(function () {
            casper.click('#screenshot-grid .bb-filter-btn');
            phantomcss.screenshot('#screenshot-grid', 'grid filter state');
        })
        .then(function () {
            casper.scrollTo(0, 49);
        })
        .then(function () {
            phantomcss.screenshot('.bb-grid-filters', 'grid filter viewkeeper activated');
        })
        .then(function () {
            casper.scrollTo(0, 0);
        })
        .then(function () {
            casper.click('#screenshot-grid-pagination .bb-filter-btn');
            phantomcss.screenshot('#screenshot-grid-pagination', 'grid inline filter state');
        })
        .then(function () {
            casper.click('#screenshot-grid-pagination .bb-filters-inline input[type="checkbox"]');
            phantomcss.screenshot('#screenshot-grid-pagination', 'grid inline filter active state');
        })
        .then(function () {
            casper.mouse.move('#screenshot-grid tr.ui-widget-content');
            phantomcss.screenshot('#screenshot-grid', 'grid multiselect hover');
        })
        .then(function () {
            casper.click('#screenshot-grid td input.cbox');
            phantomcss.screenshot('#screenshot-grid', 'grid multiselect selected');
        });
    });
}());

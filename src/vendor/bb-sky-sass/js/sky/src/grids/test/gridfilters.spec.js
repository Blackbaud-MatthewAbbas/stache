/*jshint browser: true, jasmine: true */
/*global angular, inject, module, $ */

describe('Grid filters', function () {
    'use strict';
    
    var basicGridHtml,
        bbMediaBreakpoints,
        bbViewKeeperBuilder,
        $compile,
        $document,
        el,
        filterGridHtml,
        fxOff,
        locals,
        $scope;
    
    function setUpGrid(gridHtml, setLocals) {
        var el = angular.element(gridHtml);
        
        $document.find('body').eq(0).append(el);
        
        if (angular.isDefined(setLocals)) {
            $scope.locals = setLocals;
        } else {
            $scope.locals = locals;
        }

        $compile(el)($scope);
        
        $scope.$digest();
        
        return el;
    }
    
    function getFilterButton(el) {
        return el.find('.bb-grid-container .grid-toolbar-container .filter-button');
    }
    
    beforeEach(module('ngMock'));
    beforeEach(module(
        'sky.grids',
        'sky.templates'
    ));
    
     
    beforeEach(inject(function (_$rootScope_, _$compile_, _$document_, _bbMediaBreakpoints_, _bbViewKeeperBuilder_) {
        $scope = _$rootScope_;
        $compile = _$compile_;
        
        $document = _$document_;
        bbMediaBreakpoints = _bbMediaBreakpoints_;
        bbViewKeeperBuilder = _bbViewKeeperBuilder_;
        
        locals = {
            gridOptions: {
                columns: [
                    {
                        caption: 'Name',
                        jsonmap: 'name',
                        id: 1,
                        name: 'name'
                    },
                    {
                        caption: 'Instrument',
                        jsonmap: 'instrument',
                        id: 2,
                        name: 'instrument'
                    },
                    {
                        caption: 'Biography',
                        jsonmap: 'bio',
                        id: 3,
                        name: 'bio'
                    }
                ],
                data: [],
                selectedColumnIds: [1, 2, 3]
            }
        };
        
        basicGridHtml = '<div><bb-grid bb-grid-options="locals.gridOptions"></bb-grid></div>';
        
        filterGridHtml = '<div><bb-grid bb-grid-options="locals.gridOptions">' + 
                '<bb-grid-filters bb-options="locals.filterOptions">' + 
                '</bb-grid-filters>' +
                '</bb-grid></div>';
        
        el = {};
        fxOff =  $.fx.off;
        //turn off jquery animate.
        $.fx.off = true;

    }));
               
    afterEach(function () {
        if (angular.isDefined(el)) {
            if (angular.isFunction(el.remove)) {
                el.remove();
            }
        }
        $.fx.off = fxOff;
    });
    
    describe('filters', function () {
        it('can hide the filter button', function () {
            var filterButtonEl;
            
            locals.gridOptions.hideFilters = true;
            
            el = setUpGrid(basicGridHtml, locals);
            
            filterButtonEl = getFilterButton(el);
            
            expect(filterButtonEl.length).toBe(1);
            expect(filterButtonEl.eq(0)).toHaveCss({"display": "none"});  
        });
        
        it('can have the filter button and filter icon open a filter flyout menu', function () {
            var filterButtonEl,
                filterFlyoutEl,
                filterIconEl;
            
            el = setUpGrid(filterGridHtml);
            
            //confirm that flyout icon is there
            filterIconEl = el.find('.bb-grid-container .grid-filters .grid-filters-icon');
            expect(filterIconEl.length).toBe(1);
            
            //click filter button
            filterButtonEl = getFilterButton(el);
            filterButtonEl.click();
            
            //confirm that flyout pane is there
            filterFlyoutEl = el.find('.bb-grid-container .grid-filters .grid-filters-container');
            expect(filterFlyoutEl.length).toBe(1);
            expect(filterFlyoutEl.eq(0)).toHaveCss({"display": "block"});
            
            //click filter button again
            filterButtonEl.click();
            //confirm that flyout pane is not there
            expect(filterFlyoutEl.length).toBe(1);
            expect(filterFlyoutEl.eq(0)).toHaveCss({"display": "none"});
        });
        
        it('can update grid filters when apply filters is called', function () {
            
            var applyFiltersEl,
                filterButtonEl,
                myFilters = {
                    filter1: 'blaaaaaah'
                };
            
            locals.filterOptions = {
                applyFilters: function (args) {
                    args.filters = angular.copy(myFilters);
                },
                clearFilters: function () {
                    
                }
            };
            
            el = setUpGrid(filterGridHtml, locals);
            
            filterButtonEl = getFilterButton(el);
            filterButtonEl.click();
            
            applyFiltersEl = el.find('.bb-grid-container .grid-filters .grid-filters-container .grid-filters-footer .btn-primary');
            applyFiltersEl.eq(0).click();
            
            expect($scope.locals.gridOptions.filters).toEqual(myFilters);
            
        });
        
        it('can update grid filters when clear filters is called', function () {
            var clearFiltersEl,
                 myFilters = {
                    filter1: ''
                };
            
            locals.filterOptions = {
                applyFilters: function () {
                    
                },
                clearFilters: function (args) {
                    args.filters = angular.copy(myFilters);
                }
            };
            
            el = setUpGrid(filterGridHtml, locals);
            
            clearFiltersEl = el.find('.bb-grid-container .grid-filters .grid-filters-container .grid-filters-footer .btn-white');
            clearFiltersEl.eq(0).click();
            
            expect($scope.locals.gridOptions.filters).toEqual(myFilters);
        });
        
        it('does not update grid filters when apply and clear filters are not specified', function () {
            var applyFiltersEl,
                clearFiltersEl;
            el = setUpGrid(filterGridHtml);
            
            applyFiltersEl = el.find('.bb-grid-container .grid-filters .grid-filters-container .grid-filters-footer .btn-primary');
            applyFiltersEl.eq(0).click();
            
            expect(angular.isUndefined($scope.locals.gridOptions.filters)).toBe(true);
            
            clearFiltersEl = el.find('.bb-grid-container .grid-filters .grid-filters-container .grid-filters-footer .btn-white');
            clearFiltersEl.eq(0).click();
            
            expect(angular.isUndefined($scope.locals.gridOptions.filters)).toBe(true);
        });
        
        it('will hide on apply when in mobile mode', function () {
            var applyFiltersEl,
                filterButtonEl,
                filterFlyoutEl,
                myFilters = {
                    filter1: 'blaaaaaah'
                };
            
            spyOn(bbMediaBreakpoints, 'getCurrent').and.returnValue({ xs: true });
            
            locals.filterOptions = {
                applyFilters: function (args) {
                    args.filters = angular.copy(myFilters);
                },
                clearFilters: function () {
                    
                }
            };
            
            el = setUpGrid(filterGridHtml, locals);
            
            filterButtonEl = getFilterButton(el);
            filterButtonEl.click();
            
            applyFiltersEl = el.find('.bb-grid-container .grid-filters .grid-filters-container .grid-filters-footer .btn-primary');
            applyFiltersEl.eq(0).click();
            
            //confirm that flyout pane is not there
            filterFlyoutEl = el.find('.bb-grid-container .grid-filters .grid-filters-container');
            expect(filterFlyoutEl.length).toBe(1);
            expect(filterFlyoutEl.eq(0)).toHaveCss({"display": "none"});
            
        });
        
        it('will update viewkeeper options when viewkeeperOffsetElId of grid is changed', function () {
            var myFilters = {
                    filter1: 'blaaaaaah'
                },
                filtersEl;
            
            locals.filterOptions = {
                applyFilters: function (args) {
                    args.filters = angular.copy(myFilters);
                },
                clearFilters: function () {
                    
                }
            };
            
            el = setUpGrid(filterGridHtml, locals);
            
            $scope.locals.gridOptions.viewKeeperOffsetElId = 'potato';
            
            $scope.$digest();
            
            filtersEl = el.find('[bb-options]');
            expect(filtersEl.length).toBe(1);
            expect(filtersEl.isolateScope().viewKeeperOptions.viewKeeperOffsetElId).toBe('potato');
            
        });
        
        it('will not update viewkeeper options when viewkeeperOffsetElId is changed if filters do not exist', function () {
            var filtersEl;
            el = setUpGrid(basicGridHtml);
            
            $scope.locals.gridOptions.viewKeeperOffsetElId = 'potato';
            
            $scope.$digest();
            
            filtersEl = el.find('[bb-options]');
            expect(filtersEl.length).toBe(0);
        });
        
        
    });
    
    describe('filters group', function () {
        it('can have a label and collapsed state', function () {
            var filterButtonEl,
                filterGroupEl,
                filterGroupGridHtml = '<div><bb-grid bb-grid-options="locals.gridOptions">' + 
                '<bb-grid-filters bb-options="locals.filterOptions">' + 
                '<bb-grid-filters-group bb-grid-filters-group-label="\'Filter group\'">' +
                '<label>Some content</label>' +
                '</bb-grid-filters-group>' +
                '</bb-grid-filters>' +
                '</bb-grid></div>';
            
            el = setUpGrid(filterGroupGridHtml);
            
            filterButtonEl = getFilterButton(el);
            filterButtonEl.click();
            
            filterGroupEl = el.find('.bb-grid-container .grid-filters .grid-filters-body .collapsible');
            
            expect(filterGroupEl.length).toBe(1);
            
            expect(filterGroupEl.eq(0).find('label').eq(0)).toHaveText('Filter group');
            
            expect(filterGroupEl.eq(0)).not.toHaveClass('collapsed');
            
            filterGroupEl.eq(0).find('div[ng-click]').eq(0).click();


            expect(filterGroupEl.eq(0)).toHaveClass('collapsed');
        }); 
    });
    
    describe('filters summary', function () {
        it('creates a filter summary below the grid toolbar', function () {
            var filterToolBarEl,
                headerEl,
                contentEl,
                filterSummaryGridHtml = '<div><bb-grid bb-grid-options="locals.gridOptions">' + 
                '<bb-grid-filters-summary bb-options="locals.filterOptions">' +
                '<span>Applied Filter</span>' +
                '</bb-grid-filters-summary>' +
                '<bb-grid-filters bb-options="locals.filterOptions">' + 
                '<bb-grid-filters-group bb-grid-filters-group-label="\'Filter group\'">' +
                '<label>Some content</label>' +
                '</bb-grid-filters-group>' +
                '</bb-grid-filters>' +
                '</bb-grid></div>';
            
            el = setUpGrid(filterSummaryGridHtml);
            
            filterToolBarEl = el.find('.bb-grid-container .grid-toolbar-container .toolbar.applied-filter-bar');
            expect(filterToolBarEl.length).toBe(1);
            
            headerEl = filterToolBarEl.eq(0).find('.applied-filter-header span');
            
            expect(headerEl.eq(0)).toHaveText('Filter:');
            
            contentEl = filterToolBarEl.eq(0).find('.applied-filter-content .applied-filter-text');
            
            expect(contentEl.eq(0)).toHaveText('Applied Filter');
            
        });
        
        it('can clear the filters by clicking on the close icon', function () {
            var filterToolBarEl,
                clearFiltersEl,
                filterSummaryGridHtml = '<div><bb-grid bb-grid-options="locals.gridOptions">' + 
                '<bb-grid-filters-summary bb-options="locals.filterOptions">' +
                '<span>Applied Filter</span>' +
                '</bb-grid-filters-summary>' +
                '<bb-grid-filters bb-options="locals.filterOptions">' + 
                '<bb-grid-filters-group bb-grid-filters-group-label="\'Filter group\'">' +
                '<label>Some content</label>' +
                '</bb-grid-filters-group>' +
                '</bb-grid-filters>' +
                '</bb-grid></div>',
                myFilters = {
                    filter1: ''
                };
            
            locals.filterOptions = {
                clearFilters: function (args) {
                    args.filters = angular.copy(myFilters);
                }
            };
            
            el = setUpGrid(filterSummaryGridHtml, locals);
            
            filterToolBarEl = el.find('.bb-grid-container .grid-toolbar-container .toolbar.applied-filter-bar');
            clearFiltersEl = filterToolBarEl.eq(0).find('.applied-filter-content .applied-filter-remove');
            
            clearFiltersEl.eq(0).click();
            
            expect($scope.locals.gridOptions.filters).toEqual(myFilters);
       
        });
        
        it('does not clear filters when no clearFilters function is defined', function () {
            var filterToolBarEl,
                clearFiltersEl,
                filterSummaryGridHtml = '<div><bb-grid bb-grid-options="locals.gridOptions">' + 
                '<bb-grid-filters-summary bb-options="locals.filterOptions">' +
                '<span>Applied Filter</span>' +
                '</bb-grid-filters-summary>' +
                '<bb-grid-filters bb-options="locals.filterOptions">' + 
                '<bb-grid-filters-group bb-grid-filters-group-label="\'Filter group\'">' +
                '<label>Some content</label>' +
                '</bb-grid-filters-group>' +
                '</bb-grid-filters>' +
                '</bb-grid></div>';
            
            el = setUpGrid(filterSummaryGridHtml);
            
            filterToolBarEl = el.find('.bb-grid-container .grid-toolbar-container .toolbar.applied-filter-bar');
            clearFiltersEl = filterToolBarEl.eq(0).find('.applied-filter-content .applied-filter-remove');
            
            clearFiltersEl.eq(0).click();
            
            expect(angular.isDefined($scope.locals.gridOptions.filters)).toBe(false);
        });
        
        it('opens the filter flyout when you click on the filter summary', function () {
            var filterFlyoutEl, 
                filterToolBarEl,
                filterSummaryEl,
                filterSummaryGridHtml = '<div><bb-grid bb-grid-options="locals.gridOptions">' + 
                '<bb-grid-filters-summary bb-options="locals.filterOptions">' +
                '<span>Applied Filter</span>' +
                '</bb-grid-filters-summary>' +
                '<bb-grid-filters bb-options="locals.filterOptions">' + 
                '<bb-grid-filters-group bb-grid-filters-group-label="\'Filter group\'">' +
                '<label>Some content</label>' +
                '</bb-grid-filters-group>' +
                '</bb-grid-filters>' +
                '</bb-grid></div>';
            
            el = setUpGrid(filterSummaryGridHtml);
            
            filterToolBarEl = el.find('.bb-grid-container .grid-toolbar-container .toolbar.applied-filter-bar');
            filterSummaryEl = filterToolBarEl.eq(0).find('.applied-filter-content');
            
            filterSummaryEl.eq(0).click();
            
            //confirm that flyout pane is there
            filterFlyoutEl = el.find('.bb-grid-container .grid-filters .grid-filters-container');
            expect(filterFlyoutEl.length).toBe(1);
            expect(filterFlyoutEl.eq(0)).toHaveCss({"display": "block"});
            
        });
        
        it('does not open the filter flyout menu if no bb-grid-filters directive exists', function () {
            var filterFlyoutEl, 
                filterToolBarEl,
                filterSummaryEl,
                filterSummaryGridHtml = '<div><bb-grid bb-grid-options="locals.gridOptions">' + 
                '<bb-grid-filters-summary bb-options="locals.filterOptions">' +
                '<span>Applied Filter</span>' +
                '</bb-grid-filters-summary>' +
                '</bb-grid></div>';
            
            el = setUpGrid(filterSummaryGridHtml);
            
            filterToolBarEl = el.find('.bb-grid-container .grid-toolbar-container .toolbar.applied-filter-bar');
            filterSummaryEl = filterToolBarEl.eq(0).find('.applied-filter-content');
            
            
            filterSummaryEl.eq(0).click();
            
            //confirm that flyout pane is there
            filterFlyoutEl = el.find('.bb-grid-container .grid-filters .grid-filters-container');
            expect(filterFlyoutEl.length).toBe(0);
        });
        
        it('syncs view keepers when visibility changes', function () {
            var filterSummaryGridHtml = '<div><bb-grid bb-grid-options="locals.gridOptions">' + 
                '<bb-grid-filters-summary bb-options="locals.filterOptions">' +
                '<span>Applied Filter</span>' +
                '</bb-grid-filters-summary>' +
                '<bb-grid-filters bb-options="locals.filterOptions">' + 
                '<bb-grid-filters-group bb-grid-filters-group-label="\'Filter group\'">' +
                '<label>Some content</label>' +
                '</bb-grid-filters-group>' +
                '</bb-grid-filters>' +
                '</bb-grid></div>',
                syncElPositionCalled = false;
            
            spyOn(bbViewKeeperBuilder, 'create').and.returnValue(
                { 
                    destroy: function () {
                        
                    },
                    scrollToTop: function () {
                        
                    },
                    syncElPosition: function () {
                        syncElPositionCalled = true; 
                    }
                    
                }
            );
            
            el = setUpGrid(filterSummaryGridHtml);
            
            el.hide();
            
            $scope.$digest();
            
            expect(syncElPositionCalled = true);
        });
        
    });
});
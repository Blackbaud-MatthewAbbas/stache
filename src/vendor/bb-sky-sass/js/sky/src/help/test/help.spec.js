/*jshint browser: true, jasmine: true */
/*global angular, inject, module, $ */

describe('Help service', function () {
    'use strict';
    
    var $compile,
        $rootScope,
        $state,
        $window,
        bbHelp,
        bbHelpConfig,
        bbHelpConfigInitialUrl;
    
    function createHelpAjaxSpy(helpWidget) {
        return spyOn($, 'ajax').and.callFake(function () {
            $window.BBHELP = {
                HelpWidget: helpWidget
            };

            return {
                done: function (callback) {
                    callback();
                }
            };
        });
    }
    
    beforeEach(module('sky.help', 'ui.router'));
    
    beforeEach(module(function ($provide) {
        $state = {
            current: {
            }
        };
        
        $provide.value('$state', $state);
    }));
    
    beforeEach(inject(function (_$compile_, _$rootScope_, _$window_, _bbHelp_, _bbHelpConfig_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        bbHelp = _bbHelp_;
        bbHelpConfig = _bbHelpConfig_;
        
        bbHelpConfigInitialUrl = bbHelpConfig.url;
        
        bbHelpConfig.url = 'http://test.com';
    }));
    
    afterEach(function () {
        delete $window.BBHELP;
        bbHelpConfig.url = bbHelpConfigInitialUrl;
    });
    
    describe('directive', function () {
        it('should throw an error when no help URL is defined', function () {
            bbHelpConfig.url = null;
            
            expect(function () {
                bbHelp.open('test.html');
            }).toThrow(new Error('bbHelpConfig.url is not defined.'));
        });
        
        it('should load the help widget from the specified URL', function () {
            var ajaxSpy = createHelpAjaxSpy({
                load: angular.noop,
                open: function (fileName) {
                    expect(fileName).toBe('test.html');
                }
            });
                
            bbHelp.open('test.html');
            
            expect(ajaxSpy).toHaveBeenCalled();
        });
        
        it('should not load help again if it is already defined', function () {
            var ajaxSpy,
                calledOpen;
            
            ajaxSpy = createHelpAjaxSpy({
                load: angular.noop,
                open: function (fileName) {
                    expect(fileName).toBe('test.html');
                    calledOpen = true;
                }
            });
            
            $window.BBHELP = {
                HelpWidget: {
                    load: angular.noop,
                    open: function (fileName) {
                        expect(fileName).toBe('test.html');
                        calledOpen = true;
                    }
                }
            };

            bbHelp.open('test.html');
            
            expect(ajaxSpy).not.toHaveBeenCalled();

            expect(calledOpen).toBe(true);
        });
        
        it('should close the help widget when close is called', function () {
            var calledClose;
            
            $window.BBHELP = {
                HelpWidget: {
                    close: function () {
                        calledClose = true;
                    }
                }
            };
                
            bbHelp.close();
            
            expect(calledClose).toBe(true);
        });
        
        it('should do nothing when close is called and no help widget is defined', function () {
            // This test should pass just by nature of no exception being thrown.
            
            bbHelp.close();
            
            $window.BBHELP = {};
            
            bbHelp.close();
        });
        
        describe('getCurrentHelpKey() method', function () {
            it('should return the current state\'s helpKeyOverride', function () {
                var ajaxSpy = createHelpAjaxSpy({
                    load: function (config) {
                        this.config = config;
                    },
                    open: function () {
                        $state.current.helpKeyOverride = 'test2.html';

                        expect(this.config.getCurrentHelpKey()).toBe('test2.html');
                    }
                });

                bbHelp.open();
                
                expect(ajaxSpy).toHaveBeenCalled();
            });
            
            it('should return the current state\'s pageData helpKey', function () {
                var ajaxSpy = createHelpAjaxSpy({
                    load: function (config) {
                        this.config = config;
                    },
                    open: function () {
                        $state.current.pageData = {
                            helpKey: 'test2.html'
                        };

                        expect(this.config.getCurrentHelpKey()).toBe('test2.html');
                    }
                });

                bbHelp.open();
                
                expect(ajaxSpy).toHaveBeenCalled();
            });
            
            it('should return null when no help key is defined', function () {
                var ajaxSpy = createHelpAjaxSpy({
                    load: function (config) {
                        this.config = config;
                    },
                    open: function () {
                        expect(this.config.getCurrentHelpKey()).toBe(null);
                    }
                });

                bbHelp.open();
                
                expect(ajaxSpy).toHaveBeenCalled();
            });
            
            it('should be able to be configured', function () {
                var ajaxSpy,
                    loadCalled;
                
                bbHelpConfig.getCurrentHelpKey = function () {
                    
                };

                ajaxSpy = createHelpAjaxSpy({
                    load: function (config) {
                        expect(config.getCurrentHelpKey).toBe(bbHelpConfig.getCurrentHelpKey);
                        loadCalled = true;
                    },
                    open: angular.noop
                });

                bbHelp.open();
                
                expect(ajaxSpy).toHaveBeenCalled();
                expect(loadCalled).toBe(true);
            });
        });
    });
});
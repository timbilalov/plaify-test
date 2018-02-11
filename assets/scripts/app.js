/* globals Raven */
/* eslint moduleName:0 */

"use strict";

(function() {
    var app;
    var slice = [].slice;

    // Hack for IE <= 8
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;

            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            }

            for (; from < len; from++) {
                if (from in this && this[from] === elt) {
                    return from;
                }
            }
            return -1;
        };
    }

    window.app = app = {
        createNS: function(namespace) {
            var i, len, nsparts, parent, part;
            nsparts = namespace.split(".");
            parent = app;

            // we want to be able to include or exclude the root namespace so we strip
            // it if it's in the namespace
            if (nsparts[0] === "app") {
                nsparts = nsparts.slice(1);
            }

            // loop through the parts and create a nested namespace if necessary
            for (i = 0, len = nsparts.length; i < len; i++) {
                part = nsparts[i];

                // check if the current parent already has the namespace declared
                // if it isn't, then create it
                if (typeof parent[part] === "undefined") {
                    parent[part] = {};
                }

                // get a reference to the deepest element in the hierarchy so far
                parent = parent[part];
            }

            return parent;
        },

        isLocal: !!document.getElementById("js-server-local"),
        isDebug: !!document.getElementById("js-server-debug"),

        utils: {
            debouncer: function(func, timeout) {
                var timeoutID;
                if (timeout == null) {
                    timeout = 200;
                }
                timeoutID = undefined;
                return function() {
                    var args, scope;
                    scope = this;
                    args = arguments;
                    clearTimeout(timeoutID);
                    timeoutID = setTimeout(function() {
                        func.apply(scope, Array.prototype.slice.call(args));
                    }, timeout);
                };
            },

            // Stealed from
            // https://github.com/VodkaBears/Remodal
            getScrollbarWidth: function() {
                var inner, outer, widthNoScroll, widthWithScroll, $wrapper, wrapper;
                $wrapper = app.commonVars.$wrapper;
                wrapper = $wrapper.get(0);
                if (!wrapper || wrapper.clientHeight <= window.innerHeight) {
                    return 0;
                }
                outer = document.createElement("div");
                inner = document.createElement("div");
                widthNoScroll = undefined;
                widthWithScroll = undefined;
                outer.style.visibility = "hidden";
                outer.style.width = "100px";
                document.body.appendChild(outer);
                widthNoScroll = outer.offsetWidth;

                // Force scrollbars
                outer.style.overflow = "scroll";

                // Add inner div
                inner.style.width = "100%";
                outer.appendChild(inner);
                widthWithScroll = inner.offsetWidth;

                // Remove divs
                outer.parentNode.removeChild(outer);
                outer = inner = null;
                return widthNoScroll - widthWithScroll;
            },

            // TODO
            // REPAINT
            // Вызывает Recalculate Style
            // Проверить, из-за чего, и можно ли избавиться
            getScrTop: function() {
                var $body, $document, $wrapper, scrTop;
                $document = app.commonVars.$document;
                $body = app.commonVars.$body;
                $wrapper = app.commonVars.$wrapper;
                scrTop = Math.max($document.scrollTop(), $body.scrollTop(), $wrapper.scrollTop(), 0);
                return scrTop;
            },

            getTime: (function() {
                var res;
                if (window.performance && typeof window.performance.now === "function") {
                    res = function(precision) {
                        if (precision == null) {
                            precision = 1;
                        }
                        return parseFloat(window.performance.now().toFixed(precision));
                    };
                } else {
                    res = function(precision) {
                        if (precision == null) {
                            precision = 1;
                        }
                        return parseFloat(new Date().getTime().toFixed(precision));
                    };
                }
                return res;
            })(),

            newMeasureFunc: function(precision) {
                var res, t0;
                if (precision == null) {
                    precision = 2;
                }
                t0 = app.utils.getTime(precision);
                res = function() {
                    var t1, t2;
                    t1 = app.utils.getTime(precision);
                    t2 = parseFloat((t1 - t0).toFixed(precision));
                    t0 = t1;
                    return t2;
                };
                return res;
            },

            getInitTimes: function() {
                var k, module, obj, ref, total;
                obj = {};
                total = 0;
                ref = app.modules;
                for (k in ref) {
                    module = ref[k];
                    if (module.initialized && module.__mName__ !== undefined) {
                        obj[module.__mName__] = module.__initTime__;
                        total += module.__initTime__;
                    }
                }
                obj.all = Math.round(total);
                return obj;
            }
        },

        loadScript: function(url, callback, error) {
            var script;
            script = document.createElement("script");

            // If "fallback" url passed as second argument
            var args = Array.prototype.slice.call(arguments);
            if (typeof callback === "string") {
                var fallbackUrl = callback;
                callback = error;
                var errorOri = args[3];
                error = function() {
                    DEBUG && console.log("%c[common] error while loading script: " + url + ". trying to load a fallback url: " + fallbackUrl, "color: red");
                    app.loadScript(fallbackUrl, callback, errorOri);

                    if (!DEBUG && typeof Raven !== "undefined") {
                        Raven.captureMessage("[common] error while loading script", {
                            level: "warning", // one of 'info', 'warning', or 'error'
                            extra: {
                                "script": url,
                                "fallback": fallbackUrl
                            }
                        });
                    }
                };
            }

            var cb = function() {
                DEBUG && console.log("%c--[common] finished loading script: " + url, "color: #999");
                if (typeof callback === "function") {
                    callback();
                }
            };

            // IE
            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        cb();
                    }
                };

            // Normal browsers
            } else {
                if (typeof error === "function") {
                    script.onerror = error;
                }
                script.onload = cb;
            }

            script.src = url;
            document.getElementsByTagName("body")[0].appendChild(script);
            DEBUG && console.log("%c--[common] starting to load script: " + url, "color: #999");
        },

        loadStyle: function(url) {
            var first, head, link;
            link = document.createElement("link");
            link.href = url;
            link.rel = "stylesheet";
            link.type = "text/css";
            head = document.getElementsByTagName("head")[0];
            first = head.firstChild;

            // Prepend styles in 'head' section
            head.insertBefore(link, first);
        },

        features: {
            // From Modernizr
            transitionEventEnd: (function() {
                var el, t, transitions;
                el = document.createElement("fakeelement");
                transitions = {
                    "transition": "transitionend",
                    "OTransition": "oTransitionEnd",
                    "MozTransition": "transitionend",
                    "WebkitTransition": "webkitTransitionEnd"
                };
                for (t in transitions) {
                    if (el.style[t] !== undefined) {
                        el = null;
                        return transitions[t];
                    }
                }
                return false;
            })()
        },

        modules: {},

        initializedModules: [],

        createModule: function() {
            var dep, dependencies, i, initFunc, j, len, mName, module, options, ref;
            mName = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []), initFunc = arguments[i++];
            if (typeof initFunc !== "function") {
                throw "Missing an initialization function for module '" + mName + "'";
            }

            // Create a namespace
            module = app.createNS("modules." + mName);
            module.__mName__ = mName;
            module.initialized = false;

            // Set dependencies
            if (options.length && options[0].length) {
                dependencies = [];
                ref = options[0];
                for (j = 0, len = ref.length; j < len; j++) {
                    dep = ref[j];
                    if (typeof dep === "string" && dependencies.indexOf(dep) < 0 && dep !== mName) {
                        dependencies.push(dep);
                    }
                }
                if (dependencies.length) {
                    module.dependencies = dependencies;
                }
            }

            // Set initialization function and behavior
            module.init = function() {
                var depModule, e, initTime, initializedModules, l, len1, t1, t2;
                try {
                    if (module.dependencies) {
                        for (l = 0, len1 = dependencies.length; l < len1; l++) {
                            dep = dependencies[l];
                            depModule = app.modules[dep];
                            if (!depModule) {
                                DEBUG && console.log("%c[modules] missed module " + dep + " as a dependency for module " + mName + ". (it's ok only if module is not required for this page)", "color: #BB6565; font-style: italic");
                                return false;
                            }
                            if (depModule.initialized) {
                                continue;
                            }
                            depModule.init();
                            if (!depModule.initialized) {
                                DEBUG && console.log("%c[modules] can't init module " + dep + " as a dependency for module " + mName + ". (it's ok only if module is not required for this page)", "color: #BB6565; font-style: italic");
                                return false;
                            }
                        }
                    }
                    t1 = app.utils.getTime();
                    if (initFunc.call(module) !== false) {
                        module.init = function() {
                            throw "[modules] module '" + mName + "' already initialized";
                        };
                        t2 = app.utils.getTime();
                        initTime = parseFloat((t2 - t1).toFixed(1));
                        module.__initTime__ = initTime;
                        DEBUG && console.log("[module " + mName + "] module initialized in " + initTime + " ms");
                        module.initialized = true;
                        initializedModules = app.initializedModules || [];
                        initializedModules.push(mName);
                        app.initializedModules = initializedModules;
                    }
                } catch (error1) {
                    e = error1;
                    if (typeof Raven !== "undefined") {
                        Raven.captureException(e);
                    }
                    app.errorHandler(e, {
                        moduleName: mName
                    });
                }
            };
            return module;
        },

        errorHandler: function(error, options) {
            var pre;
            pre = "[error]";
            if (options && options.moduleName) {
                pre += "[module " + options.moduleName + "]";
            }
            if (console && console.error) {
                console.error(pre + "\n" + error + "\nNavigator: " + window.navigator.userAgent);
            }
        }
    };

    // Unit-tests for app object
    if (DEBUG && typeof mocha !== "undefined" && typeof describe === "function") {
        mocha.setup("bdd");
        describe("app object tests", function() {
            it("Should be an object", function() {
                expect(app).to.be.an("object");
            });
            it("Should contain a loadScript function", function() {
                expect(app.loadScript).to.be.a("function");
            });
            it("Should contain a loadStyle function", function() {
                expect(app.loadStyle).to.be.a("function");
            });
            it("We can create a deep namespace scope with a string like 'ns1.ns2.ns3'", function() {
                app.createNS("ns1.ns2.ns3");
                expect(app.ns1).to.be.an("object");
                expect(app.ns1.ns2).to.be.an("object");
                expect(app.ns1.ns2.ns3).to.be.an("object");
                delete app.ns1;
            });
            it("initializedModules must be defined from the start", function() {
                expect(app.initializedModules).to.be.an("array");
            });

            describe(".modules", function() {
                it("Should be a function to create modules", function() {
                    expect(app.createModule).to.be.a("function");
                });
                it("We can simply create a single module", function() {
                    var module, testFunc;
                    testFunc = function() {
                        console.log("test module init");
                    };
                    var mName = "testmodule" + Math.round(Math.random() * 100);
                    module = app.createModule(mName, testFunc);
                    expect(module).to.be.equal(app.modules[mName]);
                    app.initializedModules.splice(app.initializedModules.indexOf(mName), 1);
                    delete app.modules[mName];
                });
                it("We can't create a module without initialization function", function() {
                    var module;
                    module = function() {
                        app.createModule("testmodule");
                    };
                    expect(module).to["throw"];
                });
                it("Each module must have an init function", function() {
                    var module;
                    for (module in app.modules) {
                        expect(app.modules[module].init).to.be.a("function");
                    }
                });
                it("Should throw an exception if we try to initialize a module twice", function() {
                    var mName, module, testFunc;
                    mName = "testmodule" + Math.round(Math.random() * 100);
                    testFunc = function() {
                        return 1;
                    };
                    module = app.createModule(mName, testFunc);
                    module.init();
                    expect(module.init).to["throw"];
                    app.initializedModules.splice(app.initializedModules.indexOf(mName), 1);
                    delete app.modules[mName];
                });
            });
        });
    }



    var appInitFunc = function() {
        var benchmarkCloseBtn, benchmarkDiv, criticalInitTime, dColor, fTime, initTimes, m, module, moduleName, t, time, warningModules;
        if (DEBUG) {
            t = app.utils.getTime();
        }

        // Initialize app modules
        for (m in app.modules) {
            module = app.modules[m];
            if (!module.initialized && typeof module.init === "function") {
                module.init();
            }
        }
        if (DEBUG) {
            fTime = Math.round(app.utils.getTime() - t);
            dColor = fTime < 200 ? "green" : "red";
            console.log("%c[common] document ready event fired, " + app.initializedModules.length + " modules initialized in " + fTime + " ms: " + ((function() {
                var i, len, ref, results;
                ref = app.initializedModules;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    m = ref[i];
                    results.push(" " + m + "(" + app.modules[m].__initTime__ + "ms)");
                }
                return results;
            })()), "color: " + dColor);
        }

        // Add benchmark div
        benchmarkDiv = document.getElementById("benchmark");
        if (typeof app.utils.getInitTimes === "function" && (DEBUG || window.location.hash === "#benchmark") && !benchmarkDiv) {
            benchmarkDiv = document.createElement("div");
            benchmarkDiv.className = "benchmark";
            benchmarkDiv.id = "benchmark";
            if (typeof app.utils.getInitTimes === "function") {
                benchmarkDiv.innerHTML = "<small style=\"opacity: 0.7\">modules (ms):" + ((function() {
                    var ref, results;
                    ref = app.utils.getInitTimes();
                    results = [];
                    for (m in ref) {
                        t = ref[m];
                        results.push(" " + m + ": " + t);
                    }
                    return results;
                })()) + "</small>";
            }

            // Add close button
            benchmarkCloseBtn = document.createElement("a");
            benchmarkCloseBtn.onclick = function() {
                benchmarkDiv.parentNode.removeChild(benchmarkDiv);
            };
            benchmarkCloseBtn.innerHTML = "X";
            benchmarkCloseBtn.className = "benchmark__close";
            benchmarkDiv.appendChild(benchmarkCloseBtn);
            document.body.appendChild(benchmarkDiv);
        }

        // Check for "too complex" modules
        // WARNING иногда такие "ошибки" возникают спонтанно
        // (например, все модули инициализируются за 0-2 мс, а один "выстрелил" на 300 мс).
        // Если это станет мешать проектам, то можно данные предупреждения
        // из логгера убрать.
        if (!DEBUG && typeof Raven !== "undefined") {
            initTimes = app.utils.getInitTimes();
            warningModules = [];
            criticalInitTime = 50;
            for (moduleName in initTimes) {
                time = initTimes[moduleName];
                if (moduleName === "all") {
                    continue;
                }
                if (time > criticalInitTime) {
                    warningModules.push(moduleName);
                }
            }

            //  CHANGED: Вот именно из-за того, что один из модулей может
            //  случайно инициализироваться за какое-то неадекватно большое для него время.
            //  if warningModules.length > 0
            if (warningModules.length > 1) {
                Raven.captureMessage("[common] detected some \"long\" (initTime > " + criticalInitTime + " ms) modules", {
                    level: "warning", // one of 'info', 'warning', or 'error'
                    extra: initTimes
                });
            }
        }

        // If unit tests library loaded, just load a file with tests
        if (typeof mocha !== "undefined") {
            mocha.setup("bdd");
            mocha.run();
        }
    };

    // Document ready event
    if ("addEventListener" in document) {
        document.addEventListener("DOMContentLoaded", appInitFunc, false);

    // .. IE <= 8
    } else if ("attachEvent" in document) {
        document.attachEvent("onreadystatechange", function() {
            if (document.readyState === "complete") {
                appInitFunc();
            }
        });
    }
})();
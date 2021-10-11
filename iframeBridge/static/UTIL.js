(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ucUtil = {}));
}(this, (function (exports) { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var runtime = {exports: {}};

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  (function (module) {
  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  }(runtime));

  var regenerator = runtime.exports;

  // Unique ID creation requires a high quality random # generator. In the browser we therefore
  // require the crypto API and do not support built-in fallback to lower quality random number
  // generators (like Math.random()).
  // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
  // find the complete implementation of crypto (msCrypto) on IE11.
  var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  function rng() {
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }

    return getRandomValues(rnds8);
  }

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */
  var byteToHex = [];

  for (var i$1 = 0; i$1 < 256; ++i$1) {
    byteToHex[i$1] = (i$1 + 0x100).toString(16).substr(1);
  }

  function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

    return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
  }

  function v4(options, buf, offset) {
    var i = buf && offset || 0;

    if (typeof options == 'string') {
      buf = options === 'binary' ? new Array(16) : null;
      options = null;
    }

    options = options || {};
    var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

    if (buf) {
      for (var ii = 0; ii < 16; ++ii) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || bytesToUuid(rnds);
  }

  var dist = {};

  var axios$2 = {exports: {}};

  var bind$2 = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  var bind$1 = bind$2;

  /*global toString:true*/

  // utils is a library of generic helper functions non-specific to axios

  var toString$2 = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray$4(val) {
    return toString$2.call(val) === '[object Array]';
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is a Buffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer(val) {
    return toString$2.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject$3(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a plain Object
   *
   * @param {Object} val The value to test
   * @return {boolean} True if value is a plain Object, otherwise false
   */
  function isPlainObject(val) {
    if (toString$2.call(val) !== '[object Object]') {
      return false;
    }

    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate(val) {
    return toString$2.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile(val) {
    return toString$2.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob(val) {
    return toString$2.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction$4(val) {
    return toString$2.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream(val) {
    return isObject$3(val) && isFunction$4(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim$1(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                             navigator.product === 'NativeScript' ||
                                             navigator.product === 'NS')) {
      return false;
    }
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray$4(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray$4(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind$1(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   * @return {string} content value without BOM
   */
  function stripBOM(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  }

  var utils$d = {
    isArray: isArray$4,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject$3,
    isPlainObject: isPlainObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction$4,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    extend: extend,
    trim: trim$1,
    stripBOM: stripBOM
  };

  var utils$c = utils$d;

  function encode(val) {
    return encodeURIComponent(val).
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL$2 = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils$c.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils$c.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils$c.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils$c.forEach(val, function parseValue(v) {
          if (utils$c.isDate(v)) {
            v = v.toISOString();
          } else if (utils$c.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  var utils$b = utils$d;

  function InterceptorManager$1() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager$1.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager$1.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager$1.prototype.forEach = function forEach(fn) {
    utils$b.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager$1;

  var utils$a = utils$d;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData$1 = function transformData(data, headers, fns) {
    /*eslint no-param-reassign:0*/
    utils$a.forEach(fns, function transform(fn) {
      data = fn(data, headers);
    });

    return data;
  };

  var isCancel$1 = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  var utils$9 = utils$d;

  var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
    utils$9.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError$1 = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };

  var enhanceError = enhanceError$1;

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError$2 = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
  };

  var createError$1 = createError$2;

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle$1 = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError$1(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  var utils$8 = utils$d;

  var cookies$1 = (
    utils$8.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils$8.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils$8.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils$8.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL$1 = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  var isAbsoluteURL = isAbsoluteURL$1;
  var combineURLs = combineURLs$1;

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   * @returns {string} The combined full path
   */
  var buildFullPath$1 = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };

  var utils$7 = utils$d;

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders$1 = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils$7.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils$7.trim(line.substr(0, i)).toLowerCase();
      val = utils$7.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var utils$6 = utils$d;

  var isURLSameOrigin$1 = (
    utils$6.isStandardBrowserEnv() ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
        function resolveURL(url) {
          var href = url;

          if (msie) {
          // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils$6.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
  );

  var utils$5 = utils$d;
  var settle = settle$1;
  var cookies = cookies$1;
  var buildURL$1 = buildURL$2;
  var buildFullPath = buildFullPath$1;
  var parseHeaders = parseHeaders$1;
  var isURLSameOrigin = isURLSameOrigin$1;
  var createError = createError$2;

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;

      if (utils$5.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      var fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL$1(fullPath, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      // Listen for ready state
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }

        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle(resolve, reject, response);

        // Clean up request
        request = null;
      };

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (utils$5.isStandardBrowserEnv()) {
        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils$5.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (!utils$5.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }

      // Add responseType to request if needed
      if (config.responseType) {
        try {
          request.responseType = config.responseType;
        } catch (e) {
          // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
          // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
          if (config.responseType !== 'json') {
            throw e;
          }
        }
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel);
          // Clean up request
          request = null;
        });
      }

      if (!requestData) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var utils$4 = utils$d;
  var normalizeHeaderName = normalizeHeaderName$1;

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils$4.isUndefined(headers) && utils$4.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = xhr;
    }
    return adapter;
  }

  var defaults$3 = {
    adapter: getDefaultAdapter(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');
      if (utils$4.isFormData(data) ||
        utils$4.isArrayBuffer(data) ||
        utils$4.isBuffer(data) ||
        utils$4.isStream(data) ||
        utils$4.isFile(data) ||
        utils$4.isBlob(data)
      ) {
        return data;
      }
      if (utils$4.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$4.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils$4.isObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      /*eslint no-param-reassign:0*/
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) { /* Ignore */ }
      }
      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    maxBodyLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };

  defaults$3.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  };

  utils$4.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults$3.headers[method] = {};
  });

  utils$4.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults$3.headers[method] = utils$4.merge(DEFAULT_CONTENT_TYPE);
  });

  var defaults_1 = defaults$3;

  var utils$3 = utils$d;
  var transformData = transformData$1;
  var isCancel = isCancel$1;
  var defaults$2 = defaults_1;

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest$1 = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData(
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils$3.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );

    utils$3.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults$2.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  var utils$2 = utils$d;

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig$2 = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    var valueFromConfig2Keys = ['url', 'method', 'data'];
    var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
    var defaultToConfig2Keys = [
      'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
      'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
      'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
      'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
      'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
    ];
    var directMergeKeys = ['validateStatus'];

    function getMergedValue(target, source) {
      if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
        return utils$2.merge(target, source);
      } else if (utils$2.isPlainObject(source)) {
        return utils$2.merge({}, source);
      } else if (utils$2.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    function mergeDeepProperties(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (!utils$2.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    }

    utils$2.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      }
    });

    utils$2.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

    utils$2.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      } else if (!utils$2.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });

    utils$2.forEach(directMergeKeys, function merge(prop) {
      if (prop in config2) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });

    var axiosKeys = valueFromConfig2Keys
      .concat(mergeDeepPropertiesKeys)
      .concat(defaultToConfig2Keys)
      .concat(directMergeKeys);

    var otherKeys = Object
      .keys(config1)
      .concat(Object.keys(config2))
      .filter(function filterAxiosKeys(key) {
        return axiosKeys.indexOf(key) === -1;
      });

    utils$2.forEach(otherKeys, mergeDeepProperties);

    return config;
  };

  var utils$1 = utils$d;
  var buildURL = buildURL$2;
  var InterceptorManager = InterceptorManager_1;
  var dispatchRequest = dispatchRequest$1;
  var mergeConfig$1 = mergeConfig$2;

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios$1(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios$1.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig$1(this.defaults, config);

    // Set config.method
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    // Hook up interceptors middleware
    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  };

  Axios$1.prototype.getUri = function getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method: method,
        url: url,
        data: (config || {}).data
      }));
    };
  });

  utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios$1.prototype[method] = function(url, data, config) {
      return this.request(mergeConfig$1(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1 = Axios$1;

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel$1(message) {
    this.message = message;
  }

  Cancel$1.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel$1.prototype.__CANCEL__ = true;

  var Cancel_1 = Cancel$1;

  var Cancel = Cancel_1;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  var isAxiosError = function isAxiosError(payload) {
    return (typeof payload === 'object') && (payload.isAxiosError === true);
  };

  var utils = utils$d;
  var bind = bind$2;
  var Axios = Axios_1;
  var mergeConfig = mergeConfig$2;
  var defaults$1 = defaults_1;

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    return instance;
  }

  // Create the default instance to be exported
  var axios$1 = createInstance(defaults$1);

  // Expose Axios class to allow class inheritance
  axios$1.Axios = Axios;

  // Factory for creating new instances
  axios$1.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
  };

  // Expose Cancel & CancelToken
  axios$1.Cancel = Cancel_1;
  axios$1.CancelToken = CancelToken_1;
  axios$1.isCancel = isCancel$1;

  // Expose all/spread
  axios$1.all = function all(promises) {
    return Promise.all(promises);
  };
  axios$1.spread = spread;

  // Expose isAxiosError
  axios$1.isAxiosError = isAxiosError;

  axios$2.exports = axios$1;

  // Allow use of default import syntax in TypeScript
  axios$2.exports.default = axios$1;

  var axios = axios$2.exports;

  var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
      __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.wdsProxySetting = dist.init = void 0;
  var axios_1 = axios;
  var whenToShowLoading = 1500;
  var retryMax = 5;
  var limitApi = {};
  // 默认配置
  var defaults = {
      url: '',
      method: 'get',
      timeout: 15000,
      withCredentials: false,
      whenToShowLoading: whenToShowLoading,
      before: undefined,
      // 默认重试规则
      shouldRetry: function (_a) {
          var retryCount = _a.retryCount, params = _a.params;
          if (params.retry) {
              return retryCount < params.retry;
          }
          return false;
      },
      // 默认重试次数
      retry: 0,
      // 默认限流规则，服务端返回状态码 429 或者 503，此后改域下所有请求不再发送
      shouldLimit: function (_a) {
          var status = _a.status;
          return status === 429 || status === 503;
      },
      loading: function () {
          console.warn("\u5F53\u4F60\u770B\u5230\u6B64\u63D0\u793A\u65F6\uFF0C\u8BF4\u660E\u5B58\u5728\u670D\u52A1\u7AEF\u8D85\u8FC7 " + whenToShowLoading + " ms \u7684\u8BF7\u6C42\uFF0C\u5E76\u4E14\u6CA1\u6709\u8FDB\u884C\u5168\u5C40 loading \u914D\u7F6E\uFF0C\u8BF7\u53C2\u770B request.config \u8FDB\u884C\u914D\u7F6E");
      },
      verify: function () {
          return true;
      },
      transform: undefined,
      success: undefined,
      // function, 请求失败处理函数
      error: function (error) {
          return Promise.reject(error);
      },
      customError: false,
      complete: undefined,
  };
  // 域配置的 cache
  var domainDefaultConfig = {};
  var KEYS = ['whenToShowLoading', 'before', 'loading', 'verify', 'transform', 'success', 'error', 'customError', 'complete'];
  function isFunction$3(fn) {
      return typeof fn === 'function';
  }
  /**
   * 将字符串中的两个双斜杆处理成一个，但要排除 http:// 或者 https:// 或者 // 开头
   */
  function fixDoubleSlash(str) {
      var _a = str.split(/\/+/), first = _a[0], arr = _a.slice(1);
      var left = arr.length ? arr.join('/') : '';
      if (/^https?:/.test(first) || /^\/\//.test(str)) {
          return first + "//" + left;
      }
      return first + "/" + left;
  }
  function trim(str) {
      return str.replace(/^\s+|\s+$/g, '');
  }
  function join() {
      var strs = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          strs[_i] = arguments[_i];
      }
      var s = '';
      for (var i = 0; i < strs.length; i++) {
          var item = strs[i];
          if (item) {
              item = trim(item);
          }
          if (item) {
              if (item[0] !== '/' && !/^https?:/.test(item)) {
                  s += '/' + item;
              }
              else {
                  s += item;
              }
          }
      }
      return s;
  }
  /**
   * 处理错误
   */
  function processError(scope, error, params) {
      var err = error;
      if (params.transform) {
          err = params.transform.call(scope, err, false);
      }
      else {
          if (error.response) {
              // http status error
              err = error.response;
          }
          else {
              // 根据verify返回false认为的error
              err = { data: error.data, status: 400 };
          }
      }
      var result;
      if (params.customError === true) {
          // 继续传递，自行 .catch 捕获处理
          result = Promise.reject(err);
      }
      else {
          if (params.error) {
              result = params.error.call(scope, err);
              // 允许 error 中返回结果，通常用于返回异常以供后续 .catch 捕获
              if (!result) {
                  result = new Promise(function () { });
              }
          }
          else {
              // error 中没有 throw error 或者 return Promise.reject 则中断处理
              result = new Promise(function () { });
          }
      }
      return { result: result, error: err };
  }
  var _requestIndex = 0;
  var Action = /** @class */ (function () {
      function Action(instance, setting) {
          this.retryCount = 0;
          this.instance = instance;
          this.name = setting.name;
          this.setting = setting;
          Object.assign({
              name: setting.name,
              prefix: setting.prefix ? setting.prefix.replace(/^\/+/, '/') : '',
              url: setting.url || '',
          });
      }
      /**
       * 核心请求方法
       * @param params 请求参数对象
       */
      Action.prototype.request = function (params) {
          var _this = this;
          var baseParams = __assign({}, params);
          KEYS.forEach(function (key) {
              if (isFunction$3(params[key])) {
                  params[key] = params[key].bind(_this);
              }
          });
          var prefix = this.setting.prefix || '';
          params.url = join(prefix, params.url);
          if (!this.setting.wds) {
              params.url = join(this.setting.url, params.url);
          }
          params.url = fixDoubleSlash(params.url);
          params = Object.assign({}, defaults, this.setting, domainDefaultConfig[this.setting.name], params);
          this.params = params;
          // 限流处理
          var limitItem = limitApi[this.name];
          if (limitItem !== undefined) {
              var result = processError(this, limitApi[this.name].error, params).result;
              return result;
          }
          var shouldContinue = true;
          if (params.before) {
              shouldContinue = params.before.call(this, params);
          }
          if (shouldContinue !== false) {
              if (typeof shouldContinue === 'object') {
                  this.params = shouldContinue;
              }
              var timer_1 = setTimeout(function () {
                  if (params.loading) {
                      params.loading.call(_this);
                  }
              }, params.whenToShowLoading);
              var clear_1 = function () {
                  if (timer_1) {
                      clearTimeout(timer_1);
                  }
              };
              var requestParams_1 = {};
              Object.keys(this.params).forEach(function (key) {
                  if (KEYS.indexOf(key) === -1) {
                      requestParams_1[key] = _this.params[key];
                  }
              });
              return this.instance(requestParams_1)
                  .then(function (res) {
                  clear_1();
                  var flag = true;
                  var data = res.data;
                  if (params.verify) {
                      flag = params.verify(res) !== false;
                  }
                  if (flag) {
                      if (params.transform) {
                          data = params.transform.call(_this, data, true);
                      }
                      if (params.success) {
                          params.success.call(_this, data);
                      }
                      if (params.complete) {
                          params.complete.call(_this, data);
                      }
                      return Promise.resolve(data);
                  }
                  else {
                      // 进入 catch
                      throw res;
                  }
              })
                  .catch(function (error) {
                  var _a, _b;
                  try {
                      clear_1();
                      if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) &&
                          params.shouldLimit &&
                          params.shouldLimit({ status: error.response.status, error: error }) === true) {
                          // 限流处理
                          limitApi[_this.name] = {
                              status: error.response.status,
                              error: error,
                          };
                      }
                      else if (((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.status) &&
                          params.shouldRetry &&
                          params.shouldRetry.call(_this, {
                              retryCount: _this.retryCount,
                              status: error.response.status,
                              params: requestParams_1,
                              error: error,
                          }) === true) {
                          // 重试处理
                          // 保护机制，避免自定义的 shouldRetry 不合理导致自动请求数过多
                          if (_this.retryCount < retryMax) {
                              _this.retryCount += 1;
                              return _this.request(baseParams);
                          }
                      }
                      var _c = processError(_this, error, params), result = _c.result, err = _c.error;
                      if (params.complete) {
                          params.complete.call(_this, err);
                      }
                      return result;
                  }
                  catch (e) {
                      // 非请求造成异常，直接报错
                      clear_1();
                      throw error;
                  }
              });
          }
          else {
              return new Promise(function () { });
          }
      };
      return Action;
  }());
  var GLOBAL_REQUEST = '__global__';
  var request = function (setting) {
      var instance = axios_1.default.create();
      if (!setting) {
          setting = {};
      }
      if (setting.prefix) {
          setting.prefix = setting.prefix.replace(/^\/+/, '/');
      }
      var _setting = Object.assign({
          name: "request_" + ++_requestIndex + "_" + Math.ceil(Math.random() * 10000),
          url: '',
          prefix: '',
      }, setting);
      var apiName = _setting.name;
      var actions = {
          setting: _setting,
          // API 域的配置
          config: function (requestGlobalSetting) {
              if (apiName === GLOBAL_REQUEST) {
                  for (var key in requestGlobalSetting) {
                      defaults[key] = requestGlobalSetting[key];
                  }
              }
              else {
                  domainDefaultConfig[apiName] = Object.assign({}, domainDefaultConfig[apiName], requestGlobalSetting);
              }
          },
          request: function (params) {
              var req = new Action(instance, _setting);
              return req.request(params);
          },
          get: function (url, params) {
              var req = new Action(instance, _setting);
              var options = Object.assign({}, params, {
                  url: url,
                  method: 'get',
              });
              var useCache = false; // 不使用 cache，默认会在 get 请求中添加随机数来避免 IE ajax 的缓存问题
              // 请求中主动使用 cache
              if (params && params.cache === true) {
                  useCache = true;
              }
              // 域配置主动使用 cache
              if (!useCache) {
                  if (apiName !== GLOBAL_REQUEST && domainDefaultConfig[apiName] && domainDefaultConfig[apiName].cache === true) {
                      useCache = true;
                  }
              }
              // 全局配置主动使用 cache
              if (!useCache) {
                  if (defaults && defaults.cache === true) {
                      useCache = true;
                  }
              }
              if (!useCache) {
                  options.params = Object.assign({}, options.params, {
                      _r: Date.now(),
                  });
              }
              return req.request(options);
          },
          post: function (url, params) {
              var req = new Action(instance, _setting);
              var options = Object.assign({}, params, {
                  url: url,
                  method: 'post',
              });
              return req.request(options);
          },
          patch: function (url, params) {
              var req = new Action(instance, _setting);
              var options = Object.assign({}, params, {
                  url: url,
                  method: 'patch',
              });
              return req.request(options);
          },
          put: function (url, params) {
              var req = new Action(instance, _setting);
              var options = Object.assign({}, params, {
                  url: url,
                  method: 'put',
              });
              return req.request(options);
          },
          delete: function (url, params) {
              var req = new Action(instance, _setting);
              var options = Object.assign({}, params, {
                  url: url,
                  method: 'delete',
              });
              return req.request(options);
          },
          head: function (url, params) {
              var req = new Action(instance, _setting);
              var options = Object.assign({}, params, {
                  url: url,
                  method: 'head',
              });
              return req.request(options);
          },
      };
      return actions;
  };
  /**
   * 初始化
   */
  var _init = false;
  function init(apis, param) {
      if (_init) {
          console.warn('request.init should be called only once time');
      }
      else {
          _init = true;
      }
      var _a = param || {}, _b = _a.env, env = _b === void 0 ? '' : _b, _c = _a.wds, wds = _c === void 0 ? false : _c, _d = _a.defaultEnv, defaultEnv = _d === void 0 ? 'defaults' : _d;
      Object.keys(apis).forEach(function (apiName) {
          // api name 合法性检测
          if (request.hasOwnProperty(apiName)) {
              throw new Error(apiName + " \u4E0D\u80FD\u4F5C\u4E3A\u8BF7\u6C42\u547D\u540D");
          }
          var setting;
          var api = apis[apiName];
          if (wds && api.wds) {
              setting = __assign(__assign({}, api.wds), { env: 'wds', name: apiName, wds: true, prefix: fixDoubleSlash("/" + apiName + "_wds/" + (api.wds.prefix || '')) });
          }
          else {
              if (api[env]) {
                  setting = Object.assign({}, api[env], { name: apiName, env: env });
              }
              else {
                  setting = Object.assign({}, api[defaultEnv], { name: apiName, env: defaultEnv });
              }
          }
          // 为每个 API 域请求分配一个请求对象
          request[apiName] = request(setting);
      });
      return request;
  }
  dist.init = init;
  /**
   * 提供给 webpack-dev-server 使用的 proxy 配置
   */
  function wdsProxySetting(apis, proxySetting) {
      var proxy = {};
      Object.keys(apis).forEach(function (apiName) {
          var _a;
          var api = apis[apiName];
          var wds = api.wds;
          if (wds) {
              var prefix = "/" + apiName + "_wds";
              if (proxySetting) {
                  Object.keys(proxySetting).forEach(function (key) {
                      if (isFunction$3(proxySetting[key])) {
                          proxySetting[key] = proxySetting[key].bind(wds);
                      }
                  });
              }
              proxy[prefix] = Object.assign({
                  target: wds.url,
                  changeOrigin: true,
                  secure: false,
                  pathRewrite: (_a = {}, _a["^" + prefix] = '', _a),
              }, proxySetting);
          }
      });
      return proxy;
  }
  dist.wdsProxySetting = wdsProxySetting;
  // 全局请求注入，以方便直接使用 request.get/post...
  var globalRequest = request({
      name: GLOBAL_REQUEST,
  });
  Object.keys(globalRequest).forEach(function (key) {
      if (globalRequest.hasOwnProperty(key)) {
          if (typeof globalRequest[key] === 'function') {
              request[key] = globalRequest[key];
          }
      }
  });
  request.init = init;
  request.wdsProxySetting = wdsProxySetting;
  var _default = dist.default = request;

  var n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function r(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function o(e,t,n){return e(n={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&n.path)}},n.exports),n.exports}var i=o((function(e){function t(n,r){return e.exports=t=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},e.exports.default=e.exports,e.exports.__esModule=!0,t(n,r)}e.exports=t,e.exports.default=e.exports,e.exports.__esModule=!0;})),s=r(o((function(e){e.exports=function(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,i(e,t);},e.exports.default=e.exports,e.exports.__esModule=!0;}))),a=r(o((function(e){function t(e,t,n,r,o,i,s){try{var a=e[i](s),c=a.value;}catch(e){return void n(e)}a.done?t(c):Promise.resolve(c).then(r,o);}e.exports=function(e){return function(){var n=this,r=arguments;return new Promise((function(o,i){var s=e.apply(n,r);function a(e){t(s,o,i,a,c,"next",e);}function c(e){t(s,o,i,a,c,"throw",e);}a(void 0);}))}},e.exports.default=e.exports,e.exports.__esModule=!0;}))),c=o((function(e){var t=function(e){var t,n=Object.prototype,r=n.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",a=o.toStringTag||"@@toStringTag";function c(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"");}catch(e){c=function(e,t,n){return e[t]=n};}function u(e,t,n,r){var o=t&&t.prototype instanceof m?t:m,i=Object.create(o.prototype),s=new R(r||[]);return i._invoke=function(e,t,n){var r=f;return function(o,i){if(r===h)throw new Error("Generator is already running");if(r===d){if("throw"===o)throw i;return L()}for(n.method=o,n.arg=i;;){var s=n.delegate;if(s){var a=O(s,n);if(a){if(a===g)continue;return a}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===f)throw r=d,n.arg;n.dispatchException(n.arg);}else "return"===n.method&&n.abrupt("return",n.arg);r=h;var c=p(e,t,n);if("normal"===c.type){if(r=n.done?d:l,c.arg===g)continue;return {value:c.arg,done:n.done}}"throw"===c.type&&(r=d,n.method="throw",n.arg=c.arg);}}}(e,n,s),i}function p(e,t,n){try{return {type:"normal",arg:e.call(t,n)}}catch(e){return {type:"throw",arg:e}}}e.wrap=u;var f="suspendedStart",l="suspendedYield",h="executing",d="completed",g={};function m(){}function v(){}function w(){}var y={};y[i]=function(){return this};var b=Object.getPrototypeOf,x=b&&b(b(E([])));x&&x!==n&&r.call(x,i)&&(y=x);var _=w.prototype=m.prototype=Object.create(y);function S(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}));}));}function C(e,t){function n(o,i,s,a){var c=p(e[o],e,i);if("throw"!==c.type){var u=c.arg,f=u.value;return f&&"object"==typeof f&&r.call(f,"__await")?t.resolve(f.__await).then((function(e){n("next",e,s,a);}),(function(e){n("throw",e,s,a);})):t.resolve(f).then((function(e){u.value=e,s(u);}),(function(e){return n("throw",e,s,a)}))}a(c.arg);}var o;this._invoke=function(e,r){function i(){return new t((function(t,o){n(e,r,t,o);}))}return o=o?o.then(i,i):i()};}function O(e,n){var r=e.iterator[n.method];if(r===t){if(n.delegate=null,"throw"===n.method){if(e.iterator.return&&(n.method="return",n.arg=t,O(e,n),"throw"===n.method))return g;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method");}return g}var o=p(r,e.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,g;var i=o.arg;return i?i.done?(n[e.resultName]=i.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,g):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,g)}function I(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t);}function k(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t;}function R(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(I,this),this.reset(!0);}function E(e){if(e){var n=e[i];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,s=function n(){for(;++o<e.length;)if(r.call(e,o))return n.value=e[o],n.done=!1,n;return n.value=t,n.done=!0,n};return s.next=s}}return {next:L}}function L(){return {value:t,done:!0}}return v.prototype=_.constructor=w,w.constructor=v,v.displayName=c(w,a,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return !!t&&(t===v||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,c(e,a,"GeneratorFunction")),e.prototype=Object.create(_),e},e.awrap=function(e){return {__await:e}},S(C.prototype),C.prototype[s]=function(){return this},e.AsyncIterator=C,e.async=function(t,n,r,o,i){void 0===i&&(i=Promise);var s=new C(u(t,n,r,o),i);return e.isGeneratorFunction(n)?s:s.next().then((function(e){return e.done?e.value:s.next()}))},S(_),c(_,a,"Generator"),_[i]=function(){return this},_.toString=function(){return "[object Generator]"},e.keys=function(e){var t=[];for(var n in e)t.push(n);return t.reverse(),function n(){for(;t.length;){var r=t.pop();if(r in e)return n.value=r,n.done=!1,n}return n.done=!0,n}},e.values=E,R.prototype={constructor:R,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(k),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t);},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function o(r,o){return a.type="throw",a.arg=e,n.next=r,o&&(n.method="next",n.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var s=this.tryEntries[i],a=s.completion;if("root"===s.tryLoc)return o("end");if(s.tryLoc<=this.prev){var c=r.call(s,"catchLoc"),u=r.call(s,"finallyLoc");if(c&&u){if(this.prev<s.catchLoc)return o(s.catchLoc,!0);if(this.prev<s.finallyLoc)return o(s.finallyLoc)}else if(c){if(this.prev<s.catchLoc)return o(s.catchLoc,!0)}else {if(!u)throw new Error("try statement without catch or finally");if(this.prev<s.finallyLoc)return o(s.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var s=i?i.completion:{};return s.type=e,s.arg=t,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(s)},complete:function(e,t){if("throw"===e.type)throw e.arg;return "break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),k(n),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;k(n);}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:E(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),g}},e}(e.exports);try{regeneratorRuntime=t;}catch(e){Function("r","regeneratorRuntime = r")(t);}})),u=o((function(e){e.exports=function(e){return e&&e.__esModule?e:{default:e}},e.exports.default=e.exports,e.exports.__esModule=!0;}))(o((function(e){function t(n){return "function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?(e.exports=t=function(e){return typeof e},e.exports.default=e.exports,e.exports.__esModule=!0):(e.exports=t=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e.exports.default=e.exports,e.exports.__esModule=!0),t(n)}e.exports=t,e.exports.default=e.exports,e.exports.__esModule=!0;}))),p=Object.prototype.toString;function f(e){return "[object Array]"===p.call(e)}var l={isURLSearchParams:function(e){return "undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},forEach:function(e,t){if(null!=e)if("object"!==(0, u.default)(e)&&(e=[e]),f(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e);},isArray:f,isDate:function(e){return "[object Date]"===p.call(e)},isObject:function(e){return null!==e&&"object"===(0, u.default)(e)},isStandardBrowserEnv:function(){return ("undefined"==typeof navigator||"ReactNative"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},isString:function(e){return "string"==typeof e},isFormData:function(e){return "undefined"!=typeof FormData&&e instanceof FormData},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}},h=l.isStandardBrowserEnv()?function(){var e=/(msie|trident)/i.test(navigator.userAgent),t=document.createElement("a");function n(n){var r=n;return e&&(t.setAttribute("href",r),r=t.href),t.setAttribute("href",r),{href:t.href,protocol:t.protocol?t.protocol.replace(/:$/,""):"",host:t.host,search:t.search?t.search.replace(/^\?/,""):"",hash:t.hash?t.hash.replace(/^#/,""):"",hostname:t.hostname,port:t.port,pathname:"/"===t.pathname.charAt(0)?t.pathname:"/"+t.pathname}}var r=n(window.location.href);return function(e){var t=l.isString(e)?n(e):e;return t.protocol===r.protocol&&t.host===r.host}}():function(){return !0};function d(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var g=function(e,t,n){if(!t)return e;var r;if(n)r=n(t);else if(l.isURLSearchParams(t))r=t.toString();else {var o=[];l.forEach(t,(function(e,t){null!=e&&(l.isArray(e)?t+="[]":e=[e],l.forEach(e,(function(e){l.isDate(e)?e=e.toISOString():l.isObject(e)&&(e=JSON.stringify(e)),o.push(d(t)+"="+d(e));})));})),r=o.join("&");}return r&&(e+=(-1===e.indexOf("?")?"?":"&")+r),e},m=function(e,t,n,r,o){return function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e}(new Error(e),t,n,r,o)},v=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];function w(){this.message="String contains an invalid character";}w.prototype=new Error,w.prototype.code=5,w.prototype.name="InvalidCharacterError";var y=function(e){for(var t,n,r=String(e),o="",i=0,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.charAt(0|i)||(s="=",i%1);o+=s.charAt(63&t>>8-i%1*8)){if((n=r.charCodeAt(i+=3/4))>255)throw new w;t=t<<8|n;}return o},b=Object.prototype.toString;function x(e){return "[object Array]"===b.call(e)}function _(e){return void 0===e}function S(e){return null!==e&&"object"==typeof e}function C(e){if("[object Object]"!==b.call(e))return !1;var t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function O(e){return "[object Function]"===b.call(e)}function I(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),x(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e);}var k={isArray:x,isArrayBuffer:function(e){return "[object ArrayBuffer]"===b.call(e)},isBuffer:function(e){return null!==e&&!_(e)&&null!==e.constructor&&!_(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){return "undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return "undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return "string"==typeof e},isNumber:function(e){return "number"==typeof e},isObject:S,isPlainObject:C,isUndefined:_,isDate:function(e){return "[object Date]"===b.call(e)},isFile:function(e){return "[object File]"===b.call(e)},isBlob:function(e){return "[object Blob]"===b.call(e)},isFunction:O,isStream:function(e){return S(e)&&O(e.pipe)},isURLSearchParams:function(e){return "undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return ("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:I,merge:function e(){var t={};function n(n,r){C(t[r])&&C(n)?t[r]=e(t[r],n):C(n)?t[r]=e({},n):x(n)?t[r]=n.slice():t[r]=n;}for(var r=0,o=arguments.length;r<o;r++)I(arguments[r],n);return t},extend:function(e,t,n){return I(t,(function(t,r){e[r]=n&&"function"==typeof t?function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}(t,n):t;})),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")},stripBOM:function(e){return 65279===e.charCodeAt(0)&&(e=e.slice(1)),e}},R=k.isStandardBrowserEnv()?{write:function(e,t,n,r,o,i){var s=[];s.push(e+"="+encodeURIComponent(t)),k.isNumber(n)&&s.push("expires="+new Date(n).toGMTString()),k.isString(r)&&s.push("path="+r),k.isString(o)&&s.push("domain="+o),!0===i&&s.push("secure"),document.cookie=s.join("; ");},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5);}}:{write:function(){},read:function(){return null},remove:function(){}},E="undefined"!=typeof window&&window.btoa&&window.btoa.bind(window)||y,L=function(e){return new Promise((function(t,n){var r=e.data,o=e.headers;l.isFormData(r)&&delete o["Content-Type"];var i=new XMLHttpRequest,s="onreadystatechange",a=!1;if("undefined"==typeof window||!window.XDomainRequest||"withCredentials"in i||h(e.url)||(i=new window.XDomainRequest,s="onload",a=!0,i.onprogress=function(){},i.ontimeout=function(){}),e.auth){var c=e.auth.username||"",u=e.auth.password||"";o.Authorization="Basic "+E(c+":"+u);}if(i.open(e.method.toUpperCase(),g(e.url,e.params,e.paramsSerializer),!0),i.timeout=e.timeout,i[s]=function(){if(i&&(4===i.readyState||a)&&(0!==i.status||i.responseURL&&0===i.responseURL.indexOf("file:"))){var r,o,s,c,u,p="getAllResponseHeaders"in i?(r=i.getAllResponseHeaders(),u={},r?(l.forEach(r.split("\n"),(function(e){if(c=e.indexOf(":"),o=l.trim(e.substr(0,c)).toLowerCase(),s=l.trim(e.substr(c+1)),o){if(u[o]&&v.indexOf(o)>=0)return;u[o]="set-cookie"===o?(u[o]?u[o]:[]).concat([s]):u[o]?u[o]+", "+s:s;}})),u):u):null,f={data:e.responseType&&"text"!==e.responseType?i.response:i.responseText,status:1223===i.status?204:i.status,statusText:1223===i.status?"No Content":i.statusText,headers:p,config:e,request:i};!function(e,t,n){var r=n.config.validateStatus;n.status&&r&&!r(n.status)?t(m("Request failed with status code "+n.status,n.config,null,n.request,n)):e(n);}(t,n,f),i=null;}},i.onerror=function(){n(m("Network Error",e,null,i)),i=null;},i.ontimeout=function(){n(m("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",i)),i=null;},l.isStandardBrowserEnv()){var p=R,f=(e.withCredentials||h(e.url))&&e.xsrfCookieName?p.read(e.xsrfCookieName):void 0;f&&(o[e.xsrfHeaderName]=f);}if("setRequestHeader"in i&&l.forEach(o,(function(e,t){void 0===r&&"content-type"===t.toLowerCase()?delete o[t]:i.setRequestHeader(t,e);})),e.withCredentials&&(i.withCredentials=!0),e.responseType)try{i.responseType=e.responseType;}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&i.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&i.upload&&i.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){i&&(i.abort(),n(e),i=null);})),void 0===r&&(r=null),i.send(r);}))},P=o((function(e,t){var r=n&&n.__assign||function(){return (r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)},o=n&&n.__rest||function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);}return n};Object.defineProperty(t,"__esModule",{value:!0}),e.exports={isXDomain:function(e){return !("undefined"==typeof window||!window.XDomainRequest||"withCredentials"in new window.XMLHttpRequest||h(e))},convertRequest:function(e){var t=e.method,n=e.headers,i=e.params,s=void 0===i?{}:i,a=e.data,c=o(e,["method","headers","params","data"]);return Object.assign({},c,{method:"POST",params:r(r({},s),{$proxy:"body"}),data:{$method:t,$headers:n,$body:a}})},convertResponse:function(e){if(e.$status){var t=e.$status,n=e.$status_text,r=e.$headers,o=function(e){if(void 0===e)return e;try{return JSON.parse(e)}catch(t){return e}}(e.$body);return {data:o,status:t,statusText:n,headers:r,message:o&&o.message||n}}var i=e.data,s=i.$status,a=i.$status_text,c=i.$headers,u=i.$body,p=e.config,f=e.request,l=void 0!==u?JSON.parse(u):u;return {data:l,headers:c,status:s,statusText:a,message:l&&l.message||a,config:p,request:f,response:{config:p,data:l,headers:c,status:s,statusText:a,request:f}}},buildURL:g,xhrAdapter:L};})),j=_default({prefix:"",url:""});j.config({before:function(e){var t=e.url,n=e.params,r=e.paramsSerializer,o=e.method,i=P.buildURL(t,n,r).replace(/@/g,"%40");if(e.headers.isUC){var s=e.headers.UC.getAuthHeader({url:i,method:o});e.headers=Object.assign({},e.headers,{Authorization:s}),delete e.headers.UC;}return delete e.headers.isUC,console.log("=========================="),console.log(e),e},error:function(e){throw console.warn("@gem-mine/request error===================="),console.warn(e),e}});var A=function(){function e(e){var t;this.prefix="configFrontSDK_"+e,this.storage=window.localStorage||(t={},{setItem:function(e,n){t[e]=n||"";},getItem:function(e){return e in t?t[e]:null},removeItem:function(e){delete t[e];},clear:function(){t={};}});}var t=e.prototype;return t._key=function(e){return this.prefix+"_"+e},t.set=function(e,t){try{this.storage.setItem(this._key(e),JSON.stringify(t));}catch(t){throw Error("configFrontSDK: 在localstorage中保存"+this._key(e)+"失败, "+t)}},t.get=function(e){try{var t=this.storage.getItem(this._key(e));return t?JSON.parse(t):null}catch(t){throw Error("configFrontSDK: 从localstorage获取"+this._key(e)+"失败, "+t)}},t.remove=function(e){try{this.storage.removeItem(e);}catch(t){throw Error("configFrontSDK: 从localstorage删除"+this._key(e)+"失败, "+t)}},t.clear=function(){try{this.storage.clear();}catch(e){throw Error("configFrontSDK: 清空localstorage失败, "+e)}},e}(),U=["development","test","preproduction","product","hk","aws-california","prod-eduyun","pre-iraq-edu","egvod-pre","ncet-xedu","pre1"],D={development:"https://config-cfgcenter.beta.101.com",test:"https://config-cfgcenter.beta.101.com",preproduction:"https://config-cfgcenter.beta.101.com",hk:"https://config-cfgcenter.hk.101.com",product:"https://config-cfgcenter.sdp.101.com","aws-california":"https://config-cfgcenter.awsca.101.com","prod-eduyun":"https://config-cfgcenter.vlab.eduyun.cn","pre-iraq-edu":"https://config-cfgcenter.iraq.101.com","egvod-pre":"https://config-cfgcenter.egvod-beta.ndaeweb.com","ncet-xedu":"https://config-cfgcenter.xue.eduyun.cn",pre1:"https://config-cfgcenter.pre1.ndaeweb.com"},T={development:"wss://iot-ws.beta.101.com",test:"wss://iot-ws.beta.101.com",preproduction:"wss://iot-ws.beta.101.com",hk:"wss://iot-ws.hk.101.com",product:"wss://iot-ws.sdp.101.com","aws-california":"wss://iot-ws.awsca.101.com","prod-eduyun":"wss://iot-ws.vlab.eduyun.cn","pre-iraq-edu":"wss://iot-ws.iraq.101.com","egvod-pre":"wss://iot-ws.egvod-beta.ndaeweb.com","ncet-xedu":"wss://iot-ws.xue.eduyun.cn",pre1:"wss://iot-ws.debug.ndaeweb.com"},F={development:"https://betacs.101.com",test:"https://betacs.101.com",preproduction:"https://betacs.101.com",product:"https://gcdncs.101.com","aws-california":"https://cdn-cs-awsca.101.com",hk:"https://cdn-cs-aws.101.com","prod-eduyun":"https://sdpcs.vlab.eduyun.cn","pre-iraq-edu":"https://sdpcs.iraq.101.com","egvod-pre":"https://sdpcs.egvod-beta.ndaeweb.com","ncet-xedu":"https://sdpcs.xue.eduyun.cn",pre1:"https://betacs.101.com"},q={development:"preproduction_content_cfg_dev",test:"preproduction_content_cfg_test",preproduction:"preproduction_content_cfgcenter",product:"config_cfgcenter","aws-california":"awsca_content_cfgcenter",hk:"hk_content_cfgcenter","prod-eduyun":"content_config_cfgcenter","pre-iraq-edu":"iraq_content_cfgcenter","egvod-pre":"egvod_pre_content_cfgcenter","ncet-xedu":"ncet_xedu_content_cfgcenter",pre1:"dev_content_config_cfgcenter"};var N=function(e){function t(){return e.apply(this,arguments)||this}return s(t,e),t}(function(){function t(e){if(!U.includes(e.env))throw new Error("env参数必传，支持development, test, preproduction, product, hk, aws-california, prod-eduyun, pre-iraq-edu, egvod-pre, ncet-xedu");if("string"!=typeof e.sdpAppId||!e.sdpAppId)throw new Error("sdpAppId参数必传，string类型，不能为空串");if(e.hasOwnProperty("sdpBizType")&&("string"!=typeof e.sdpBizType||""===e.sdpBizType))throw new Error("sdpBizType参数，string类型，不能为空串");if(e.hasOwnProperty("sdpOrgId")&&("string"!=typeof e.sdpOrgId||""===e.sdpOrgId))throw new Error("sdpOrgId参数，string类型，不能为空串");if(e.hasOwnProperty("realTimeRefresh")&&"boolean"!=typeof e.realTimeRefresh)throw new Error("realTimeRefresh参数，要求为boolean类型");var t;console.log(e),this.env=e.env||"test",this.origin=(t=this.env,D[t]),this.sdpAppId=e.sdpAppId||"",this.sdpBizType=e.sdpBizType||"",this.sdpOrgId=e.sdpOrgId||"",this.realTimeRefresh=e.realTimeRefresh,this.openWay=this.sdpAppId+"||"+this.sdpBizType+"||"+this.sdpOrgId,this.UC=e.UC||{},this.isUC=!!this.UC.getAuthHeader,this.storage=new A(""+this.env),this.isPushInit=window.xx_push?window.xx_push.s_deviceToken:null,this.imPushOrigin=function(e){return T[e]}(this.env),this.webImPush=void 0,this.isSdkInit=!1;}var n=t.prototype;return n.init=function(){var e=a(c.mark((function e(){return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("开始执行init方法"),void 0!==this.realTimeRefresh&&!this.realTimeRefresh){e.next=5;break}return e.next=4,this.handleInitWs();case 4:console.log("参数realTimeRefresh不存在，或者传值为true，初始化web-im-push");case 5:this.isSdkInit=!0,console.log("执行init方法结束了");case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),n.getWebIMPush=function(){var e=a(c.mark((function e(){var t;return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.webImPush){e.next=7;break}return e.next=3,import('@sdp.nd/web-im-push');case 3:t=e.sent,console.log("异步加载web-im-push"),console.log(t),t.default?this.webImPush=t.default:this.webImPush=t;case 7:return e.abrupt("return",this.webImPush);case 8:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),n.handleInitWs=function(){var t=a(c.mark((function t(){var n,r,o=this;return c.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.isPushInit){t.next=10;break}return window.xx_configFrontSDK_pushListener=!0,console.log("window对象上没有xx_push对象，需要初始化，初始化sdpAppId为"+this.sdpAppId),t.next=5,this.getWebIMPush();case 5:(n=t.sent).init({url:this.imPushOrigin,appid:this.sdpAppId,unique_id:v4()}).connect(),n.setNotificationListener((function(e,t){o.handleImPushMes(e,t);})),t.next=14;break;case 10:console.log("使用已有的push连接，且未绑定sdk自己的监听事件，否则复用push上的已有事件，通过window.xx_push查看push连接相关信息"),r=window.xx_push,console.log("已有的push连接上，是否有配置中心的监听事件",window.xx_configFrontSDK_pushListener),window.xx_configFrontSDK_pushListener||(window.xx_configFrontSDK_pushListener=!0,console.log("未绑定监听事件，复用已有的push连接，绑定监听事件，设置xx_configFrontSDK_pushListener为true"),r.setNotificationListener((function(e,t){o.handleImPushMes(e,t);})));case 14:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}(),n.handleImPushMes=function(e,t){for(var n=t.getEntryList(),r="",o=0;o<n.length;o++)"event"===n[o][0]&&(r=n[o][1]);if("handler_config_cfgcenter_event"===r){var i=JSON.parse((new TextDecoder).decode(e));console.log(i),this.handleNeedRemoveStorage(i);}},n.handleNeedRemoveStorage=function(e){var t,n,r,o=this,i=function(){var e=Object.keys(localStorage);return e.filter((function(e){return -1!==e.indexOf("configFrontSDK")}))}(),s=e.config_type,a=e.format_code,c=e.open_way,u=e.delay,p=u.min,f=u.max,l=(n=f-(t=p),r=Math.random(),1e3*(t+Math.round(r*n)));i.forEach((function(e){var t=e.split("_"),n=t[t.length-1]===c;if(-1!==e.indexOf("_"+s+"_")&&-1!==e.indexOf("_"+a+"_"+c)&&n){var r=t[2]+"_"+s+"_"+a+"_"+c,i=o.storage.get(r);if(i){console.log(i);var u=i.expire,p=(new Date).getTime()+l,f=u<p?u:p;i.expire=f,console.log(i),o.storage.set(r,i);var h=new Date(f),d=h.getFullYear()+"-"+(h.getMonth()+1<10?"0"+(h.getMonth()+1):h.getMonth()+1)+"-"+(h.getDate()<10?"0"+h.getDate():h.getDate())+"-"+(h.getHours()+":")+(h.getMinutes()+":")+h.getSeconds();console.log("接收push消息，localstorage中的    "+e+" 将在expire="+f+"     "+d+" 后失效 ， ");}}}));},n.getRequestURL=function(e,t,n){return {common:"v2.0/configs/config_type/"+encodeURIComponent(e)+"/format_code/"+encodeURIComponent(t)+"/open_way/"+encodeURIComponent(this.openWay)+"/actions/merge_for_web",public:"v2.0/configs/merge/config_type/"+encodeURIComponent(e)+"/format_code/"+encodeURIComponent(t)+"/open_way/"+encodeURIComponent(this.openWay)+"/public_configs/for_web",private:"v2.0/configs/merge/config_type/"+encodeURIComponent(e)+"/format_code/"+encodeURIComponent(t)+"/open_way/"+encodeURIComponent(this.openWay)+"/private_configs/for_web"}[n]},n.getHeader=function(){return this.isUC?{"x-config-dispatch-env":this.env,isUC:this.isUC,UC:this.UC}:{"x-config-dispatch-env":this.env,isUC:this.isUC}},n.handleAction=function(){var e=a(c.mark((function e(t,n,r){var o,i,s,a;return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=this.getHeader(),e.next=3,j.get(this.origin+"/"+this.getRequestURL(t,n,r),{headers:o});case 3:return i=e.sent,console.log("request url header value====================="),console.log(this.origin+"/"+this.getRequestURL(t,n,r)),console.log(o),console.log(i),s=null!=i&&i.ttl?i.ttl:3600,i.expire=(new Date).getTime()+1e3*s,a=r+"_"+t+"_"+n+"_"+this.openWay,this.storage.set(a,i),e.abrupt("return",i);case 13:case"end":return e.stop()}}),e,this)})));return function(t,n,r){return e.apply(this,arguments)}}(),n.handleIsInStorage=function(e,t,n){var r=n+"_"+e+"_"+t+"_"+this.openWay,o=this.storage.get(r);return (null!=o&&o.expire?o.expire:0)>(new Date).getTime()},n.handleCsAction=function(){var e=a(c.mark((function e(t,n,r,o){var i,s,a,u,p,f,l,h;return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,i=(r+"_"+t+"_"+n+"_"+this.openWay).replace(/[\\:*?"<>|]/g,"$"),"public404"!==r&&"public500"!==r&&"public502"!==r||(i=("public_"+t+"_"+n+"_"+this.openWay).replace(/[\\:*?"<>|]/g,"$")),i=""+encodeURIComponent(i+".json"),s=new Date,a=s.getFullYear(),u=s.getMonth()+1<10?"0"+(s.getMonth()+1):s.getMonth()+1,p=s.getDate()<10?"0"+s.getDate():s.getDate(),f=""+a+u+p,l=F[this.env]+"/v0.1/static/"+q[this.env]+"/high_avl/"+i+"?serviceName="+q[this.env]+"&attachment=true&_t="+f,e.next=12,j.get(""+l,{headers:{isUC:!1}});case 12:return h=e.sent,console.log("handleCsAction  cs filename fileurl value"),console.log(i),console.log(l),console.log(h),e.abrupt("return",h);case 20:throw e.prev=20,e.t0=e.catch(0),console.warn("handleCsAction cs error===================="),console.warn(o),o;case 25:case"end":return e.stop()}}),e,this,[[0,20]])})));return function(t,n,r,o){return e.apply(this,arguments)}}(),n.handleGetConfig=function(){var e=a(c.mark((function e(t,n,r){var o,i,s,a,u;return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("string"==typeof n&&n){e.next=2;break}throw new Error("formatCode参数必传，string类型，不能为空串");case 2:if(o=this.handleIsInStorage(t,n,r),i=r+"_"+t+"_"+n+"_"+this.openWay,!o){e.next=12;break}return console.log("从缓存中读取"),delete(s=this.storage.get(i)).ttl,delete s.expire,e.abrupt("return",s);case 12:return e.prev=12,console.log("缓存中没有，调取配置接口"),e.next=16,this.handleAction(t,n,r);case 16:return a=e.sent,console.log("await this.handleAction value=================="),console.log(a),delete a.ttl,delete a.expire,e.abrupt("return",a);case 24:if(e.prev=24,e.t0=e.catch(12),console.warn("handleGetConfig request error===================="),console.warn(e.t0),"public"!==r&&"public500"!==r&&"public502"!==r||e.t0.response&&!(e.t0.response.status>=500)){e.next=38;break}return console.warn("handleGetConfig request response  status===================="),console.warn(e.t0.response),console.warn(e.t0.response.status),console.log("缓存中没有该公共配置，接口没有response或者response的状态码>=500，从cs取配置"),console.warn(e.t0.response),e.next=36,this.handleCsAction(t,n,r,e.t0);case 36:return u=e.sent,e.abrupt("return",u);case 38:throw console.warn("缓存中没有，公有配置接口错误状态码<500，或者私有配置接口抛出错误"),e.t0;case 40:case"end":return e.stop()}}),e,this,[[12,24]])})));return function(t,n,r){return e.apply(this,arguments)}}(),n.handleIsSdkInit=function(){var e=a(c.mark((function e(){return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,this.isSdkInit){e.next=7;break}return console.log("未初始化，执行初始化方法"),e.next=5,this.init();case 5:e.next=8;break;case 7:console.log("已经执行过初始化方法了");case 8:e.next=14;break;case 10:e.prev=10,e.t0=e.catch(0),console.log("初始化方法执行失败，将影响实时更新配置功能，不影响获取配置功能"),console.log(e.t0);case 14:case"end":return e.stop()}}),e,this,[[0,10]])})));return function(){return e.apply(this,arguments)}}(),n.getAppComponentConfig=function(){var e=a(c.mark((function e(){return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.handleIsSdkInit();case 2:return console.warn("该方法不建议使用，请更换获取公有或私有配置的方法"),e.abrupt("return",this.handleGetConfig("app_component","app_default","common"));case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),n.getSiteConfig=function(){var e=a(c.mark((function e(){return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.handleIsSdkInit();case 2:return console.warn("该方法不建议使用，请更换获取公有或私有配置的方法"),e.abrupt("return",this.handleGetConfig("site","website_header_footer","common"));case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),n.getServiceComponentConfig=function(){var e=a(c.mark((function e(t){var n;return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.formatCode,e.next=3,this.handleIsSdkInit();case 3:return console.warn("该方法不建议使用，请更换获取公有或私有配置的方法"),e.abrupt("return",this.handleGetConfig("service_component",n,"common"));case 7:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}(),n.getAppComponentConfigForPublic=function(){var e=a(c.mark((function e(){var t,n,r;return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.handleIsSdkInit();case 2:return t="app_component",n="app_default",r="public",console.log("getAppComponentConfigForPublic================"),console.log(this.handleGetConfig(t,n,r)),e.abrupt("return",this.handleGetConfig(t,n,r));case 8:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),n.getSiteConfigForPublic=function(){var e=a(c.mark((function e(){return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.handleIsSdkInit();case 2:return e.abrupt("return",this.handleGetConfig("site","website_header_footer","public"));case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),n.getServiceComponentConfigForPublic=function(){var e=a(c.mark((function e(t){var n;return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.formatCode,e.next=3,this.handleIsSdkInit();case 3:return e.abrupt("return",this.handleGetConfig("service_component",n,"public"));case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}(),n.getAppComponentConfigForPrivate=function(){var e=a(c.mark((function e(){return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.warn("该方法不建议使用，直接返回空对象{}，请更换获取公有配置的方法"),e.abrupt("return",{});case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),n.getSiteConfigForPrivate=function(){var e=a(c.mark((function e(){return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.warn("该方法不建议使用，直接返回空对象{}，请更换获取公有配置的方法"),e.abrupt("return",{});case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),n.getServiceComponentConfigForPrivate=function(){var e=a(c.mark((function e(){return c.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.warn("该方法不建议使用，直接返回空对象{}，请更换获取公有配置的方法"),e.abrupt("return",{});case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),t}());

  /**
   * 判断是否为移动端根据UserAgent
   */

  function isMobileByUserAgent() {
    /* eslint-disable */
    var ua = '';

    if (typeof navigator !== 'undefined') {
      ua = navigator.userAgent || '';
    }

    return !!ua.match(/android|webos|ip(hone|ad|od)|opera (mini|mobi|tablet)|iemobile|windows.+(phone|touch)|mobile|fennec|kindle (Fire)|Silk|maemo|blackberry|playbook|bb10\; (touch|kbd)|Symbian(OS)|Ubuntu Touch/i);
    /* eslint-enable */
  }
  /**
   * 判断是否为移动端根据PageWidth
   */


  function isMobileByPageWidth() {
    var width = 0;

    if (typeof document !== 'undefined') {
      width = document.documentElement.clientWidth;
    }

    return width <= 1200;
  }

  var UCUtil = /*#__PURE__*/function () {
    function UCUtil(options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          _options$env = _options.env,
          env = _options$env === void 0 ? '' : _options$env,
          _options$sdpAppId = _options.sdpAppId,
          sdpAppId = _options$sdpAppId === void 0 ? '' : _options$sdpAppId;

      if (!env) {
        throw new Error('uc-util: env is required');
      }

      if (!sdpAppId) {
        throw new Error('uc-util: sdpAppId is required');
      }

      if (!options.sdp_app_id) {
        options.sdp_app_id = sdpAppId;
      }

      this.options = options;
      this.cfSdk = new N(options);
    }
    /**
     * 获取UC-SDK的初始化参数
     * @param {Object} defaultConfig 默认配置
     */


    var _proto = UCUtil.prototype;

    _proto.getInitConfigOfUCSDK =
    /*#__PURE__*/
    function () {
      var _getInitConfigOfUCSDK = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(defaultConfig) {
        var env, sdpAppId, result, _ref, sso, storageType, UC, SSO;

        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (defaultConfig === void 0) {
                  defaultConfig = {};
                }

                env = this.options.env;
                sdpAppId = this.options.sdpAppId;
                _context.prev = 3;
                _context.next = 6;
                return this.cfSdk.getServiceComponentConfigForPublic({
                  formatCode: 'UC-SDK'
                });

              case 6:
                result = _context.sent;
                _ref = result.properties || {}, sso = _ref.sso, storageType = _ref.storageType, UC = _ref.UC, SSO = _ref.SSO;
                return _context.abrupt("return", {
                  env: env,
                  sdpAppId: sdpAppId,
                  sso: sso === '1',
                  storageType: storageType,
                  origins: {
                    UC: UC,
                    SSO: SSO
                  }
                });

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](3);
                console.warn('uc-util: getServiceComponentConfigForPublic fail', _context.t0);
                return _context.abrupt("return", Object.assign({
                  env: env,
                  sdpAppId: sdpAppId,
                  sso: true
                }, defaultConfig));

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 11]]);
      }));

      function getInitConfigOfUCSDK(_x) {
        return _getInitConfigOfUCSDK.apply(this, arguments);
      }

      return getInitConfigOfUCSDK;
    }()
    /**
     * 重定向到登录页
     * @param {Object} params 请求相关的参数
     * @param {string} config.versionStrategy 版本策略，可选：Web版(web)、H5版(h5)、根据UserAgent(ua)、根据页面宽度(width)
     * @param {string} config.redirectType 重定向类型，可选：顶层窗口跳转(top)、当前窗口跳转(window)
     */
    ;

    _proto.redirect2LoginPage =
    /*#__PURE__*/
    function () {
      var _redirect2LoginPage = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(params, config) {
        var _config, _config$versionStrate, versionStrategy, _config$redirectType, redirectType, result, properties, loginUrl, loginUrlH5, url;

        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (params === void 0) {
                  params = {};
                }

                if (config === void 0) {
                  config = {};
                }

                _config = config, _config$versionStrate = _config.versionStrategy, versionStrategy = _config$versionStrate === void 0 ? 'ua' : _config$versionStrate, _config$redirectType = _config.redirectType, redirectType = _config$redirectType === void 0 ? 'top' : _config$redirectType;
                params.redirect_uri = params.redirect_uri || window.encodeURIComponent(window.top.location.href);
                params.redirect_url = params.redirect_url || params.redirect_uri;
                params.sdp_app_id = params.sdp_app_id || this.options.sdpAppId; // 获取产品的通用配置

                result = {};
                _context2.prev = 7;
                _context2.next = 10;
                return this.cfSdk.getAppComponentConfigForPublic();

              case 10:
                result = _context2.sent;
                _context2.next = 16;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](7);
                console.warn('uc-util: getAppComponentConfigForPublic fail', _context2.t0);

              case 16:
                properties = result.properties || {};
                /* eslint-disable */

                loginUrl = properties.login_page || '/uc-component/index.html?sdp-app-id=${sdp_app_id}#/login';
                loginUrlH5 = properties.h5_login_page || '/uc-aq/index.html?sdp-app-id=${sdp_app_id}#/login';
                /* eslint-enable */

                url = '';
                _context2.t1 = versionStrategy;
                _context2.next = _context2.t1 === 'web' ? 23 : _context2.t1 === 'h5' ? 25 : _context2.t1 === 'ua' ? 27 : _context2.t1 === 'width' ? 29 : 31;
                break;

              case 23:
                url = loginUrl;
                return _context2.abrupt("break", 32);

              case 25:
                url = loginUrlH5;
                return _context2.abrupt("break", 32);

              case 27:
                url = isMobileByUserAgent() ? loginUrlH5 : loginUrl;
                return _context2.abrupt("break", 32);

              case 29:
                url = isMobileByPageWidth() ? loginUrlH5 : loginUrl;
                return _context2.abrupt("break", 32);

              case 31:
                url = loginUrl;

              case 32:
                url = url.replace(/\$\{([0-9A-Za-z_]+)\}/g, function (match, p1) {
                  if (typeof params[p1] === 'undefined') {
                    return '';
                  }

                  return params[p1];
                });

                if (!(redirectType === 'top')) {
                  _context2.next = 36;
                  break;
                }

                window.top.location.href = url;
                return _context2.abrupt("return");

              case 36:
                window.location.href = url;

              case 37:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 13]]);
      }));

      function redirect2LoginPage(_x2, _x3) {
        return _redirect2LoginPage.apply(this, arguments);
      }

      return redirect2LoginPage;
    }();

    return UCUtil;
  }();

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */

  var isArray$3 = Array.isArray;

  var isArray_1 = isArray$3;

  /** Detect free variable `global` from Node.js. */

  var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal$1;

  var freeGlobal = _freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root$3 = freeGlobal || freeSelf || Function('return this')();

  var _root = root$3;

  var root$2 = _root;

  /** Built-in value references. */
  var Symbol$4 = root$2.Symbol;

  var _Symbol = Symbol$4;

  var Symbol$3 = _Symbol;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$4.toString;

  /** Built-in value references. */
  var symToStringTag$1 = Symbol$3 ? Symbol$3.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty$3.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag$1;

  /** Used for built-in method references. */

  var objectProto$3 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto$3.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString$1(value) {
    return nativeObjectToString.call(value);
  }

  var _objectToString = objectToString$1;

  var Symbol$2 = _Symbol,
      getRawTag = _getRawTag,
      objectToString = _objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag$2(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  var _baseGetTag = baseGetTag$2;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */

  function isObjectLike$2(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike$2;

  var baseGetTag$1 = _baseGetTag,
      isObjectLike$1 = isObjectLike_1;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol$3(value) {
    return typeof value == 'symbol' ||
      (isObjectLike$1(value) && baseGetTag$1(value) == symbolTag);
  }

  var isSymbol_1 = isSymbol$3;

  var isArray$2 = isArray_1,
      isSymbol$2 = isSymbol_1;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey$1(value, object) {
    if (isArray$2(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol$2(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }

  var _isKey = isKey$1;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */

  function isObject$2(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject$2;

  var baseGetTag = _baseGetTag,
      isObject$1 = isObject_1;

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction$2(value) {
    if (!isObject$1(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction$2;

  var root$1 = _root;

  /** Used to detect overreaching core-js shims. */
  var coreJsData$1 = root$1['__core-js_shared__'];

  var _coreJsData = coreJsData$1;

  var coreJsData = _coreJsData;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked$1(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  var _isMasked = isMasked$1;

  /** Used for built-in method references. */

  var funcProto$1 = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource$1(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  var _toSource = toSource$1;

  var isFunction$1 = isFunction_1,
      isMasked = _isMasked,
      isObject = isObject_1,
      toSource = _toSource;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative$1(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  var _baseIsNative = baseIsNative$1;

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */

  function getValue$1(object, key) {
    return object == null ? undefined : object[key];
  }

  var _getValue = getValue$1;

  var baseIsNative = _baseIsNative,
      getValue = _getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative$3(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative$3;

  var getNative$2 = _getNative;

  /* Built-in method references that are verified to be native. */
  var nativeCreate$4 = getNative$2(Object, 'create');

  var _nativeCreate = nativeCreate$4;

  var nativeCreate$3 = _nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear$1() {
    this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
    this.size = 0;
  }

  var _hashClear = hashClear$1;

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */

  function hashDelete$1(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var _hashDelete = hashDelete$1;

  var nativeCreate$2 = _nativeCreate;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet$1(key) {
    var data = this.__data__;
    if (nativeCreate$2) {
      var result = data[key];
      return result === HASH_UNDEFINED$2 ? undefined : result;
    }
    return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet$1;

  var nativeCreate$1 = _nativeCreate;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas$1(key) {
    var data = this.__data__;
    return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
  }

  var _hashHas = hashHas$1;

  var nativeCreate = _nativeCreate;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet$1(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
    return this;
  }

  var _hashSet = hashSet$1;

  var hashClear = _hashClear,
      hashDelete = _hashDelete,
      hashGet = _hashGet,
      hashHas = _hashHas,
      hashSet = _hashSet;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash$1.prototype.clear = hashClear;
  Hash$1.prototype['delete'] = hashDelete;
  Hash$1.prototype.get = hashGet;
  Hash$1.prototype.has = hashHas;
  Hash$1.prototype.set = hashSet;

  var _Hash = Hash$1;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */

  function listCacheClear$1() {
    this.__data__ = [];
    this.size = 0;
  }

  var _listCacheClear = listCacheClear$1;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */

  function eq$1(value, other) {
    return value === other || (value !== value && other !== other);
  }

  var eq_1 = eq$1;

  var eq = eq_1;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf$4(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  var _assocIndexOf = assocIndexOf$4;

  var assocIndexOf$3 = _assocIndexOf;

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete$1(key) {
    var data = this.__data__,
        index = assocIndexOf$3(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  var _listCacheDelete = listCacheDelete$1;

  var assocIndexOf$2 = _assocIndexOf;

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet$1(key) {
    var data = this.__data__,
        index = assocIndexOf$2(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  var _listCacheGet = listCacheGet$1;

  var assocIndexOf$1 = _assocIndexOf;

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas$1(key) {
    return assocIndexOf$1(this.__data__, key) > -1;
  }

  var _listCacheHas = listCacheHas$1;

  var assocIndexOf = _assocIndexOf;

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet$1(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  var _listCacheSet = listCacheSet$1;

  var listCacheClear = _listCacheClear,
      listCacheDelete = _listCacheDelete,
      listCacheGet = _listCacheGet,
      listCacheHas = _listCacheHas,
      listCacheSet = _listCacheSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache$1.prototype.clear = listCacheClear;
  ListCache$1.prototype['delete'] = listCacheDelete;
  ListCache$1.prototype.get = listCacheGet;
  ListCache$1.prototype.has = listCacheHas;
  ListCache$1.prototype.set = listCacheSet;

  var _ListCache = ListCache$1;

  var getNative$1 = _getNative,
      root = _root;

  /* Built-in method references that are verified to be native. */
  var Map$1 = getNative$1(root, 'Map');

  var _Map = Map$1;

  var Hash = _Hash,
      ListCache = _ListCache,
      Map = _Map;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear$1() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map || ListCache),
      'string': new Hash
    };
  }

  var _mapCacheClear = mapCacheClear$1;

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */

  function isKeyable$1(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  var _isKeyable = isKeyable$1;

  var isKeyable = _isKeyable;

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData$4(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  var _getMapData = getMapData$4;

  var getMapData$3 = _getMapData;

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete$1(key) {
    var result = getMapData$3(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  var _mapCacheDelete = mapCacheDelete$1;

  var getMapData$2 = _getMapData;

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet$1(key) {
    return getMapData$2(this, key).get(key);
  }

  var _mapCacheGet = mapCacheGet$1;

  var getMapData$1 = _getMapData;

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas$1(key) {
    return getMapData$1(this, key).has(key);
  }

  var _mapCacheHas = mapCacheHas$1;

  var getMapData = _getMapData;

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet$1(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  var _mapCacheSet = mapCacheSet$1;

  var mapCacheClear = _mapCacheClear,
      mapCacheDelete = _mapCacheDelete,
      mapCacheGet = _mapCacheGet,
      mapCacheHas = _mapCacheHas,
      mapCacheSet = _mapCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache$2(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache$2.prototype.clear = mapCacheClear;
  MapCache$2.prototype['delete'] = mapCacheDelete;
  MapCache$2.prototype.get = mapCacheGet;
  MapCache$2.prototype.has = mapCacheHas;
  MapCache$2.prototype.set = mapCacheSet;

  var _MapCache = MapCache$2;

  var MapCache$1 = _MapCache;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize$1(func, resolver) {
    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize$1.Cache || MapCache$1);
    return memoized;
  }

  // Expose `MapCache`.
  memoize$1.Cache = MapCache$1;

  var memoize_1 = memoize$1;

  var memoize = memoize_1;

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped$1(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  var _memoizeCapped = memoizeCapped$1;

  var memoizeCapped = _memoizeCapped;

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath$1 = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  var _stringToPath = stringToPath$1;

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */

  function arrayMap$3(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  var _arrayMap = arrayMap$3;

  var Symbol$1 = _Symbol,
      arrayMap$2 = _arrayMap,
      isArray$1 = isArray_1,
      isSymbol$1 = isSymbol_1;

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString$1(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray$1(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap$2(value, baseToString$1) + '';
    }
    if (isSymbol$1(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
  }

  var _baseToString = baseToString$1;

  var baseToString = _baseToString;

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString$1(value) {
    return value == null ? '' : baseToString(value);
  }

  var toString_1 = toString$1;

  var isArray = isArray_1,
      isKey = _isKey,
      stringToPath = _stringToPath,
      toString = toString_1;

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath$1(value, object) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }

  var _castPath = castPath$1;

  var isSymbol = isSymbol_1;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey$1(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  var _toKey = toKey$1;

  var castPath = _castPath,
      toKey = _toKey;

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet$1(object, path) {
    path = castPath(path, object);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return (index && index == length) ? object : undefined;
  }

  var _baseGet = baseGet$1;

  var baseGet = _baseGet;

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  var get_1 = get;

  /**
   * uc页面被嵌入到iframe之后，可通过该方法和uc组件建立通信
   * 每隔10ms给uc窗口发送一个初始化消息，直到接收到初始化成功消息后，结束发送
   * @param {Node} iframeElement - Iframe元素
   * @param {Object} initOptions - 初始化参数
   * @param {Function} eventCallback - 通信回调
   */

  var CreateIframeBridge = function CreateIframeBridge(iframeElement, initOptions, eventCallback) {
    var _this = this;

    if (initOptions === void 0) {
      initOptions = {};
    }

    this.isDOM = function (obj) {
      return typeof HTMLElement === 'object' ? obj instanceof HTMLElement : obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    };

    this.receiveMessage = function (event) {
      if (event.origin === _this.initOptions.targetOrigin) {
        if (get_1(event, 'data.name') === 'UC_IFRAME_BRIDGE_CREATE_SUCCESS') {
          clearInterval(_this.intervalId);
        }

        if (_this.eventCallback) _this.eventCallback(event);
      }
    };

    this.create = function () {
      window.addEventListener('message', _this.receiveMessage, false);
      var startTime = Date.now();
      _this.intervalId = setInterval(function () {
        // 等待数秒，还未建立通信，则断开
        if (Date.now() - startTime >= _this.initOptions.waitingTimeForCreating * 1000) {
          clearInterval(_this.intervalId);
        }

        if (_this.iframeElement.contentWindow && _this.iframeElement.contentWindow.postMessage) {
          _this.iframeElement.contentWindow.postMessage({
            name: 'UC_IFRAME_BRIDGE_CREATE',
            data: _this.initOptions.initMessage
          }, _this.initOptions.targetOrigin);
        }
      }, _this.initOptions.sendDelay);
    };

    this.destory = function () {
      window.removeEventListener('message', _this.receiveMessage, false);
    };

    var _initOptions = initOptions,
        initMessage = _initOptions.initMessage,
        _initOptions$sendDela = _initOptions.sendDelay,
        sendDelay = _initOptions$sendDela === void 0 ? 10 : _initOptions$sendDela,
        targetOrigin = _initOptions.targetOrigin,
        _initOptions$waitingT = _initOptions.waitingTimeForCreating,
        waitingTimeForCreating = _initOptions$waitingT === void 0 ? 3 : _initOptions$waitingT;
    this.initOptions = {
      initMessage: initMessage,
      sendDelay: sendDelay,
      targetOrigin: targetOrigin,
      waitingTimeForCreating: waitingTimeForCreating
    };

    if (!iframeElement || !this.isDOM(iframeElement)) {
      throw new Error('uc-util/IFRAME_BRIDGE: iframe dom必传');
    }

    if (!this.initOptions.targetOrigin) {
      throw new Error('uc-util/IFRAME_BRIDGE: 接收消息的窗口源targetOrigin必传');
    }

    if (this.initOptions.targetOrigin === '*') {
      throw new Error('uc-util/IFRAME_BRIDGE: 接收消息的窗口源应为uc站点地址，以保证通信成功');
    }

    this.iframeElement = iframeElement;
    this.eventCallback = eventCallback;
    this.intervalId = undefined;
  };

  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */
  function setCacheAdd$1(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }

  var _setCacheAdd = setCacheAdd$1;

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */

  function setCacheHas$1(value) {
    return this.__data__.has(value);
  }

  var _setCacheHas = setCacheHas$1;

  var MapCache = _MapCache,
      setCacheAdd = _setCacheAdd,
      setCacheHas = _setCacheHas;

  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  function SetCache$1(values) {
    var index = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new MapCache;
    while (++index < length) {
      this.add(values[index]);
    }
  }

  // Add methods to `SetCache`.
  SetCache$1.prototype.add = SetCache$1.prototype.push = setCacheAdd;
  SetCache$1.prototype.has = setCacheHas;

  var _SetCache = SetCache$1;

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */

  function baseFindIndex$1(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  var _baseFindIndex = baseFindIndex$1;

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */

  function baseIsNaN$1(value) {
    return value !== value;
  }

  var _baseIsNaN = baseIsNaN$1;

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */

  function strictIndexOf$1(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  var _strictIndexOf = strictIndexOf$1;

  var baseFindIndex = _baseFindIndex,
      baseIsNaN = _baseIsNaN,
      strictIndexOf = _strictIndexOf;

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf$1(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  var _baseIndexOf = baseIndexOf$1;

  var baseIndexOf = _baseIndexOf;

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes$1(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  var _arrayIncludes = arrayIncludes$1;

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */

  function arrayIncludesWith$1(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  var _arrayIncludesWith = arrayIncludesWith$1;

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */

  function baseUnary$1(func) {
    return function(value) {
      return func(value);
    };
  }

  var _baseUnary = baseUnary$1;

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  function cacheHas$1(cache, key) {
    return cache.has(key);
  }

  var _cacheHas = cacheHas$1;

  var SetCache = _SetCache,
      arrayIncludes = _arrayIncludes,
      arrayIncludesWith = _arrayIncludesWith,
      arrayMap$1 = _arrayMap,
      baseUnary = _baseUnary,
      cacheHas = _cacheHas;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMin = Math.min;

  /**
   * The base implementation of methods like `_.intersection`, without support
   * for iteratee shorthands, that accepts an array of arrays to inspect.
   *
   * @private
   * @param {Array} arrays The arrays to inspect.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of shared values.
   */
  function baseIntersection$1(arrays, iteratee, comparator) {
    var includes = comparator ? arrayIncludesWith : arrayIncludes,
        length = arrays[0].length,
        othLength = arrays.length,
        othIndex = othLength,
        caches = Array(othLength),
        maxLength = Infinity,
        result = [];

    while (othIndex--) {
      var array = arrays[othIndex];
      if (othIndex && iteratee) {
        array = arrayMap$1(array, baseUnary(iteratee));
      }
      maxLength = nativeMin(array.length, maxLength);
      caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
        ? new SetCache(othIndex && array)
        : undefined;
    }
    array = arrays[0];

    var index = -1,
        seen = caches[0];

    outer:
    while (++index < length && result.length < maxLength) {
      var value = array[index],
          computed = iteratee ? iteratee(value) : value;

      value = (comparator || value !== 0) ? value : 0;
      if (!(seen
            ? cacheHas(seen, computed)
            : includes(result, computed, comparator)
          )) {
        othIndex = othLength;
        while (--othIndex) {
          var cache = caches[othIndex];
          if (!(cache
                ? cacheHas(cache, computed)
                : includes(arrays[othIndex], computed, comparator))
              ) {
            continue outer;
          }
        }
        if (seen) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
    return result;
  }

  var _baseIntersection = baseIntersection$1;

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */

  function identity$2(value) {
    return value;
  }

  var identity_1 = identity$2;

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */

  function apply$1(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  var _apply = apply$1;

  var apply = _apply;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest$1(func, start, transform) {
    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  var _overRest = overRest$1;

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */

  function constant$1(value) {
    return function() {
      return value;
    };
  }

  var constant_1 = constant$1;

  var getNative = _getNative;

  var defineProperty$1 = (function() {
    try {
      var func = getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  var _defineProperty = defineProperty$1;

  var constant = constant_1,
      defineProperty = _defineProperty,
      identity$1 = identity_1;

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString$1 = !defineProperty ? identity$1 : function(func, string) {
    return defineProperty(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant(string),
      'writable': true
    });
  };

  var _baseSetToString = baseSetToString$1;

  /** Used to detect hot functions by number of calls within a span of milliseconds. */

  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeNow = Date.now;

  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */
  function shortOut$1(func) {
    var count = 0,
        lastCalled = 0;

    return function() {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);

      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }

  var _shortOut = shortOut$1;

  var baseSetToString = _baseSetToString,
      shortOut = _shortOut;

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString$1 = shortOut(baseSetToString);

  var _setToString = setToString$1;

  var identity = identity_1,
      overRest = _overRest,
      setToString = _setToString;

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest$1(func, start) {
    return setToString(overRest(func, start, identity), func + '');
  }

  var _baseRest = baseRest$1;

  /** Used as references for various `Number` constants. */

  var MAX_SAFE_INTEGER = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength$1(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  var isLength_1 = isLength$1;

  var isFunction = isFunction_1,
      isLength = isLength_1;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike$1(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  var isArrayLike_1 = isArrayLike$1;

  var isArrayLike = isArrayLike_1,
      isObjectLike = isObjectLike_1;

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject$1(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  var isArrayLikeObject_1 = isArrayLikeObject$1;

  var isArrayLikeObject = isArrayLikeObject_1;

  /**
   * Casts `value` to an empty array if it's not an array like object.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Array|Object} Returns the cast array-like object.
   */
  function castArrayLikeObject$1(value) {
    return isArrayLikeObject(value) ? value : [];
  }

  var _castArrayLikeObject = castArrayLikeObject$1;

  var arrayMap = _arrayMap,
      baseIntersection = _baseIntersection,
      baseRest = _baseRest,
      castArrayLikeObject = _castArrayLikeObject;

  /**
   * Creates an array of unique values that are included in all given arrays
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons. The order and references of result values are
   * determined by the first array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @returns {Array} Returns the new array of intersecting values.
   * @example
   *
   * _.intersection([2, 1], [2, 3]);
   * // => [2]
   */
  var intersection = baseRest(function(arrays) {
    var mapped = arrayMap(arrays, castArrayLikeObject);
    return (mapped.length && mapped[0] === arrays[0])
      ? baseIntersection(mapped)
      : [];
  });

  var intersection_1 = intersection;

  /**
   * 事件管理器
   * 默认等待1s建立连接，如果连接未成功，则事件未空对象
   * 接收初始化数据，创建事件函数列表
   */

  var IframeBridgeManager = function IframeBridgeManager(options) {
    var _this = this;

    this.receiveMessage = function (event) {
      if (_this.isIframe) {
        // 握手成功，接受通信的初始化数据，成功连接后，通知外层初始化参数成功
        if (!_this.init && get_1(event, 'data.name') === 'UC_IFRAME_BRIDGE_CREATE') {
          _this.init = true;
          clearInterval(_this.intervalId);
          _this.initMessageData = {
            customizeEvents: intersection_1(_this.options.customizeEventList, get_1(event, 'data.data.customizeEvents', []))
          };
          _this.iframeOrigin = event.origin;

          try {
            window.parent.postMessage({
              name: 'UC_IFRAME_BRIDGE_CREATE_SUCCESS'
            }, _this.iframeOrigin);
          } catch (errors) {
            console.error('UC/IFRAME_BRIDGE: receiveMessage', errors);
          }
        }
      }
    };

    this.initData = function () {
      if (!_this.isIframe) {
        _this.initMessageData = {
          customizeEvents: []
        };
        return;
      }

      var startTime = Date.now();
      _this.intervalId = setInterval(function () {
        if (Date.now() - startTime >= _this.options.waitingTimeForCreating * 1000) {
          clearInterval(_this.intervalId);
          _this.initMessageData = {
            customizeEvents: []
          };
        }
      }, 10);
    };

    this.initIframeEvent = function (customizeEvents) {
      if (customizeEvents === void 0) {
        customizeEvents = [];
      }

      return customizeEvents.reduce(function (accumulator, eventName) {
        accumulator[eventName] = function () {
          try {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            window.parent.postMessage({
              name: eventName,
              data: Object.assign({}, args)
            }, _this.iframeOrigin);
          } catch (errors) {
            console.error('UC/IFRAME_BRIDGE: initIframeEvent', errors);
          }
        };

        return accumulator;
      }, {});
    };

    this.getIframeCustomizeEvents = function () {
      return new Promise(function (resolve) {
        var intervalId = setInterval(function () {
          if (_this.initMessageData !== undefined) {
            clearInterval(intervalId);
            resolve(_this.initIframeEvent(_this.initMessageData.customizeEvents));
          }
        }, 10);
      });
    };

    this.destory = function () {
      window.removeEventListener('message', _this.receiveMessage, false);
    };

    var _ref = options || {},
        _ref$customizeEventLi = _ref.customizeEventList,
        customizeEventList = _ref$customizeEventLi === void 0 ? [] : _ref$customizeEventLi,
        _ref$waitingTimeForCr = _ref.waitingTimeForCreating,
        waitingTimeForCreating = _ref$waitingTimeForCr === void 0 ? 1 : _ref$waitingTimeForCr;

    this.options = {
      customizeEventList: customizeEventList,
      waitingTimeForCreating: waitingTimeForCreating
    };
    this.isIframe = window.top !== window.self;
    this.init = false;
    this.initMessageData = undefined; // 初始化消息数据

    this.iframeOrigin = undefined; // iframe源

    window.addEventListener('message', this.receiveMessage, false);
    this.initData();
  } // iframe嵌入的情况下，可开启通信
;

  exports.CreateIframeBridge = CreateIframeBridge;
  exports.IframeBridgeManager = IframeBridgeManager;
  exports['default'] = UCUtil;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

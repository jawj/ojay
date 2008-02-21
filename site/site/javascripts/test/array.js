YAHOO.util.Event.onDOMReady(function() {
    YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
        name: 'Array tests',
        
        setUp: function() {
            this.assert = YAHOO.util.Assert;
            this.arrayAssert = YAHOO.util.ArrayAssert;
        },
        
        testPop: function() {
            var myFish = ["angel", "clown", "mandarin", "surgeon"];
            var popped = myFish.pop();
            this.assert.areEqual("surgeon", popped);
            this.arrayAssert.itemsAreEqual(["angel", "clown", "mandarin"], myFish);
        },
        
        testPush: function() {
            var myFish = ["angel", "clown"];
            var pushed = myFish.push("drum", "lion");
            this.arrayAssert.itemsAreEqual(["angel", "clown", "drum", "lion"], myFish);
        },
        
        testReverse: function() {
            var myArray = ["one", "two", "three"];
            this.arrayAssert.itemsAreEqual(["three", "two", "one"], myArray.reverse());
        },
        
        testShift: function() {
            var myFish = ["angel", "clown", "mandarin", "surgeon"];
            var shifted = myFish.shift();
            this.assert.areEqual("angel", shifted);
            this.arrayAssert.itemsAreEqual(["clown", "mandarin", "surgeon"], myFish);
        },
        
        testSort: function() {
            var stringArray = ["Blue", "Humpback", "Beluga"];
            var numericStringArray = ["80", "9", "700"];
            var numberArray = [40, 1, 5, 200];
            var mixedNumericArray = ["80", "9", "700", 40, 1, 5, 200];
            
            var compareNumbers = function(a, b) { return a - b; };
            
            this.arrayAssert.itemsAreSame(["Beluga", "Blue", "Humpback"], stringArray.sort());
            this.arrayAssert.itemsAreSame(["700", "80", "9"], numericStringArray.sort());
            this.arrayAssert.itemsAreSame(["9", "80", "700"], numericStringArray.sort(compareNumbers));
            this.arrayAssert.itemsAreSame([1, 200, 40, 5], numberArray.sort());
            this.arrayAssert.itemsAreSame([1, 5, 40, 200], numberArray.sort(compareNumbers));
            this.arrayAssert.itemsAreSame([1, 200, 40, 5, "700", "80", "9"], mixedNumericArray.sort());
            this.arrayAssert.itemsAreSame([1, 5, "9", 40, "80", 200, "700"], mixedNumericArray.sort(compareNumbers));
        },
        
        testSplice: function() {
            var myFish = ["angel", "clown", "mandarin", "surgeon"];
            
            var removed = myFish.splice(2, 0, "drum");
            this.arrayAssert.itemsAreEqual([], removed);
            this.arrayAssert.itemsAreEqual(["angel", "clown", "drum", "mandarin", "surgeon"], myFish);
            
            removed = myFish.splice(3, 1);
            this.arrayAssert.itemsAreEqual(["mandarin"], removed);
            this.arrayAssert.itemsAreEqual(["angel", "clown", "drum", "surgeon"], myFish);
            
            removed = myFish.splice(2, 1, "trumpet");
            this.arrayAssert.itemsAreEqual(["drum"], removed);
            this.arrayAssert.itemsAreEqual(["angel", "clown", "trumpet", "surgeon"], myFish);
            
            removed = myFish.splice(0, 2, "parrot", "anemone", "blue");
            this.arrayAssert.itemsAreEqual(["angel", "clown"], removed);
            this.arrayAssert.itemsAreEqual(["parrot", "anemone", "blue", "trumpet", "surgeon"], myFish);
        },
        
        testUnshift: function() {
            var myFish = ["angel", "clown"];
            var unshifted = myFish.unshift("drum", "lion");
            this.arrayAssert.itemsAreEqual(["drum", "lion", "angel", "clown"], myFish);
        },
        
        testConcat: function() {
            var alpha = ["a", "b", "c"];
            var numeric = [1, 2, 3];
            this.arrayAssert.itemsAreEqual(["a", "b", "c", 1, 2, 3], alpha.concat(numeric));
            
            var num1 = [1, 2, 3];
            var num2 = [4, 5, 6];
            var num3 = [7, 8, 9];
            this.arrayAssert.itemsAreEqual([1, 2, 3, 4, 5, 6, 7, 8, 9], num1.concat(num2, num3));
            this.arrayAssert.itemsAreEqual([1, 2, 3, 4, 5, 6, 7, 8, 9], num1.concat(num2).concat(num3));
        },
        
        testJoin: function() {
            var a = new Array("Wind","Rain","Fire");
            this.assert.areEqual("Wind,Rain,Fire", a.join());
            this.assert.areEqual("Wind, Rain, Fire", a.join(", "));
            this.assert.areEqual("Wind + Rain + Fire", a.join(" + "));
        },
        
        testSlice: function() {
            var myHonda = { color: "red", wheels: 4, engine: { cylinders: 4, size: 2.2 } };
            var myCar = [myHonda, 2, "cherry condition", "purchased 1997"];
            var newCar = myCar.slice(0, 2);
            this.arrayAssert.itemsAreSame([myHonda, 2], newCar);
            newCar = myCar.slice(1, 4);
            this.arrayAssert.itemsAreSame([2, "cherry condition", "purchased 1997"], newCar);
        },
        
        testToString: function() {
            var monthNames = new Array("Jan","Feb","Mar","Apr");
            this.assert.areEqual("Jan,Feb,Mar,Apr", monthNames.toString());
        },
        
        testIndexOf: function() {
            var array = [2, 5, 9, 2];
            this.assert.areEqual(0, array.indexOf(2));
            this.assert.areEqual(3, array.indexOf(2,1));
            this.assert.areEqual(-1, array.indexOf(7));
        },
        
        testLastIndexOf: function() {
            var array = [2, 5, 9, 2];
            this.assert.areEqual(3, array.lastIndexOf(2));
            this.assert.areEqual(-1, array.lastIndexOf(7));
            this.assert.areEqual(3, array.lastIndexOf(2,3));
            this.assert.areEqual(0, array.lastIndexOf(2,2));
            this.assert.areEqual(0, array.lastIndexOf(2,-2));
            this.assert.areEqual(3, array.lastIndexOf(2,-1));
        },
        
        testFilter: function() {
            function isBigEnough(element, index, array) {
              return (element >= 10);
            }
            this.arrayAssert.itemsAreEqual([12, 130, 44], [12, 5, 8, 130, 44].filter(isBigEnough));
        },
        
        testForEach: function() {
            var results = [];
            [2, 5, 9].forEach(function(element, index, array) {
                results.push(element + index + array[2]);
            });
            this.arrayAssert.itemsAreEqual([11, 15, 20], results);
        },
        
        testEvery: function() {
            function isBigEnough(element, index, array) {
              return (element >= 10);
            }
            this.assert.isFalse([12, 5, 8, 130, 44].every(isBigEnough));
            this.assert.isTrue([12, 54, 18, 130, 44].every(isBigEnough));
        },
        
        testMap: function() {
            function makePseudoPlural(single) {
              return single.replace(/o/g, "e");
            }
            var singles = ["foot", "goose", "moose"];
            var plurals = singles.map(makePseudoPlural);
            this.arrayAssert.itemsAreEqual(["feet", "geese", "meese"], plurals);
            
            var numbers = [1, 4, 9];
            var roots = numbers.map(Math.sqrt);
            this.arrayAssert.itemsAreEqual([1, 2, 3], roots);
        },
        
        testSome: function() {
            function isBigEnough(element, index, array) {
              return (element >= 10);
            }
            this.assert.isFalse([2, 5, 8, 1, 4].some(isBigEnough));
            this.assert.isTrue([12, 5, 8, 1, 4].some(isBigEnough));
        },
        
        testReduce: function() {
            var sum = [0,1,2,3,4].reduce(function(previousValue, currentValue, index, array){
              return previousValue + currentValue;
            });
            this.assert.areEqual(10, sum);
            
            var sumWithStart = [0,1,2,3,4].reduce(function(previousValue, currentValue, index, array){
              return previousValue + currentValue;
            }, 10);
            this.assert.areEqual(20, sumWithStart);
            
            var flattened = [[0,1], [2,3], [4,5]].reduce(function(a,b) {
              return a.concat(b);
            }, []);
            this.arrayAssert.itemsAreEqual([0,1,2,3,4,5], flattened);
        },
        
        testReduceRight: function() {
            var total = [0, 1, 2, 3].reduceRight(function(a, b) { return a + b; });
            this.assert.areEqual(6, total);
            
            var flattened = [[0, 1], [2, 3], [4, 5]].reduceRight(function(a, b) {
              return a.concat(b);
            }, []);
            this.arrayAssert.itemsAreEqual([4,5,2,3,0,1], flattened);
        }
    }));
    
    var logger = new YAHOO.tool.TestLogger();
    YAHOO.tool.TestRunner.run();
});

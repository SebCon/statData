
'use strict';


/**
*		@namespace statData
*		@todo calculate max array size via heap limits
*/

/**
 * @copyright 2016-2017
 * @author Sebastian Conrad <http://www.sebcon.de/>
 * @version 1.1 - 01. July 2017
 * @see http://www.github.com/sebcon
 * @license Available under MIT license <https://mths.be/mit>
 * @fileoverview collectData can handle large arrays with statistic data,
 *		the following statistic methods are implemened:
 *			- wrapping methods for large arrays
 *			- can calculate average of large arrays
 *			- can specify the max and the min value of large arrays
 *			- can calculate median of small arrays
 */


/**
*		@class statData
*
*		@constructor
*		@param {string}	[name = default] - the name of the statistic data collection
*		@param {number} [arraySize = Unlimited] - array length
*		@param {boolean} [onlyPositive = false] - only positives numbers are allowed
**/
var statData = function(name, arraySize, onlyPositive) {

	// if not set any name, default name is 'default'
	if (name !== undefined && name !== null) {
		this.name = name;
	} else {
		this.name = 'default';
	}
	var setArraySize = false;

	// if not set any size, array size is Unlimited
	if (arraySize) {
		this.arraySize = arraySize;
		setArraySize = true;
	}

	// @todo - clean up variables
	this.onlyPositive = (onlyPositive || true);

	// @todo if !setArraySize, init array with heap limit
	var collector = [];
	var collectorWarning = [];
	var averageTemp = 0.0;
	var calcAverageTemp = false;
	var max = 0.0;
	var min = 0.0;
	var median = 0.0;
	var total = 0.0;
	var totalCount = 0;

	var errorValue = 0;
	var errorTotal = 0;

	/**
	*		@constant
	*		@type {number}
	*/
	var DECIMAL_COUNT = 10;



	/** get the min value of statistic collection
	*		@function getMin
	*		@return {number} minValue
	**/
	function getMin() {
		return min;
	}


	/** get max Value of statistic collection
	*		@function getMax
	*		@return {number} maxValue
	**/
	function getMax() {
		return max;
	}


	/**
	*		@function rounded value with x decimals
	*		@private
	*		@param {number} value - value that should be rounded
	*		@param {number} [decimals = 10] - rounded x decimals
	*		@return {number} roundedValue
	**/
	function round(value, decimals) {
	  if (value) {
	     if (!decimals) {
				 decimals = DECIMAL_COUNT;
	     }
	     return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
	  } else {
	     return 0;
	  }
	}


	// @todo clear???
	function addElemToLargeArray(elem) {
		collector[collector.length] = round(elem);
	}


	function getLargeArray() {
		return collector;
	}


	/** start the garbage collector of the browser
	* 	@function startgc
	*		@private
	*		@todo start gc several times???
	*/
	function startgc() {
		if (window.gc) {
				console.warn('running garbage collector');
				window.gc();
		}
	}


	/** reset all data
	* 	@function destroyCollector
	*		@private
	*/
	function destroyCollector() {
		collector.length = 0;
		collector = [];
		min = 0.0;
		max = 0.0;
		total = 0.0;
		totalCount = 0;
		errorValue = 0;
		errorTotal = 0;
		//clearVisDom();
		startgc();
	}


	/** reset Array data
	* 	@function cleanUp
	*		@private
	*/
	function cleanUp() {
		collector.length = 0;
		collector = [];
		startgc();
	}


/*
* Aufgrund der ungenauen Floating Point arithmetic kommt es zu Ungenauigkeiten bei Werten von 20.000 sowie 30.000
* Ab 40.000 Einträgen wird die Ungenauigkeit durch Rundungen wieder ausgeglichen
* Grund dafür ist die ArraySize, je größer die ArraySize desto größer ist die Kumulation der Rundungsfehler
*
* ersetzt wird die Funktion durch die u.st. Funktion addElement
* FUnktion kann auch beibehalten werden, wenn die ArraySize auf 2 eingestellt wird.
*/
/*
	function addElement(elem) {
		if (elem !== undefined && elem !== null) {

			if (setArraySize && collector.length >= arraySize) {
				//console.log('calculate storage sum: '+averageTemp);
				calcAverageTemp = true;
				averageTemp = calculateAverage();
				cleanUp();
			}

			if (onlyPositive && elem <= 0) {
				collectorWarning[collectorWarning.length] = elem;
			} else {
				totalCount++;
				collector[collector.length] = elem;
			}
		}
	};
	*/

	// calc average: (x1 + x2) / 2
	// Versuch, Problem mit dem Floating Point zu umgehen
	//
	// measure time, if this function is more slower
	function addElement(elem) {
		if (elem !== undefined && elem !== null) {
			if (onlyPositive && elem <= 0) {
				collectorWarning[collectorWarning.length] = elem;
			} else {
				collector.push(elem);
				totalCount++;
				if (calcAverageTemp) {
					averageTemp = round( (averageTemp + elem) / 2);
				} else {
					calcAverageTemp = true;
					averageTemp = elem;
				}
			}
		}
	}


	/** get the median value of the statistic collection
	* 	@function getMedian
	*		@return {number} median
	*/
	function getMedian() {
		return (calculateMedian() || 0);
	}


	/** get Average, if not, calculate average within array data
	* 	@function getAverage
	*		@return {number} average
	*/
	function getAverage() {
		//
		var average = averageTemp;
		if (!calcAverageTemp) {
			average = calculateAverage();
		}

		return average;
	}


	/** check if number is odd
	* 	@function isOdd
	*		@private
	*		@param {number} num - number that will be check
	*		@return {boolean} isOdd
	*/
	function isOdd(num) {
		return (num % 2);
	}


	/** calculate median of the statistic collection
	* 	@function calculateMedian
	*		@private
	*		@return {number} median
	*/
	function calculateMedian() {
		var len = collector.length;
		var xm = 0;
		if (len > 0) {
			// vorher Array Werte sortieren !!!
			collector.sort();
			if (isOdd(len)) {
				var xn = (len + 1) / 2;
				console.log('isOdd xm: '+xn);
				xm = collector[xn];
			} else {
				var xm1 = (collector[(len / 2)]) / 2;
				var xm2 = (collector[((len + 2) /2 )]) / 2;
				console.log('isEven: xm1 '+xm1+' - xm2: '+xm2);
				xm = xm1 + xm2;
			}
		} else {
			console.warn('cannot calc median of empty array');
		}

		return round(xm);
	}



	/** calculate average of the statistic collection
	* 	@function calculateAverage
	*		@private
	*		@return {number} average
	*/
	function calculateAverage() {
		var total = 0.0;
		var temp = 0.0;
		var len = collector.length;
		var average = 0;

		if (len > 0) {
			for (var i=(len-1); i >=0; i--) {
				total = round((total + collector[i]));
				if (collector[i] > max) {
						max = collector[i];
				}
				if (collector[i] < min) {
						min = collector[i];
				}
			}

			var newLen = len;
			if (calcAverageTemp) {
				newLen++;
			}

			/*
			console.log('total: '+total);
			console.log('averageTemp: '+averageTemp);
			console.log('newLen: '+newLen);
			console.warn((total + averageTemp) / (newLen));
			*/

			average = round((total + averageTemp) / (newLen));

		} else {
			console.error('cannot find any collector or data for collector '+name);
		}

		return (average);
	}


	/** get warnings
	* 	@function getWarning
	*		@return {number[]} warnings
	*/
	function getWarning() {
		return collectorWarning;
	}


	/** get count of loops
	* 	@function getTotalCount
	*		@return {number} loopCount
	*/
	function getTotalCount() {
		return totalCount;
	}


	// automatische Ermittlung des Stichprobenumfangs !!!
	function calcStichprobenumfang() {

	}


	return {
		addElement : addElement,
		getAverage : getAverage,
		destroyCollector : destroyCollector,
		getMin : getMin,
		getMax : getMax,
		getMedian : getMedian,
		addElemToLargeArray : addElemToLargeArray,
		getLargeArray : getLargeArray,
		getWarning : getWarning,
		getTotalCount : getTotalCount
	};


};

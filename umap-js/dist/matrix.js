"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var utils = __importStar(require("./utils"));
var SparseMatrix = (function () {
    function SparseMatrix(rows, cols, values, dims) {
        this.entries = new Map();
        this.nRows = 0;
        this.nCols = 0;
        this.rows = __spread(rows);
        this.cols = __spread(cols);
        this.values = __spread(values);
        for (var i = 0; i < values.length; i++) {
            var key = this.makeKey(this.rows[i], this.cols[i]);
            this.entries.set(key, i);
        }
        this.nRows = dims[0];
        this.nCols = dims[1];
    }
    SparseMatrix.prototype.makeKey = function (row, col) {
        return row + ":" + col;
    };
    SparseMatrix.prototype.checkDims = function (row, col) {
        var withinBounds = row < this.nRows && col < this.nCols;
        if (!withinBounds) {
            throw new Error('array index out of bounds');
        }
    };
    SparseMatrix.prototype.set = function (row, col, value) {
        this.checkDims(row, col);
        var key = this.makeKey(row, col);
        if (!this.entries.has(key)) {
            this.rows.push(row);
            this.cols.push(col);
            this.values.push(value);
            this.entries.set(key, this.values.length - 1);
        }
        else {
            var index = this.entries.get(key);
            this.values[index] = value;
        }
    };
    SparseMatrix.prototype.get = function (row, col, defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        this.checkDims(row, col);
        var key = this.makeKey(row, col);
        if (this.entries.has(key)) {
            var index = this.entries.get(key);
            return this.values[index];
        }
        else {
            return defaultValue;
        }
    };
    SparseMatrix.prototype.getDims = function () {
        return [this.nRows, this.nCols];
    };
    SparseMatrix.prototype.getRows = function () {
        return __spread(this.rows);
    };
    SparseMatrix.prototype.getCols = function () {
        return __spread(this.cols);
    };
    SparseMatrix.prototype.getValues = function () {
        return __spread(this.values);
    };
    SparseMatrix.prototype.forEach = function (fn) {
        for (var i = 0; i < this.values.length; i++) {
            fn(this.values[i], this.rows[i], this.cols[i]);
        }
    };
    SparseMatrix.prototype.map = function (fn) {
        var vals = [];
        for (var i = 0; i < this.values.length; i++) {
            vals.push(fn(this.values[i], this.rows[i], this.cols[i]));
        }
        var dims = [this.nRows, this.nCols];
        return new SparseMatrix(this.rows, this.cols, vals, dims);
    };
    SparseMatrix.prototype.toArray = function () {
        var _this = this;
        var rows = utils.empty(this.nRows);
        var output = rows.map(function () {
            return utils.zeros(_this.nCols);
        });
        for (var i = 0; i < this.values.length; i++) {
            output[this.rows[i]][this.cols[i]] = this.values[i];
        }
        return output;
    };
    return SparseMatrix;
}());
exports.SparseMatrix = SparseMatrix;
function transpose(matrix) {
    var cols = [];
    var rows = [];
    var vals = [];
    matrix.forEach(function (value, row, col) {
        cols.push(row);
        rows.push(col);
        vals.push(value);
    });
    var dims = [matrix.nCols, matrix.nRows];
    return new SparseMatrix(rows, cols, vals, dims);
}
exports.transpose = transpose;
function identity(size) {
    var _a = __read(size, 1), rows = _a[0];
    var matrix = new SparseMatrix([], [], [], size);
    for (var i = 0; i < rows; i++) {
        matrix.set(i, i, 1);
    }
    return matrix;
}
exports.identity = identity;
function pairwiseMultiply(a, b) {
    return elementWise(a, b, function (x, y) { return x * y; });
}
exports.pairwiseMultiply = pairwiseMultiply;
function add(a, b) {
    return elementWise(a, b, function (x, y) { return x + y; });
}
exports.add = add;
function subtract(a, b) {
    return elementWise(a, b, function (x, y) { return x - y; });
}
exports.subtract = subtract;
function maximum(a, b) {
    return elementWise(a, b, function (x, y) { return (x > y ? x : y); });
}
exports.maximum = maximum;
function multiplyScalar(a, scalar) {
    return a.map(function (value) {
        return value * scalar;
    });
}
exports.multiplyScalar = multiplyScalar;
function eliminateZeros(m) {
    var zeroIndices = new Set();
    var values = m.getValues();
    var rows = m.getRows();
    var cols = m.getCols();
    for (var i = 0; i < values.length; i++) {
        if (values[i] === 0) {
            zeroIndices.add(i);
        }
    }
    var removeByZeroIndex = function (_, index) { return !zeroIndices.has(index); };
    var nextValues = values.filter(removeByZeroIndex);
    var nextRows = rows.filter(removeByZeroIndex);
    var nextCols = cols.filter(removeByZeroIndex);
    return new SparseMatrix(nextRows, nextCols, nextValues, m.getDims());
}
exports.eliminateZeros = eliminateZeros;
function normalize(m, normType) {
    if (normType === void 0) { normType = "l2"; }
    var e_1, _a;
    var normFn = normFns[normType];
    var colsByRow = new Map();
    m.forEach(function (_, row, col) {
        var cols = colsByRow.get(row) || [];
        cols.push(col);
        colsByRow.set(row, cols);
    });
    var nextMatrix = new SparseMatrix([], [], [], m.getDims());
    var _loop_1 = function (row) {
        var cols = colsByRow.get(row).sort();
        var vals = cols.map(function (col) { return m.get(row, col); });
        var norm = normFn(vals);
        for (var i = 0; i < norm.length; i++) {
            nextMatrix.set(row, cols[i], norm[i]);
        }
    };
    try {
        for (var _b = __values(colsByRow.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var row = _c.value;
            _loop_1(row);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return nextMatrix;
}
exports.normalize = normalize;
var normFns = (_a = {},
    _a["max"] = function (xs) {
        var max = -Infinity;
        for (var i = 0; i < xs.length; i++) {
            max = xs[i] > max ? xs[i] : max;
        }
        return xs.map(function (x) { return x / max; });
    },
    _a["l1"] = function (xs) {
        var sum = 0;
        for (var i = 0; i < xs.length; i++) {
            sum += xs[i];
        }
        return xs.map(function (x) { return x / sum; });
    },
    _a["l2"] = function (xs) {
        var sum = 0;
        for (var i = 0; i < xs.length; i++) {
            sum += Math.pow(xs[i], 2);
        }
        return xs.map(function (x) { return Math.sqrt(Math.pow(x, 2) / sum); });
    },
    _a);
function elementWise(a, b, op) {
    var visited = new Set();
    var rows = [];
    var cols = [];
    var vals = [];
    var operate = function (row, col) {
        rows.push(row);
        cols.push(col);
        var nextValue = op(a.get(row, col), b.get(row, col));
        vals.push(nextValue);
    };
    var valuesA = a.getValues();
    var rowsA = a.getRows();
    var colsA = a.getCols();
    for (var i = 0; i < valuesA.length; i++) {
        var row = rowsA[i];
        var col = colsA[i];
        var key = row + ":" + col;
        visited.add(key);
        operate(row, col);
    }
    var valuesB = b.getValues();
    var rowsB = b.getRows();
    var colsB = b.getCols();
    for (var i = 0; i < valuesB.length; i++) {
        var row = rowsB[i];
        var col = colsB[i];
        var key = row + ":" + col;
        if (visited.has(key))
            continue;
        operate(row, col);
    }
    var dims = [a.nRows, a.nCols];
    return new SparseMatrix(rows, cols, vals, dims);
}
function getCSR(x) {
    var entries = [];
    x.forEach(function (value, row, col) {
        entries.push({ value: value, row: row, col: col });
    });
    entries.sort(function (a, b) {
        if (a.row === b.row) {
            return a.col - b.col;
        }
        else {
            return a.row - b.col;
        }
    });
    var indices = [];
    var values = [];
    var indptr = [];
    var currentRow = -1;
    for (var i = 0; i < entries.length; i++) {
        var _a = entries[i], row = _a.row, col = _a.col, value = _a.value;
        if (row !== currentRow) {
            currentRow = row;
            indptr.push(i);
        }
        indices.push(col);
        values.push(value);
    }
    return { indices: indices, values: values, indptr: indptr };
}
exports.getCSR = getCSR;

import * as heap from './heap';
import * as matrix from './matrix';
import * as tree from './tree';
import { RandomFn, Vectors, DistanceFn } from './umap';
export declare function makeNNDescent(distanceFn: DistanceFn, random: RandomFn): (data: number[][], leafArray: number[][], nNeighbors: number, nIters?: number, maxCandidates?: number, delta?: number, rho?: number, rpTreeInit?: boolean) => {
    indices: number[][];
    weights: number[][];
};
export declare type InitFromRandomFn = (nNeighbors: number, data: Vectors, queryPoints: Vectors, _heap: heap.Heap, random: RandomFn) => void;
export declare type InitFromTreeFn = (_tree: tree.FlatTree, data: Vectors, queryPoints: Vectors, _heap: heap.Heap, random: RandomFn) => void;
export declare function makeInitializations(distanceFn: DistanceFn): {
    initFromRandom: (nNeighbors: number, data: number[][], queryPoints: number[][], _heap: number[][][], random: RandomFn) => void;
    initFromTree: (_tree: tree.FlatTree, data: number[][], queryPoints: number[][], _heap: number[][][], random: RandomFn) => void;
};
export declare type SearchFn = (data: Vectors, graph: matrix.SparseMatrix, initialization: heap.Heap, queryPoints: Vectors) => heap.Heap;
export declare function makeInitializedNNSearch(distanceFn: DistanceFn): (data: number[][], graph: matrix.SparseMatrix, initialization: number[][][], queryPoints: number[][]) => number[][][];
export declare function initializeSearch(forest: tree.FlatTree[], data: Vectors, queryPoints: Vectors, nNeighbors: number, initFromRandom: InitFromRandomFn, initFromTree: InitFromTreeFn, random: RandomFn): number[][][];

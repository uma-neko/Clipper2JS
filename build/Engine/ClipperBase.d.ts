import { Active } from "./Active";
import { HorzJoin } from "./HorzJoin";
import { HorzSegment } from "./HorzSegment";
import { IntersectNode } from "./IntersectNode";
import { LocalMinima } from "./LocalMinima";
import { OutPt } from "./OutPt";
import { OutRec } from "./OutRec";
import { PolyPathBase } from "./PolyPathBase";
import { Vertex } from "./Vertex";
import { ClipType, FillRule, PathType } from "../Core/CoreEnums";
import { Paths64 } from "../Core/Paths64";
import { Point64 } from "../Core/Point64";
import { Rect64 } from "../Core/Rect64";
export declare class ClipperBase {
    _cliptype: ClipType;
    _fillrule: FillRule;
    _actives?: Active;
    _sel?: Active;
    _minimaList: LocalMinima[];
    _intersectList: IntersectNode[];
    _vertexList: Vertex[];
    _outrecList: OutRec[];
    _scanlineList: bigint[];
    _horzSegList: HorzSegment[];
    _horzJoinList: HorzJoin[];
    _currentLocMin: number;
    _currentBotY: bigint;
    _isSortedMinimaList: boolean;
    _hasOpenPaths: boolean;
    _using_polytree: boolean;
    _succeeded: boolean;
    preserveCollinear: boolean;
    reverseSolution: boolean;
    constructor();
    clearSolutionOnly(): void;
    clear(): void;
    reset(): void;
    insertScanLine(y: bigint): void;
    popScanline(): {
        result: boolean;
        y: bigint;
    };
    hasLocMinAtY(y: bigint): boolean;
    popLocalMinima(): LocalMinima;
    addSubject(path: Iterable<Point64>): void;
    addOpenSubject(path: Iterable<Point64>): void;
    addClip(path: Iterable<Point64>): void;
    addPath(path: Iterable<Point64>, polytype: PathType, isOpen?: boolean): void;
    addPaths(paths: Iterable<Iterable<Point64>>, polytype: PathType, isOpen?: boolean): void;
    isContributingClosed(ae: Active): boolean;
    isContributingOpen(ae: Active): boolean;
    setWindCountForClosedPathEdge(ae: Active): void;
    setWindCountForOpenPathEdge(ae: Active): void;
    insertLeftEdge(ae: Active): void;
    insertLocalMinimaIntoAEL(boty: bigint): void;
    pushHorz(ae: Active): void;
    popHorz(): {
        result: boolean;
        value?: Active;
    };
    addLocalMinPoly(ae1: Active, ae2: Active, pt: Point64, isNew?: boolean): OutPt;
    addLocalMaxPoly(ae1: Active, ae2: Active, pt: Point64): OutPt | undefined;
    newOutRec(): OutRec;
    startOpenPath(ae: Active, pt: Point64): OutPt;
    updateEdgeIntoAEL(ae: Active): void;
    intersectEdges(ae1: Active, ae2: Active, pt: Point64): OutPt | undefined;
    deleteFromAEL(ae: Active): void;
    adjustCurrXAndCopyToSEL(topY: bigint): void;
    executeInternal(ct: ClipType, fillRule: FillRule): void;
    doIntersections(topY: bigint): void;
    disposeIntersectNodes(): void;
    addNewIntersectNode(ae1: Active, ae2: Active, topY: bigint): void;
    buildIntersectList(topY: bigint): boolean;
    processIntersectList(): void;
    swapPositionsInAEL(ae1: Active, ae2: Active): void;
    addToHorzSegList(op: OutPt): void;
    getLastOp(hotEdge: Active): OutPt;
    doHorizontal(horz: Active): void;
    doTopOfScanbeam(y: bigint): void;
    doMaxima(ae: Active): Active | undefined;
    split(e: Active, currPt: Point64): void;
    checkJoinLeft(e: Active, pt: Point64, checkCurrX?: boolean): void;
    checkJoinRight(e: Active, pt: Point64, checkCurrX?: boolean): void;
    convertHorzSegsToJoins(): void;
    moveSplits(fromOr: OutRec, toOr: OutRec): void;
    processHorzJoins(): void;
    cleanCollinear(outrec?: OutRec): void;
    doSplitOp(outrec: OutRec, splitOp: OutPt): void;
    fixSelfIntersects(outrec: OutRec): void;
    buildPaths(solutionClosed: Paths64, solutionOpen?: Paths64): boolean;
    checkBounds(outrec: OutRec): boolean;
    checkSplitOwner(outrec: OutRec, splits?: number[]): boolean;
    recursiveCheckOwners(outrec: OutRec, polypath: PolyPathBase): void;
    buildTree(polytree: PolyPathBase, solutionOpen?: Paths64): void;
    getBounds(): Rect64;
}

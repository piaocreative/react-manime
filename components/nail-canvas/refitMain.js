import refitEditor from './refitCurveEditor';
import {
    makeParamFromPoints,
    makeParamTranslate,
    makeParamFrom2,
    makeParamFrom2RevisitedForBottom,
    interpolate
} from './refitMath';

let nailEditor;
let defaultNail;
let canvasName = "interactiveNailCanvas";
let nailBottom;
let nailTop;
let nail;

let xOffset = 0; // positive offset moves the nail right
let yOffset = 70; // positive offset moves the nail up

let backgroundColor = "transparent"; //"#F8F1ED";
let originalStrokeColor = "#2C4349";
let originalFillColor = backgroundColor;
let newStrokeColor = "#F7BFA0";
let newFillColor = "#F7BFA0";

let strokeWidth = 2; // px

function start() {

    let numCurvePoints = 3;
    let maxIdx;
    let c1, c2, c3;

    // change these points here to change the default nail shape
    // Units are in pixels

    if (numCurvePoints === 4) {
        c1 = [{ x: 50, y: 100 },
        { x: 50, y: 160 },
        { x: 60, y: 230 },
        { x: 100, y: 250 }];

        c2 = [{ x: 100, y: 250 },
        { x: 140, y: 230 },
        { x: 150, y: 160 },
        { x: 150, y: 100 }];

        c3 = [{ x: 150, y: 100 },
        { x: 120, y: 60 },
        { x: 80, y: 60 },
        { x: 50, y: 100 }];

        maxIdx = 3;
    }
    else {

        c1 = [{ x: 50, y: 100 },
        { x: 45, y: 220 },
        { x: 100, y: 250 }];

        c2 = [{ x: 100, y: 250 },
        { x: 155, y: 220 },
        { x: 150, y: 100 }];

        c3 = [{ x: 150, y: 100 },
        { x: 100, y: 90 },
        { x: 50, y: 100 }];

        maxIdx = 2;
    }


    let lowerWidthSlider = document.getElementById("lowerWidthSlider");

    lowerWidthSlider.onchange = function (value) {
        lowerWidthSlider.value = value;
        nailEditor.curves[0][maxIdx - 1].x = c1[maxIdx - 1].x - parseInt(this.value);
        nailEditor.curves[1][1].x = c2[1].x + parseInt(this.value);
        change()
    }

    let upperWidthSlider = document.getElementById("upperWidthSlider");

    upperWidthSlider.onchange = function (value) {
        upperWidthSlider.value = value;
        let i;
        for (i = 0; i < maxIdx - 1; ++i) {
            nailEditor.curves[0][i].x = c1[i].x - parseInt(this.value);
        }

        for (i = 2; i <= maxIdx; ++i) {
            nailEditor.curves[1][i].x = c2[i].x + parseInt(this.value);
        }

        nailEditor.curves[2][0] = nailEditor.curves[1][maxIdx];
        nailEditor.curves[2][maxIdx] = nailEditor.curves[0][0];

        change()
    }

    let lengthSlider = document.getElementById("lengthSlider");

    lengthSlider.onchange = function (value) {
        lengthSlider.value = value;
        nailEditor.curves[0][0].y = nailEditor.curves[2][maxIdx].y = c1[0].y - parseInt(this.value);
        nailEditor.curves[1][maxIdx].y = nailEditor.curves[2][0].y = c2[maxIdx].y - parseInt(this.value);

        for (let i = 1; i < maxIdx; ++i) {
            nailEditor.curves[2][i].y = c3[i].y - parseInt(this.value);
        }
        change()
    }

    let resetButton = document.getElementById("resetButton");
    resetButton.onclick = function () {
        lengthSlider.value = 0;
        lengthSlider.onchange();

        lowerWidthSlider.value = 0;
        lowerWidthSlider.onchange();

        upperWidthSlider.value = 0;
        upperWidthSlider.onchange();

        change();

    }

    nailEditor = new refitEditor(canvasName);

    let canvas = document.getElementById(canvasName);
    let width = canvas.width;
    let height = canvas.height;


    nailEditor.left = 0;
    nailEditor.right = width;
    nailEditor.top = 0;
    nailEditor.bottom = height;

    nailEditor.specificExtremumDrawing = true;

    nailEditor.addCurve(c1);
    nailEditor.addCurve(c2);
    nailEditor.addCurve(c3);

    nailEditor.needRedrawCallback = function () {
        redraw();
    };

    nailEditor.allowShiftFlag = true;

    if (nailEditor != null) {
        nailEditor.changeCallback = function (that, c, cp, x, y) {
            change();
        };
    }

    nailEditor.friendCurvesCallback = function (that, c) {
        let f = 0;
        let result = [];
        if (c !== f * 3) result.push(f * 3);
        if (c !== f * 3 + 1) result.push(f * 3 + 1);
        if (c !== f * 3 + 2) result.push(f * 3 + 2);
        return result;
    }

    makeDefault();

    change();
}

function makeDefault() {

    nailBottom =
        makeParamFrom2RevisitedForBottom(
            makeParamFromPoints(nailEditor.curves[0]),
            makeParamFromPoints(nailEditor.curves[1]));


    nailTop = makeParamFromPoints(nailEditor.curves[2]);

    defaultNail = makeParamFrom2(nailBottom, nailTop);

    defaultNail = centerNail(defaultNail);

}

function centerNail(nailFun) {
    let p0 = nailFun(0);
    let p1 = nailFun(0.5);
    let p2 = {
        x: (p0.x + p1.x) / 2,
        y: (p0.y + p1.y) / 2
    };
    let canvas = document.getElementById(canvasName);

    let lengthSlider = document.getElementById("lengthSlider");

    return makeParamTranslate(nailFun, -p2.x + canvas.width / 2 + xOffset, -p2.y + canvas.height / 2 - lengthSlider.value - yOffset);
}


function redraw() {
    let canvas = document.getElementById(canvasName);
    let context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = originalStrokeColor;
    context.fillStyle = originalFillColor;
    context.globalAlpha = 1
    drawParametricShape(defaultNail, 1);
    
    context.strokeStyle = newStrokeColor;
    context.fillStyle = newFillColor;
    context.globalAlpha = 1;

    // nailEditor.draw();
    // context.setLineDash([5, 5]);
    drawParametricShape(nail, 1)
    // drawParametricShape(nail, 0)

    // context.setLineDash([]);
    context.strokeStyle = originalStrokeColor;
    context.fillStyle = originalFillColor;
    drawParametricShape(defaultNail, 0);

    function drawParametricShape(p, fillFlag) {
        if (fillFlag === undefined){
            fillFlag = 0;
        }
        let divisions = 64;

        context.beginPath();

        for (let a = 0; a <= divisions; a++) {
            let t = interpolate(a, 0, divisions, 0, 1);
            let xy1 = p(t);

            if (a === 0) {
                context.moveTo(nailEditor.xToCanvas(xy1.x, xy1.y), nailEditor.yToCanvas(xy1.x, xy1.y));
            }
            else {
                context.lineTo(nailEditor.xToCanvas(xy1.x, xy1.y), nailEditor.yToCanvas(xy1.x, xy1.y));
            }
        }

        context.closePath();
        context.stroke();
        context.lineWidth = strokeWidth;
        if (fillFlag){
            context.fill();
        }
    }
}
function change() {

    nailBottom =
        makeParamFrom2RevisitedForBottom(
            makeParamFromPoints(nailEditor.curves[0]),
            makeParamFromPoints(nailEditor.curves[1]));

    nailTop = makeParamFromPoints(nailEditor.curves[2]);

    nail = makeParamFrom2(nailBottom, nailTop);

    nail = centerNail(nail);

    redraw();
}

export {
    start
}
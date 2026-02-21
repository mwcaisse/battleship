import Konva from "konva";

function shipTop(x: number, y: number) {
    const radius = 30;
    const lineLength = 30;

    const fill = new Konva.Shape({
        x: x,
        y: y,
        offset: {
            x: 30,
            y: 30,
        },
        fill: "grey",
        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.arc(0, 0, radius, Math.PI, 0, false);

            ctx.lineTo(radius, lineLength);
            ctx.lineTo(-radius, lineLength);
            ctx.closePath();

            ctx.fillShape(shape);
        },
    });
    const outline = new Konva.Shape({
        x: x,
        y: y,
        offset: {
            x: 30,
            y: 30,
        },
        stroke: "black",
        strokeWidth: 4,

        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.arc(0, 0, radius, Math.PI, 0, false);

            ctx.moveTo(radius, 0);
            ctx.lineTo(radius, lineLength);

            ctx.moveTo(-radius, 0);
            ctx.lineTo(-radius, lineLength);

            ctx.strokeShape(shape);
        },
    });

    const group = new Konva.Group({ draggable: true });
    group.add(fill);
    group.add(outline);

    return group;
}

function shipMiddle(x: number, y: number) {
    const lineLength = 60;
    const halfLineLength = lineLength / 2;

    const fill = new Konva.Shape({
        x: x,
        y: y,
        fill: "grey",
        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.rect(-halfLineLength, -halfLineLength, lineLength, lineLength);
            ctx.fillShape(shape);
        },
    });
    const outline = new Konva.Shape({
        x: x,
        y: y,
        stroke: "black",
        strokeWidth: 4,
        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.moveTo(-halfLineLength, -halfLineLength);
            ctx.lineTo(-halfLineLength, halfLineLength);

            ctx.moveTo(halfLineLength, -halfLineLength);
            ctx.lineTo(halfLineLength, halfLineLength);

            ctx.strokeShape(shape);
        },
    });

    const group = new Konva.Group({ draggable: true });
    group.add(fill);
    group.add(outline);

    return group;
}

function shipBottom(x: number, y: number) {
    const radius = 30;
    const lineLength = 30;

    const fill = new Konva.Shape({
        x: x,
        y: y,
        offset: {
            x: 30,
            y: 30,
        },
        fill: "grey",
        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.moveTo(radius, 0);

            ctx.arc(0, 0, radius, 0, Math.PI, false);

            ctx.lineTo(-radius, -lineLength);
            ctx.lineTo(radius, -lineLength);

            ctx.closePath();

            ctx.fillShape(shape);
        },
    });
    const outline = new Konva.Shape({
        x: x,
        y: y,
        offset: {
            x: 30,
            y: 30,
        },
        stroke: "black",
        strokeWidth: 4,

        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.arc(0, 0, radius, 0, Math.PI, false);

            ctx.moveTo(radius, -lineLength);
            ctx.lineTo(radius, 0);

            ctx.moveTo(-radius, -lineLength);
            ctx.lineTo(-radius, 0);

            ctx.strokeShape(shape);
        },
    });

    const group = new Konva.Group({ draggable: true });
    group.add(fill);
    group.add(outline);

    return group;
}

function setupKonva(elementId: string) {
    const stage = new Konva.Stage({
        container: elementId,
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const layer = new Konva.Layer();

    const circle = new Konva.Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 70,
        fill: "red",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
    });

    layer.add(circle);

    const st = shipTop(150, 150);

    layer.add(st);

    const sm = shipMiddle(200, 200);
    layer.add(sm);

    const sb = shipBottom(300, 300);
    layer.add(sb);

    stage.add(layer);
}

setupKonva("app");

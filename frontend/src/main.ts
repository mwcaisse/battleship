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

    const group = new Konva.Group();
    group.add(fill);
    group.add(outline);

    return group;
}

function shipMiddle(x: number, y: number) {
    const lineLength = 60;

    const fill = new Konva.Shape({
        x: x,
        y: y,
        fill: "grey",
        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.rect(-lineLength, -lineLength, lineLength, lineLength);
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

            ctx.moveTo(-lineLength, -lineLength);
            ctx.lineTo(-lineLength, 0);

            ctx.moveTo(0, -lineLength);
            ctx.lineTo(0, 0);

            ctx.strokeShape(shape);
        },
    });

    const group = new Konva.Group();
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

    const group = new Konva.Group();
    group.add(fill);
    group.add(outline);

    return group;
}

function createShip(x: number, y: number, length: number) {
    if (length < 2) {
        throw new Error("Ship must be at least 2 in length");
    }

    const group = new Konva.Group({ draggable: true });

    const shipHeight = 60;
    const cx = x;
    let cy = y;
    group.add(shipTop(cx, cy));
    cy += shipHeight;

    for (let i = 0; i < length - 2; i++) {
        group.add(shipMiddle(x, cy));
        cy += shipHeight;
    }

    group.add(shipBottom(cx, cy));

    return group;
}

function setupKonva(elementId: string) {
    const stage = new Konva.Stage({
        container: elementId,
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const layer = new Konva.Layer();

    const destroyer = createShip(150, 100, 2);
    layer.add(destroyer);

    const submarine = createShip(250, 100, 3);
    layer.add(submarine);

    const cruiser = createShip(350, 100, 3);
    layer.add(cruiser);

    const battleship = createShip(450, 100, 4);
    layer.add(battleship);

    const carrier = createShip(550, 100, 5);
    layer.add(carrier);

    stage.add(layer);
}

setupKonva("app");

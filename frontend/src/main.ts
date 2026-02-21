import Konva from "konva";

const shipWidth = 25;
const shipHeight = 30;

function shipTop(x: number, y: number) {
    const radius = shipWidth;
    const lineLength = shipHeight;

    const fill = new Konva.Shape({
        x: x,
        y: y,
        offset: {
            x: lineLength,
            y: lineLength,
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
            x: lineLength,
            y: lineLength,
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
    const lineWidth = shipWidth * 2;
    const lineHeight = shipHeight * 2;

    const fill = new Konva.Shape({
        x: x,
        y: y,
        fill: "grey",
        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.rect(-lineHeight + 5, -lineHeight, lineWidth, lineHeight);
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

            ctx.moveTo(-lineHeight + 5, -lineHeight);
            ctx.lineTo(-lineHeight + 5, 0);

            ctx.moveTo(-5, -lineHeight);
            ctx.lineTo(-5, 0);

            ctx.strokeShape(shape);
        },
    });

    const group = new Konva.Group();
    group.add(fill);
    group.add(outline);

    return group;
}

function shipBottom(x: number, y: number) {
    const radius = shipWidth;
    const lineLength = shipHeight;

    const fill = new Konva.Shape({
        x: x,
        y: y,
        offset: {
            x: lineLength,
            y: lineLength,
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
            x: lineLength,
            y: lineLength,
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

// board is 10x10
//  letters on top
//  numbers on side

const boardSize = 10;
const boardTileWidth = 65;

function createBoardSquare(x: number, y: number) {
    return new Konva.Rect({
        x: x,
        y: y,
        width: boardTileWidth,
        height: boardTileWidth,
        fill: "white",
        stroke: "black",
        strokeWidth: 2,
    });
}

function createHeaderBoardSquare(x: number, y: number, label: string | null) {
    const group = new Konva.Group({});

    const square = new Konva.Rect({
        x: x,
        y: y,
        width: boardTileWidth,
        height: boardTileWidth,
        fill: "lightGray",
        stroke: "black",
        strokeWidth: 2,
    });

    const text = new Konva.Text({
        x: x,
        y: y + 16,
        fontSize: 36,
        text: label || "",
        align: "center",
        width: boardTileWidth,
    });

    group.add(square);
    group.add(text);

    return group;
}

function createBoard(x: number, y: number) {
    const group = new Konva.Group({});

    group.add(createHeaderBoardSquare(x, y, null));

    for (let i = 1; i <= boardSize; i++) {
        group.add(
            createHeaderBoardSquare(
                x + i * boardTileWidth,
                y,
                String.fromCharCode("A".charCodeAt(0) + i - 1),
            ),
        );
    }

    for (let i = 1; i <= boardSize; i++) {
        group.add(
            createHeaderBoardSquare(x, y + i * boardTileWidth, i.toString()),
        );
    }

    for (let i = 1; i <= boardSize; i++) {
        for (let j = 1; j <= boardSize; j++) {
            group.add(
                createBoardSquare(
                    x + i * boardTileWidth,
                    y + j * boardTileWidth,
                ),
            );
        }
    }

    return group;
}

function setupKonva(elementId: string) {
    const stage = new Konva.Stage({
        container: elementId,
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const layer = new Konva.Layer();

    const board = createBoard(150, 400);
    layer.add(board);

    const destroyer = createShip(150, 100, 2);
    layer.add(destroyer);

    const submarine = createShip(150, 400, 3);
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

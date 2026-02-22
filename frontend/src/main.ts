import Konva from "konva";

const boardSize = 10;
const boardTileWidth = 45;
const boardTileHeight = boardTileWidth;
const halfShipWidth = boardTileWidth / 2.0 - 5;

function shipTop(x: number, y: number) {
    const centerX = boardTileWidth / 2.0;
    const centerY = boardTileHeight / 2.0;
    const lineLength = boardTileHeight - centerY;

    const fill = new Konva.Shape({
        x: x,
        y: y,
        fill: "grey",
        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.arc(centerX, centerY, halfShipWidth, Math.PI, 0, false);

            ctx.lineTo(centerX + halfShipWidth, centerY + lineLength);
            ctx.lineTo(centerX - halfShipWidth, centerY + lineLength);
            ctx.closePath();

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

            // x,y is the center point of the arc
            ctx.arc(centerX, centerY, halfShipWidth, Math.PI, 0, false);

            ctx.moveTo(centerX - halfShipWidth, centerY);
            ctx.lineTo(centerX - halfShipWidth, centerY + lineLength);

            ctx.moveTo(centerX + halfShipWidth, centerY);
            ctx.lineTo(centerX + halfShipWidth, centerY + lineLength);

            ctx.strokeShape(shape);
        },
    });

    const group = new Konva.Group();
    group.add(fill);
    group.add(outline);

    return group;
}

function shipMiddle(x: number, y: number) {
    const lineWidth = halfShipWidth * 2;
    const lineHeight = boardTileHeight;

    const centerX = boardTileWidth / 2.0;

    const fill = new Konva.Shape({
        x: x,
        y: y,
        fill: "grey",
        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.rect(centerX - lineWidth / 2.0, 0, lineWidth, lineHeight);
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

            ctx.moveTo(centerX - lineWidth / 2.0, 0);
            ctx.lineTo(centerX - lineWidth / 2.0, lineHeight);

            ctx.moveTo(centerX + lineWidth / 2.0, 0);
            ctx.lineTo(centerX + lineWidth / 2.0, lineHeight);

            ctx.strokeShape(shape);
        },
    });

    const group = new Konva.Group();
    group.add(fill);
    group.add(outline);

    return group;
}

function shipBottom(x: number, y: number) {
    const centerX = boardTileWidth / 2.0;
    const centerY = boardTileHeight / 2.0;
    const lineLength = boardTileHeight - centerY;

    const fill = new Konva.Shape({
        x: x,
        y: y,
        fill: "grey",
        sceneFunc: (ctx, shape) => {
            ctx.beginPath();

            ctx.arc(centerX, centerY, halfShipWidth, 0, Math.PI, false);

            ctx.lineTo(centerX - halfShipWidth, 0);
            ctx.lineTo(centerX + halfShipWidth, 0);

            ctx.closePath();

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

            ctx.arc(centerX, centerY, halfShipWidth, 0, Math.PI, false);

            ctx.moveTo(centerX - halfShipWidth, 0);
            ctx.lineTo(centerX - halfShipWidth, lineLength);

            ctx.moveTo(centerX + halfShipWidth, 0);
            ctx.lineTo(centerX + halfShipWidth, lineLength);

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

    const group = new Konva.Group({
        draggable: true,
        x: x,
        y: y,
        offset: {
            x: boardTileWidth / 2.0,
            y: boardTileHeight / 2.0,
        },
    });

    const cx = 0;
    let cy = 0;
    group.add(shipTop(cx, cy));
    cy += boardTileWidth;

    for (let i = 0; i < length - 2; i++) {
        group.add(shipMiddle(cx, cy));
        cy += boardTileHeight;
    }

    group.add(shipBottom(cx, cy));

    return group;
}

function createBoardSquare(x: number, y: number) {
    return new Konva.Rect({
        x: x,
        y: y,
        width: boardTileWidth,
        height: boardTileHeight,
        fill: "white",
        stroke: "black",
        strokeWidth: 2,
    });
}

function createHeaderBoardSquare(x: number, y: number, label: string | null) {
    const fontSize = boardTileWidth / 2.0;
    const group = new Konva.Group({});

    const square = new Konva.Rect({
        x: x,
        y: y,
        width: boardTileWidth,
        height: boardTileHeight,
        fill: "lightGray",
        stroke: "black",
        strokeWidth: 2,
    });

    const text = new Konva.Text({
        x: x,
        y: y + fontSize / 2.0,
        fontSize: fontSize,
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
            createHeaderBoardSquare(x, y + i * boardTileHeight, i.toString()),
        );
    }

    for (let i = 1; i <= boardSize; i++) {
        for (let j = 1; j <= boardSize; j++) {
            group.add(
                createBoardSquare(
                    x + i * boardTileWidth,
                    y + j * boardTileHeight,
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

    const enemyBoard = createBoard(
        150 + 50 + boardTileWidth * (boardSize + 1),
        400,
    );
    layer.add(enemyBoard);

    const destroyer = createShip(150, 100, 2);
    layer.add(destroyer);

    const submarine = createShip(
        150 + boardTileWidth + boardTileWidth / 2.0,
        400 + boardTileHeight + boardTileHeight / 2.0,
        3,
    );
    submarine.rotate(-90);

    layer.add(submarine);

    const cruiser = createShip(
        150 + boardTileWidth + boardTileWidth / 2.0,
        400 + boardTileHeight + boardTileHeight / 2.0,
        3,
    );
    layer.add(cruiser);

    const battleship = createShip(450, 100, 4);
    layer.add(battleship);

    const carrier = createShip(550, 100, 5);
    layer.add(carrier);

    stage.add(layer);
}

setupKonva("app");

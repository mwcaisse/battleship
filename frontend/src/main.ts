import Konva from "konva";
import { boardSize, boardTileHeight, boardTileWidth } from "@app/constants.ts";
import Ship from "@app/ship.ts";

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
    const group = new Konva.Group({
        x: x,
        y: y,
    });

    group.add(createHeaderBoardSquare(0, 0, null));

    for (let i = 1; i <= boardSize; i++) {
        group.add(
            createHeaderBoardSquare(
                i * boardTileWidth,
                0,
                String.fromCharCode("A".charCodeAt(0) + i - 1),
            ),
        );
    }

    for (let i = 1; i <= boardSize; i++) {
        group.add(
            createHeaderBoardSquare(0, i * boardTileHeight, i.toString()),
        );
    }

    for (let i = 1; i <= boardSize; i++) {
        for (let j = 1; j <= boardSize; j++) {
            group.add(
                createBoardSquare(i * boardTileWidth, j * boardTileHeight),
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

    const destroyer = new Ship(board, 150, 100, 2);
    destroyer.draw(layer);

    const submarine = new Ship(
        board,
        150 + boardTileWidth + boardTileWidth / 2.0,
        400 + boardTileHeight + boardTileHeight / 2.0,
        3,
    );
    submarine.draw(layer);

    const cruiser = new Ship(
        board,
        200 + boardTileWidth + boardTileWidth / 2.0,
        400 + boardTileHeight + boardTileHeight / 2.0,
        3,
    );
    cruiser.draw(layer);

    const battleship = new Ship(board, 450, 100, 4);
    battleship.draw(layer);

    const carrier = new Ship(board, 550, 100, 5);
    carrier.draw(layer);

    stage.add(layer);

    // window.addEventListener("keydown", (e: KeyboardEvent) => {
    //     if (e.key === "r" || e.key === "R") {
    //         const ship = destroyer;
    //
    //         if (ship.rotation() === -90) {
    //             ship.rotate(90);
    //         } else {
    //             ship.rotate(-90);
    //         }
    //     }
    // });
}

setupKonva("app");

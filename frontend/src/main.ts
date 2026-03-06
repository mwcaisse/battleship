import Konva from "konva";
import { boardSize, boardTileHeight, boardTileWidth } from "@app/constants.ts";
import Ship from "@app/ship.ts";
import Board from "@app/board.ts";

function setupKonva(elementId: string) {
    const stage = new Konva.Stage({
        container: elementId,
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const layer = new Konva.Layer();

    const board = new Board(150, 400);
    board.draw(layer);

    const enemyBoard = new Board(
        150 + 50 + boardTileWidth * (boardSize + 1),
        400,
    );
    enemyBoard.draw(layer);

    const destroyer = new Ship(stage, board, 150, 100, 2);
    destroyer.draw(layer);

    const submarine = new Ship(
        stage,
        board,
        150 + boardTileWidth + boardTileWidth / 2.0,
        400 + boardTileHeight + boardTileHeight / 2.0,
        3,
    );
    submarine.draw(layer);

    const cruiser = new Ship(
        stage,
        board,
        200 + boardTileWidth + boardTileWidth / 2.0,
        400 + boardTileHeight + boardTileHeight / 2.0,
        3,
    );
    cruiser.draw(layer);

    const battleship = new Ship(stage, board, 450, 100, 4);
    battleship.draw(layer);

    const carrier = new Ship(stage, board, 550, 100, 5);
    carrier.draw(layer);

    stage.add(layer);
}

setupKonva("app");

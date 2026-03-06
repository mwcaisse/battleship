import Konva from "konva";
import { boardSize, boardTileHeight, boardTileWidth } from "@app/constants.ts";

export default class Board {
    private graphicsGroup: Konva.Group;

    constructor(x: number, y: number) {
        this.init(x, y);
    }

    private init(x: number, y: number) {
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

        this.graphicsGroup = group;
    }

    draw(layer: Konva.Layer) {
        layer.add(this.graphicsGroup);
    }

    public x() {
        return this.graphicsGroup.x();
    }

    public y() {
        return this.graphicsGroup.y();
    }
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

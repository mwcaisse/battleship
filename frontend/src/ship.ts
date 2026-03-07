import Konva from "konva";
import {
    boardTileHeight,
    boardTileWidth,
    halfShipWidth,
} from "@app/constants.ts";
import type Board from "@app/board.ts";

export default class Ship {
    private length: number;
    // TODO: Handle this more gracefully, but works for now
    //  need a better way for this to handle / know about the board and handle in / out of bounds on the board
    private board: Board;
    private stage: Konva.Stage;

    private graphicsGroup: Konva.Group;

    private isDragging: boolean = false;
    private dragStartPosition: Konva.Vector2d | null = null;
    private dragStartRotation: number | null = null;

    /**
     * Creates a new ship and places it at the given coordinates
     * @param stage The konva stage
     * @param board The board, used for snapping when dragging
     * @param x absolute X position
     * @param y absolute Y position
     * @param length The length of the ship
     */
    constructor(
        stage: Konva.Stage,
        board: Board,
        x: number,
        y: number,
        length: number,
    ) {
        if (length < 2) {
            throw new Error("Ship must be at least 2 in length");
        }

        this.stage = stage;
        this.board = board;
        this.length = length;

        this.init(x, y);
    }

    private init(x: number, y: number) {
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

        for (let i = 0; i < this.length - 2; i++) {
            group.add(shipMiddle(cx, cy));
            cy += boardTileHeight;
        }

        group.add(shipBottom(cx, cy));

        group.on("dragstart", (e) => {
            if (e.evt === undefined) {
                return;
            }

            console.log("Drag started");
            console.dir(e);
            this.isDragging = true;

            this.dragStartPosition = {
                x: group.x(),
                y: group.y(),
            };
            this.dragStartRotation = group.rotation();
        });

        group.on("dragend", (e) => {
            // This handles us manually stopping the drag when rotating, as the event will be null
            //  because we don't pass one
            if (e.evt === undefined) {
                return;
            }
            console.log("Drag ended");
            console.dir(e);

            console.log(`Event (x,y): (${e.evt.x}, ${e.evt.y})`);
            console.log(`Node (x,y): (${group.x()}, ${group.y()})`);

            if (!this.board.isInBounds(group.x(), group.y())) {
                // we are out of bounds, so reset the position to where we started
                group.x(this.dragStartPosition!.x);
                group.y(this.dragStartPosition!.y);
                if (
                    this.dragStartRotation !== null &&
                    this.dragStartRotation !== group.rotation()
                ) {
                    if (this.graphicsGroup.rotation() === -90) {
                        this.graphicsGroup.rotate(90);
                    } else {
                        this.graphicsGroup.rotate(-90);
                    }
                }
            } else {
                // event x ,y is based upon where the mouse is
                // node x ,y is based upon where the node is (duh)

                //lets make it snap

                // to snap, we want to get our board, then snap x /y to the nearest grid...
                //  for now always bias to snap up and to the left

                // ship top left point relative to the board
                const shipTopLeftX =
                    group.x() - boardTileWidth / 2.0 - this.board.x();
                const shipTopLeftY =
                    group.y() - boardTileHeight / 2.0 - this.board.y();

                const xTileOffest =
                    Math.floor(shipTopLeftX / boardTileWidth) +
                    ((shipTopLeftX / boardTileWidth) % 1.0 >= 0.5 ? 1 : 0);

                const yTileOffest =
                    Math.floor(shipTopLeftY / boardTileWidth) +
                    ((shipTopLeftY / boardTileWidth) % 1.0 >= 0.5 ? 1 : 0);

                const snapX =
                    xTileOffest * boardTileWidth +
                    this.board.x() +
                    boardTileWidth / 2.0;
                const snapY =
                    yTileOffest * boardTileHeight +
                    this.board.y() +
                    boardTileHeight / 2.0;

                group.x(snapX);
                group.y(snapY);
            }

            this.isDragging = false;
            this.dragStartPosition = null;
            this.dragStartRotation = null;
        });

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (this.isDragging && (e.key === "r" || e.key === "R")) {
                this.rotate();
            }
        });

        this.graphicsGroup = group;
    }

    /**
     * Rotates the ship between the acceptable positions
     */
    rotate() {
        this.graphicsGroup.stopDrag();

        const pointer = this.stage.getPointerPosition()!;
        const relativeX = pointer.x - this.graphicsGroup.x();
        const relativeY = pointer.y - this.graphicsGroup.y();

        let transformedX = 0;
        let transformedY = 0;

        if (this.graphicsGroup.rotation() === -90) {
            this.graphicsGroup.rotate(90);
            transformedX = relativeY;
            transformedY = -relativeX;
        } else {
            this.graphicsGroup.rotate(-90);
            transformedX = -relativeY;
            transformedY = relativeX;
        }

        this.graphicsGroup.position({
            x: pointer.x + transformedX,
            y: pointer.y + transformedY,
        });

        this.graphicsGroup.startDrag();
    }

    draw(layer: Konva.Layer) {
        layer.add(this.graphicsGroup);
    }
}

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

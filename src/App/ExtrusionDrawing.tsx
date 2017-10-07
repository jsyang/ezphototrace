import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import STYLES from '../styles';

const styles = StyleSheet.create({
    canvas: STYLES.POSITIONING.FILL_PARENT,
    back: {
        left: 'calc(100% - 0.5em)',
        top: '0.5em',
        transform: 'translateX(-100%)',
        outline: '1px solid red'
    }
});

const DRAW_MODES = [
    'additions',
    'deletions'
];

export default class ExtrusionDrawer extends React.PureComponent<any, any> {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    state = {
        isFocused: false,
        isMouseDown: false,
        isSmallSized: false,
        drawMode: 'additions',
        translateX: 0,
        translateY: 0,
        scale: 1
    };

    additions = [[]];
    deletions = [[]];

    lastX = 0;
    lastY = 0;

    init = () => {
        const { isSmallSized } = this.state;
        const { bigWidth, bigHeight, smallWidth, smallHeight } = this.props;

        this.canvas.width = isSmallSized ? smallWidth : bigWidth;
        this.canvas.height = isSmallSized ? smallHeight : bigHeight;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.redraw();
    };

    componentDidUpdate() {
        this.init();
        this.props.parent.forceUpdate();
    }

    translate = (translateX, translateY) => this.setState({ translateX, translateY });
    scale = scale => this.setState({ scale });
    focus = () => this.setState({ isFocused: true });
    blur = () => this.setState({ isFocused: false });

    drawCircle = ({ x1, y1, x2, y2 }) => {
        const r = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgb(255,0,255)';
        this.ctx.arc(x1, y1, r, 0, Math.PI * 2);
        this.ctx.stroke();
    };

    clearDrawing = () => this.ctx.clearRect(0, 0, innerWidth, innerHeight);

    drawLine = ({ x1, y1, x2, y2 }, i) => {
        const { translateX, translateY, scale } = this.state;

        if (i === 0) {
            this.ctx.moveTo(
                x1 * scale + translateX,
                y1 * scale + translateY
            );
        }

        this.ctx.lineTo(
            x2 * scale + translateX,
            y2 * scale + translateY
        );
    };

    drawPolygon = (color, polyLine) => {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        polyLine.forEach(this.drawLine);
        this.ctx.stroke();
    }

    redraw = () => {
        this.clearDrawing();
        this.additions.forEach(this.drawPolygon.bind(this, 'rgb(0,255,0)'));
        this.deletions.forEach(this.drawPolygon.bind(this, 'rgb(255,0,0)'));
    };

    createNewAddition = () => this.additions.push([]);
    createNewDeletion = () => this.deletions.push([]);

    setDrawMode = mode => {
        if (DRAW_MODES.indexOf(mode) !== -1) {
            this.setState({ drawMode: mode });
        }
    };

    addNewLine = () => {
        const lineSet = this[this.state.drawMode];
        lineSet[lineSet.length - 1].push({
            x1: this.lastX,
            y1: this.lastY
        });
    };

    undo = () => {
        const { drawMode, isFocused } = this.state;

        if (isFocused) {
            const lineSet = this[drawMode];

            const endPolyLine = lineSet[lineSet.length - 1];
            const currentLine = endPolyLine[endPolyLine.length - 1];
            if (currentLine.length > 0) {
                currentLine.pop();
            } else {
                endPolyLine.pop();
            }

            this.redraw();
        }
    };

    bringToFront = () => this.setState({ isSmallSized: false });
    sendToBack = () => this.setState({ isSmallSized: true });

    getRelativeXY: any = e => {
        const { translateX, translateY, scale } = this.state;

        return {
            x: (e.pageX - e.target.getBoundingClientRect().left - document.body.scrollLeft - translateX) / scale,
            y: (e.pageY - e.target.getBoundingClientRect().top - document.body.scrollTop - translateY) / scale
        }
    };

    updateLastXY = (x, y) => {
        this.lastX = x;
        this.lastY = y;
    };

    onMouseDown: any = e => {
        const { isFocused } = this.state;

        if (isFocused) {
            const { x, y } = this.getRelativeXY(e);
            this.updateLastXY(x, y);
            this.addNewLine();

            this.setState({ isMouseDown: true });
        }
    };

    onMouseMove: any = e => {
        const { isFocused, drawMode, isMouseDown } = this.state;

        if (isFocused && isMouseDown) {
            let { x, y } = this.getRelativeXY(e);

            let lineSet, currentLine;

            lineSet = this[drawMode];
            const endPolyLine = lineSet[lineSet.length - 1];
            currentLine = endPolyLine[endPolyLine.length - 1];

            currentLine.x2 = x;
            currentLine.y2 = y;

            this.updateLastXY(x, y);
            this.redraw();
        }
    };

    onMouseUp: any = e => {
        const { isFocused } = this.state;

        if (isFocused) {
            this.redraw();
            this.setState({ isMouseDown: false });
        }
    };

    render() {
        const { bigWidth, bigHeight, smallWidth, smallHeight } = this.props;
        const { isSmallSized,isFocused } = this.state;
        const { onMouseDown, onMouseMove, onMouseUp } = this;

        const props = {
            ref: el => this.canvas = el,
            onMouseUp,
            onMouseDown,
            onMouseMove,
            width: isSmallSized ? smallWidth : bigWidth,
            height: isSmallSized ? smallHeight : bigHeight,
            className: css(
                styles.canvas,
                isSmallSized && styles.back
            ),
            style: {
                zIndex: 1000,
                pointerEvents: isFocused? 'all' : 'none'
            } as any
        };

        return <canvas {...props} />;
    }
}

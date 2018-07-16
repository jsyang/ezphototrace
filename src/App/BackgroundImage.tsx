import * as React from 'react';
import {StyleSheet, css} from 'aphrodite';
import STYLES from '../styles';

const styles = StyleSheet.create({
    container: STYLES.POSITIONING.FILL_PARENT,
    input:     {
        ...STYLES.POSITIONING.FILL_PARENT,
        width:         '100%',
        height:        '100%',
        opacity:       0,
        pointerEvents: 'none',
        appearance:    'none'
    }
});

interface IProps {
    onTranslate: Function;
    onScale: Function;
}

interface IState {
    value: string;
    dataUrl: string;
    x: number;
    y: number;
    renderedWidth: number;
    isFocused: boolean;
    isMouseDown: boolean;
    mouseDownX: number;
    mouseDownY: number;
}

const INITIAL_STATE = {
    value:         '',
    dataUrl:       '',
    x:             0,
    y:             0,
    renderedWidth: 1000,
    isFocused:     false,
    isMouseDown:   false,
    mouseDownX:    0,
    mouseDownY:    0
};

export default class BackgroundImage extends React.PureComponent<IProps, IState> {
    state = {...INITIAL_STATE};

    inputElement: HTMLInputElement;

    onReaderLoad = e => this.setState({dataUrl: e.target.result});

    onChange = e => {
        const file          = e.currentTarget.files[0];
        const readerDataURL = new FileReader();
        readerDataURL.readAsDataURL(file);
        readerDataURL.onload = this.onReaderLoad;
        this.setState({value: file.name});
    };

    add      = () => this.inputElement.click();
    focus    = () => this.setState({isFocused: true});
    blur     = () => this.setState({isFocused: false});
    reset    = () => this.setState({...INITIAL_STATE, isFocused: true});
    setWidth = () => this.setState({
        renderedWidth: parseFloat(
            prompt(
                'Set rendered width of the background image',
                this.state.renderedWidth.toString()
            ) || INITIAL_STATE.renderedWidth.toString()
        )
    });

    onMouseDown = e => this.setState({
        isMouseDown: true,
        mouseDownX:  e.pageX - this.state.x,
        mouseDownY:  e.pageY - this.state.y
    });

    onMouseMove = e => {
        const {isMouseDown, mouseDownX, mouseDownY} = this.state;

        if (isMouseDown) {
            this.setState({
                x: e.pageX - mouseDownX,
                y: e.pageY - mouseDownY
            });
        }
    };

    onMouseUp = () => {
        this.setState({isMouseDown: false});
        const {x, y} = this.state;
        this.props.onTranslate(x, y);
    };

    onMouseWheel = e => {
        const AMOUNT = 100;
        const delta  = e.deltaY > 0 ? AMOUNT : -AMOUNT;

        const renderedWidth = this.state.renderedWidth + delta;
        this.setState({renderedWidth});
        this.props.onScale(renderedWidth / 1000);
    };

    render() {
        const {value, x, y, renderedWidth, dataUrl, isFocused}    = this.state;
        const {onMouseDown, onMouseUp, onMouseMove, onMouseWheel} = this;

        const inputProps = {
            value,
            ref:       el => this.inputElement = el,
            type:      'file',
            className: css(styles.input),
            style:     {display: value.length > 0 ? 'none' : 'block'},
            onChange:  this.onChange
        };

        const containerProps = {
            className: css(styles.container),
            style:     {
                           backgroundImage:    `url(${dataUrl})`,
                           backgroundRepeat:   'no-repeat',
                           backgroundPosition: `${x}px ${y}px`,
                           backgroundSize:     `${renderedWidth}px`,
                           zIndex:             isFocused ? 1000 : 'initial',
                           cursor:             Boolean(dataUrl) ? 'move' : 'pointer'
                       } as any,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onMouseWheel
        };

        return (
            <div {...containerProps}>
                <input {...inputProps} />
            </div>
        );
    }
}

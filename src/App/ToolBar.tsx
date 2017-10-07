import * as React from 'react';

import { StyleSheet, css } from 'aphrodite';

const styles: any = StyleSheet.create({
    toolbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '5em',
        overflowY: 'hidden',
        overflowX: 'auto',
        right: 0,
        backgroundColor: 'rgb(222,222,222)',
        zIndex: 2000,
        'white-space': 'nowrap',
        lineHeight: '5em',
        '::-webkit-scrollbar': {
            display: 'none'
        }
    },
    button: {
        appearance: 'none',
        display: 'inline-block',
        margin: '1.3em 0.5em',
        fontSize: '0.9em',
        height: '3em',
        verticalAlign: '3em',
        ':first-child': {
            marginLeft: '1em'
        },
        ':last-child': {
            marginRight: '1em'
        }
    },
    buttonImage: {
        display: 'inline-block',
        width: '1.5em',
        height: '1.5em',
        marginRight: '0.3em',
        verticalAlign: 'middle'
    }
});


const BUTTONS = {
    BACKGROUND_IMAGE: [
        {
            onClick: 'onClickAddImage',
            title: 'Add new background image',
            label: 'Add new image'
        },
        {
            onClick: 'onClickResetImage',
            title: 'Clear background image',
            label: 'Clear image'
        },
        {
            onClick: 'onClickSetWidthImage',
            title: 'Set width of the background image in pixels',
            label: 'Set width'
        },
        {
            onClick: 'onClickBlurImage',
            title: 'Finish editing background image',
            label: 'Done editing'
        }
    ],
    EXTRUSION_DRAWING: [
        {
            imgSrc: 'assets/undo.svg',
            onClick: 'onClickUndo',
            title: 'Undo the last action',
            label: 'Undo'
        },
        {
            imgSrc: 'assets/addition.svg',
            onClick: 'onClickNewAddition',
            title: 'Create a new additive polygon',
            label: '+Addition'
        },
        {
            imgSrc: 'assets/deletion.svg',
            onClick: 'onClickNewDeletion',
            title: 'Create a new subtractive polygon',
            label: '+Deletion'
        },
        {
            onClick: 'onClickBlurExtrusionDrawing',
            label: 'Done editing'
        }
    ],
    DEFAULT: [
        {
            onClick: 'onClickModeImage',
            title: 'Start editing background image for tracing',
            label: 'Background Image'
        },

        {
            onClick: 'onClickModeExtrusionDrawing',
            title: 'Start editing the extrusion drawing (tracing)',
            label: 'Extrusion Drawing'
        },
        {
            imgSrc: 'assets/refresh.svg',
            onClick: 'onClickUpdate3D',
            title: 'Re-render the 3D model',
            label: 'Update 3D'
        },
        {
            imgSrc: 'assets/download.svg',
            onClick: 'onClickDownloadSTL',
            title: 'Download 3D model as .STL',
            label: 'Download STL'
        }
    ]
};

const user = {
    x: 0,
    initialToolbarScroll: 0,
    isDragging: false
};

const onMouseDown = e => {
    user.x = e.pageX;
    user.isDragging = true;
    user.initialToolbarScroll = e.currentTarget.scrollLeft;
};

const onMouseUp = e => {
    user.x = e.pageX;
    user.isDragging = false;
};

const onMouseMove = e => {
    if (user.isDragging) {
        e.currentTarget.scrollLeft =
            user.initialToolbarScroll + user.x - e.pageX;
    }
};

interface IToolBarProps {
    parent: any;
    mode: string;
}

export default function ToolBar({ parent, mode }: IToolBarProps): JSX.Element {
    const className = {
        toolbar: css(styles.toolbar),
        button: css(styles.button),
        buttonImage: css(styles.buttonImage),
        modeText: css(styles.modeText)
    };

    const props = {
        className: className.toolbar,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onMouseLeave: onMouseUp
    };

    return (
        <div {...props}>
            {BUTTONS[mode].map(({ imgSrc, onClick, title, label }) => (
                <button
                    {...{
                        className: className.button,
                        onClick: parent[onClick],
                        title
                    }}
                >
                    {imgSrc ? <img src={imgSrc} className={className.buttonImage} /> : null}
                    {label}
                </button>
            ))}
        </div>
    );
}
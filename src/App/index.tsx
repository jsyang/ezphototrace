import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { getDownloadBlobFunction } from '../helpers/browserDownload';

import STYLES from '../styles';
import STLViewer from './STLViewer';
import ExtrusionDrawing from './ExtrusionDrawing';
import BackgroundImage from './BackgroundImage';
import polyLineToSTL from './polyLineToSTL';
import ToolBar from './ToolBar';

const styles: any = StyleSheet.create({
    page: STYLES.POSITIONING.FILL_PARENT,

    container: {
        ...STYLES.FONT.BODY_SMALL,
        ...STYLES.POSITIONING.FILL_PARENT
    }
});

const saveSTL = getDownloadBlobFunction('model.stl');

const MODE = [
    'DEFAULT',
    'BACKGROUND_IMAGE', 
    'EXTRUSION_DRAWING'
];

export default class App extends React.PureComponent<any,any> {
    extrusionDrawing: ExtrusionDrawing;
    stlViewer: STLViewer;
    backgroundImage: BackgroundImage;

    state = {
        base64: '',
        bigWidth: 300,
        bigHeight: 200,
        smallWidth: 100,
        smallHeight: 80,
        mode: MODE[0],
        extrustions: []
    };

    getEMinPX = () => Number((getComputedStyle(document.body) as any).fontSize.replace(/[^\d]/g, ''));

    onResize = () => {
        const EM_IN_PX = this.getEMinPX();

        this.setState({
            bigWidth: innerWidth,
            bigHeight: innerHeight - 5 * EM_IN_PX,
            smallWidth: innerWidth * 0.2,
            smallHeight: innerHeight * 0.2,
        });
    };

    componentDidMount() {
        addEventListener('resize', this.onResize);
        this.onResize();
    }

    componentWillUnmount() {
        removeEventListener('resize', this.onResize);
    }

    updateBase64 = base64 => this.setState({ base64 });

    onClickDownloadSTL = () => {
        const { additions, deletions } = this.extrusionDrawing;
        polyLineToSTL({ additions, deletions }).then(saveSTL);
    };

    onClickUpdate3D = () => {
        const { additions, deletions } = this.extrusionDrawing;

        polyLineToSTL({ additions, deletions })
            .then(blob => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => this.updateBase64(reader.result);
            });
    };

    renderClassNames = () => ({
        page: css(styles.page),
        container: css(styles.container)
    });

    // Extrusion Drawing 

    onClickModeExtrusionDrawing = () => {
        this.extrusionDrawing.focus();
        this.setState({ mode: MODE[2] });
    };

    onClickBlurExtrusionDrawing = () => {
        this.extrusionDrawing.blur();
        this.setState({ mode: MODE[0] });
    };

    onClickNewAddition = () => {
        this.extrusionDrawing.setDrawMode('additions');
        this.extrusionDrawing.createNewAddition();
    };

    onClickNewDeletion = () => {
        this.extrusionDrawing.setDrawMode('deletions');
        this.extrusionDrawing.createNewDeletion();
    };

    onClickSwapView = () => {
        if (this.extrusionDrawing.state.isFocused) {
            this.extrusionDrawing.sendToBack();
            this.stlViewer.bringToFront();
        } else {
            this.extrusionDrawing.bringToFront();
            this.stlViewer.sendToBack();
        }
    };

    onClickUndo = () => this.extrusionDrawing.undo();

    // Background Image

    onClickAddImage = () => this.backgroundImage.add();
    onClickModeImage = () => {
        this.backgroundImage.focus();
        this.setState({ mode: MODE[1] });
    };
    onClickSetWidthImage = () => this.backgroundImage.setWidth();
    onClickResetImage = () => this.backgroundImage.reset();
    onClickBlurImage = () => {
        this.backgroundImage.blur();
        this.setState({ mode: MODE[0] });
    };

    onBackgroundImageTranslate = (x, y) => this.extrusionDrawing.translate(x, y);
    onBackgroundImageScale = scale => this.extrusionDrawing.scale(scale);

    render() {
        const {
            base64,
            bigWidth,
            bigHeight,
            smallHeight,
            smallWidth,
            mode
        } = this.state;

        return (
            <div className={css(styles.page)}>
                <ToolBar {...{
                    parent: this as any,
                    mode
                }} />

                <div className={css(styles.container)}>

                    <BackgroundImage {...{
                        onTranslate: this.onBackgroundImageTranslate,
                        onScale: this.onBackgroundImageScale,
                        ref: el => this.backgroundImage = el as any
                    }} />

                    <ExtrusionDrawing {...{
                        bigWidth,
                        bigHeight,
                        smallWidth,
                        smallHeight,
                        parent: this,
                        ref: el => this.extrusionDrawing = el
                    }} />

                    <STLViewer {...{
                        bigWidth,
                        bigHeight,
                        smallWidth,
                        smallHeight,
                        url: base64,
                        modelColor: 'rgb(200,64,64)',
                        backgroundColor: '#EAEAEA',
                        ref: el => this.stlViewer = el as any
                    }} />
                </div>
            </div>
        );
    }
}
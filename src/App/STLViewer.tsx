import * as React from 'react';
import * as THREE from 'three';
import {StyleSheet, css} from 'aphrodite';

import * as _STLLoader from 'three-stl-loader';
import * as _OrbitControls from 'three-orbit-controls';

const STLLoader     = _STLLoader(THREE);
const OrbitControls = _OrbitControls(THREE);

const styles = StyleSheet.create({
    canvas: {
        position:        'absolute',
        display:         'block',
        boxSizing:       'border-box',
        backgroundColor: 'rgb(200,200,200)',
        transition:      'all 0.3s'
    },
    front:  {
        zIndex: 0,
        left:   0,
        top:    0
    },
    back:   {
        zIndex:    1,
        left:      'calc(100% - 0.5em)',
        bottom:    '0.5em',
        transform: 'translateX(-100%)',
        outline:   '1px solid blue'
    }
});

interface ISTLViewer {
    url?: string;
    bigWidth: number;
    bigHeight: number;
    smallWidth: number;
    smallHeight: number;
    backgroundColor?: string;
    modelColor?: string;
}

export default class STLViewer extends React.PureComponent<ISTLViewer, any> {
    state = {
        isFocused:       false,
        isExpanded:      true,
        backgroundColor: this.props.backgroundColor || 'rgb(255,255,255)',
        modelColor:      this.props.modelColor || 'rgb(128,128,128)'
    };

    el: any;

    loader        = new STLLoader();
    scene         = new THREE.Scene();
    distance      = 10000;
    camera: any   = null;
    renderer: any = null;
    controls: any = null;

    resetScene = () => {
        let {scene, distance, el}                            = this;
        const {isFocused}                                    = this.state;
        const {bigWidth, bigHeight, smallWidth, smallHeight} = this.props;

        const width  = isFocused ? bigWidth : smallWidth;
        const height = isFocused ? bigHeight : smallHeight;

        if (scene) {
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
        }

        const directionalLight      = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.x = 0;
        directionalLight.position.y = 1;
        directionalLight.position.z = 1;
        directionalLight.position.normalize();
        scene.add(directionalLight);

        this.camera = new THREE.PerspectiveCamera(30, width / height, 1, distance);
        scene.add(this.camera);

        this.controls            = new OrbitControls(this.camera, el);
        this.controls.enableKeys = false;
        this.controls.addEventListener('change', this.render3D);
    };


    onSTLLoaded = geometry => {
        let {scene, el}                                      = this;
        const {bigWidth, bigHeight, smallWidth, smallHeight} = this.props;
        const {modelColor, backgroundColor, isFocused}       = this.state;

        const width  = isFocused ? bigWidth : smallWidth;
        const height = isFocused ? bigHeight : smallHeight;

        this.resetScene();

        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.center();

        const mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial({
                    overdraw: true,
                    color:    modelColor
                }
            ));

        geometry.computeBoundingBox();
        const xDims = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        const yDims = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
        const zDims = geometry.boundingBox.max.z - geometry.boundingBox.min.z;

        // Specific to the frame tracing STL output
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.y = -Math.PI / 2;

        scene.add(mesh);

        this.camera.position.set(0, 0, Math.max(xDims * 3, yDims * 3, zDims * 3));

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(backgroundColor, 1);

        el.innerHTML = '';
        el.appendChild(this.renderer.domElement);

        this.animate();
    };

    onClickToggle3D = () => this.setState({isExpanded: !this.state.isExpanded});

    render3D = () => this.renderer.render(this.scene, this.camera);

    animate = () => {
        this.controls.update();
        this.render3D();
    };

    updateSTL = () => {
        const {loader}     = this;
        const {url}        = this.props;
        loader.crossOrigin = '';

        if (url && url.length > 0) {
            loader.load(url, this.onSTLLoaded);
        }
    };

    componentDidMount() {
        this.updateSTL();
        const label            = document.createElement('div');
        label.onclick          = this.onClickToggle3D;
        label.style.cursor     = 'pointer';
        label.innerText        = '3D';
        label.style.position   = 'absolute';
        label.style.width      = '2em';
        label.style.height     = '2em';
        label.style.lineHeight = '2em';
        label.style.textAlign  = 'center';
        label.style.bottom     = '0';
        label.style.right      = '0';
        this.el.appendChild(label);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.url !== nextProps.url ||
            this.state.isFocused !== nextState.isFocused ||
            this.props.bigWidth !== nextProps.bigWidth ||
            this.props.bigHeight !== nextProps.bigHeight ||
            this.state.isExpanded !== nextState.isExpanded
        );
    }

    bringToFront = () => this.setState({isFocused: true});
    sendToBack   = () => this.setState({isFocused: false});

    componentDidUpdate() {
        this.updateSTL();
    }

    render() {
        const {bigWidth, bigHeight, smallWidth, smallHeight} = this.props;
        const {isFocused, isExpanded}                        = this.state;

        const style = isExpanded ? {
            width:  isFocused ? bigWidth : smallWidth,
            height: isFocused ? bigHeight : smallHeight
        } : {
            width:  '2em',
            height: '2em'
        };

        const props = {
            style,
            ref:       el => this.el = el,
            className: css(
                styles.canvas,
                isFocused ? styles.front : styles.back
            )
        };

        return <div {...props}/>;
    };
}

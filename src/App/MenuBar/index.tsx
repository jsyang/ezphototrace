import * as React from 'react';
import {StyleSheet, css} from 'aphrodite';

import App from '..';
import Dropdown from './Dropdown';
import {Key} from '../../helpers/key';

const styles: any = StyleSheet.create({
    menubar: {
        position:        'absolute',
        top:             0,
        left:            0,
        right:           0,
        backgroundColor: 'rgba(222,222,222,0.5)',
        zIndex:          2000,
        padding:         '0.25em'
    }
});

interface IMenuBarProps {
    app: App;
}

const MENUS = {
    'Background': [
        {
            onSelect: 'onClickAddImage',
            title:    'Add new background image'
        },
        {
            onSelect: 'onClickResetImage',
            title:    'Clear background images'
        },
        {
            onSelect: 'onClickSetWidthImage',
            title:    'Set width of the background image in pixels'
        },
        {
            onSelect: 'onClickBlurImage',
            title:    'Finish editing background image'
        }
    ],
    'Tracing':    [
        {
            onSelect: 'onClickUndo',
            title:    'Undo the last action'
        },
        {
            onSelect: 'onClickNewAddition',
            title:    'Create a new additive polygon'
        },
        {
            onSelect: 'onClickNewDeletion',
            title:    'Create a new subtractive polygon'
        },
        {
            onSelect: 'onClickBlurExtrusionDrawing',
            label:    'Done editing'
        }
    ],
    'Export':     [
        {
            onSelect: 'onClickModeImage',
            title:    'Start editing background image for tracing'
        },

        {
            onSelect: 'onClickModeExtrusionDrawing',
            title:    'Start editing the extrusion drawing (tracing)'
        },
        {
            onSelect: 'onClickUpdate3D',
            title:    'Re-render the 3D model'
        },
        {
            onSelect: 'onClickDownloadSTL',
            title:    'Download 3D model as STL'
        }
    ]
};

export default class MenuBar extends React.PureComponent<IMenuBarProps, {}> {
    dropdowns: any[] = [];

    setDropdownRef = ref => this.dropdowns.push(ref);

    componentDidMount() {
        addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        this.dropdowns = [];
        removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = (e: KeyboardEvent) => {
        const dropdown = this.dropdowns[e.which - Key.F1];

        if (dropdown) {
            dropdown.focus();
        }
    };

    onChange = (e: any) => {
        const {app}        = this.props;
        const onSelectFunc = app[e.currentTarget.value];

        if (onSelectFunc) {
            onSelectFunc();
        }

        e.currentTarget.value = 'default';
    };

    render() {
        return (
            <div className={css(styles.menubar)}>
                {
                    Object.keys(MENUS).map(name => (
                        <Dropdown
                            {...this.props}
                            setDropdownRef={this.setDropdownRef}
                            options={MENUS[name]}
                            name={name}
                            onChange={this.onChange}
                        />
                    ))
                }
            </div>
        );
    };
}
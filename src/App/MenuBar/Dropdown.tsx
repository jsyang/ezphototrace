import * as React from 'react';
import {FormEventHandler} from 'react';

interface IDropdownProps {
    name: string;
    options: any;
    onChange: FormEventHandler<HTMLSelectElement>;
    setDropdownRef: Function;
}

const DROPDOWN_STYLE = {margin: '0.5em'};

export default class Dropdown extends React.PureComponent<IDropdownProps, {}> {
    render() {
        const {options, name, onChange, setDropdownRef} = this.props;

        return (
            <select
                style={DROPDOWN_STYLE}
                value='default'
                onChange={onChange}
                ref={setDropdownRef as any}
            >
                <option disabled selected value='default'>{name} ></option>
                <option disabled/>
                {
                    options.map(({title, onSelect}) => (
                        <option value={onSelect}>{title}</option>
                    ))
                }
            </select>
        );
    }

}

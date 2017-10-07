const CONTAINER = {
    display  : 'inline-block',
    boxSizing: 'border-box',
    float    : 'left',
    position : 'relative'
};

const CENTERED_CONTENT = {
    position:  'absolute',
    top:       '50%',
    left:      '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
};

const FILL_PARENT = {
    position : 'absolute',
    top      : 0,
    left     : 0,
    right    : 0,
    bottom   : 0,
    display  : 'block',
    boxSizing: 'border-box'
}

export default {
    CENTERED_CONTENT,
    CONTAINER,
    FILL_PARENT
}

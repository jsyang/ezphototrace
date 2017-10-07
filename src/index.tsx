import * as React from 'react';
import { render } from 'react-dom';
import App from './App';

const renderApp = (EZPhotoTrace:any = App) => render(<EZPhotoTrace/>, document.getElementById('root'));

addEventListener('DOMContentLoaded',()=>renderApp());

if (module.hot) {
    module.hot.accept("./App", () => {
        renderApp(require('./App').default);
    });
}
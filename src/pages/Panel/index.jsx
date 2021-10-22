import React from 'react';
import { render } from 'react-dom';

import { Panel } from "./Panel";


console.log("dupa");
console.log(chrome.devtools);
render(<Panel />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();

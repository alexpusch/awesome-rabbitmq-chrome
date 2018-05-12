import startApp from '../../../app/index';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

chrome.extension.sendMessage({}, async function(response) {
  const scriptEl = createElement(
    `<script>${bootstrapScript.toString()}; bootstrapScript()</script>`
  );
  window.document.head.appendChild(scriptEl);

  window.addEventListener('message', e => {
    if (e.data === 'awesome') {
      const root = window.document.querySelector('#awesome-root');
      startApp(root);
    }
  });
});

function createElement(htmlString) {
  return document.createRange().createContextualFragment(htmlString);
}

function bootstrapScript() {
  NAVIGATION.Awesome = ['#/awesome', 'management'];
  dispatcher_add(sammy => {
    sammy.get('/awesome', context => {
      current_highlight = '#/awesome';
      update_navigation();
      replace_content('main', "<div id='awesome-root'></div>");

      window.postMessage('awesome', '*');
    });
  });
}

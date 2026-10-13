import './styles/main.css';
import { renderInitialState } from './ui/render.js';

const app = document.querySelector('#pokemon-grid');

if (app) {
  renderInitialState(app);
}

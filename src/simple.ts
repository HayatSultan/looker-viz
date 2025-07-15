import { Looker, VisualizationDefinition } from './types';

declare var looker: Looker;

const vis: VisualizationDefinition = {
  options: {},
  create(element, config) {
    element.innerHTML = `
      <style>
        .hello-world-vis {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
      </style>
    `;
    const container = element.appendChild(document.createElement('div'));
    container.className = 'hello-world-vis';
    this._container = container;
  },
  updateAsync(data, element, config, queryResponse, details, doneRendering) {
    const firstRow = data[0];
    const firstCell = firstRow[queryResponse.fields.measure_like[0].name];
    this._container.innerHTML = `<h1>${firstCell.value}</h1>`;
    doneRendering();
  },
};

looker.plugins.visualizations.add(vis); 

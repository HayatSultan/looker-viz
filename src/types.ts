export interface VisualizationDefinition {
  id?: string;
  label?: string;
  options: {[key: string]: any};
  create: (element: HTMLElement, config: object) => void;
  updateAsync: (
    data: any,
    element: HTMLElement,
    config: object,
    queryResponse: any,
    details: any,
    doneRendering: () => void
  ) => void;
  destroy?: () => void;
  [key: string]: any;
}

export interface Looker {
  plugins: {
    visualizations: {
      add: (vis: VisualizationDefinition) => void;
    };
  };
} 

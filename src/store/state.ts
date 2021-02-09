export interface State {
  exploration: ExplorationState;
}

export interface ExplorationState {
  sections: SectionState[];
}

export interface SectionState {
  id: string;
  visualContainers: VisualContainerState[];
}

export interface VisualContainerState {
  name: string;
  title: string;
  config: {
    query: string;
  };
}

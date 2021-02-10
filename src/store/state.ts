export interface State {
  exploration: ExplorationState;
}

export interface ExplorationState {
  currentSectionId?: string;
  sections: SectionState[];
}

export interface SectionState {
  id: string;
  title: string;
  visualContainers: VisualContainerState[];
}

export interface VisualContainerState {
  name: string;
  title: string;
  config: {
    query: string;
  };
}

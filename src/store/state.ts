import { EntityState } from "@ngrx/entity";

export interface AppState {
  minerva: MinervaState;
}

export type SectionStateId = string;
export type VisualContainerStateId = string;
export type ExplorationStateId = string;
export type CounterId = string;

export type VisualContainerTable = EntityState<VisualContainerState>;
export type SectionTable = EntityState<SectionState>;
export type ExplorationTable = EntityState<ExplorationState>;
export type CounterTable = EntityState<Counter>;

export const enum CounterIds {
  ExplorationId = 'explorationId',
  SectionId = 'sectionId',
  VisualContainerId = 'visualContainerId',
}

export interface MinervaState {
  currentExplorationId?: ExplorationStateId;

  explorations: ExplorationTable;
  sections: SectionTable,
  visualContainers: VisualContainerTable,

  counters: CounterTable;
}

export interface Counter {
  id: string;
  counter: number;
}

export interface ExplorationState {
  id: ExplorationStateId;

  currentSectionId?: SectionStateId;

  sections: SectionStateId[];
}

export interface SectionState {
  id: SectionStateId;
  parent: ExplorationStateId;

  title: string;
  background: string;
  visualContainers: VisualContainerStateId[];
}

export interface VisualContainerState {
  id: VisualContainerStateId;
  parent: SectionStateId;

  title: string;
  background: string;
  config: {
    query: string;
  };
}
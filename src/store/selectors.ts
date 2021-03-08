import { Dictionary } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";

import { ExplorationState, SectionStateId, MinervaState, AppState, SectionState, ExplorationStateId, VisualContainerState, VisualContainerStateId, Counter, CounterId, ExplorationTable, SectionTable } from "./state";

import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";

export function selectExplorationId(state: ExplorationState): ExplorationStateId {
  return state.id;
}

export function selectSectionId(state: SectionState): SectionStateId {
  return state.id;
}

export function selectVisualContainerId(state: VisualContainerState): VisualContainerStateId {
  return state.id;
}

export function selectCounterId(state: Counter): CounterId {
  return state.id;
}

export const explorationsAdapter: EntityAdapter<ExplorationState> = createEntityAdapter<ExplorationState>({
  selectId: selectExplorationId,
});

export const sectionsAdapter: EntityAdapter<SectionState> = createEntityAdapter<SectionState>({
  selectId: selectSectionId,
});

export const visualContainersAdapter: EntityAdapter<VisualContainerState> = createEntityAdapter<VisualContainerState>({
  selectId: selectVisualContainerId,
});

export const countersAdapter: EntityAdapter<Counter> = createEntityAdapter<Counter>({
  selectId: selectCounterId,
});

// NOTE: this is kind of annoying to have to use everywhere, maybe @ngrx/entity helps with this, otherwise we should probably build helpers
export const selectMinerva = createFeatureSelector<AppState, MinervaState>('minerva');// (state: AppState) => state.minerva;

const explorationSelectors = explorationsAdapter.getSelectors();
const sectionSelectors = sectionsAdapter.getSelectors();
const visualContainerSelectors = visualContainersAdapter.getSelectors();

export const selectCurrentExploration = createSelector(
  selectMinerva,
  (state: MinervaState) => {
    if (state.currentExplorationId == null)
        return undefined;

      return state.explorations.entities[state.currentExplorationId];
  }
);

export const selectExplorationEntities = createSelector(
  selectMinerva,
  (state: MinervaState) => explorationSelectors.selectEntities(state.explorations),
);

export const selectExplorationById = createSelector(
  selectExplorationEntities,
  (explorations: Dictionary<ExplorationState>, props: { explorationId: ExplorationStateId }) => explorations[props.explorationId]
);

// TODO : probably want to factor selectors into groups, like "currentExploration"

export const selectSectionTable = createSelector(
  selectCurrentExploration,
  (exploration: ExplorationState) => exploration.sections,
);

// export const selectCurrentSection = createSelector(
//   selectCurrentExploration,
//   (exploration: ExplorationState) => {
//     if (exploration.currentSectionId == null)
//       return undefined;
//     return exploration.sections[exploration.currentSectionId];
//   }
// );

// export function getAllSections() {
//   return ...state.explorations.entities[state.currentExplorationId].sections
// }

export function getCurrentExploration(state: MinervaState) {
  return state.explorations.entities[state.currentExplorationId];
}

export const selectSectionEntities = createSelector(
  selectMinerva,
  (state: MinervaState) => sectionSelectors.selectEntities(state.sections),
);

export const selectSection = createSelector(
  selectSectionEntities,
  (sections: Dictionary<SectionState>, props: { sectionId: SectionStateId }) => sections[props.sectionId],
);

export const selectSections = createSelector(
  selectSectionEntities,
  getSectionsById
)

export function getSectionsById(sections: Dictionary<SectionState>, props: { sectionIds: SectionStateId[] }) {
  return props.sectionIds.map((sectionId) => sections[sectionId])
}

export const selectSectionIds = createSelector(
  selectExplorationById,
  (exploration: ExplorationState) => exploration.sections
)

export const selectCurrentSection = createSelector(
  selectExplorationById,
  selectSectionEntities,
  (exploration: ExplorationState, sections: Dictionary<SectionState>) => sections[exploration.currentSectionId],
)

export const selectCurrentSectionId = createSelector(
  selectExplorationById,
  (exploration: ExplorationState) => exploration.currentSectionId,
)

export const selectVisualContainerEntities = createSelector(
  selectMinerva,
  (state: MinervaState) => visualContainerSelectors.selectEntities(state.visualContainers)
);

export const selectVisualContainers = createSelector(
  selectVisualContainerEntities,
  selectSectionEntities,
  (
    visualContainers: Dictionary<VisualContainerState>,
    sections: Dictionary<SectionState>,
    props: {sectionId: SectionStateId}
  ) => getVisualContainers(visualContainers, sections, props.sectionId),
)

// NOTE: pulling out "getters" into functions to allow reuse in reducers
export function getVisualContainers(
  visualContainers: Dictionary<VisualContainerState>,
  sections: Dictionary<SectionState>,
  sectionId: SectionStateId,
) {
  return sections[sectionId].visualContainers.map((vcId) => visualContainers[vcId]);
}

export function getVisualContainerIdsForSection(
  sections: Dictionary<SectionState>,
  sectionId: SectionStateId,
) {
  return sections[sectionId].visualContainers;
}
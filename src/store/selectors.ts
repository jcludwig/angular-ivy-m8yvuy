import { createSelector } from "@ngrx/store";
import { ExplorationState, SectionState, State } from "./state";

export const selectExploration = (state: State) => state.exploration;

export const selectSections = createSelector(
  selectExploration,
  (exploration: ExplorationState) => exploration.sections
);

export const selectCurrentSection = createSelector(
  selectExploration,
  (exploration: ExplorationState) => {
    if (exploration.currentSectionId == null)
      return undefined;

    return exploration.sections.find(section => (section.id === exploration.currentSectionId))
  }
);

export const selectSection = createSelector(
  selectSections,
  (sections: SectionState[], props: { sectionId: string }) =>
    sections.find(section => (section.id = props.sectionId))
);

export const selectVisualContainers = createSelector(
  selectCurrentSection,  // NOTE: interesting, how should we deal with the page (data-bind-in? assume "current"?)
  (section) => section.visualContainers
);
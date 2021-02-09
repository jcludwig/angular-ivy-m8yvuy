import { createSelector } from "@ngrx/store";
import { ExplorationState, SectionState, State } from "./state";

export const selectExploration = (state: State) => state.exploration;

export const selectSections = createSelector(
  selectExploration,
  (exploration: ExplorationState) => exploration.sections
);

export const selectSection = createSelector(
  selectSections,
  (sections: SectionState, props: { sectionId: string }) =>
    sections.find(section => (section.id = sectionId))
);

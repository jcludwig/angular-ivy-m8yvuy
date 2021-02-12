import { createAction, props } from "@ngrx/store";
import { SectionState, SectionStateId, VisualContainerState } from "./state";

const namespace = "[Exporation] ";

export const createBlankExploration = createAction(
  namespace + "Create Blank Exploration",
);

// --- Sections

export const createBlankSection = createAction(
  namespace + "Create Blank Section",
);

export const removeSection = createAction(
  namespace + "Remove Section",
  props<{ section: SectionState }>()
);

export const navigateSection = createAction(
  namespace + "Navigate Section",
  props<{ section: SectionStateId }>(),
)

export const mutateSection = createAction(namespace + "Mutate Section");

// --- Visual Container

export const createVisualContainer = createAction(
  namespace + "Create Visual Container",
  props<{ targetSectionId: SectionStateId; }>()
);

export const addVisualContainer = createAction(
  namespace + "Add Visual Container",
  props<{ targetSectionId: SectionStateId; vc: VisualContainerState }>()
);

export const removeVisualContainer = createAction(
  namespace + "Remove Visual Container",
  props<{ section: SectionState; vc: VisualContainerState }>()
);

export const mutateVisualContainer = createAction(
  namespace + "Mutate Visual Container"
);

export const selectDatapoint = createAction(
  namespace + "Select Datapoint",
  props<{ targetVC: VisualContainerState, datapoint: string }>(),
)
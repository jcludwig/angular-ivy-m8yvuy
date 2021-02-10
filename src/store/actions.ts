import { createAction, props } from "@ngrx/store";
import { SectionState, VisualContainerState } from "./state";

const namespace = "[Exporation] ";

// --- Sections

export const addSection = createAction(
  namespace + "Add Section",
  props<{ section: SectionState }>()
);

export const removeSection = createAction(
  namespace + "Remove Section",
  props<{ section: SectionState }>()
);

export const mutateSection = createAction(namespace + "Mutate Section");

// --- Visual Container

export const addVisualContainer = createAction(
  namespace + "Add Visual Container",
  props<{ section: SectionState; vc: VisualContainerState }>()
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
  props<{ vc: VisualContainerState, datapoint: string }>(),
)
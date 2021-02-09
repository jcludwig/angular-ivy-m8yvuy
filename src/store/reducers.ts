import { Action, createReducer, on } from "@ngrx/store";
import { addVisualContainer } from "./actions";
import { State } from "./state";

const initialState: State = {
  exploration: {
    sections: []
  }
};

const vcsReducer = createReducer(
  initialState, // initial state
  on(addVisualContainer, (state, { section, vc }) => ({
    exploration: {
      sections: [
        ...state.exploration.sections;
      ]
    }
  })),
  // on(removeVisualContainer, (state, { section, vc }) => ({
  //   ...state,
  //   vcs: state.vcs.filter(item => item !== vc)
  // })),
  on(mutateVisualContainer, state => {
    // mutation
    return state;
  })
);

function update<T>(state: T)

export function reducer(state: State, action: Action) {
  return vcsReducer(state, action);
}

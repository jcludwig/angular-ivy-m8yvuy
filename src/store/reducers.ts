import { Action, createReducer, on } from "@ngrx/store";
import { addSection, addVisualContainer, mutateVisualContainer, selectDatapoint } from "./actions";
import { ExplorationState, State, VisualContainerState } from "./state";

const initialState: ExplorationState = {
  sections: []
};

let q = 0;

const vcsReducer = createReducer(
  initialState, // initial state
  on(addSection, (state, { section }) => {
    const newState: ExplorationState = {
      ...state,
      sections: [
        ...state.sections,
        section,
      ],
    };

    if (newState.sections.length === 1)
      newState.currentSectionId = newState.sections[0].id;

    return newState;
  }),
  on(addVisualContainer, (state, { section, vc }) => ({
    ...state,
    sections: [
      ...modifyOne(state.sections, (s) => s === section, (s) => ({ ...s, visualContainers: [...s.visualContainers, vcWithQuery(vc, q+"")]})),
    ]
  })),
  on(selectDatapoint, (state, { vc, datapoint }) => {
    // const newState = {
    //   ...state,
    // };

    // // update affect queries
    // for (const section of state.sections) {
    //   if (section.visualContainers.find((_vc) => _vc = vc)) {
    //     for (const affectedVC of section.visualContainers) {
    //       affectedVC.config.query = new Date().toTimeString();
    //     }
    //   }
    // }

    // update queries
    q++;

    const newState: ExplorationState = {
      ...state,
      sections: modifyOne(state.sections, (s) => !!s.visualContainers.find((_vc) => _vc === vc), (s) => ({
        ...s,
        visualContainers: s.visualContainers.map((affectedVC): VisualContainerState => {
          if (affectedVC === vc)
            return affectedVC;

          return vcWithQuery(affectedVC, q+"");
        })
      })),
    }

    return newState;
  }),
  // on(removeVisualContainer, (state, { section, vc }) => ({
  //   ...state,
  //   vcs: state.vcs.filter(item => item !== vc)
  // })),
  // on(mutateVisualContainer, state => {
  //   // mutation
  //   return state;
  // })
);

function modifyOne<T>(ts: T[], filter: (t: T) => boolean, modify: (t: T) => T): T[] {
  return ts.map((t) => {
    if (filter(t)) {
      return modify(t);
    }

    return t;
  });
}

function vcWithQuery(vc: VisualContainerState, query: string): VisualContainerState {
  return {
    ...vc,
    config: {
      ...vc.config,
      query,
    }
  };
}

export function reducer(state: ExplorationState, action: Action) {
  return vcsReducer(state, action);
}

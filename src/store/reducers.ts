import { Action, ActionCreator, createReducer, on } from "@ngrx/store";
import { OnReducer } from "@ngrx/store/src/reducer_creator";
import { CounterIds, CounterTable, ExplorationState, ExplorationStateId, MinervaState, SectionState, SectionStateId, SectionTable, VisualContainerState } from "./state";

// NOTE: is this good practice? Will tree-shaking work?
import * as actions from "./actions";
import { countersAdapter, explorationsAdapter, getCurrentExploration, getVisualContainers, sectionsAdapter, visualContainersAdapter } from "./selectors";

const initialState: MinervaState = {
  explorations: explorationsAdapter.getInitialState(),
  sections: sectionsAdapter.getInitialState(),
  visualContainers: visualContainersAdapter.getInitialState(),
  counters: countersAdapter.getInitialState(),
  // counters: {
  //   nextQueryId: 0,
  //   nextExplorationId: 0,
  //   nextSectionId: 0,
  //   nextVisualContainerId: 0,
  // },
};

// NOTE: seems a bit awkward, is there a good way to separate the reducers into separate functions?
type MinervaReducer<T extends ActionCreator> = OnReducer<MinervaState, [T /* assume only one */]>;

const onCreateBlankExploration: MinervaReducer<typeof actions.createBlankExploration> = (state: MinervaState) => {
  const newExplorationId = toId(getCounter(state.counters, CounterIds.ExplorationId));

  return {
    ...state,
    explorations: explorationsAdapter.addOne(
      explorationFactory(
        newExplorationId
      ),
      state.explorations,
    ),
    currentExplorationId: newExplorationId,
    counters: incrementCounters(state.counters, [CounterIds.ExplorationId]),
  };
  // return {
  //   ...state,
  //   currentExplorationId: toId(state.counters.nextExplorationId),
  //   explorations: {
  //     ...state.explorations,
  //     [state.counters.nextExplorationId]:
  //       // NOTE: contrast this with composing actions
  //       // would we ever need to do this mutation as part of the createSection action instead?
  //       // this would need to become an effect, or the caller would have to sequence the ops which is fragile
  //       addSection(
  //         explorationFactory(
  //           toId(state.counters.nextExplorationId)
  //         ),
  //         sectionFactory(
  //           toId(state.counters.nextSectionId)
  //         )
  //       ),
  //   },
  //   counters:
  //     incrementCounter(  // NOTE: syntax is awkward...
  //       incrementCounter(state.counters, 'nextExplorationId'),
  //       'nextSectionId'
  //     ),
  // };
};

const onCreateBlankSection: MinervaReducer<typeof actions.createBlankSection> = (state: MinervaState, { } ) => {
  const newSectionId = toId(getCounter(state.counters, CounterIds.SectionId));
  return {
    ...state,
    explorations: explorationsAdapter.updateOne(
      {
        id: state.currentExplorationId,
        changes: {
          currentSectionId: newSectionId,
          sections: [...getCurrentExploration(state).sections, newSectionId]
        }
      },
      state.explorations,
    ),
    sections: sectionsAdapter.addOne(
      sectionFactory(
        newSectionId,
        state.currentExplorationId,
      ),
      state.sections,
    ),
    counters: incrementCounters(state.counters, [CounterIds.SectionId]),
  }
};

const onAddVisualContainer: MinervaReducer<typeof actions.addVisualContainer> = (state, { targetSectionId, vc: newVC }) => (
  {
    ...state,
    sections: sectionsAdapter.updateOne(
      {
        id: targetSectionId,
        changes: {
          visualContainers: [...state.sections.entities[targetSectionId].visualContainers, newVC.id],
        },
      },
      state.sections
    ),
    visualContainers: visualContainersAdapter.addOne(
      newVC,
      state.visualContainers,
    ),
  }
);

const onSelectDatapoint: MinervaReducer<typeof actions.selectDatapoint> = (state, { targetVC, datapoint }) => {
  const currentExploration = state.explorations[state.currentExplorationId];
  const currentSection = currentExploration.sections[currentExploration.currentSectionId];
  const affectedVCs = currentSection.visualContainers.filter((vc) => vc !== targetVC.id);

  const pending: MinervaState = {
    ...state,
    visualContainers: visualContainersAdapter.updateOne(
      {
        id: targetVC.id,
        changes: {
          config: {
            query: (Number.parseInt(state.visualContainers.entities[targetVC.id].config.query, 10) + 1) + "",
          }
        }
      },
      state.visualContainers,
    )
  }

  // NOTE: which pattern is better?
  // optimize for minimizing errors and fewest allocations?
  // apply ImmerJS instead?
  // state = {
  //   ...state,
  //   counters: incrementCounter(state.counters, 'nextQueryId'),
  // };
  // state = incrementCounter2(state, 'nextQueryId');

  return pending;
};

const onNavigateSection: MinervaReducer<typeof actions.navigateSection> = (state, { section }) => {
  // TODO: can we automatically apply reducers to current exploration?
  // I think we'll still need to pass in "state" to modify counters...
  // return modifyCurrentExploration(
  //   state,
  //   (e) => ({
  //     ...e,
  //     currentSectionId: section
  //   })
  // );
  return {
    ...state,
    explorations: explorationsAdapter.updateOne(
      {
        id: state.currentExplorationId,
        changes: {
          currentSectionId: section,
        },
      },
      state.explorations,
    ),
  }
};

function toId(counter: number): string {
  return counter+"";
}

const onCreateVisualContainer: MinervaReducer<typeof actions.createVisualContainer> = (state, { targetSectionId }) => {
  // const newVC = visualContainerFactory(toId(state.counters.nextVisualContainerId), toId(state.counters.nextQueryId));

  // return modifyCurrentExploration(
  //   {
  //     ...state,
  //     counters: incrementCounter(
  //       incrementCounter(state.counters, 'nextVisualContainerId'),
  //       'nextQueryId'
  //     ),
  //   },
  //   (e) => ({
  //     ...e,
  //     sections: modifyTable(e.sections, [targetSectionId], (section) => ({ ...section, visualContainers: [...section.visualContainers, newVC.id]})),
  //     visualContainers: {
  //       ...e.visualContainers,
  //       // add a visual container
  //       [newVC.id]: newVC,
  //     }
  //   }),
  // );
  const newVCId = toId(getCounter(state.counters, CounterIds.VisualContainerId));

  return {
    ...state,
    sections: sectionsAdapter.updateOne(
      {
        id: targetSectionId,
        changes: {
          visualContainers: [...state.sections.entities[targetSectionId].visualContainers, newVCId],
        },
      },
      state.sections
    ),
    visualContainers: visualContainersAdapter.addOne(
      visualContainerFactory(
        newVCId,
        targetSectionId,
        '234',
      ),
      state.visualContainers,
    ),
    counters: incrementCounters(state.counters, [CounterIds.VisualContainerId]),
  }
};

// function incrementCounter2(state: MinervaState, counter: keyof MinervaState['counters']): MinervaState {
//   return {
//     ...state,
//     counters: {
//       ...state.counters,
//       [counter]: state.counters[counter] + 1,
//     }
//   };
// }

// function incrementCounter(counters: MinervaState['counters'], counter: keyof MinervaState['counters']): MinervaState['counters'] {
//   return {
//     ...counters,
//     [counter]: counters[counter] + 1,
//   };
// }

// function modifyCurrentExploration(state: MinervaState, modify: (e: ExplorationState) => ExplorationState): MinervaState {
//   return {
//     ...state,
//     explorations: modifyTable(state.explorations, [state.currentExplorationId], modify),
//   };
// }

// function modifyList<T>(ts: T[], filter: (t: T) => boolean, modify: (t: T) => T): T[] {
//   return ts.map((t) => {
//     if (filter(t)) {
//       return modify(t);
//     }

//     return t;
//   });
// }

// function modifyTable<T>(ts: { [id: string]: T }, ids: string[], modify: (t: T) => T): { [id: string]: T } {
//   const modified: { [id: string]: T } = {};

//   for (const id of ids) {
//     modified[id] = modify(ts[id]);
//   }

//   return Object.assign({}, ts, modified);
// }


const minervaReducer = createReducer(
  initialState, // initial state
  on(actions.createBlankExploration, onCreateBlankExploration),
  on(actions.createBlankSection, onCreateBlankSection),
  on(actions.createVisualContainer, onCreateVisualContainer),
  on(actions.addVisualContainer, onAddVisualContainer),
  on(actions.selectDatapoint, onSelectDatapoint),
  on(actions.navigateSection, onNavigateSection),
);

export function reducer(state: MinervaState | undefined, action: Action) {
  return minervaReducer(state, action);
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

function explorationFactory(id: string): ExplorationState {
  return {
    id,
    sections: [],
  };
}

function sectionFactory(id: string, parent: ExplorationStateId): SectionState {
  const section: SectionState = {
    id,
    parent,
    background: randomColor(),
    title: 'Section ' + id,
    visualContainers: [],
  };

  return section;
}

function visualContainerFactory(id: string, parent: SectionStateId, query: string): VisualContainerState {
  const visualContainer: VisualContainerState = {
    id,
    parent,
    background: randomColor(),
    config: {
      query,
    },
    title: 'Visual Container ' + id,
  }

  return visualContainer;
}

function addSection(exploration: ExplorationState, section: SectionState): ExplorationState {
  exploration = {
    ...exploration,
    // add a section
    sections: {...exploration.sections, [section.id]: section },
  };

  if (Object.keys(exploration.sections).length === 1)
    exploration.currentSectionId = section.id;

  return exploration;
}

function randomColor(): string {
  return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
}

function incrementCounters(counters: CounterTable, counterIds: CounterIds[]): CounterTable {
  return countersAdapter.upsertMany(
    counterIds.map((counter) => ({
      id: counter,
      counter: getCounter(counters, counter) + 1,
    })),
    counters);
}

function getCounter(counters: CounterTable, counter: CounterIds): number {
  return counters.entities[counter]?.counter || 0;
}
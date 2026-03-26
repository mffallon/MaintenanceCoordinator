import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { ALL_LEAF_IDS } from './treeData';
import { facilities } from '../../data/facilities';

// All unique states from facilities
export const ALL_STATES = [...new Set(facilities.map((f) => f.state))].sort();

// Map facility ID → state
const facilityStateMap = new Map(facilities.map((f) => [f.id, f.state]));

interface CommunityContextValue {
  /** null = no filter (all selected). Set<string> = explicit selection (can be empty = nothing). */
  checkedLeaves: Set<string> | null;
  setCheckedLeaves: (leaves: Set<string> | null) => void;
  /** null = all states. Set<string> = explicit selection. */
  selectedStates: Set<string> | null;
  setSelectedStates: (states: Set<string> | null) => void;
  /** True when no active filters */
  isAllSelected: boolean;
  /** Filter predicate */
  passesFilter: (facilityId: string) => boolean;
}

const CommunityContext = createContext<CommunityContextValue>({
  checkedLeaves: null,
  setCheckedLeaves: () => {},
  selectedStates: null,
  setSelectedStates: () => {},
  isAllSelected: true,
  passesFilter: () => true,
});

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [checkedLeaves, setCheckedLeaves] = useState<Set<string> | null>(null);
  const [selectedStates, setSelectedStates] = useState<Set<string> | null>(null);

  const value = useMemo(() => {
    const allCommunitiesSelected = checkedLeaves === null;
    const allStatesSelected = selectedStates === null;
    const isAllSelected = allCommunitiesSelected && allStatesSelected;

    const passesFilter = (facilityId: string) => {
      if (!allCommunitiesSelected && !checkedLeaves.has(facilityId)) return false;
      if (!allStatesSelected) {
        const state = facilityStateMap.get(facilityId);
        if (!state || !selectedStates.has(state)) return false;
      }
      return true;
    };
    return { checkedLeaves, setCheckedLeaves, selectedStates, setSelectedStates, isAllSelected, passesFilter };
  }, [checkedLeaves, selectedStates]);

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunityFilter() {
  return useContext(CommunityContext);
}

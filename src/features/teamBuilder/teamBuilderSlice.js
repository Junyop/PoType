import { createSlice } from '@reduxjs/toolkit';
import typeChart from '../../data/typeChart.json';
import {
    calculateDefenseEffectiveness,
    calculateAttackEffectiveness,
    flattenAttackData
} from '../typeCalculator/typeUtils';

const emptySlot = { types: [], attack: {}, defense: {}, pokemon: "", sprite: "" };
const emptyFilter = {
    searchTerm: "", typeFilter: [], genFilter: "all", sortMode: "id-asc", anchorEl: null
};

const initialState = {
    team: Array(6).fill(emptySlot),
    filterParameters: Array(6).fill(emptyFilter),

};

const teamBuilderSlice = createSlice({
    name: 'teamBuilder',
    initialState,
    reducers: {
        setSlotTypes(state, action) {
            const { slotIndex, types, pokemon, sprite } = action.payload;
            const limitedTypes = types.slice(0, 2);

            const defense = calculateDefenseEffectiveness(limitedTypes, typeChart);
            const allTargets = Object.keys(typeChart).map((t) => [t]);
            const rawAttack = calculateAttackEffectiveness(limitedTypes, allTargets, typeChart);
            const attack = flattenAttackData(rawAttack);
            state.team[slotIndex] = {
                types: limitedTypes,
                attack,
                defense,
                pokemon: pokemon || "",
                sprite: sprite || ""

            };
        },
        setFilterParameters(state, action) {
            const { slotIndex, ...filters } = action.payload;
            if (!state.filterParameters[slotIndex])
                state.filterParameters[slotIndex] = { ...emptyFilter };
            state.filterParameters[slotIndex] = { ...state.filterParameters[slotIndex], ...filters };
        },

        reorderTeam(state, action) {
            const { sourceIndex, destIndex } = action.payload;
            const updated = [...state.team];
            const [removed] = updated.splice(sourceIndex, 1);
            updated.splice(destIndex, 0, removed);
            state.team = updated;
        },

        setFullTeam(state, action) {
            state.team = action.payload;
        },

        resetTeam(state) {
            state.team = Array(6).fill(emptySlot);
            state.filterParameters = Array(6).fill(emptyFilter);
        },
    }
});

export const { setSlotTypes, resetTeam, reorderTeam, setFullTeam, setFilterParameters, setFilterParametersTeam } = teamBuilderSlice.actions;
export default teamBuilderSlice.reducer;

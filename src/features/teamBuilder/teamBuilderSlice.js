import { createSlice } from '@reduxjs/toolkit';
import typeChart from '../../data/typeChart.json';
import {
    calculateDefenseEffectiveness,
    calculateAttackEffectiveness,
    flattenAttackData
} from '../typeCalculator/typeUtils';

const emptySlot = { types: [], attack: {}, defense: {}, pokemon: "" };

const initialState = {
    team: Array(6).fill(emptySlot)
};

const teamBuilderSlice = createSlice({
    name: 'teamBuilder',
    initialState,
    reducers: {
        setSlotTypes(state, action) {
            const { slotIndex, types, pokemon } = action.payload;
            const limitedTypes = types.slice(0, 2);

            const defense = calculateDefenseEffectiveness(limitedTypes, typeChart);
            const allTargets = Object.keys(typeChart).map((t) => [t]);
            const rawAttack = calculateAttackEffectiveness(limitedTypes, allTargets, typeChart);
            const attack = flattenAttackData(rawAttack);

            state.team[slotIndex] = {
                types: limitedTypes,
                attack,
                defense,
                pokemon: pokemon || ""
            };
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
            // tüm slotları sıfırla
            state.team = Array(6).fill(emptySlot);
        },
    }
});

export const { setSlotTypes, resetTeam, reorderTeam, setFullTeam } = teamBuilderSlice.actions;
export default teamBuilderSlice.reducer;

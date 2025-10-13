import { createSlice } from '@reduxjs/toolkit';
import typeChart from '../../data/typeChart.json';
import {
    calculateDefenseEffectiveness,
    calculateAttackEffectiveness,
    flattenAttackData
} from '../typeCalculator/typeUtils';

const initialState = {
    team: [
        { types: [], attack: {}, defense: {} },
        { types: [], attack: {}, defense: {} },
        { types: [], attack: {}, defense: {} },
        { types: [], attack: {}, defense: {} },
        { types: [], attack: {}, defense: {} },
        { types: [], attack: {}, defense: {} }
    ]
};

const teamBuilderSlice = createSlice({
    name: 'teamBuilder',
    initialState,
    reducers: {
        setSlotTypes(state, action) {
            const { slotIndex, types } = action.payload;
            const limitedTypes = types.slice(0, 2);

            const defense = calculateDefenseEffectiveness(limitedTypes, typeChart);

            const allTargets = Object.keys(typeChart).map((t) => [t]);

            const rawAttack = calculateAttackEffectiveness(
                limitedTypes,
                allTargets,
                typeChart
            );

            const attack = flattenAttackData(rawAttack);

            state.team[slotIndex] = {
                types: limitedTypes,
                attack,
                defense
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
        }
    }
});

export const { setSlotTypes, resetTeam, reorderTeam, setFullTeam } = teamBuilderSlice.actions;
export default teamBuilderSlice.reducer;

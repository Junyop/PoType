import { createSlice } from '@reduxjs/toolkit';
import typeChart from '../../data/typeChart.json';
import {
    calculateDefenseEffectiveness,
    calculateAttackEffectiveness,
    flattenAttackData
} from './typeUtils';

const initialState = {
    selectedTypes: [],
    defenseEffectiveness: {},
    attackEffectiveness: {}
};

const typeCalculatorSlice = createSlice({
    name: 'typeCalculator',
    initialState,
    reducers: {
        setSelectedTypes(state, action) {
            const types = action.payload.slice(0, 2);
            state.selectedTypes = types;

            state.defenseEffectiveness = calculateDefenseEffectiveness(types, typeChart);

            const rawAttack = calculateAttackEffectiveness(
                types,
                Object.keys(typeChart).map(t => [t]),
                typeChart
            );

            state.attackEffectiveness = flattenAttackData(rawAttack);
        },
        resetTypes(state) {
            state.selectedTypes = [];
            state.defenseEffectiveness = {};
            state.attackEffectiveness = {};
        }
    }
});

export const { setSelectedTypes, resetTypes } = typeCalculatorSlice.actions;
export default typeCalculatorSlice.reducer;

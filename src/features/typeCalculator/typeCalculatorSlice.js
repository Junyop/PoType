import { createSlice } from "@reduxjs/toolkit";
import {
    calculateDefenseEffectiveness,
    calculateAttackEffectiveness,
    flattenAttackData,
} from "../typeCalculator/typeUtils";
import typeChart from "../../data/typeChart.json";

const emptyFilter = { searchTerm: "", typeFilter: [], genFilter: "all", sortMode: "id-asc", anchorEl: null };

const emptySlot = { types: [], attack: {}, defense: {}, pokemon: "", sprite: "" };

const initialState = {
    filterParameters: { ...emptyFilter },
    selectedPokemon: emptySlot,
};

const typeCalculatorSlice = createSlice({
    name: "typeCalculator",
    initialState,
    reducers: {
        setPokeTypes: (state, action) => {
            const { types, pokemon, sprite } = action.payload;
            const limitedTypes = types.slice(0, 2);
            const defense = calculateDefenseEffectiveness(limitedTypes, typeChart);
            const allTargets = Object.keys(typeChart).map((t) => [t]);
            const rawAttack = calculateAttackEffectiveness(limitedTypes, allTargets, typeChart);
            const attack = flattenAttackData(rawAttack);

            state.selectedPokemon = {
                types: limitedTypes,
                attack,
                defense,
                pokemon: pokemon || "",
                sprite: sprite || "",
            };
        },

        setFilterParameters: (state, action) => {
            const { ...filters } = action.payload;
            if (!state.filterParameters) {
                state.filterParameters = { ...emptyFilter };
            }
            state.filterParameters = { ...state.filterParameters, ...filters };
        },

        resetSelected: (state) => {
            state.selectedPokemon = emptySlot;
            state.filterParameters = emptyFilter;
        },

    },
});

export const {
    setPokeTypes,
    setFilterParameters,
    resetSelected,
} = typeCalculatorSlice.actions;

export default typeCalculatorSlice.reducer;

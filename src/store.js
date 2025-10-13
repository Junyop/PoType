import { configureStore } from '@reduxjs/toolkit';
import typeCalculatorReducer from './features/typeCalculator/typeCalculatorSlice';
import teamBuilderReducer from './features/teamBuilder/teamBuilderSlice';

export const store = configureStore({
    reducer: {
        typeCalculator: typeCalculatorReducer,
        teamBuilder: teamBuilderReducer
    }
});

export default store;

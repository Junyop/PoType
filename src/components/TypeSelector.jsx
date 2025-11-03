import React from 'react';
import typeColors from '../utils/typeColors';

import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTypes, resetTypes } from '../features/typeCalculator/typeCalculatorSlice';
import { Box, Button, Chip, Typography } from '@mui/material';

const allTypes = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
    'dragon', 'dark', 'steel', 'fairy'
];

const TypeSelector = () => {
    const dispatch = useDispatch();
    const selectedTypes = useSelector((state) => state.typeCalculator.selectedTypes);

    const handleClick = (type) => {
        let updated = selectedTypes.includes(type)
            ? selectedTypes.filter((t) => t !== type)
            : [...selectedTypes, type].slice(-2);

        dispatch(setSelectedTypes(updated));
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Select up to 2 types:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                {allTypes.map((type) => (
                    <Chip
                        key={type}
                        label={type}
                        onClick={() => handleClick(type)}
                        sx={{
                            bgcolor: selectedTypes.includes(type) ? typeColors[type] : '#e0e0e0',
                            color: selectedTypes.includes(type) ? '#fff' : '#000'
                        }}
                    />

                ))}
            </Box>
            <Button variant="contained" color="secondary" onClick={() => dispatch(resetTypes())}>
                Reset Types
            </Button>
        </Box>
    );
};

export default TypeSelector;

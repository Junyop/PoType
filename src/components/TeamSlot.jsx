import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSlotTypes } from '../features/teamBuilder/teamBuilderSlice';
import typeChart from '../data/typeChart.json';
import pokemonList from '../data/pokemonList.json';
import TypeBadge from './TypeBadge';
import useTypeSelectorMode from '../contexts/useTypeSelectorMode';

import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip
} from '@mui/material';

const allTypes = Object.keys(typeChart);

const TeamSlot = ({ slotIndex, slot }) => {
    const dispatch = useDispatch();
    const [selectedTypes, setSelectedTypes] = useState(slot.types || []);
    const [selectedPokemon, setSelectedPokemon] = useState('');

    const handleTypeChange = (e) => {
        const types = e.target.value.slice(0, 2);
        setSelectedTypes(types);
        setSelectedPokemon(''); // manuel seçince Pokémon sıfırlanır
        dispatch(setSlotTypes({ slotIndex, types }));
    };

    const handlePokemonChange = (e) => {
        const selectedName = e.target.value;
        setSelectedPokemon(selectedName);
        const found = pokemonList.find(p => p.name === selectedName);
        if (found) {
            setSelectedTypes(found.types);
            dispatch(setSlotTypes({ slotIndex, types: found.types }));
        }
    };
    const { mode } = useTypeSelectorMode(); // ✅ Bu doğru

    return (
        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
            <Typography variant="h6">Slot {slotIndex + 1}</Typography>

            {/* ✅ Pokémon Seçimi */}
            {mode === 'pokemon' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Select Pokémon</InputLabel>
                    <Select
                        value={selectedPokemon}
                        label="Select Pokémon"
                        onChange={handlePokemonChange}
                    >
                        {pokemonList.map((poke) => (
                            <MenuItem key={poke.name} value={poke.name}>
                                {poke.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {mode === 'type' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Select Types</InputLabel>
                    <Select
                        multiple
                        value={selectedTypes}
                        onChange={handleTypeChange}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {selected.map((type) => (
                                    <Chip key={type} label={type} />
                                ))}
                            </Box>
                        )}
                    >
                        {allTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {/* ✅ Manuel Type Seçimi */}
            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Select Types</InputLabel>
                <Select
                    multiple
                    value={selectedTypes}
                    onChange={handleTypeChange}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {selected.map((type) => (
                                <Chip key={type} label={type} />
                            ))}
                        </Box>
                    )}
                >
                    {allTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default TeamSlot;

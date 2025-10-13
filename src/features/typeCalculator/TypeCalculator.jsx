import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Chip, Button } from '@mui/material';
import pokemonList from '../../data/pokemonList.json';
import typeChart from '../../data/typeChart.json';
import { calculateDefenseEffectiveness, calculateAttackEffectiveness } from './typeUtils';
import useTypeSelectorMode from '../../contexts/useTypeSelectorMode';
import TypeBadge from '../../components/TypeBadge';

const allTypes = Object.keys(typeChart);

const TypeCalculator = () => {
    const { mode } = useTypeSelectorMode(); // ✅ Bu doğru

    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState('');
    const [results, setResults] = useState(null);

    const handleCalculate = () => {
        const typesToUse = selectedTypes.slice(0, 2);
        const allTargets = Object.keys(typeChart).map((t) => [t]);

        const attack = calculateAttackEffectiveness(typesToUse, allTargets, typeChart);
        const defense = calculateDefenseEffectiveness(typesToUse, typeChart);

        setResults({
            attack: Object.fromEntries(
                Object.entries(attack[typesToUse[0]]).map(([target, mult]) => [target, mult])
            ),
            defense
        });
    };

    const handlePokemonChange = (e) => {
        const name = e.target.value;
        const found = pokemonList.find(p => p.name === name);
        if (found) {
            setSelectedPokemon(name);
            setSelectedTypes(found.types);
        }
    };

    const handleTypeChange = (e) => {
        const newTypes = e.target.value.slice(0, 2);
        setSelectedTypes(newTypes);
        setSelectedPokemon('');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Type Effectiveness Calculator
            </Typography>

            {/* Pokémon veya Type seçim moduna göre alanı göster */}
            {mode === 'pokemon' ? (
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Choose Pokémon</InputLabel>
                    <Select value={selectedPokemon} onChange={handlePokemonChange}>
                        {pokemonList.map((p) => (
                            <MenuItem key={p.name} value={p.name}>{p.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Choose Types</InputLabel>
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
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <Button variant="contained" onClick={handleCalculate} disabled={selectedTypes.length === 0}>
                Hesapla
            </Button>

            {results && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">🗡️ Attack Effectiveness</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(results.attack).map(([type, value]) => (
                            <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TypeBadge type={type} />
                                <Typography>{value}x</Typography>
                            </Box>
                        ))}
                    </Box>

                    <Typography variant="h6" sx={{ mt: 3 }}>🛡️ Defense Weaknesses</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(results.defense).map(([type, value]) => (
                            <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TypeBadge type={type} />
                                <Typography>{value}x</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default TypeCalculator;

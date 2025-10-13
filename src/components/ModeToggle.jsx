import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import TuneIcon from '@mui/icons-material/Tune';
import useTypeSelectorMode from '../contexts/useTypeSelectorMode';

const ModeToggle = () => {
    const { mode, setMode } = useTypeSelectorMode();

    return (
        <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, newMode) => {
                if (newMode) setMode(newMode);
            }}
            size="small"
            sx={{ position: 'fixed', top: 16, right: 16, zIndex: 999 }}
        >
            <ToggleButton value="pokemon">
                <CatchingPokemonIcon sx={{ mr: 1 }} /> Pokémon Seç
            </ToggleButton>
            <ToggleButton value="type">
                <TuneIcon sx={{ mr: 1 }} /> Type Seç
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ModeToggle;

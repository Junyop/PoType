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
            sx={{ position: 'sticky', width: 'fit-content', zIndex: 999, left: '100%', mt: 2, mb: 2, top: 8, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}

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

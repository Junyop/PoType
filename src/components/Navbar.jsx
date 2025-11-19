// ...existing code...
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import PokemonLogo from '../assets/pokemon-logo.png'; // ekle (dosya yolunu proje yapına göre ayarla)
// ...existing code...
const Navbar = () => {
    const location = useLocation();

    const pages = [
        { label: 'Pokémon incele', path: '/calculator' },
        { label: 'Takım Oluştur', path: '/team' }
    ];

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="img"
                        src={PokemonLogo}
                        alt="Pokémon"
                        sx={{ height: 35, display: 'inline-block', verticalAlign: 'middle' }}
                    />
                    <Box component="span">Tip / Takım Analizi</Box>
                </Typography>
                {pages.map((page) => (
                    <Button
                        key={page.path}
                        component={Link}
                        to={page.path}
                        color="inherit"
                        variant={location.pathname === page.path ? 'outlined' : 'text'}
                        sx={{ ml: 1 }}
                    >
                        {page.label}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
};
// ...existing code...
export default Navbar;
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const pages = [
        { label: 'Type Calculator', path: '/calculator' },
        { label: 'Team Builder', path: '/team' }
    ];

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Pokémon Type Tool
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

export default Navbar;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetTypes } from './typeCalculatorSlice';
import {
    Box, Typography, Chip, Button, Paper, Grid, Container, FormControl, InputLabel, Select, MenuItem, TextField, Divider
} from '@mui/material';
import fullPokemonList from '../../data/pokemonList.json';
import useTypeSelectorMode from '../../contexts/useTypeSelectorMode';
import { setSelectedTypes } from './typeCalculatorSlice';
import PokemonSelector from '../../components/PokemonSelector';
import typeChart from '../../data/typeChart.json';
import typeColors from '../../utils/typeColors';
import SummaryTable from '../../components/SummaryTable';
import { Label } from 'recharts';
import { Gradient } from '@mui/icons-material';


const allTypes = Object.keys(typeChart);

const pokemonlist = fullPokemonList
    .filter((poke) => poke.name !== "Pokeball")
    .sort((a, b) => (a.id || 9999) - (b.id || 9999));


const TypeCalculator = () => {
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.typeCalculator.selectedTypes);
    const { mode } = useTypeSelectorMode();
    const isPokemonMode = mode === 'pokemon';
    const isTypeMode = mode === 'type';

    const [selectedPokemon, setSelectedPokemon] = useState("");
    const [selectedType, setSelectedType] = useState([]);

    useEffect(() => {
        setSelectedType([]);
        setSelectedPokemon("");
    }, [mode]);

    const handlePokemonChange = (event) => {
        const pokemonName = event.target.value;
        setSelectedPokemon(pokemonName);
        const pokemon = pokemonlist.find((p) => p.name === pokemonName);
        if (pokemon) {
            const types = pokemon.types;
            setSelectedType(types);
            dispatch(setSelectedTypes(types));
        }
    };

    const handleTypeChange = (types) => {
        setSelectedType(types);
        setSelectedPokemon("");
        dispatch(setSelectedTypes(types));
    }
    const handleReset = () => {
        setSelectedType([]);
        setSelectedPokemon("");
        dispatch(resetTypes());
    };

    const selectedPokeData = pokemonlist.find((p) => p.name === selectedPokemon);


    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" fontWeight="bold"
                gutterBottom sx={{ color: 'primary.main' }}
            >
                Pokémon Analizörü
            </Typography>
            <Box sx={{
                display: 'flex', justifyContent: 'center', mb: 3

            }}>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleReset}
                >
                    Slotu Sıfırla
                </Button>

            </Box>
            <Grid container spacing={3} justifyContent="center" alignItems="flex-start" >
                <Grid item >
                    <Paper elevation={2} >
                        <Box display="flex" flexDirection="row" alignItems="center" textAlign="center" gap={3} >
                            <Box sx={{
                                width: 450,
                                height: 390,
                                border: "1px solid #ccc",
                                borderRadius: 3,
                                p: 2,
                                boxShadow: 2,
                                bgcolor: "background.paper",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                                transition: "all 0.25s ease",
                                "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
                                backgroundColor: isPokemonMode
                                    ? selectedPokeData
                                        ? typeColors(selectedPokeData.types[0]) + "22"
                                        : "grey.200"
                                    : isTypeMode
                                        ? typeColors(selectedType[0] || "normal") + "22"
                                        : "grey.200"
                            }}>

                                <Box
                                    sx={{
                                        width: "100%",
                                        flexGrow: 1,
                                        overflowY: "auto",
                                        p: 0.5,
                                        "&::-webkit-scrollbar": {
                                            width: 6,
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: selectedPokeData ? typeColors[selectedPokeData.types[0]] : "grey",
                                            borderRadius: 3,
                                        },
                                    }}>
                                    {isPokemonMode ? (
                                        <PokemonSelector value={selectedPokemon} onChange={handlePokemonChange} />
                                    ) : (
                                        <TypeSelector value={selectedType} onChange={handleTypeChange} />
                                    )}
                                </Box>
                            </Box>
                            <Box sx={{
                                width: 450,
                                height: 390,
                                border: "1px solid #ccc",
                                borderRadius: 3,
                                p: 2,
                                boxShadow: 2,
                                bgcolor: "background.paper",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                                transition: "all 0.25s ease",
                                "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
                                // ...existing code...


                                background: isPokemonMode
                                    ? selectedPokeData
                                        ? `linear-gradient(135deg, ${typeColors(selectedPokeData.types[0])}99,  ${typeColors(selectedPokeData.types[1] || selectedPokeData.types[0])}88)`
                                        : "#e0e0e0"
                                    : isTypeMode
                                        ? `linear-gradient(135deg, ${typeColors(selectedType[0] || "normal")}99, ${typeColors(selectedType[1] || selectedType[0] || "normal")}88)`
                                        : "#e0e0e0"
                            }}>
                                <Typography variant="subtitle1" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {isPokemonMode
                                        ? selectedPokeData
                                            ? `Selected Pokémon: ${selectedPokeData.name} `
                                            : "No Pokémon Selected"
                                        : isTypeMode
                                            ? `Selected Types: ${selectedType.join(", ") || "None"}`
                                            : "No Types Selected"
                                    }
                                </Typography>

                                {isPokemonMode && selectedPokeData && (
                                    <Box component="img" src={selectedPokeData.sprite} alt={selectedPokeData.name} sx={{ width: 300, height: 300, objectfile: "contain", mb: 2 }} />
                                )}

                                {isTypeMode && (
                                    <Box component="img"
                                        src="https://img.pokemondb.net/sprites/items/poke-ball.png"
                                        alt="Pokéball"
                                        sx={{ width: 300, height: 300, objectFit: "contain", mb: 1 }}
                                    />
                                )}
                                {isPokemonMode && selectedType.length > 0 && (
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 1 }}>
                                        {selectedType.map((type) => (
                                            <Chip key={type} label={type}
                                                sx={{ fontWeight: "bold", color: "white", bgcolor: typeColors(type) }} />
                                        ))}
                                    </Box>
                                )}

                                <Box
                                    sx={{
                                        width: "100%",
                                        flexGrow: 1,
                                        overflowY: "auto",
                                        p: 0.5,
                                        "&::-webkit-scrollbar": {
                                            width: 6,
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: selectedPokeData ? typeColors[selectedPokeData.types[0]] : "grey",
                                            borderRadius: 3,
                                        },
                                    }}>

                                </Box>
                            </Box>
                        </Box>

                    </Paper>

                </Grid>

            </Grid>
            <Box sx={{ mt: 4 }} >

                <SummaryTable team={selected} />
            </Box>
        </Container >
    );
};

const TypeSelector = ({ value, onChange }) => {
    const handleSelect = (type) => {
        let updated;
        if (value.includes(type)) {
            updated = value.filter((t) => t !== type);
        } else if (value.length < 2) {
            updated = [...value, type];
        } else {
            updated = value;
        }
        onChange(updated);
    };

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Select up to 2 Types
                </Typography>
            </Box>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "center",
            }}>
                {allTypes.map((type) => (
                    <Chip
                        key={type}
                        label={type}
                        onClick={() => handleSelect(type)}
                        sx={{
                            bgcolor: value.includes(type) ? typeColors(type) : "grey.300",
                            color: value.includes(type) ? "white" : "black",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    />
                ))}

            </Box>
        </Box>
    );
};



export default TypeCalculator;


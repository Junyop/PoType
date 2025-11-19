import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setPokeTypes,
    setFilterParameters,
    resetSelected,
} from "./typeCalculatorSlice";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Chip,
    IconButton,
    Tooltip,
    Paper,
    FormControl, InputLabel, Menu, Container
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import typeChart from "../../data/typeChart.json";
import typeColors from "../../utils/typeColors";
import useTypeSelectorMode from "../../contexts/useTypeSelectorMode";
import TeamMatrix from "../../components/TeamMatrix";
import fullPokemonList from "../../data/pokemonList.json";


const allTypes = Object.keys(typeChart);

const pokemonList = fullPokemonList
    .filter((p) => p.name !== "Pokeball")
    .sort((a, b) => (a.id || 9999) - (b.id || 9999));

const TypeCalculator = (selected) => {
    const dispatch = useDispatch();
    const poke = useSelector((state) => state.typeCalculator.selectedPokemon);

    const { mode } = useTypeSelectorMode();

    const [selectedPokemon, setSelectedPokemon] = useState(selected.pokemon || "");

    const [selectedTypes, setSelectedTypes] = useState(selected.types || [])


    // filtreleme güncelle
    useEffect(() => {
        setSelectedPokemon(selected.pokemon || "");
        setSelectedTypes(selected.types || []);
    }, [selected]);

    const handlePokemonChange = (e) => {
        const name = e.target.value;
        setSelectedPokemon(name);
        const found = pokemonList.find((p) => p.name === name);
        if (found) {
            setSelectedTypes(found.types);
            dispatch(setPokeTypes({ types: found.types, pokemon: name, sprite: found.sprite }));
        }
    };

    const handleTypeChange = (types) => {
        setSelectedTypes(types);
        setSelectedPokemon("");
        dispatch(setPokeTypes({ types, pokemon: "" }));
    };

    const filterParams = useSelector((state) => state.typeCalculator.filterParameters) || { searchTerm: "", typeFilter: [], genFilter: "all", sortMode: "id-asc" };

    const selectedPokeData = pokemonList.find((p) => p.name === selectedPokemon);

    const { searchTerm = "", typeFilter = [], genFilter = "all", sortMode = "id-asc" } = filterParams || {};
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenSortMenu = (e) => setAnchorEl(e.currentTarget);
    const handleCloseSortMenu = () => setAnchorEl(null);
    const handleSortChange = (mode) => {
        dispatch(setFilterParameters({ ...filterParams, sortMode: mode }));
        handleCloseSortMenu();
    };
    // Local değişiklikleri Redux'a yaz
    const updateFilter = (changes) => {
        dispatch(setFilterParameters({ ...filterParams, ...changes }));
    };

    // Filtreleme işlemleri
    const filteredList = useMemo(() => {
        let list = fullPokemonList;

        // Arama
        if (searchTerm.trim().length >= 2) {
            const term = searchTerm.toLowerCase();
            list = list.filter((p) => p.name.toLowerCase().includes(term));
        }

        // Type filtresi
        if (typeFilter.length > 0) {
            list = list.filter((p) => typeFilter.every((t) => p.types.includes(t)));
        }

        // Jenerasyon filtresi
        if (genFilter !== "all") {
            list = list.filter((p) => p.gen === Number(genFilter));
        }

        // Sıralama
        list = [...list].sort((a, b) => {
            switch (sortMode) {
                case "id-desc": return (b.id || 0) - (a.id || 0);
                case "name-asc": return a.name.localeCompare(b.name);
                case "name-desc": return b.name.localeCompare(a.name);
                default: return (a.id || 0) - (b.id || 0);
            }
        });

        return list;
    }, [searchTerm, typeFilter, genFilter, sortMode]);

    const generations = [...new Set(pokemonList.map((p) => p.gen))].sort((a, b) => a - b);

    const handleSelect = (type) => {
        let updated;
        if (selectedTypes.includes(type)) {
            updated = selectedTypes.filter((t) => t !== type);
        } else if (selectedTypes.length < 2) {
            updated = [...selectedTypes, type];
        } else {
            updated = selectedTypes;
        }
        handleTypeChange(updated);
    };

    const resetFilters = () => {
        updateFilter({
            searchTerm: "",
            typeFilter: [],
            genFilter: "all",
            sortMode: "id-asc",
        })
        setSelectedTypes([]);
        setSelectedPokemon("");
        dispatch(resetSelected());
    }
    const sortLabelMap = {
        "id-asc": "ID ↑",
        "id-desc": "ID ↓",
        "name-asc": "A → Z",
        "name-desc": "Z → A",
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography
                variant="h4"
                align="center"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "primary.main" }}
            >
                Pokémon Tip Analizörü
            </Typography>

            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* POKEMON MODU üst bar */}
                {mode === "pokemon" && (
                    <Box sx={{
                        mb: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", justifyContent: "center", textAlign: "center",

                    }}>                            {/* Arama */}
                        <TextField
                            label="Pokémon Ara (min 2 harf)"
                            value={searchTerm}
                            onChange={(e) => updateFilter({ searchTerm: e.target.value })}
                            size="small"
                        />
                        {/* Jenerasyon */}
                        <FormControl size="small" >
                            <InputLabel>Jenerasyon</InputLabel>
                            <Select
                                label="Jenerasyon"
                                value={genFilter}
                                onChange={(e) => updateFilter({ genFilter: e.target.value })}
                            >
                                <MenuItem value="all">Tümü</MenuItem>
                                {generations.map((g) => (
                                    <MenuItem key={g} value={g}>Gen {g}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Sıralama */}
                        <Tooltip title="Sıralama Modu">
                            <IconButton onClick={handleOpenSortMenu}>
                                <SortIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseSortMenu}>
                            <MenuItem onClick={() => handleSortChange("id-asc")}>ID ↑</MenuItem>
                            <MenuItem onClick={() => handleSortChange("id-desc")}>ID ↓</MenuItem>
                            <MenuItem onClick={() => handleSortChange("name-asc")}>A → Z</MenuItem>
                            <MenuItem onClick={() => handleSortChange("name-desc")}>Z → A</MenuItem>
                        </Menu>
                        <Typography variant="body2" color="text.secondary">
                            {sortLabelMap[sortMode]}
                        </Typography>
                        {/* Reset */}
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            sx={{ mt: 1 }}
                            onClick={() => resetFilters()}
                        >
                            Filtreleri Sıfırla
                        </Button>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 0.4,
                                justifyItems: "center",
                                mt: 1,
                                width: "100%",
                                flexDirection: "row",
                                textAlign: "center",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {allTypes.map((type) => (
                                <Chip
                                    key={type}
                                    label={type}
                                    onClick={() => {
                                        const updated = typeFilter.includes(type)
                                            ? typeFilter.filter((t) => t !== type)
                                            : typeFilter.length < 2
                                                ? [...typeFilter, type]
                                                : typeFilter;
                                        updateFilter({ typeFilter: updated });
                                    }}
                                    sx={{
                                        bgcolor: typeFilter.includes(type)
                                            ? typeColors(type)
                                            : "grey.300",
                                        color: typeFilter.includes(type) ? "white" : "black",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        minWidth: 45,
                                        maxWidth: 100,
                                        textAlign: "center",
                                        display: "flex",
                                        justifyItems: "center",
                                        justifyContent: "center",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",

                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* TYPE MODU üst bar */}
                {mode === "type" && (
                    <Box sx={{
                        mb: 3, textAlign: "center", gap: 2, display: "flex", flexDirection: "column", alignItems: "center"
                    }}>
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            sx={{ mt: 1 }}
                            onClick={() => resetFilters()}
                        >
                            Filtreleri Sıfırla
                        </Button>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 0.4,
                                justifyItems: "center",
                                mt: 1,
                                width: "100%",
                                flexDirection: "row",
                                textAlign: "center",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {allTypes.map((type) => (
                                <Chip
                                    key={type}
                                    label={type}
                                    onClick={() => handleSelect(type)}

                                    sx={{
                                        bgcolor: selectedTypes.includes(type)
                                            ? typeColors(type)
                                            : "grey.300",
                                        color: selectedTypes.includes(type) ? "white" : "black",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        minWidth: 45,
                                        maxWidth: 100,
                                        textAlign: "center",
                                        display: "flex",
                                        justifyItems: "center",
                                        justifyContent: "center",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                    }}

                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* POKEMON MODU Pokemon listeleme*/}
            {mode === "pokemon" && (
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ maxHeight: "70vh", overflowY: "auto", p: 1 }}
                >
                    {filteredList.map((poke) => (
                        <Grid item key={poke.id} value={poke.name}>
                            <Box
                                onClick={() => handlePokemonChange({ target: { value: poke.name } })}
                                sx={{
                                    width: 120,
                                    height: 140,
                                    p: 1,
                                    borderRadius: 2,
                                    border:
                                        selectedPokemon?.name === poke.name
                                            ? `2px solid ${typeColors(poke.types[0])}`
                                            : "1px solid #ccc",
                                    boxShadow: 1,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    "&:hover": { transform: "scale(1.05)" },
                                    bgcolor: typeColors(poke.types[0]) + "22",
                                }}
                            >
                                <img src={poke.sprite} alt={poke.name} width={72} height={72} />
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {poke.name}
                                </Typography>
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                                    {poke.types.map((t) => (
                                        <Chip
                                            key={t}
                                            label={t}
                                            size="small"
                                            sx={{
                                                bgcolor: typeColors(t),
                                                color: "white",
                                                height: 20,
                                                fontSize: "0.7rem",
                                            }}
                                        />
                                    ))}
                                </Box>
                                <Typography variant="subtitle2" >
                                    {poke.id ? `#${poke.id.toString().padStart(3, "0")}` : "No ID"}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
            {/* TEAM MATRIX */}
            {(selectedTypes.length === 0) && (
                <Typography
                    variant="h6"
                    align="center"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Lütfen analiz için bir Pokémon veya en az bir tip seçin.
                </Typography>
            )}
            {(selectedPokemon || selectedTypes.length > 0)
                && (
                    <Box sx={{ mt: 4 }}>
                        <TeamMatrix flgTeam={false}
                            team={
                                selectedPokemon
                                    ? [
                                        {
                                            pokemon: selectedPokeData.name,
                                            sprite: selectedPokeData.sprite,
                                            types: selectedPokeData.types,
                                            defense: poke.defense,
                                            attack: poke.attack,
                                        },
                                    ]
                                    : [
                                        {
                                            pokemon: "Pokémon",
                                            sprite: "https://img.pokemondb.net/sprites/items/poke-ball.png",
                                            types: selectedTypes,
                                            defense: poke.defense,
                                            attack: poke.attack,
                                        },
                                    ]
                            }
                        />
                    </Box>
                )}
        </Container>
    );
};
export default TypeCalculator;





import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSlotTypes, setFilterParameters } from "../features/teamBuilder/teamBuilderSlice";
import typeChart from "../data/typeChart.json";
import fullPokemonList from "../data/pokemonList.json";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    TextField,
    IconButton,
    Tooltip,
    Stack,
    Button,
    Menu,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import useTypeSelectorMode from "../contexts/useTypeSelectorMode";
import typeColors from "../utils/typeColors";

const allTypes = Object.keys(typeChart);

const pokemonList = fullPokemonList
    .filter((p) => p.name !== "Pokeball")
    .sort((a, b) => (a.id || 9999) - (b.id || 9999));

const TeamSlot = ({ slotIndex, slot }) => {
    const dispatch = useDispatch();
    const { mode } = useTypeSelectorMode();
    const isPokemonMode = mode === "pokemon";
    const isTypeMode = mode === "type";

    const [selectedPokemon, setSelectedPokemon] = useState(slot.pokemon || "");
    const [selectedTypes, setSelectedTypes] = useState(slot.types || []);

    //  slot değiştiğinde local state'i güncelle (reset dahil)
    useEffect(() => {
        setSelectedPokemon(slot.pokemon || "");
        setSelectedTypes(slot.types || []);
    }, [slot]);

    const handlePokemonChange = (e) => {
        const name = e.target.value;
        setSelectedPokemon(name);
        const found = pokemonList.find((p) => p.name === name);
        if (found) {
            setSelectedTypes(found.types);
            dispatch(setSlotTypes({ slotIndex, types: found.types, pokemon: name, sprite: found.sprite }));
        }
    };

    const handleTypeChange = (types) => {
        setSelectedTypes(types);
        setSelectedPokemon("");
        dispatch(setSlotTypes({ slotIndex, types, pokemon: "" }));
    };
    const filterParams = useSelector((state) => state.teamBuilder.filterParameters[slotIndex]) || { searchTerm: "", typeFilter: [], genFilter: "all", sortMode: "id-asc" };

    const selectedPokeData = pokemonList.find((p) => p.name === selectedPokemon);

    const cardWidth = 300;
    const cardHeight = 430;

    return (
        <Box
            sx={{
                width: cardWidth,
                height: cardHeight,
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
                background: isPokemonMode
                    ? selectedPokeData
                        ? `linear-gradient(135deg, ${typeColors(selectedPokeData.types[0])}99,  ${typeColors(selectedPokeData.types[1] || selectedPokeData.types[0])}88)`
                        : "#e0e0e0"
                    : isTypeMode
                        ? `linear-gradient(135deg, ${typeColors(selectedTypes[0] || "normal")}99, ${typeColors(selectedTypes[1] || selectedTypes[0] || "normal")}88)`
                        : "#e0e0e0"
            }}
        >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Slot {slotIndex + 1}
            </Typography>

            {/* Görsel */}
            {isPokemonMode && selectedPokeData && (
                <Box component="img" src={selectedPokeData.sprite} alt={selectedPokemon}
                    sx={{ width: 140, height: 140, objectFit: "contain", mb: 1 }} />
            )}

            {isTypeMode && (
                <Box
                    component="img"
                    src="https://img.pokemondb.net/sprites/items/poke-ball.png"
                    alt="Pokéball"
                    sx={{ width: 96, height: 96, objectFit: "contain", mb: 1 }}
                />
            )}

            {/* Type chip'ler */}
            {isPokemonMode && selectedTypes.length > 0 && (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", mb: 1 }}>
                    {selectedTypes.map((type) => (
                        <Chip key={type} label={type}
                            sx={{ fontWeight: "bold", color: "white", bgcolor: typeColors(type) }} />
                    ))}
                </Box>
            )}
            {/* Selector container (scrollable) */}
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
                        backgroundColor: selectedPokeData ? typeColors(selectedPokeData.types[0]) : "grey",
                        borderRadius: 3,
                    },
                }}
            >{isPokemonMode ? (
                <PokemonSelector value={selectedPokemon} onChange={handlePokemonChange} filterParams={filterParams} slotIndex={slotIndex}
                />
            ) : (
                <TypeSelector value={selectedTypes} onChange={handleTypeChange} />
            )}
            </Box>
        </Box>
    );
};

/* --------------------------
   PokemonSelector Component
---------------------------*/
const PokemonSelector = ({ slotIndex, value, onChange, filterParams }) => {
    const dispatch = useDispatch();

    // fallback filter
    const { searchTerm = "", typeFilter = [], genFilter = "all", sortMode = "id-asc" } =
        filterParams || {};
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenSortMenu = (e) => setAnchorEl(e.currentTarget);
    const handleCloseSortMenu = () => setAnchorEl(null);
    const handleSortChange = (mode) => {
        dispatch(setFilterParameters({ slotIndex, ...filterParams, sortMode: mode }));
        handleCloseSortMenu();
    };

    // Local değişiklikleri Redux'a yaz
    const updateFilter = (changes) => {
        dispatch(setFilterParameters({ slotIndex, ...filterParams, ...changes }));
    };

    // 🔹 Filtreleme işlemleri
    const filteredList = useMemo(() => {
        let list = pokemonList;

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

    const resetSlot = () => {
        // filtreleri sıfırla
        dispatch(setFilterParameters({ slotIndex, searchTerm: "", typeFilter: [], genFilter: "all", sortMode: "id-asc" }));
        // bu slottaki seçimi sıfırla (pokemon, types, sprite)
        dispatch(setSlotTypes({ slotIndex, types: [], pokemon: "", sprite: "" }));
    };

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* Arama + sıralama barı */}
            <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                    size="small"
                    variant="outlined"
                    label="Ara (min 2 harf)"
                    value={searchTerm}
                    onChange={(e) => updateFilter({ searchTerm: e.target.value })}
                    fullWidth
                />
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
            </Stack>

            {/* Jenerasyon seçimi */}
            <FormControl size="small" fullWidth>
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

            {/* Pokémon seçimi */}
            <FormControl fullWidth size="small">
                <InputLabel>Pokémon Seç</InputLabel>
                <Select value={value} label="Pokémon Seç" onChange={onChange}>
                    {filteredList.map((poke) => (
                        <MenuItem key={poke.id} value={poke.name}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <img src={poke.sprite} alt={poke.name} width={32} height={32} />
                                <Typography>{poke.name}</Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Type filtreleri */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                    gap: 0.5,
                    justifyItems: "center",
                    mt: 1,
                }}
            >
                {allTypes.map((type) => (
                    <Chip
                        key={type}
                        label={type}
                        size="small"
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
                            width: "100%",
                            textAlign: "center",
                        }}
                    />
                ))}
            </Box>

            {/* Filtre reset butonu */}
            <Button
                variant="outlined"
                size="small"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => resetSlot()}
            >
                Filtreleri Sıfırla
            </Button>

            <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                Sıralama: {sortMode == "id-asc" ? "ID ↑" : (sortMode == "id-desc" ? "ID ↓" : (sortMode == "name-asc" ? "A → Z" : "Z → A"))}

            </Typography>
        </Box>
    );
};



/* --------------------------
   TypeSelector Component
---------------------------*/
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
    );
};

export default TeamSlot;

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setSlotTypes } from "../features/teamBuilder/teamBuilderSlice";
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
    Collapse,
    Menu,
    Divider,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import useTypeSelectorMode from "../contexts/useTypeSelectorMode";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const allTypes = Object.keys(typeChart);

function typeColor(type) {
    const colors = {
        normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
        grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
        ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
        rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
        steel: "#B7B7CE", fairy: "#D685AD"
    };
    return colors[type] || "#999";
}

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
            dispatch(setSlotTypes({ slotIndex, types: found.types, pokemon: name }));
        }
    };

    const handleTypeChange = (types) => {
        setSelectedTypes(types);
        setSelectedPokemon("");
        dispatch(setSlotTypes({ slotIndex, types, pokemon: "" }));
    };

    const selectedPokeData = pokemonList.find((p) => p.name === selectedPokemon);

    const cardWidth = 300;
    const cardHeight = 390;

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
                backgroundColor: isPokemonMode
                    ? selectedPokeData
                        ? typeColor(selectedPokeData.types[0]) + "72"
                        : "grey.200"
                    : isTypeMode
                        ? typeColor(selectedTypes[0] || "normal") + "72"
                        : "grey.200"
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
                            sx={{ fontWeight: "bold", color: "white", bgcolor: typeColor(type) }} />
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
                        backgroundColor: selectedPokeData ? typeColor(selectedPokeData.types[0]) : "grey",
                        borderRadius: 3,
                    },
                }}
            >{isPokemonMode ? (
                <PokemonSelector value={selectedPokemon} onChange={handlePokemonChange} />
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
const PokemonSelector = ({ value, onChange }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState([]);
    const [genFilter, setGenFilter] = useState("all");
    const [sortMode, setSortMode] = useState("id-asc");
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenSortMenu = (e) => setAnchorEl(e.currentTarget);
    const handleCloseSortMenu = () => setAnchorEl(null);
    const handleSortChange = (mode) => {
        setSortMode(mode);
        handleCloseSortMenu();
    };

    // 🔹 Filtreleme işlemleri
    const filteredList = useMemo(() => {
        let list = pokemonList;

        // Arama (en az 2-3 harf)
        if (searchTerm.trim().length >= 2) {
            const term = searchTerm.toLowerCase();
            list = list.filter((p) => p.name.toLowerCase().includes(term));
        }

        // Türe göre filtreleme
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

    const sortLabelMap = {
        "id-asc": "ID ↑",
        "id-desc": "ID ↓",
        "name-asc": "A → Z",
        "name-desc": "Z → A",
    };

    //  Mevcut jenerasyonlar (otomatik liste)
    const generations = [...new Set(pokemonList.map((p) => p.gen))].sort((a, b) => a - b);

    return (
        <Box sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            alignItems: "stretch",
        }}>
            {/*  Arama + sıralama barı */}
            <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                    size="small"
                    variant="outlined"
                    label="Ara (min 2 harf)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

            {/*  Jenerasyon seçimi */}
            <FormControl size="small" fullWidth>
                <InputLabel>Jenerasyon</InputLabel>
                <Select
                    label="Jenerasyon"
                    value={genFilter}
                    onChange={(e) => setGenFilter(e.target.value)}
                >
                    <MenuItem value="all">Tümü</MenuItem>
                    {generations.map((g) => (
                        <MenuItem key={g} value={g}>
                            Gen {g}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Pokémon seçimi */}
            <FormControl fullWidth size="small">
                <InputLabel>Pokémon Seç</InputLabel>
                <Select value={value} label="Pokémon Seç" onChange={onChange}>
                    {filteredList.map((poke) => (
                        <MenuItem key={poke.name} value={poke.name}>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}>
                                <img
                                    src={poke.sprite}
                                    alt={poke.name}
                                    width={32}
                                    height={32}
                                />
                                <Typography>{poke.name}</Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Tip filtreleri*/}
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
                        onClick={() =>
                            setTypeFilter((prev) =>
                                prev.includes(type)
                                    ? prev.filter((t) => t !== type)
                                    : prev.length < 2
                                        ? [...prev, type]
                                        : prev
                            )
                        }
                        sx={{
                            bgcolor: typeFilter.includes(type)
                                ? typeColor(type)
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
            <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                sx={{ mt: 0.5 }}
            >
                Sıralama: {sortLabelMap[sortMode]}
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
                        bgcolor: value.includes(type) ? typeColor(type) : "grey.300",
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

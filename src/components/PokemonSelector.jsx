import React, { useState, useMemo } from "react";
import { Box, Stack, TextField, IconButton, Tooltip, Menu, MenuItem, FormControl, InputLabel, Select, Typography, Chip } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import pokemonList from "../data/pokemonList.json";
import typeChart from "../data/typeChart.json";
const allTypes = Object.keys(typeChart);
import typeColors from "../utils/typeColors";

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

export default PokemonSelector;
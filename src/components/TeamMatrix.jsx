import React, { useMemo, useState } from "react";
import {
    Box,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Divider,
} from "@mui/material";
import { typeColors } from "../utils/typeColors";
import TeamSummaryChart from "./TeamSummaryChart";
import { findSynergy } from "../utils/synergyUtils";
import TeamSynergy from "./TeamSynergy";


const TeamMatrix = ({ team = [], flgTeam }) => {
    const [mode, setMode] = useState("defense"); // "attack" | "defense"
    const allTypes = useMemo(() => {
        return [
            "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
            "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
        ];
    }, []);
    const defenseSummary = {};
    const attackSummary = {};

    team.forEach((slot) => {
        Object.entries(slot.defense || {}).forEach(([type, value]) => {
            if (!defenseSummary[type]) defenseSummary[type] = { weak: 0, resist: 0, immune: 0 };
            if (value > 1) defenseSummary[type].weak++;
            else if (value < 1 && value > 0) defenseSummary[type].resist++;
            else if (value === 0) defenseSummary[type].immune++;
        });

        Object.entries(slot.attack || {}).forEach(([type, value]) => {
            if (!attackSummary[type]) attackSummary[type] = { weak: 0, resist: 0, immune: 0 };
            if (value > 1) attackSummary[type].resist++; // saldırıda avantaj
            else if (value < 1 && value > 0) attackSummary[type].weak++; // etkisiz
            else if (value === 0) attackSummary[type].immune++; // etkisiz
        });
    });

    // === TEAM SUMMARY CALC ===
    const summary = useMemo(() => {
        const res = {};
        allTypes.forEach((type) => {
            res[type] = { weak: 0, resist: 0, immune: 0 };
            team.forEach((slot) => {
                const data = mode === "defense" ? slot.defense : slot.attack;
                if (!data || data[type] == null) return;
                const mult = data[type];
                if (mult === 0) res[type].immune += 1;
                else if (mult < 1) res[type].resist += 1;
                else if (mult > 1) res[type].weak += 1;
            });
        });
        return res;
    }, [team, mode, allTypes]);

    const getColorForMult = (m) => {
        if (m === 0) return "#333";
        if (m < 1) return "#2e7d32";
        if (m === 1) return "#9e9e9e";
        if (m > 1 && m < 3) return "#ef6c00";
        return "#d32f2f";
    };
    const synergy = findSynergy(team);


    // === REPORT TEXT ===
    const reportList = useMemo(() => {
        return allTypes
            .map((type) => {
                const s = summary[type];
                if (!s) return null;
                const color = typeColors[type];
                const emoji =
                    mode === "defense"
                        ? s.weak > s.resist
                            ? "⚠️"
                            : s.resist > s.weak
                                ? "🛡️"
                                : "⚖️"
                        : s.resist > s.weak
                            ? "💥"
                            : "❌";
                return {
                    type,
                    emoji,
                    color,
                    text: `${s.weak} zayıf, ${s.resist} dirençli, ${s.immune} bağışık`,
                };
            })
            .filter(Boolean);

    }, [summary, mode, allTypes]);

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                    {flgTeam ? "Takım Tip Matrisi" : "Pokémon Tip Matrisi"}
                </Typography>
                <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={mode}
                    onChange={(e, v) => v && setMode(v)}
                >
                    <ToggleButton value="defense" >🛡️ Defans</ToggleButton>
                    <ToggleButton value="attack">⚔️ Atak</ToggleButton>

                </ToggleButtonGroup>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: "auto" }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Pokémon</TableCell>
                            {allTypes.map((type) => (
                                <TableCell
                                    key={type}
                                    align="center"
                                    title={type.toUpperCase()}
                                    sx={{
                                        backgroundColor: typeColors(type),
                                        color: "#fff",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                        width: 15,
                                    }}
                                >
                                    {type.toUpperCase().substring(0, 3)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* === EACH POKEMON ROW === */}
                        {team.map((slot, i) => (
                            <TableRow key={i}>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {slot.pokemon ? (
                                            <img
                                                src={slot.sprite || ""}
                                                alt={slot.pokemon}
                                                width={36}
                                                height={36}
                                                style={{ objectFit: "contain" }}
                                            />
                                        ) : null}
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                            {slot.pokemon || `Slot ${i + 1}`}
                                        </Typography>

                                        {slot.types && slot.types.length > 0 ? (
                                            slot.types.map((type) => (
                                                <Box sx={{
                                                    display: "flex", gap: 0.5, backgroundColor: typeColors(type), p: 0.5, borderRadius: 1, color: "#fff", fontWeight: "bold",
                                                    fontSize: "0.75rem"
                                                }} key={type}>
                                                    {type.toUpperCase().substring(0, 3)}
                                                </Box>
                                            ))) : null}
                                    </Box>
                                </TableCell>

                                {allTypes.map((type) => {
                                    const data = mode === "defense" ? slot.defense : slot.attack;
                                    const m = data ? data[type] ?? 1 : 1;
                                    return (
                                        <TableCell
                                            key={type}
                                            align="center"
                                            sx={{
                                                backgroundColor: getColorForMult(m),
                                                color: "#fff",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {m}×
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}

                        {/* === TEAM SUMMARY ROW === */}
                        {flgTeam === true && (
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Takım Özeti</TableCell>
                                {allTypes.map((type) => {
                                    const s = summary[type];
                                    const msg = s
                                        ? `W:${s.weak} R:${s.resist} I:${s.immune}`
                                        : "-";
                                    return (
                                        <TableCell
                                            key={type}
                                            align="center"
                                            sx={{
                                                backgroundColor: s?.weak >= 2
                                                    ? "#d32f2f"
                                                    : s?.weak === 1
                                                        ? "#ef6c00"
                                                        : "#2e7d32",
                                                color: "#ffffffff",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {msg}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* === REPORT LIST === */}

            <Divider sx={{ my: 3 }} />
            {flgTeam && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Zaaf & Avantaj Özeti ({mode === "defense" ? "Defans" : "Atak"})
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {reportList.map(({ type, emoji, text }) => (
                            <Chip
                                key={type}
                                label={`${emoji} ${type.toUpperCase()} — ${text}`}
                                sx={{
                                    backgroundColor: "#000000ff",
                                    color: typeColors(type),
                                    fontWeight: "bold",
                                    borderRadius: "8px",
                                }}
                            />
                        ))}
                    </Box>
                </Box>)}
            <Box sx={{ mt: 4 }}>
                <TeamSummaryChart
                    defenseSummary={defenseSummary}
                    attackSummary={attackSummary}
                />
            </Box>
            {flgTeam && (
                <Box sx={{ mt: 4 }}>
                    <TeamSynergy synergy={synergy} />
                </Box>
            )}
        </Box >

    );
};

export default TeamMatrix;

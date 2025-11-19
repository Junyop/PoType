import React from "react";
import { useSelector } from "react-redux";
import {
    Box,
    Paper,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Divider,
} from "@mui/material";
import calculateTeamAnalysis from "../utils/calculateTeamAnalysis";
import typeColors from "../utils/typeColors";

const TeamSynergy = () => {
    const team = useSelector((state) => state.teamBuilder.team);

    const teamData = calculateTeamAnalysis(team);
    const allTypes = Object.keys(teamData.attack);

    // Hücreye koşullu stil uygulayan yardımcı fonksiyon
    const getCellStyle = (value, isAttack = false) => {
        const val = parseFloat(value);
        if (val === 0) return { bgcolor: "#333", color: "white", fontWeight: "bold" }; // Bağışıklık

        // Saldırı (Attack) Renklendirmesi
        if (isAttack) {
            if (val >= 2.0) return { bgcolor: "#4CAF50", color: "white", fontWeight: "bold" }; // 2x Veya Üzeri (Süper Etkili Kapsama)
            if (val <= 0.5) return { bgcolor: "#FF5722", color: "white" }; // 0.5x Veya Altı (Kötü Kapsama)
        }
        // Savunma (Defense) Renklendirmesi
        else {
            if (val >= 1.5) return { bgcolor: "#F44336", color: "white", fontWeight: "bold" }; // Zayıflık (1.5x, 2x, 4x)
            if (val <= 0.5) return { bgcolor: "#4CAF50", color: "white", fontWeight: "bold" }; // Direnç (0.5x, 0.25x)
            if (val > 1.0 && val < 1.5) return { bgcolor: "#FFC107", color: "black" }; // Hafif Zayıflık
        }
        return {}; // Normal
    };

    return (
        <Box sx={{ mt: 4, px: 2 }}>
            <Typography
                variant="h4"
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}
            >
                🔍 Takım Sinerjisi Analizi
            </Typography>

            {/* 📊 Genel Tablo */}
            <Paper
                elevation={4}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    mb: 4,
                    p: 2,
                    bgcolor: "background.paper",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: "bold", color: "secondary.main" }}
                >
                    🧮 Genel Etkinlik Tablosu
                </Typography>

                <Grid container spacing={2}>
                    {/* ÖZET KISMI */}
                    <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 2, bgcolor: "#f0f0f0" }}>
                            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                Savunma Özeti (Ortalama Direnç)
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                                <Typography component="span" fontWeight="bold" color="green">
                                    Dirençli Tipler (&lt; 0.74):
                                </Typography>
                                {teamData.summary.strongAgainst.length > 0 ? (
                                    teamData.summary.strongAgainst.map((type) => (
                                        <Chip key={`strong-${type}`} label={type} size="small" sx={{ ml: 1, bgcolor: typeColors(type), color: 'white' }} />
                                    ))
                                ) : (
                                    <Typography component="span" sx={{ ml: 1 }}>Yok</Typography>
                                )}
                            </Box>
                            <Box sx={{ mb: 1 }}>
                                <Typography component="span" fontWeight="bold" color="red">
                                    Zayıf Tipler (&gt; 1.26):
                                </Typography>
                                {teamData.summary.weakAgainst.length > 0 ? (
                                    teamData.summary.weakAgainst.map((type) => (
                                        <Chip key={`weak-${type}`} label={type} size="small" sx={{ ml: 1, bgcolor: typeColors(type), color: 'white' }} />
                                    ))
                                ) : (
                                    <Typography component="span" sx={{ ml: 1 }}>Yok</Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Düşman Tipi</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Atak Gücü (Max Kapsama)
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Defans Direnci (Ortalama Hasar)
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allTypes.map((type) => (
                            <TableRow key={type}>
                                <TableCell>
                                    <Chip
                                        label={type}
                                        sx={{
                                            bgcolor: typeColors(type),
                                            color: "white",
                                            fontWeight: "bold",
                                            textTransform: "capitalize",
                                        }}
                                    />
                                </TableCell>
                                {/* Atak Gücü */}
                                <TableCell
                                    align="center"
                                    sx={getCellStyle(teamData.attack[type], true)}
                                >
                                    {teamData.attack[type]}x
                                </TableCell>
                                {/* Defans Direnci */}
                                <TableCell
                                    align="center"
                                    sx={getCellStyle(teamData.defense[type], false)}
                                >
                                    {teamData.defense[type]}x
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Divider sx={{ my: 4 }} />
        </Box>
    );
};

export default TeamSynergy;
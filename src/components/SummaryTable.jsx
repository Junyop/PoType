import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Grid,
    Divider,

} from "@mui/material";

import PowerPieChart from "./PowerPieChart";
import SmartAlerts from "./SmartAlerts";
import TypeBadge from "./TypeBadge";

import typeChart from "../data/typeChart.json";
import { getCoverageGaps } from "../utils/coverageUtils";
import { getStackedWeaknesses } from "../utils/weaknessUtils";
import { analyzeCounter } from "../utils/counterUtils";
import { groupEffectiveness } from "../utils/effectivenessUtils";

//
// 🔹 Yardımcı Fonksiyon: Takım genel etkilerini birleştir
//
const mergeEffectiveness = (team, field) => {
    const result = {};
    team.forEach((slot) => {
        const eff = slot[field] || {};
        for (const [type, mult] of Object.entries(eff)) {
            result[type] = (result[type] || 0) + (mult > 1 ? 1 : mult === 0 ? -1 : 0);
        }
    });
    return result;
};

//
// 🔹 Ana Bileşen
//
const SummaryTable = ({ team }) => {
    const gaps = getCoverageGaps(team);
    const stackedWeaknesses = getStackedWeaknesses(team);
    const targetTypes = ["dragon", "flying"];
    const counterReport = analyzeCounter(team, targetTypes, typeChart);

    const attackSum = mergeEffectiveness(team, "attack");
    const defenseSum = mergeEffectiveness(team, "defense");

    //
    // 🔸 Tablo satırlarını oluştur
    //
    const renderRows = (obj) =>
        Object.entries(obj)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
                <TableRow key={type}>
                    <TableCell>
                        <TypeBadge type={type} />
                    </TableCell>
                    <TableCell>
                        {count > 0
                            ? `${count}x avantaj`
                            : count < 0
                                ? `${Math.abs(count)}x zaaf`
                                : "nötr"}
                    </TableCell>
                </TableRow>
            ));

    //
    // 🔸 Boş takım kontrolü
    //
    const isEmptyTeam = team.every(
        (slot) => !slot.types || slot.types.length === 0
    );
    if (isEmptyTeam)
        return (
            <Paper
                sx={{
                    p: 3,
                    mt: 4,
                    textAlign: "center",
                    backgroundColor: "#fafafa",
                    border: "1px dashed #ccc",
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    👀 Henüz takım oluşturulmadı.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Ekleyeceğin Pokémon’ların tip kombinasyonlarını buradan analiz
                    edebilirsin.
                </Typography>
            </Paper>
        );

    //
    // 🔹 Render
    //
    return (
        <Box sx={{ mt: 4 }}>
            {/* Başlık */}
            <Typography
                variant="h5"
                sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
            >
                📊 Takım Özeti
            </Typography>

            {/* Pie Chart */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <PowerPieChart team={team} />
            </Paper>

            {/* Akıllı Uyarılar */}
            <SmartAlerts
                coverageGaps={gaps}
                stackedWeaknesses={stackedWeaknesses}
                counterReport={counterReport}
            />

            {/* Analiz Grid */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Saldırı Tablosu */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        🗡️ Saldırı Gücü
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tip</TableCell>
                                    <TableCell>Durum</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{renderRows(attackSum)}</TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Savunma Tablosu */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        🛡️ Savunma Zayıflıkları
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tip</TableCell>
                                    <TableCell>Durum</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{renderRows(defenseSum)}</TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Coverage ve Counter Bilgileri */}
            <Box sx={{ mt: 2 }}>
                {gaps.length > 0 && (
                    <>
                        <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                            ⚠️ Eksik Saldırı Kapsamı
                        </Typography>
                        <Typography variant="body2">
                            Aşağıdaki tiplere karşı süper etkili saldırın yok:{" "}
                            <b>{gaps.join(", ")}</b>
                        </Typography>
                    </>
                )}

                {stackedWeaknesses.length > 0 && (
                    <>
                        <Typography variant="h6" sx={{ mt: 3 }}>
                            ⚠️ Yinelenen Zayıflıklar
                        </Typography>
                        <ul style={{ paddingLeft: "20px", margin: 0 }}>
                            {stackedWeaknesses.map(({ type, count }) => (
                                <li
                                    key={type}
                                    style={{
                                        color: count >= 3 ? "#d32f2f" : "#ed6c02",
                                        marginBottom: 4,
                                    }}
                                >
                                    <b>{count}</b> üye <b>{type}</b> tipine karşı zayıf.
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <Typography variant="h6" sx={{ mt: 4 }}>
                    🐉 Counter Check: Dragonite (Dragon + Flying)
                </Typography>
                <Typography variant="body2">
                    {counterReport.offensiveCoverage} üye Dragonite’a süper etkili
                    saldırabiliyor. <br />
                    {counterReport.defensiveWeakness} üye onun saldırılarına zayıf.
                </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Özet Renkli Tip Grupları */}
            <Grid container spacing={2}>
                {/* Saldırı */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        🗡️ Saldırı Etkinliği
                    </Typography>
                    {Object.entries(groupEffectiveness(attackSum)).map(
                        ([label, types]) =>
                            types.length > 0 && (
                                <Box key={label} sx={{ mt: 1 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: "bold", color: "text.secondary" }}
                                    >
                                        {label}
                                    </Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                                        {types.map((t) => (
                                            <TypeBadge key={t} type={t} />
                                        ))}
                                    </Box>
                                </Box>
                            )
                    )}
                </Grid>

                {/* Savunma */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        🛡️ Savunma Direnci
                    </Typography>
                    {Object.entries(groupEffectiveness(defenseSum)).map(
                        ([label, types]) =>
                            types.length > 0 && (
                                <Box key={label} sx={{ mt: 1 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: "bold", color: "text.secondary" }}
                                    >
                                        {label}
                                    </Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                                        {types.map((t) => (
                                            <TypeBadge key={t} type={t} />
                                        ))}
                                    </Box>
                                </Box>
                            )
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default SummaryTable;

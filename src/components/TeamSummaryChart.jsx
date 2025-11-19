import React, { useState } from "react";
import { Box, Typography, Paper, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const TeamSummaryChart = ({ defenseSummary, attackSummary }) => {
    const [mode, setMode] = useState("defense");

    const currentData = mode === "defense" ? defenseSummary : attackSummary;

    if (!currentData) return null;

    const chartData = Object.entries(currentData).map(([type, data]) => ({
        type,
        Zayıf: data.weak || 0,
        Dirençli: data.resist || 0,
        Bağışık: data.immune || 0,
    }));

    const totalWeak = chartData.reduce((acc, t) => acc + t.Zayıf, 0);
    const totalResist = chartData.reduce((acc, t) => acc + t.Dirençli, 0);
    const totalImmune = chartData.reduce((acc, t) => acc + t.Bağışık, 0);

    const title = mode === "defense" ? "🛡️ Defans Analizi" : "⚔️ Atak Analizi";

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">{title}</Typography>

                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(e, val) => val && setMode(val)}
                    size="small"
                >
                    <ToggleButton value="defense">🛡️ Defans</ToggleButton>
                    <ToggleButton value="attack">⚔️ Atak</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, bgcolor: "#d32f2f", color: "white", textAlign: "center" }}>
                        <Typography variant="h5" fontWeight="bold">{totalWeak}</Typography>
                        <Typography variant="body2">{mode === "defense" ? "Toplam Zayıflık" : "Zayıf Saldırı"}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, bgcolor: "#2e7d32", color: "white", textAlign: "center" }}>
                        <Typography variant="h5" fontWeight="bold">{totalResist}</Typography>
                        <Typography variant="body2">{mode === "defense" ? "Toplam Direnç" : "Etkili Saldırı"}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, bgcolor: "#424242", color: "white", textAlign: "center" }}>
                        <Typography variant="h5" fontWeight="bold">{totalImmune}</Typography>
                        <Typography variant="body2">{mode === "defense" ? "Toplam Bağışıklık" : "Etkisiz Saldırı"}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ p: 2 }}>
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Zayıf" stackId="a" fill="#d32f2f" />
                        <Bar dataKey="Dirençli" stackId="a" fill="#2e7d32" />
                        <Bar dataKey="Bağışık" stackId="a" fill="#424242" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default TeamSummaryChart;

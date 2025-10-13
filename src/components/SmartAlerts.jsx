import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SmartAlerts = ({ coverageGaps, stackedWeaknesses, counterReport }) => {
    const alerts = [];

    // 🔴 1. Coverage Eksikleri
    if (coverageGaps.length > 0) {
        alerts.push({
            level: 'error',
            title: 'Coverage Gaps',
            message: `No super-effective moves against: ${coverageGaps.join(', ')}`
        });
    }

    // 🟠 2. Zayıflık Tekrarı
    stackedWeaknesses.forEach(({ type, count }) => {
        alerts.push({
            level: count >= 3 ? 'error' : 'warning',
            title: 'Stacked Weakness',
            message: `${count} members are weak to ${type}`
        });
    });

    // 🟠 3. Counter Check: Dragonite
    if (counterReport) {
        const { offensiveCoverage, defensiveWeakness, teamSize } = counterReport;

        if (offensiveCoverage === 0) {
            alerts.push({
                level: 'error',
                title: 'No Offensive Threat to Dragonite',
                message: `None of your members can hit Dragonite effectively.`
            });
        } else if (offensiveCoverage < Math.ceil(teamSize / 2)) {
            alerts.push({
                level: 'warning',
                title: 'Limited Offensive Threat to Dragonite',
                message: `${offensiveCoverage} member(s) can hit Dragonite effectively.`
            });
        }

        if (defensiveWeakness >= 3) {
            alerts.push({
                level: 'error',
                title: 'Too Many Members Weak to Dragonite',
                message: `${defensiveWeakness} member(s) are weak to Dragonite’s typical moves.`
            });
        }
    }

    if (alerts.length === 0) {
        alerts.push({
            level: 'success',
            title: 'Solid Team!',
            message: 'No major weaknesses detected.'
        });
    }

    const getColor = (level) => {
        if (level === 'error') return '#f44336';
        if (level === 'warning') return '#ff9800';
        return '#4caf50';
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Smart Team Warnings
            </Typography>
            {alerts.map((alert, index) => (
                <Paper
                    key={index}
                    elevation={3}
                    sx={{
                        p: 2,
                        mb: 2,
                        borderLeft: `6px solid ${getColor(alert.level)}`
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {alert.title}
                    </Typography>
                    <Typography>{alert.message}</Typography>
                </Paper>
            ))}
        </Box>
    );
};

export default SmartAlerts;

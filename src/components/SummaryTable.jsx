import React from 'react';
import { getCoverageGaps } from '../utils/coverageUtils';
import { getStackedWeaknesses } from '../utils/weaknessUtils';
import PowerPieChart from './PowerPieChart';
import { analyzeCounter } from '../utils/counterUtils';
import typeChart from '../data/typeChart.json';
import SmartAlerts from './SmartAlerts';
import { groupEffectiveness } from '../utils/effectivenessUtils';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography
} from '@mui/material';

import { Box } from '@mui/system';
import TypeBadge from './TypeBadge';

const mergeEffectiveness = (team, field) => {
    const result = {};
    team.forEach((slot) => {
        const eff = slot[field];
        for (const [type, multiplier] of Object.entries(eff)) {
            result[type] = (result[type] || 0) + (multiplier > 1 ? 1 : multiplier === 0 ? -1 : 0);
        }
    });
    return result;
};


const SummaryTable = ({ team }) => {
    const gaps = getCoverageGaps(team);
    const stackedWeaknesses = getStackedWeaknesses(team);
    const targetTypes = ['dragon', 'flying'];
    const counterReport = analyzeCounter(team, targetTypes, typeChart);


    const attackSum = mergeEffectiveness(team, 'attack');
    const defenseSum = mergeEffectiveness(team, 'defense');

    const renderRows = (obj) =>
        Object.entries(obj)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
                <TableRow key={type}>
                    <TableCell>{type}</TableCell>
                    <TableCell>{count > 0 ? `${count}x avantaj` : count < 0 ? `${Math.abs(count)}x zaaf` : 'nötr'}</TableCell>
                </TableRow>
            ));

    return (
        <div>

            <Typography variant="h5" sx={{ mt: 4 }}>Team Summary</Typography>
            <PowerPieChart team={team} />

            <SmartAlerts
                coverageGaps={gaps}
                stackedWeaknesses={stackedWeaknesses}
                counterReport={counterReport}
            />


            <Typography variant="h6" sx={{ mt: 2 }}>Attack Potential</Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderRows(attackSum)}</TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6">Defense Weaknesses</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderRows(defenseSum)}</TableBody>
                </Table>
            </TableContainer>
            {gaps.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ mt: 4, color: 'error.main' }}>
                        ⚠️ No Effective Attack Against:
                    </Typography>
                    <Typography>{gaps.join(', ')}</Typography>
                </>
            )}
            {stackedWeaknesses.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ mt: 4 }}>
                        ⚠️ Stacked Weaknesses
                    </Typography>
                    <ul style={{ paddingLeft: '20px' }}>
                        {stackedWeaknesses.map(({ type, count }) => (
                            <li
                                key={type}
                                style={{ color: count >= 3 ? '#d32f2f' : '#ed6c02' }} // kırmızı veya sarı
                            >
                                {count} member{count > 1 ? 's' : ''} are weak to <b>{type}</b>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <Typography variant="h6" sx={{ mt: 4 }}>
                🛡️ Counter Check: Dragonite (dragon + flying)
            </Typography>
            <Typography>
                {counterReport.offensiveCoverage} member(s) can hit effectively. <br />
                {counterReport.defensiveWeakness} member(s) are weak to its attacks.
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, mt: 4 }}>
                {/* Attack */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">🗡️ Attack Effectiveness</Typography>
                    {Object.entries(groupEffectiveness(attackSum)).map(([label, types]) => (
                        types.length > 0 && (
                            <Box key={label} sx={{ mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{label}</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {types.map((type) => (
                                        <TypeBadge key={type} type={type} />
                                    ))}
                                </Box>                            </Box>
                        )
                    ))}
                </Box>

                {/* Defense */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">🛡️ Defense Weaknesses</Typography>
                    {Object.entries(groupEffectiveness(defenseSum)).map(([label, types]) => (
                        types.length > 0 && (
                            <Box key={label} sx={{ mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{label}</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {types.map((type) => (
                                        <TypeBadge key={type} type={type} />
                                    ))}
                                </Box>                            </Box>
                        )
                    ))}
                </Box>
            </Box>
        </div>
    );
};

export default SummaryTable;

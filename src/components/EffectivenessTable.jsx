import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography
} from '@mui/material';

const EffectivenessTable = ({ title, effectiveness }) => {
    if (!effectiveness || Object.keys(effectiveness).length === 0) return null;

    const sorted = Object.entries(effectiveness).sort((a, b) => b[1] - a[1]);

    return (
        <TableContainer component={Paper} sx={{ my: 3 }}>
            <Typography variant="h6" sx={{ p: 2 }}>{title}</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Target Type</TableCell>
                        <TableCell>Multiplier</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sorted.map(([type, value]) => (
                        <TableRow key={type}>
                            <TableCell>{type}</TableCell>
                            <TableCell>x{value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EffectivenessTable;

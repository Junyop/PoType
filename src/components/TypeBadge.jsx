import React from 'react';
import { Chip } from '@mui/material';
import { typeColors } from '../utils/typeColors';

const TypeBadge = ({ type }) => {
    return (
        <Chip
            label={type.toUpperCase?.() || type}
            size="small"
            sx={{
                backgroundColor: typeColors[type] || '#9e9e9e',
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }}
        />
    );
};

export default TypeBadge;

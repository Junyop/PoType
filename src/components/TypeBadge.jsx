import React from 'react';
import { Chip } from '@mui/material';
import { typeColors } from '../utils/typeColors';

const TypeBadge = ({ type }) => {
    return (
        <Chip
            label={type.toUpperCase()}
            sx={{
                backgroundColor: typeColors[type] || '#ccc',
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }}
            size="small"
        />
    );
};

export default TypeBadge;

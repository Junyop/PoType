import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};

const getTypeCounts = (team) => {
    const counts = {};
    team.forEach((slot) => {
        slot.types?.forEach((type) => {
            counts[type] = (counts[type] || 0) + 1;
        });
    });

    return Object.entries(counts).map(([type, value]) => ({
        name: type,
        value,
        color: typeColors[type] || '#ccc'
    }));
};

const PowerPieChart = ({ team }) => {
    const data = getTypeCounts(team);

    if (data.length === 0) return null;

    return (
        <div style={{ height: 300 }}>
            <h3>Type Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PowerPieChart;

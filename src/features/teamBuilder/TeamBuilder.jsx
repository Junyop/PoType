import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TeamSlot from '../../components/TeamSlot';
import { resetTeam, setFullTeam } from './teamBuilderSlice';

import {
    Container,
    Grid,
    Button,
    Typography,
    Paper,
    Box,
} from '@mui/material';
import TeamMatrix from '../../components/TeamMatrix';

const TeamBuilder = () => {
    const dispatch = useDispatch();
    const team = useSelector((state) => state.teamBuilder.team);
    const handleExport = () => {
        const blob = new Blob([JSON.stringify(team, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'myTeam.json';
        link.click();
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                dispatch(setFullTeam(data));
            } catch (error) {
                alert('Geçersiz JSON dosyası!\n' + error.message);
            }
        };
        reader.readAsText(file);
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography
                variant="h4"
                align="center"
                fontWeight="bold"
                gutterBottom
                sx={{ color: 'primary.main' }}
            >
                Pokémon Takım Analizörü
            </Typography>

            <Box sx={{
                display: 'flex', justifyContent: 'center', mb: 3

            }}>
                <Button variant="contained" color="secondary" onClick={() => dispatch(resetTeam())} >
                    Takımı Sıfırla
                </Button>
                <Button variant="contained" color="primary" onClick={handleExport} sx={{ mr: 2, ml: 2 }}>
                    Dışa Aktar
                </Button>
                <Button variant="contained" component="label" color="info">
                    İçe Aktar
                    <input
                        type="file"
                        accept=".json"
                        hidden
                        onChange={handleImport}
                    />
                </Button>
            </Box>

            <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
                {team.map((slot, index) => (
                    <Grid item key={index}>
                        <Paper elevation={2}>
                            <TeamSlot slotIndex={index} slot={slot} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {
                (!team.some(slot => slot.pokemon)) &&
                <Typography variant="h6" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                    Lütfen analiz için takımınıza Pokémon veya tip ekleyiniz.
                </Typography>
            }
            {(team.some(slot => slot.pokemon)) &&
                <Box sx={{ mt: 4 }}>
                    <TeamMatrix team={team} flgTeam={true} />
                </Box>
            }
            { }

        </Container>
    );
};

export default TeamBuilder;

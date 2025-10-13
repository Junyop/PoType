import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TeamSlot from '../../components/TeamSlot';
import SummaryTable from '../../components/SummaryTable';
import { resetTeam, reorderTeam } from './teamBuilderSlice';
import { setFullTeam } from './teamBuilderSlice';

import {
    Container,
    Grid,
    Button,
    Typography,
    Paper
} from '@mui/material';
import {
    DragDropContext,
    Droppable,
    Draggable
} from '@hello-pangea/dnd';

const TeamBuilder = () => {
    const dispatch = useDispatch();
    const team = useSelector((state) => state.teamBuilder.team);

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.index === destination.index) return;

        dispatch(reorderTeam({ sourceIndex: source.index, destIndex: destination.index }));
    };

    return (
        <Container sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Team Type Analyzer
            </Typography>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="teamSlots">
                    {(provided) => (
                        <Grid
                            container
                            spacing={2}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {team.map((slot, index) => (
                                <Draggable key={index} draggableId={`slot-${index}`} index={index}>
                                    {(provided) => (
                                        <Grid
                                            item
                                            xs={12}
                                            md={6}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Paper elevation={2} sx={{ p: 1 }}>
                                                <TeamSlot slotIndex={index} slot={slot} />
                                            </Paper>
                                        </Grid>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>

            <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 3 }}
                onClick={() => dispatch(resetTeam())}
            >
                Reset Team
            </Button>
            <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 3, ml: 2 }}
                onClick={() => {
                    const blob = new Blob([JSON.stringify(team, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'myTeam.json';
                    link.click();
                }}
            >
                Export Team
            </Button>

            <Button
                variant="outlined"
                color="primary"
                component="label"
                sx={{ mt: 3, ml: 2 }}
            >
                Import Team
                <input
                    type="file"
                    accept=".json"
                    hidden
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            try {
                                const data = JSON.parse(event.target.result);
                                dispatch(setFullTeam(data));
                            } catch (error) {
                                alert('Invalid JSON file!\n' + error.message);
                            }
                        };
                        reader.readAsText(file);
                    }}
                />
            </Button>


            <SummaryTable team={team} />
        </Container>
    );
};

export default TeamBuilder;

import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Divider} from "@mui/material";
import Typography from '@mui/material/Typography';

const Test: React.FC = () => {

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                    m: 1,
                },
            }}
        >
            <Paper >
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="body1">
                            <ul><li>
                                well meaning and kindly.kjsdljkhaSD LKJASHD LKJHA SDLKJH ASLDKJH a lkjh aslkdh
                                <br />
                                {'"a benevolent smile"'}
                            </li>
                            </ul>
                        </Typography>
                        <Divider />
                        <Typography variant="body2">
                            <ul><li>
                            well meaning and kindly.kjsdljkhaSD LKJASHD LKJHA SDLKJH ASLDKJH a lkjh aslkdh
                            <br />
                            {'"a benevolent smile"'}
                            </li>
                            </ul>
                        </Typography>
                    </CardContent>
                    <ul>
                        <li>
                    <Card sx={{ minWidth: 275 }} elevation={2}>
                        <CardContent>
                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                Blah blah blah
                            </Typography>
                        </CardContent>
                    </Card></li>
                    </ul>
                </Card>
            </Paper>
        </Box>
    )
}

export default Test;

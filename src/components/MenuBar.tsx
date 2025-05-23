import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { indigo } from "@mui/material/colors";
import { Link } from 'react-router-dom';

const theme = createTheme({
    palette: {
        primary: {
            main: indigo[500],
        },
        secondary: {
            main: indigo[700],
        },
    },
});

function MenuBar() {
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <Link to={"/cn-visualiser/"}><MenuIcon /></Link>

                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Canton Network Scan "Updates" Visualiser
                    </Typography>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}

export default MenuBar;
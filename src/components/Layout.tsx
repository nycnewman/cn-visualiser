import { Container } from "@mui/material";
import MenuBar from "./MenuBar.tsx";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
    return (
        <Container>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MenuBar/>
                {props.children}
            </LocalizationProvider>
        </Container>
    );
};

export default Layout;
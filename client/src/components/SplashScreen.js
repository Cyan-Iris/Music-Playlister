import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import AuthContext from '../auth';
import { useContext } from 'react'

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    function handleLoginAsGuest(){
        auth.setLoginAsGuest();
    }
    return (
        <div id="splash-screen">
            Playlister
            <div id="comment">
                Music Playlist created by Chenxi Lin
            </div>
            <Stack spacing={2} direction="row"  justifyContent="center" marginTop={10}>
                <Button variant="outlined"><Link to='/login/'>Login</Link></Button>
                <Button variant="outlined"><Link to='/register/'>Create New Account</Link></Button>
                <Button variant="outlined" onClick={handleLoginAsGuest}>Continue as Guest</Button>
            </Stack>
            </div>

    )
}
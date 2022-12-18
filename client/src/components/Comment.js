import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store';

export default function Comment(props) {
    const { store } = useContext(GlobalStoreContext);
    const { comment } = props;

    return (
        <div style={{marginBottom:'20px'}}>
            <ListItem 
            alignItems="flex-start"
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '25pt' }}
            >
                {comment}
            </ListItem>
            <Divider variant="inset" component="li" />
        </div>

    );
}
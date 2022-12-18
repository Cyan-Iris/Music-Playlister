import React, { useContext, useEffect } from 'react'
import {useState} from 'react'
import { GlobalStoreContext } from '../store'
import List from '@mui/material/List';
import Comment from './Comment';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab'
import SendIcon from '@mui/icons-material/Send';
import Divider from '@mui/material/Divider';
import AuthContext from '../auth';

export default function CommentSession() {
    const { store } = useContext(GlobalStoreContext);
    const [comment, setComment ] = useState("");
    const { auth } = useContext(AuthContext);
    let res = store.sessionSelectedList == null ? <div></div> : store.sessionSelectedList.comments.map((comment, index) => (
        <Comment
            comment={comment}
        />
    ))
    function handleSendComment(){
        store.updateComment(comment);
    }
    function handleUpdateComment(event){
        setComment(event.target.value);

    }
    

    return (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <div id='chat-input-box'>
                    <TextField id="outlined" style={{ width: '85%' }}  onChange={handleUpdateComment} disabled={store.sessionSelectedList==null||auth.loginAsGuest||!store.sessionSelectedList.publish}/>
                    <Fab color="inherit" aria-label="add" onClick={handleSendComment} disabled={store.sessionSelectedList==null||auth.loginAsGuest||!store.sessionSelectedList.publish}><SendIcon /></Fab>
                </div>
                <Divider component="li">Comments:</Divider>
                {res}
            </List>


    );
}
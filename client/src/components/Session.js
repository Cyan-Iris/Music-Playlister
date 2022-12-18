import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import Player from './Player';
import CommentSession from './CommentSession';

export default function Session() {
    const { store } = useContext(GlobalStoreContext);
    let res=store.sessionState==null?<div></div>:store.sessionState=="Player"?<Player/>:<CommentSession/>;

    function handleClickPlayer(){
        store.changeSessionState("Player",store.sessionSelectedList);

    }
    function handleClickComment(){
        store.changeSessionState("Comments",store.sessionSelectedList);
    }
    return(
        <div id="session-body">
            <div id="session-header">
                <Button variant="contained"  style={{ background: '#2E3B55' }} onClick={handleClickPlayer}>Player</Button>
                <Button variant="contained"  style={{ background: '#2E3B55' }} onClick={handleClickComment}>Comments</Button>
            </div>
            <div id="content-session">
                {res}
            </div>
           

        </div>

    )
}
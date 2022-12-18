import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import QueueMusic from '@mui/icons-material/QueueMusic';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbDown from '@mui/icons-material/ThumbDown';
import AuthContext from '../auth';




/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    //own code
    const { auth } = useContext(AuthContext);

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }


    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if (store.isNameDuplicate(text)) {
                toggleEdit();
            }
            else {
                let id = event.target.id.substring("list-".length);
                store.changeListName(id, text);
                toggleEdit();
            }
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    //own code
    function handleClickSelectedSong(event, id) {
        event.stopPropagation();
        store.changeSelectSession(id);

    }
    function handleChangeUpvoteNumber(event, id) {
        event.stopPropagation();
        store.ChangeUpVoteNumber(id,auth.user.firstName+" "+auth.user.lastName);
    }

    function handleChangeDownVoteNumber(event, id) {
        event.stopPropagation();
        store.ChangeDownVoteNumber(id,auth.user.firstName+" "+auth.user.lastName);
    }



    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let cardElement = store.sessionSelectedList != null && store.sessionSelectedList._id == idNamePair._id ?
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '25pt', backgroundColor: '#9f98f0' }}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }}
        >
            <Box sx={{ p: 1, flexGrow: 1 }}>
                {idNamePair.name}
                <div style={{ fontSize: '12pt' }}>
                    {new Date(idNamePair.createTime).toString().split("GMT")[0]}
                </div>
                <div style={{ fontSize: '12pt' }}>
                    by:{idNamePair.authorName}
                </div>
                <div style={{ fontSize: '12pt' }}>
                    view:{idNamePair.view}
                </div>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton aria-label='edit' 
                onClick={(event) => { handleChangeUpvoteNumber(event, idNamePair._id) }}
                disabled={auth.loginAsGuest}
                >
                    <ThumbUp style={{ fontSize: '20pt' }} />
                </IconButton>
                <span id="thumbUp-count">{idNamePair.upVote.length}</span>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => { handleChangeDownVoteNumber(event, idNamePair._id) }} aria-label='edit'
                disabled={auth.loginAsGuest}
                >
                    <ThumbDown style={{ fontSize: '20pt' }} />
                </IconButton>
                <span id="thumbDown-count">{idNamePair.downVote.length}</span>
            </Box>

            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleToggleEdit} aria-label='edit'
                disabled={auth.loginAsGuest||auth.user.firstName+' '+auth.user.lastName!=idNamePair.authorName}
                >
                    <EditIcon style={{ fontSize: '20pt' }} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }} aria-label='delete'
                disabled={auth.loginAsGuest||auth.user.firstName+' '+auth.user.lastName!=idNamePair.authorName}
                >
                    <DeleteIcon style={{ fontSize: '20pt' }} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                    handleClickSelectedSong(event, idNamePair._id)
                }}>
                    <QueueMusic style={{ fontSize: '20pt' }}></QueueMusic>
                </IconButton>
            </Box>
        </ListItem>
        : idNamePair.publish ?
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ marginTop: '15px', display: 'flex', p: 1 }}
                style={{ width: '100%', fontSize: '25pt' }}
                button
                onClick={(event) => {
                    handleLoadList(event, idNamePair._id)
                }}
            >
                <Box sx={{ p: 1, flexGrow: 1 }}>
                    {idNamePair.name}
                    <div style={{ fontSize: '12pt' }}>
                        {new Date(idNamePair.createTime).toString().split("GMT")[0]}
                    </div>
                    <div style={{ fontSize: '12pt' }}>
                        by:{idNamePair.authorName}
                    </div>
                    <div style={{ fontSize: '12pt' }}>
                        view:{idNamePair.view}
                    </div>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton 
                    onClick={(event) => { handleChangeUpvoteNumber(event, idNamePair._id) }} 
                    aria-label='edit'
                    disabled={auth.loginAsGuest}
                    >
                        <ThumbUp style={{ fontSize: '20pt' }} />
                    </IconButton>
                    <span id="thumbUp-count">{idNamePair.upVote.length}</span>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton 
                    onClick={(event) => { handleChangeDownVoteNumber(event, idNamePair._id) }}
                     aria-label='edit'
                     disabled={auth.loginAsGuest}
                     >
                        <ThumbDown style={{ fontSize: '20pt' }} />
                    </IconButton>
                    <span id="thumbDown-count">{idNamePair.downVote.length}</span>
                </Box>

                <Box sx={{ p: 1 }}>
                    <IconButton onClick={handleToggleEdit} aria-label='edit'
                    disabled={auth.loginAsGuest||auth.user.firstName+' '+auth.user.lastName!=idNamePair.authorName}
                    >
                        <EditIcon style={{ fontSize: '20pt' }} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'
                    disabled={auth.loginAsGuest||auth.user.firstName+' '+auth.user.lastName!=idNamePair.authorName}
                    >
                        <DeleteIcon style={{ fontSize: '20pt' }} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                        handleClickSelectedSong(event, idNamePair._id)
                    }}>
                        <QueueMusic style={{ fontSize: '20pt' }}></QueueMusic>
                    </IconButton>
                </Box>
            </ListItem>
            //list is not selected but published
            :
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ marginTop: '15px', display: 'flex', p: 1 }}
                style={{ width: '100%', fontSize: '25pt', backgroundColor: '#eeeedd' }}
                button
                onClick={(event) => {
                    handleLoadList(event, idNamePair._id)
                }}
            >
                <Box sx={{ p: 1, flexGrow: 1 }}>
                    {idNamePair.name}
                    <div style={{ fontSize: '12pt' }}>
                        {new Date(idNamePair.createTime).toString().split("GMT")[0]}
                    </div>
                    <div style={{ fontSize: '12pt' }}>
                        by:{idNamePair.authorName}
                    </div>
                    <div style={{ fontSize: '12pt' }}>
                        view:{idNamePair.view}
                    </div>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton 
                    onClick={(event) => { handleChangeUpvoteNumber(event, idNamePair._id) }}
                    disabled={auth.loginAsGuest}
                     aria-label='edit'>
                        <ThumbUp style={{ fontSize: '20pt' }} />
                    </IconButton>
                    <span id="thumbUp-count">{idNamePair.upVote.length}</span>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton 
                    onClick={(event) => { handleChangeDownVoteNumber(event, idNamePair._id) }}
                    disabled={auth.loginAsGuest}
                     aria-label='edit'>
                        <ThumbDown style={{ fontSize: '20pt' }} />
                    </IconButton>
                    <span id="thumbDown-count">{idNamePair.downVote.length}</span>
                </Box>

                <Box sx={{ p: 1 }}>
                    <IconButton onClick={handleToggleEdit} aria-label='edit'
                    disabled={auth.loginAsGuest||auth.user.firstName+' '+auth.user.lastName!=idNamePair.authorName}
                    >
                        <EditIcon style={{ fontSize: '20pt' }} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'
                    disabled={auth.loginAsGuest||auth.user.firstName+' '+auth.user.lastName!=idNamePair.authorName}
                    >
                        <DeleteIcon style={{ fontSize: '20pt' }} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                        handleClickSelectedSong(event, idNamePair._id)
                    }}>
                        <QueueMusic style={{ fontSize: '20pt' }}></QueueMusic>
                    </IconButton>
                </Box>
            </ListItem>
    //list is not publish




    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{ style: { fontSize: 48 } }}
                InputLabelProps={{ style: { fontSize: 24 } }}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;
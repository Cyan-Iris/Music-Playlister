import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Button from '@mui/material/Button';
import Home from '@mui/icons-material/Home';
import People from '@mui/icons-material/People';
import Person from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';
import Publish from '@mui/icons-material/Publish';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Sort from '@mui/icons-material/Sort';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { breakpoints } from '@mui/system';


/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const [searchText, setSearchText ] = useState("");
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);


    //own code

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const sortMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={sortByName}>Name</MenuItem>
            <MenuItem onClick={sortByPublishDate}>Publish Date</MenuItem>
            <MenuItem onClick={sortByView}>View</MenuItem>
            <MenuItem onClick={sortByLike}>Likes</MenuItem>
            <MenuItem onClick={sortByDisLike}>Dislikes</MenuItem>
        </Menu>
    );
    function sortByName() {
        store.sortByName();
    }
    function sortByPublishDate(){
        store.sortByPublishDate();
    }
    function sortByView(){
        store.sortByView();
    }

    function sortByLike(){
        store.sortByLike();
    }
    
    function sortByDisLike(){
        store.sortByDisLike();
    }


    function dummyFunction(){

    }





    function searchByCurrentList() {
        store.searchByCurrentList(searchText);
    }
    function searchByAllList() {
        store.searchByAllList(searchText);
    }
    function searchByUserName() {
        store.searchByUserName(searchText);
    }

    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        store.closeCurrentList();
    }

    //own code
    function handlePublishList() {
        store.currentList.publish = true;
        for(let i=0;i<store.idNamePairs.length;i++){
            if(store.idNamePairs[i]._id==store.currentList._id){
                store.idNamePairs[i].publish=true;
                break;
            }
        }
        if(store.sessionSelectedList!=null&&store.currentList._id==store.sessionSelectedList._id){
            store.sessionSelectedList.publish=true;
        }
        store.updateCurrentList();
    }
    function handleCopyContent() {
        store.copyCurrentList();

    }

    function handleUpdateSearchText(event){
        setSearchText(event.target.value);
    }




    let loginAsGuest = auth.loginAsGuest;
    let value = null;
    value = store.currentList ?
        <div id="edit-toolbar">
            <Button
                disabled={loginAsGuest}
                color="inherit"
                id='copy-list-button'
                onClick={handleCopyContent}
                variant="contained">
                <ContentCopy />
            </Button>
            <Button
                color="inherit"
                disabled={!store.canPublish() || loginAsGuest||store.currentList.authorName!=auth.user.firstName+' '+auth.user.lastName}
                id='publish-list-button'
                onClick={handlePublishList}
                variant="contained">
                <Publish />
            </Button>
            <Button
                color="inherit"
                disabled={!store.canAddNewSong() || loginAsGuest||store.currentList.authorName!=auth.user.firstName+' '+auth.user.lastName}
                id='add-song-button'
                onClick={handleAddNewSong}
                variant="contained">
                <AddIcon />
            </Button>
            <Button
                color="inherit"
                disabled={!store.canUndo() || loginAsGuest||store.currentList.authorName!=auth.user.firstName+' '+auth.user.lastName}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                <UndoIcon />
            </Button>
            <Button
                color="inherit"
                disabled={!store.canRedo() || loginAsGuest||store.currentList.authorName!=auth.user.firstName+' '+auth.user.lastName}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                <RedoIcon />
            </Button>
            <Button
                color="inherit"
                disabled={!store.canClose()}
                id='close-button'
                onClick={handleClose}
                variant="contained">
                <CloseIcon />
            </Button>
        </div>
        :
        <Stack spacing={2} direction="row" justifyContent="center" >
            <Button
                color={store.onSearchButton=="SEARCH_BY_CURRENT_LIST"?"primary":"inherit"}
                disabled={auth.loginAsGuest}
                onClick={searchByCurrentList}
                variant="contained">
                <Home />
            </Button>
            <Button
                color={store.onSearchButton=="SEARCH_BY_ALL_LIST"?"primary":"inherit"}
                onClick={searchByAllList}
                variant="contained">
                <People />
            </Button>
            <Button
                color={store.onSearchButton=="SEARCH_BY_USER_NAME"?"primary":"inherit"}
                onClick={searchByUserName}
                variant="contained">
                <Person />
            </Button>
            <TextField id="outlined-basic" onChange={handleUpdateSearchText} label="Enter Your Search" variant="standard" style={{ backgroundColor: 'white' }} />
            <div style={{ fontSize: '20pt', marginLeft: '20%' }}>SORT BY</div>
            <Button
                size="large"
                edge="end"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
                <Sort />
            </Button>
            {
                sortMenu
            }
        </Stack>



    return (
        value
    );
}

export default EditToolbar;
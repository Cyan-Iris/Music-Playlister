import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    CHANGE_SESSION_STATE: "CHANGE_SESSION_STATE",
    UPDATE_CURRENT_PLAYER: 'UPDATE_CURRENT_PLAYER',
    DEFAULT_LOGIN_SCREEN: 'DEFAULT_LOGIN_SCREEN'
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE: "NONE",
    DELETE_LIST: "DELETE_LIST",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        idNamePairs: [],
        //in here idNamePairs=[_id,name, upvote,downvote, publish?]
        currentList: null,
        currentSongIndex: -1,
        currentSong: null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        //own code
        sessionState: null,
        sessionSelectedList: null,
        currentVideo: null,
        onSearchButton: null,
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: store.currentVideo,
                    onSearchButton: store.onSearchButton,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: store.currentVideo,
                    onSearchButton: store.onSearchButton,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.newIdNamePair,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: payload.value + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: store.currentVideo,
                    onSearchButton: store.onSearchButton,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.list,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: store.currentVideo,
                    onSearchButton: payload.state
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal: CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: store.currentVideo,
                    onSearchButton: store.onSearchButton,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: store.currentVideo,
                    onSearchButton: store.onSearchButton,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: store.currentVideo,
                    onSearchButton: store.onSearchButton,
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal: CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: store.currentVideo,
                    onSearchButton: store.onSearchButton,
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal: CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: store.currentVideo,
                    onSearchButton: store.onSearchButton,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: store.currentVideo,
                    onSearchButton: store.onSearchButton,
                });
            }
            //own code
            //change CHANGE_SESSION_STATE
            case GlobalStoreActionType.CHANGE_SESSION_STATE: {
                return setStore({
                    currentModal: store.currentModal,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    sessionState: payload.state,
                    sessionSelectedList: payload.list,
                    currentVideo: store.currentVideo,
                    onSearchButton: store.onSearchButton,
                });
            }
            case GlobalStoreActionType.UPDATE_CURRENT_PLAYER: {
                return setStore({
                    currentModal: store.currentModal,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    sessionState: store.sessionState,
                    sessionSelectedList: store.sessionSelectedList,
                    currentVideo: payload.video,
                    onSearchButton: store.onSearchButton,

                });
            }
            case GlobalStoreActionType.DEFAULT_LOGIN_SCREEN: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: [],
                    //in here idNamePairs=[_id,name, upvote,downvote, publish?]
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: 0,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    //own code
                    sessionState: null,
                    sessionSelectedList: null,
                    currentVideo: null,
                    onSearchButton: null,
                })
            }

            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    //own code
    // in here, CHANGE_LIST_NAME can be reused
    store.ChangeUpVoteNumber = function (id, authorName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (playlist.upVote.indexOf(authorName) >= 0) {
                    playlist.upVote.splice(playlist.upVote.indexOf(authorName), 1);
                    for (let i = 0; i < store.idNamePairs.length; i++) {
                        if (store.idNamePairs[i]._id == id) {
                            store.idNamePairs[i].upVote.splice(store.idNamePairs[i].upVote.indexOf(authorName), 1);
                            break;
                        }
                    }
                }
                else {
                    playlist.upVote.push(authorName);
                    for (let i = 0; i < store.idNamePairs.length; i++) {
                        if (store.idNamePairs[i]._id == id) {
                            store.idNamePairs[i].upVote.push(authorName);
                        }
                    }
                }
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: { list: store.idNamePairs, state: store.onSearchButton },
                        })
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    store.ChangeDownVoteNumber = function (id, authorName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (playlist.downVote.indexOf(authorName) >= 0) {
                    playlist.downVote.splice(playlist.downVote.indexOf(authorName), 1);
                    for (let i = 0; i < store.idNamePairs.length; i++) {
                        if (store.idNamePairs[i]._id == id) {
                            store.idNamePairs[i].downVote.splice(store.idNamePairs[i].downVote.indexOf(authorName), 1);
                            break;
                        }
                    }
                }
                else {
                    playlist.downVote.push(authorName);
                    for (let i = 0; i < store.idNamePairs.length; i++) {
                        if (store.idNamePairs[i]._id == id) {
                            store.idNamePairs[i].downVote.push(authorName);
                        }
                    }
                }
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: { list: store.idNamePairs, state: store.onSearchButton }
                        })
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }






    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        // store.loadIdNamePairs();
        // directly load the IdNamePairs

        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: null
        });
        tps.clearAllTransactions();
        // history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let value = store.newListCounter;
        // own code
        //find the unique default name
        let duplicatedName = true;
        while (duplicatedName) {
            let i = 0;
            for (; i < store.idNamePairs.length; i++) {
                if (store.idNamePairs[i].name == "Untitled" + value) {
                    value += 1;
                    break;
                }
            }
            duplicatedName = i < store.idNamePairs.length;
        }
        let newListName = "Untitled" + value;

        const response = await api.createPlaylist(newListName, [], auth.user.email, false, [], [], [], new Date().getTime(), auth.user.firstName + " " + auth.user.lastName, 0);
        console.log("createNewList response: " + response);
        if (response.status == 201) {
            tps.clearAllTransactions();
            async function asyncLoadIdNamePairs() {
                const response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: { newIdNamePair: pairsArray, value: value }
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
            asyncLoadIdNamePairs();

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            // history.push("/playlist/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: { list: pairsArray, state: null }
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: { id: id, playlist: playlist }
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function () {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToEdit }
        });
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToRemove }
        });
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }

    //own code
    store.unmarkListForDeletion = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }


    store.isDeleteListModalOpen = () => {
        return store.currentModal == CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal == CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal == CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    // history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }
    store.addNewSong = function () {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function (index, song) {
        let list = store.currentList;
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function (start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function (index) {
        let list = store.currentList;
        list.songs.splice(index, 1);

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function (index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    //own Code
    //updateComment
    store.updateComment = function (comment) {
        store.sessionSelectedList.comments.push(comment);
        if (store.currentList != null) {
            store.currentList.comments.push(comment);
            store.updateCurrentList();
        }
        else {
            async function asyncUpdateCurrentList() {
                const response = await api.updatePlaylistById(store.sessionSelectedList._id, store.sessionSelectedList);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SESSION_STATE,
                        payload: { state: store.sessionState, list: store.sessionSelectedList }
                    });
                }
            }
            asyncUpdateCurrentList();

        }

    }


    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function () {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (store.sessionSelectedList != null && store.currentList._id == store.sessionSelectedList._id) {
                store.sessionSelectedList = store.currentList;
            }
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function () {
        return (store.currentList !== null);
    }

    store.canUndo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function () {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }


    //own code
    store.canPublish = function () {
        return !store.currentList.publish;
    }
    store.changeSessionState = function (state, list) {
        if (state == 'Player' && list != null) {
            store.sessionState = state;
            store.sessionSelectedList = list;
            store.sessionSelectedList.view += 1;
            async function asyncUpdateCurrentList() {
                const response = await api.updatePlaylistById(store.sessionSelectedList._id, store.sessionSelectedList);
                if (response.data.success) {
                    for (let i = 0; i < store.idNamePairs.length; i++) {
                        if (store.idNamePairs[i]._id == store.sessionSelectedList._id) {
                            store.idNamePairs[i].view += 1;
                            break;
                        }
                    }
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: { list: store.idNamePairs, state: store.onSearchButton }
                        });
                    }
                }
            }
            asyncUpdateCurrentList();
        }
        else {
            storeReducer({
                type: GlobalStoreActionType.CHANGE_SESSION_STATE,
                payload: { state: state, list: list },
            })
        }
    }



    store.changeSelectSession = function (id) {
        async function asyncChangeSelectSession(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_SESSION_STATE,
                    payload: { state: store.state, list: playlist }
                });
            }
            else {
                console.log("Fail to find that id");
            }
        }
        asyncChangeSelectSession(id);
    }
    store.updateCurrentVideo = function (player) {
        storeReducer({
            type: GlobalStoreActionType.UPDATE_CURRENT_PLAYER,
            payload: { video: player }
        })

    }
    store.copyCurrentList = async function () {
            const response0 = await api.getPlaylistPairs();
            let pairsArray=null;
            if (response0.data.success) {
                pairsArray = response0.data.idNamePairs;
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }

        let value = 0;
        // own code
        //find the unique default name
        let duplicatedName = true;
        while (duplicatedName) {
            let i = 0;
            for (; i < pairsArray.length; i++) {
                if (pairsArray[i].name == "COPY" + value + "-" + store.currentList.name) {
                    value += 1;
                    break;
                }
            }
            duplicatedName = i < store.idNamePairs.length;
        }
        let newListName = "COPY" + value + "-" + store.currentList.name;
        const response = await api.createPlaylist(newListName, store.currentList.songs, auth.user.email, false, [], [], [], new Date().getTime(), auth.user.firstName + " " + auth.user.lastName, 0);
        console.log("Copy List response: " + response);
        if (response.status == 201) {
            console.log("List is successfully copied");
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            // history.push("/playlist/" + newList._id);
            //if the idNamePair belongs to the user, then add that in
            if (store.onSearchButton == null) {
                async function asyncLoadIdNamePairs() {
                    const response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: { list: pairsArray, state: store.onSearchButton }
                        });
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                }
                asyncLoadIdNamePairs();

            }
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }



    store.setStoreToDefault = function () {
        storeReducer({
            type: GlobalStoreActionType.DEFAULT_LOGIN_SCREEN,
            payload: null
        })
    }

    store.searchByCurrentList = function (searchText) {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                let newIdNamePair = [];
                for (let i = 0; i < pairsArray.length; i++) {
                    if (pairsArray[i].name.startsWith(searchText)) {
                        newIdNamePair.push(pairsArray[i]);
                    }
                }
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: { list: newIdNamePair, state: "SEARCH_BY_CURRENT_LIST" }
                })

            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
        // let newIdNamePair = [];
        // for (let i = 0; i < store.idNamePairs.length; i++) {
        //     if (store.idNamePairs[i].name.startsWith(searchText)) {
        //         newIdNamePair.push(store.idNamePairs[i]);
        //     }
        // }
        // storeReducer({
        //     type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        //     payload: { list: newIdNamePair, state: "SEARCH_BY_CURRENT_LIST" }
        // })
    }

    store.isNameDuplicate = function (name) {
        let i = 0;
        for (; i < store.idNamePairs.length; i++) {
            if (store.idNamePairs[i].name == name) {
                return true;
            }
        }
        return false;
    }

    store.searchByAllList = function (text) {
        async function asyncsearchByAllList(text) {
            let response = await api.getPlaylists();
            if (response.data.success) {
                let list = response.data.data;
                let newIdNamePair = [];
                for (let i = 0; i < list.length; i++) {
                    if (list[i].publish && list[i].name == text) {
                        newIdNamePair.push({
                            _id: list[i]._id,
                            name: list[i].name,
                            upVote: list[i].upVote,
                            downVote: list[i].downVote,
                            publish: list[i].publish,
                            createTime: list[i].createTime,
                            authorName: list[i].authorName,
                            view: list[i].view
                        });
                    }
                }
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: { list: newIdNamePair, state: "SEARCH_BY_ALL_LIST" }
                });
            }
            else {
                console.log("FAIL TO GET THE LIST");
            }
        }
        asyncsearchByAllList(text);

    }
    store.searchByUserName = function (text) {
        async function asyncsearchByUserName(text) {
            let response = await api.getPlaylists();
            if (response.data.success) {
                let list = response.data.data;
                let newIdNamePair = [];
                for (let i = 0; i < list.length; i++) {
                    if (list[i].publish && list[i].authorName == text) {
                        newIdNamePair.push({
                            _id: list[i]._id,
                            name: list[i].name,
                            upVote: list[i].upVote,
                            downVote: list[i].downVote,
                            publish: list[i].publish,
                            createTime: list[i].createTime,
                            authorName: list[i].authorName,
                            view: list[i].view
                        });
                    }
                }
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: { list: newIdNamePair, state: "SEARCH_BY_USER_NAME" }
                });
            }
            else {
                console.log("FAIL TO GET THE LIST");
            }
        }
        asyncsearchByUserName(text);
    }

    store.sortByName = function () {
        let pairsArray = store.idNamePairs;
        pairsArray.sort(
            (a, b) => {
                if (a.name == b.name) {
                    return 0;
                }
                return a.name < b.name ? -1 : 1;
            }
        );
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: { list: pairsArray, state: store.onSearchButton }
        });

    }
    store.sortByPublishDate = function () {
        let pairsArray = store.idNamePairs;
        pairsArray.sort(
            (a, b) => {
                if (a.createTime == b.createTime) {
                    return 0;
                }
                return a.createTime < b.createTime ? -1 : 1;
            }
        );
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: { list: pairsArray, state: store.onSearchButton }
        });

    }

    store.sortByView = function () {
        let pairsArray = store.idNamePairs;
        pairsArray.sort(
            (a, b) => {
                if (a.view == b.view) {
                    return 0;
                }
                return a.view < b.view ? 1 : -1;
            }
        );
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: { list: pairsArray, state: store.onSearchButton }
        });

    }
    store.sortByLike = function () {
        let pairsArray = store.idNamePairs;
        pairsArray.sort(
            (a, b) => {
                if (a.upVote == b.upVote) {
                    return 0;
                }
                return a.upVote < b.upVote ? 1 : -1;
            }
        );
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: { list: pairsArray, state: store.onSearchButton }
        });

    }

    store.sortByDisLike = function () {
        let pairsArray = store.idNamePairs;
        pairsArray.sort(
            (a, b) => {
                if (a.downVote == b.downVote) {
                    return 0;
                }
                return a.downVote < b.downVote ? 1 : -1;
            }
        );
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: { list: pairsArray, state: store.onSearchButton }
        });


    }








    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );

}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
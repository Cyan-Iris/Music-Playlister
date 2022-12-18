

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

export const createPlaylist = (newListName, newSongs, userEmail,isPublish,comments,upVote,downVote,createTime,authorName,view) => {
    return api.post(`/playlist/`, {
        // SPECIFY THE PAYLOAD
        name: newListName,
        songs: newSongs,
        ownerEmail: userEmail,
        publish:isPublish,
        comments:comments,
        upVote:upVote,
        downVote:downVote,
        createTime:createTime,
        authorName:authorName,
        view:view,
    })
}
export const deletePlaylistById = (id) => api.delete(`/playlists/${id}`)
export const deletePlaylist = (id) => api.delete(`/playlist/${id}`)
export const getPlaylistById = (id) => api.get(`/playlist/${id}`)
export const getPlaylistPairs = () => api.get(`/playlistpairs/`)
export const updatePlaylistById = (id, playlist) => {
    return api.put(`/playlist/${id}`, {
        // SPECIFY THE PAYLOAD
        playlist : playlist
    })
}
export const getPlaylists=()=>api.get('/playlists')



const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById,
    getPlaylists,

}

export default apis

const getters = {
    fullScreen(state) {
        return state.fullScreen;
    },
    playList(state) {
        return state.playList;
    },
    sequencesList(state) {
        return state.sequencesList;
    },
    currentIndex(state) {
        return state.currentIndex;
    },
    mode(state) {
        return state.mode;
    },
    currentSong(state) {
        return state.playList[state.currentIndex];
    },
    isLove(state) {
        let isLove = false;
        const currentSong = state.playList[state.currentIndex];
        for (let i = 0; i < state.loveList.length; i += 1) {
            if (currentSong && state.loveList[i].id === currentSong.id) {
                isLove = true;
                return isLove;
            }
        }
        return isLove;
    },
    //获得state中的搜索词并返回。
    searchText(state) {
        return state.searchText;
    },
    //返回播放历史中的数据
    historyList(state) {
        return state.historyList;
    },
    loveList(state) {
        return state.loveList;
    }
};
export default getters;
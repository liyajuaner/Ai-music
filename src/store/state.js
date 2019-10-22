import { playMode } from '../common/js/aliasConfig';

const state = {
    fullScreen: false,
    playList: [],
    sequencesList: [],
    currentIndex: 0,
    mode: playMode.sequence,
    //历史播放记录
    historyList: JSON.parse(localStorage.getItem('HistoryList')) || [],
    //收藏
    loveList: JSON.parse(localStorage.getItem('LoveList')) || [],
    //搜索词
    searchText: JSON.parse(localStorage.getItem('SearchText')) || []
};
export default state;
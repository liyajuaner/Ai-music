const mutations = {
    SET_FULLSCREEN(state, val) {
        state.fullScreen = val;
    },
    SET_PLAY_LIST(state, val) {
        state.playList = val;
    },
    SET_SEQUENCE_LIST(state, val) {
        state.sequencesList = val;
    },
    SET_CURRENT_INDEX(state, val) {
        state.currentIndex = val;
    },
    SET_MODE(state, val) {
        state.mode = val;
    },
    //删除当前播放歌曲
    DEL_FROM_PLAY_LIST(state, val) {
    //根据传递进来的对象，去找到它在它在整个playlist的值。
      const index = state.playList.findIndex(item => item.id === val.delSong.id);
    //根据index的值去删除这一项
      state.playList.splice(index, 1);
      if (val.delSong.id !== val.curSong.id) {
        state.currentIndex = state.playList.findIndex(item => item.id === val.curSong.id);
      }
    },
    //历史播放记录
    SET_HISTORY_LIST(state, val) {//将当前播放歌曲整个对象传入这个方法
    let haveHistory = false;
    //判断当前播放歌曲是否已经存在
    for (let i = 0; i < state.historyList.length; i += 1) {
      if (state.historyList[i].id === val.id) {
          haveHistory = true;
          return;
      }
    }
    if (!haveHistory) {
      state.historyList.push(val);
    }
    localStorage.setItem('HistoryList', JSON.stringify(state.historyList));
  },
    SET_LOVE_LIST(state, val) {
        let haveLove = false;
        for (let i = 0; i < state.loveList.length; i += 1) {
            if (state.loveList[i].id === val.id) {
                haveLove = true;
                return;
            }
        }
        if (!haveLove) {
            state.loveList.push(val);
        }
        localStorage.setItem('LoveList', JSON.stringify(state.loveList));
    },
    DEL_FROM_LOVE_LIST(state, val) {
        const index = state.loveList.findIndex(item => item.id === val.id);
        state.loveList.splice(index, 1);
        localStorage.setItem('LoveList', JSON.stringify(state.loveList));
    },
    //改变搜索词的方法。val代表搜索框中填入的数据信息
    SET_SEARCH_TEXT(state, val) {
        //判断搜索词在存储数据中是否存在
        let haveText = false;
        //遍历存储数据，如果存在就不需要重复的去存储，将状态变为true，跳出循环
        for (let i = 0; i < state.searchText.length; i += 1) {
            if (state.searchText[i] === val.trim()) {
                haveText = true;
                return;
            }
        }
        //如果搜索词在存储数据中不存在
        if (!haveText) {
            //将数据添加到存储数据里面，并且是存储数据的最前面，使用的是unshif方法
            state.searchText.unshift(val);
            //存储数据不能无限存储，最多只能存储10条，所以需要将数据进行截取，截取前面的10条数据。
            state.searchText = state.searchText.slice(0, 10);
        }
        //将数据存储在localstorage中去
        localStorage.setItem('SearchText', JSON.stringify(state.searchText));
    },
    //点击删除关键词的方法
    DEL_FROM_SEARCH_TEXT(state, val) {
        for (let i = 0; i < state.searchText.length; i += 1) {
            if (state.searchText[i] === val.trim()) {
                state.searchText.splice(i, 1);
            }
        }
        //将删除后的数据内容重新存储在localstorage中
        localStorage.setItem('SearchText', JSON.stringify(state.searchText));
    },
    SET_LOVE_LIST(state, val) {
        let haveLove = false;
        for (let i = 0; i < state.loveList.length; i += 1) {
            if (state.loveList[i].id === val.id) {
                haveLove = true;
                return;
            }
        }
        if (!haveLove) {
            state.loveList.push(val);
        }
        localStorage.setItem('LoveList', JSON.stringify(state.loveList));
    },
    DEL_FROM_LOVE_LIST(state, val) {
        const index = state.loveList.findIndex(item => item.id === val.id);
        state.loveList.splice(index, 1);
        localStorage.setItem('LoveList', JSON.stringify(state.loveList));
    },
};
export default mutations;
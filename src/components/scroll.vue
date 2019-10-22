<template>
  <div ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "scroll",
  //通过监测父级传递过来的数据，如果数据发生改变就会调用refresh方法。
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  //dom更新之后再去调用refresh方法
  watch: {
    data(val) {
      this.$nextTick(() => {
        this.refresh();
      });
    }
  },
  //组件挂载的时候，并且是在DOM节点渲染完成之后再去执行initScroll方法
  mounted() {
    // $nextTick回调函数的作用：先要把dom渲染完毕再去调用initScroll方法
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  methods: {
    initScroll() {
      // 判断dom对象是否拿到
      if (!this.$refs.scrollWrapper) return;
      // 传入这个dom对象，实例化/初始化这个组件
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        click: true
      });
    },
    //当DOM结构发生变化的时候，也就是数据变化的时候调用refresh方法，重新计算better-scroll的高度，保证滚动效果正常
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="home">
    <!-- 头部导航 -->
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <span style="line-height:60px;color:white;float:left;margin:0 20px;font-size:20px">句子迷Admin</span>
      <el-menu-item index="1">首页</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">用户管理</el-menu-item>
        <el-menu-item index="2-2">专辑管理</el-menu-item>
        <el-menu-item index="2-3">句子管理</el-menu-item>
        <el-menu-item index="2-4">推荐管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="3">系统设置</el-menu-item>
      <van-image
        round
        fit="contain"
        width="40px"
        height="40px;"
        src="http://www.qiangssvip.com/usr/uploads/2019/05/281426999.jpg"
        style="float:right;top:10px;right:10px;"
      />
    </el-menu>
    <!-- 内容 -->
    <van-row type="flex" justify="space-around">
      <van-col span="20" style="background-color:red;">
        
        <router-view/>
      </van-col>
    </van-row>
    


  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="less">
  // 取消
  body{
    margin: 0px;
    padding: 0px;
  }
  .head{
    width: 100%;
    height: 30px;
    background-color: red;
    
  }

</style>


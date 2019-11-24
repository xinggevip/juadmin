<template>
  <div class="home">
    <!-- 头部导航 -->
    <el-menu
      :default-active="activeIndex2"
      :router="true"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <span style="line-height:60px;color:white;float:left;margin:0 20px;font-size:20px">句子迷Admin</span>
      <el-menu-item index="/">首页</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="/user">用户管理</el-menu-item>
        <el-menu-item index="/album">专辑管理</el-menu-item>
        <el-menu-item index="/sentence">句子管理</el-menu-item>
        <el-menu-item index="/pushhot">推荐管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="/sets">系统设置</el-menu-item>
      <!-- <img v-if="user != null" class="mdui-icon material-icons mdui-img-circle" v-bind:src="$global.globalPictureUrl + (JSON.parse(this.$store.state.user)).userPicture"/> -->
      <el-submenu index="4" style="float:right;">
        <template slot="title">
          <van-image
            round
            fit="contain"
            width="40px"
            height="40px;"
            :src="$global.globalPictureUrl + (JSON.parse(this.$store.state.user)).adminPicture"
            style="float:right;top:10px;right:10px;"
          />
        </template>
        <el-menu-item v-on:click="exit" >退出登录</el-menu-item>
      </el-submenu>
      
    </el-menu>
    <!-- 内容 -->
    <van-row type="flex" justify="space-around">
      <van-col span="20" style="background-color:white;padding:10px;">
        
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
      activeIndex2: '/'
    };
  },
  methods: {
    // 退出登录
    exit:function(){
      // alert("退出登录");
        this.$store.commit('LOGOUT');
        this.$message({
            type: 'success',
            message: "已退出登录",
            duration: 2000
        });
        setTimeout(()=>{
          window.location.href=this.$global.localhostUrl + "/login/";
        }, 1000);
    },
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
  .home{
    padding-top:50px;
  }
  .el-menu-demo{
    position: fixed !important;
    top: 0px;
    z-index:5;
    width:100%;
  }

</style>


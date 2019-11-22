<template>
    <div class="sets">
        <h1>系统设置</h1>
        <hr>
        <el-tooltip :content="'isOpenActive = ' + value" placement="top">
            <el-switch
                v-model="value"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value=1
                :inactive-value=0
                active-text="开启审核"
                inactive-text="关闭审核"
                @change="change()"
                :disabled="loading"
                >
            </el-switch>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: "sets",
    props: {
        msg: String
    },
    data() {
      return {
        value: 1,
        loading:false
      }
    },
    created(){
        this.value = (JSON.parse(this.$store.state.user)).isOpenActive;
    },
    methods:{
        // 更新管理员信息
        updataAdmin:function(admin){
            this.loading = true;
            this.$http.post("/api/adminupdataself",admin,{
                headers: {
                    'Content-Type':'application/json;charset=UTF-8'
                }

                }).then(response => {
                    // 响应成功回调
                    if(response.data.success == true){
                        this.$message({
                            type: 'success',
                            message: response.data.message,
                            duration: 2000
                        });
                        this.loading = false;
                    }else{
                        this.$message({
                        type: 'info',
                            message: response.data.message,
                            duration: 2000
                        });
                        this.loading = false;
                    }
                }),
                function(response) {
                    // 响应错误回调
                    alert("服务器开小差了");
                };
        },
        // value值发生改变
        change:function(){
            console.log(this.value);
            let admin = JSON.parse(this.$store.state.user);
            admin.isOpenActive = this.value;
            console.log(admin);
            // 执行更新
            this.updataAdmin(admin);
        }
    }
};
</script>

<style scoped lang="less">
</style>

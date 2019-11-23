<template>
    <div class="pushhot">
        <h1>推荐管理</h1>
        <hr>
        <el-tooltip :content="'adminOtherOne = ' + value" placement="top">
            <el-switch
                v-model="value"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value='1'
                inactive-value='0'
                active-text="推荐最新"
                inactive-text="推荐最热"
                @change="change()"
                :disabled="loading"
                >
            </el-switch>
        </el-tooltip>
        <br>
        <br>
        
        展示数量 &nbsp;&nbsp;
        <el-select v-model="showNum" placeholder="展示数量" size="small" :disabled="loading">
            <el-option label="5" value="5"></el-option>
            <el-option label="10" value="10"></el-option>
            <el-option label="15" value="15"></el-option>
            <el-option label="20" value="20"></el-option>
        </el-select>
        
    </div>
</template>

<script>
export default {
    name: "pushhot",
    props: {
        msg: String
    },
    data() {
      return {
        value: '1',
        loading:false,
        showNum:'10',
        cont:0
      }
    },
    
    created(){
        this.value = (JSON.parse(this.$store.state.user)).adminOtherOne;
        this.showNum = (JSON.parse(this.$store.state.user)).adminOtherTwo;
    },
    watch:{
        'showNum':function(){
            if(this.cont == 0){
                this.cont = 100;
            }else{
                console.log(this.showNum);
                let admin = JSON.parse(this.$store.state.user);
                admin.adminOtherTwo = this.showNum;
                console.log(admin);
                // 执行更新
                this.updataAdmin(admin);
            }
           
        }
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

                        let objStr = JSON.stringify(admin);
                        // console.log([objStr]);
                        this.$store.commit('GET_USER', objStr);
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
            admin.adminOtherOne = this.value;
            console.log(admin);
            // 执行更新
            this.updataAdmin(admin);
        },

    }
};
</script>

<style scoped lang="less">
</style>

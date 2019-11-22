<template>
    <div class="sentence">
        <h1>句子管理</h1>
        <hr>
        <!-- 搜索筛选 -->
        <el-button type="primary" icon="el-icon-search" size="medium" style="margin-right:15px;float:right">搜索</el-button>
        <el-input v-model="serch" placeholder="请输入id" size="medium" style="width:200px;margin-right:15px;float:right"></el-input>
        
        <!-- <el-checkbox v-model="checked">未激活</el-checkbox> -->
        <el-select v-model="batch.do" placeholder="批量操作" style="margin-right:15px;">
            <el-option label="批量删除" value="delUser"></el-option>
        </el-select>

        <el-button type="primary"  size="medium" v-on:click="toDo">执行</el-button>

        <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="userList"
            tooltip-effect="dark"
            style="width: 100%"
            v-if="userList.length > 0"
            @selection-change="handleSelectionChange">

            <el-table-column
            type="selection"
            width="55">
            </el-table-column>

            <el-table-column
            label="发布日期"
            prop="createDate"
            :formatter="dateFormatter"
            >
            <!-- <template slot-scope="scope">{{ scope.row.createDate }}</template> -->
            </el-table-column>

            <el-table-column
            prop="sentenceId"
            label="ID"
            width="80"
            >
            </el-table-column>
            
            <el-table-column
            prop="sentenceTxt"
            label="内容"
            width="250"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="authorName"
            label="作者"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="userId"
            label="发布者Id"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="albumName"
            label="专辑"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="classfiyId"
                label="分类"
                :filters="[
                    { text: '电影', value: 1 }, 
                    { text: '电视剧', value: 2 },
                    { text: '小说', value: 3 },
                    { text: '书籍', value: 4 },
                    { text: '名人名言', value: 5 },
                    { text: '原创', value: 6 },
                    ]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag
                        v-if="scope.row.classfiyId == 1"
                        type="success"
                        close-transition>电影
                    </el-tag>
                    <el-tag
                        v-if="scope.row.classfiyId == 2"
                        type="info"
                        close-transition>电视剧
                    </el-tag>
                    <el-tag
                        v-if="scope.row.classfiyId == 3"
                        type="warning"
                        close-transition>小说
                    </el-tag>
                    <el-tag
                        v-if="scope.row.classfiyId == 4"
                        type="danger"
                        close-transition>书籍
                    </el-tag>
                    <el-tag
                        v-if="scope.row.classfiyId == 5"
                        color="yellow"
                        close-transition>名人名言
                    </el-tag>
                    <el-tag
                        v-if="scope.row.classfiyId == 6"
                        close-transition>原创
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="open(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!-- 分页 -->
        <div class="block" style="float:right;margin-top:23px;">
            <!-- <span class="demonstration">完整功能</span> -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSetting['page-sizes']"
            :page-size="pageSetting['page-size']"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageSetting['total']">
            </el-pagination>
        </div>
        <!-- 更新用户弹框 -->
        <el-dialog
        title="编辑句子"
        @close="editDialogClose"
        :visible.sync="dialogTableVisible"
        :close-on-click-modal="false"
        :width="dialogWidth"
        >
        <!-- 更新用户的表单 -->
        <el-form ref="addFormRef" label-position="right" :rules="rulesEditUser" :model="editUser" label-width="100px" v-if="editUser != null">

            <el-form-item label="发布日期">
                <el-input :disabled="true" :value="setDate(editUser.createDate)"></el-input>
            </el-form-item>

            <el-form-item label="句子Id">
                <el-input v-model="editUser.sentenceId" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item prop="sentenceTxt" label="句子内容">
                <el-input v-model="editUser.sentenceTxt"></el-input>
            </el-form-item>

            <el-form-item prop="authorName" label="作者">
                <el-input v-model="editUser.authorName"></el-input>
            </el-form-item>

            <el-form-item label="发布者Id">
                <el-input v-model="editUser.userId" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="专辑">
                <el-input v-model="editUser.albumName" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="分类">
                <el-input v-bind:value="classFillter(editUser.classfiyId)" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item>
            <el-button @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" :loading="loading" @click="onEditUser">提交更新</el-button>
            </el-form-item>
        </el-form>
        </el-dialog>


    </div>
</template>

<script>
export default {
    name: "sentence",
    props: {
        msg: String
    },
    data() {
        return {
            // 批量操作
            batch:{
                'do':'',
            },
            // 按钮加载状态
            loading:false,
            // 
            dialogTableVisible:false,
            // 开关
            switchValue: false,
            dialogWidth: "0px", // 屏幕宽度
            disabled:false,
            //文件上传的参数
            dialogImageUrl: '',
            dialogVisible: false,
            fileList:[],
            // 默认不显示修改对话框
            value: '100',
            // 待修改
            editUser:null,
            checked: false,
            serch:'',
            input5:'',
            select:'',
            currentPage: 1,
            userList:[],
            // 选中列表
            multipleSelection: [],
            // 分页配置
            pageSetting:{
                'page-sizes':[5, 10, 15,20],
                'page-size':5,
                'total':0
            },
            // 请求pageInfo参数
            pageReqinfo:{
                "pageNum":1,
                "pageSize":5
            },
            // 验证规则
            rulesEditUser: {
                authorName: [
                { required: true, message: '作者不能为空', trigger: 'blur' }
                ],
                sentenceTxt: [
                { required: true, message: '内容不能为空', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        // 获取所有用户
        this.getUserList();
        // 设置对话框宽度
        this.setDialogWidth();
    },
    mounted() {
        window.onresize = () => {
        return (() => {
            this.setDialogWidth()
        })()
        }
    },
    methods:{
        // classify格式化
        classFillter:function(classifyId){
            if(classifyId == 1){
                return '电影';
            }else if(classifyId == 2){
                return '电视剧';
            }else if(classifyId == 3){
                return '动漫';
            }else if(classifyId == 4){
                return '小说';
            }else if(classifyId == 5){
                return '书籍';
            }else if(classifyId == 6){
                return '名人名言';
            }else{
                return '未知错误';
            };
        },
        // 打开删除确认对话框
        open(index,row) {
            this.$confirm('此操作将永久删除该句子, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                // 执行删除单个用户
                this.handleDelete(index,row);

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 打开删除确认对话框2
        open2(index,row) {
            this.$confirm('此操作将永久删除选中句子, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                // 执行删除多个句子
                this.handleDeleteSome();

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消批量删除'
                });          
            });
        },
        // 删除单个句子
        handleDelete:function(index,row){
            this.loading = true;
            console.log(row);
            this.$http.post("/api/delsenbysenid?sentenceId=" + row.sentenceId).then(response => {
                    // 响应成功回调
                    if(response.data.success == true){
                        this.$message({
                            type: 'success',
                            message: response.data.message,
                            duration: 2000
                        });
                        this.userList.splice(index,1);
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
        // 批量删除多个句子
        handleDeleteSome:function(){
            // 删除专辑名称属性
            for(let i = 0; i < this.multipleSelection.length;i++){
                delete this.multipleSelection[i].authorName;
            };

            this.loading = true;
            this.$http.post("/api/admindelsomesen",this.multipleSelection,{
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

                    // 删除后，重新get数据，实现刷新数据
                    this.getUserList();

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
                this.loading = false;
                alert("服务器开小差了");
                
            };
        },
        // 设置为激活状态
        setUserYesActive:function(){
            // 遍历对象设置为激活状态
            this.loading = true;
            this.multipleSelection.forEach(function (item, index, arr){
                item.isActive = 1;
                arr[index] = item;
            });
        },
        // 设置为未激活状态
        setUserNoActive:function(){
            // 遍历对象设置为未激活状态
            this.loading = true;
            this.multipleSelection.forEach(function (item, index, arr){
                item.isActive = 0;
                arr[index] = item;
            });
        },
        // 批量提交之toggle激活
        postWidthSetActive:function(){
            this.$http.post("/api/adminsetusersyesact",this.multipleSelection,{
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
                this.loading = false;
                alert("服务器开小差了");
                
            };
        },
        
        // 执行批量操作
        toDo:function(){
            
            
            if(this.batch.do == ''){
                alert("请选择操作选项");
                console.log(typeof this.batch.do);
                console.log(this.batch.do);
            }else{
                if(this.batch.do == 'delUser'){
                    console.log("选项不为空");
                    console.log(typeof this.batch.do);
                    console.log(this.batch.do);
                    if(this.multipleSelection.length == 0){
                        alert("未选中操作对象");
                        console.log(this.multipleSelection);
                    }else{
                        console.log("操作对象不为空");
                        console.log(this.multipleSelection);
                        // 执行批量删除
                        this.open2();
                    }
                }

            }
        },
        // 设置对话框大小
        setDialogWidth() {
            console.log(document.body.clientWidth)
            var val = document.body.clientWidth
            const def = 800 // 默认宽度
            if (val < def) {
                this.dialogWidth = '100%'
            } else {
                this.dialogWidth = def + 'px'
            }
        },
        // 提交更新
        onEditUser:function(){
            this.loading = true;
            // alert("提交更新用户信息");
            console.log(this.editUser);

            if (this.editUser.userPicture != '') {
                this.$http.post("/api/updatasen", this.editUser, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }

                }).then(response => {
                    console.log(response.data);

                    if (response.data.success == true) {
                        this.$message({
                            type: 'success',
                            message: response.data.message,
                            duration: 2000
                        });
                        this.getUserList();
                        this.loading = false;
                        this.editDialogClose();

                    } else {
                        this.$message({
                            type: 'info',
                            message: response.data.message,
                            duration: 2000
                        });
                        this.loading = false;
                    }

                }),
                    function (response) {
                        // 响应错误回调
                        alert("未知错误");
                        this.loading = false;
                    };




            } else {
                this.submitting = false;
                alert("请上传专辑图片");
            }

        },
        // 关闭对话框钩子函数
        editDialogClose:function(){
            this.editUser = null;
            this.dialogTableVisible = false;
        },
        // 编辑
        handleEdit:function(index,row){
            console.log(index);
            console.log(row);
            

            this.editUser = row;
            

            // 给头像赋值
            this.fileList = [{name: this.editUser.userPicture, url: this.$global.globalPictureUrl + this.editUser.userPicture}];
            this.dialogTableVisible = true;
            
        },
        // 全选开关
        toggleSelection(rows) {
            if (rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });
            } else {
            this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 设置每页显示多少条
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageReqinfo.pageSize = val;
            this.pageReqinfo.pageNum = 1;
            this.getUserList();
        },
        // 页数发生改变
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pageReqinfo.pageNum = val;
            this.getUserList();
        },
        // 过滤标签
        filterTag(value, row) {
            return row.classfiyId === value;
        },
        // 分页获取句子
        getUserList:function(){

            this.$http.post("/api/admingetsenpro",this.pageReqinfo,{
            headers: {
                'Content-Type':'application/json;charset=UTF-8'
            }
            }).then(response => {
                // 响应成功回调
                console.log(response.data);
                this.userList = response.data.list;
                this.setPageInfo(response.data);
            }),
            function(response) {
                // 响应错误回调
                alert("服务器开小差了");
            };

        },
        // 设置pageInfo
        setPageInfo:function(data){
            this.pageSetting.total = data.total;
            this.currentPage = data.pageNum;
        },
        // 日期格式化
        dateFormatter (row, column) {
            let datetime = row.createDate;
            if(datetime){
                datetime = new Date(datetime);
                let y = datetime.getFullYear() + '-';
                let mon = datetime.getMonth()+1 + '-';
                let d = datetime.getDate();
                return y + mon + d;
            }
            return ''
        },
        // 表单日期格式化
        setDate:function(dateNum){
            let datetime = dateNum;
            if(datetime){
                datetime = new Date(datetime);
                let y = datetime.getFullYear() + '-';
                let mon = datetime.getMonth()+1 + '-';
                let d = datetime.getDate();
                return y + mon + d;
            }
            return ''
        },
        // 设置开关
        setActive:function(isActive){
            if(isActive === 0){
                return false;
            }else if(isActive === 1){
                return true;
            }
        },
        // 专辑格式化
        albumFormatter(row, column){
            if(row.albumId == 1){
                return '未设置';
            }else{
                return row.userName;
            }
        },
        //文件上传成功的钩子函数
        handleSuccess(res, file) {
            
            if (file.response.success) {
                this.$message({
                    type: 'success',
                    message: '图片上传成功',
                    duration: 1500
                });
                // this.editor.picture = file.response.message; //将返回的文件储存路径赋值picture字段
                this.editUser.userPicture = file.response.message; //将返回的文件储存路径赋值picture字段
                console.log(this.user);
                // alert(this.album.albumPicture);
            }
        },
        //删除文件之前的钩子函数
        handleRemove(file, fileList) {

            this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 点确定来到了这
                    console.log(this.user);
                    if(this.editUser.userPicture == '/headpicture/defaultpicture.png'){
                        // 如果用户用户向删除的图片为系统默认头像，则只清空前端图图片列表，不调用删除图片api从服务器删除
                        // alert("则只清空前端图图片列表");
                        this.$refs.upload.clearFiles();

                    }else{
                        // 调用删除图片api从服务器删除
                        // alert("从服务器删除图图片");

                            this.$http.post("/api/deluserpicture",this.editUser,{
                            headers: {
                                'Content-Type':'application/json;charset=UTF-8'
                            }

                        }).then(response => {
                            console.log(response.data);

                            if(response.data.success == true){
                                // 删除成功执行
                                this.$refs.upload.clearFiles();
                                this.$message({
                                    type: 'success',
                                    message: response.data.message
                                });
                            }else{
                                // 删除失败执行
                                this.$refs.upload.clearFiles();
                                this.$message({
                                type: 'info',
                                message: response.data.message
                                });  
                            }
                            }),
                            function(response) {
                                // 响应错误回调
                                this.$refs.upload.clearFiles();
                                alert("未知错误");
                            };
                    }


                }).catch(() => {
                    // 点取消来到了这
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });


        },
        //点击列表中已上传的文件事的钩子函数
        handlePreview(file) {
        },
        //上传的文件个数超出设定时触发的函数
        onExceed(files, fileList) {
            this.$message({
                type: 'info',
                message: '最多只能上传一个图片',
                duration: 6000
            });
        },
        //文件上传前的前的钩子函数
        //参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
        beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isGIF = file.type === 'image/gif';
            const isPNG = file.type === 'image/png';
            const isBMP = file.type === 'image/bmp';
            const isJPGG = file.type === 'image/jpg';
            const isLt2M = file.size / 1024 / 1024 < 10;

            if (!isJPG && !isGIF && !isPNG && !isBMP) {
                this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 10MB!');
            }
            return (isJPG || isBMP || isGIF || isPNG || isJPGG) && isLt2M;
        },
        handlePictureCardPreview:function(file){

        },


    }
};
</script>

<style scoped lang="less">
</style>

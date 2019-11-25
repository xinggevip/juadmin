<template>
    <div class="user">
        <h1>用户管理</h1>
        <hr>
        <!-- 搜索筛选 -->
        <el-button type="primary" icon="el-icon-search" size="medium" style="margin-right:15px;float:right" @click="toSearchUsers()">搜索</el-button>
        <el-input v-model="serch" placeholder="请输入id或姓名" size="medium" style="width:200px;margin-right:15px;float:right"></el-input>
        
        <!-- <el-checkbox v-model="checked">未激活</el-checkbox> -->
        <el-select v-model="batch.do" placeholder="批量操作" style="margin-right:15px;">
            <el-option label="批量设置为激活" value="yesActive"></el-option>
            <el-option label="批量设置为未激活" value="noActive"></el-option>
            <el-option label="批量删除" value="delUser"></el-option>
        </el-select>

        <el-button type="primary"  size="medium" v-on:click="toDo">执行</el-button>

        <h3 v-if="userList.length == 0">无数据</h3>
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
            label="注册日期"
            prop="createDate"
            :formatter="dateFormatter"
            >
            <!-- <template slot-scope="scope">{{ scope.row.createDate }}</template> -->
            </el-table-column>

            <el-table-column
            prop="userId"
            label="ID"
            >
            </el-table-column>
            
            <el-table-column
            prop="userName"
            label="姓名"
            :formatter="nameFormatter"
            >
            </el-table-column>
            <el-table-column
            prop="userSex"
            label="性别"
            >
            </el-table-column>
            <el-table-column
            prop="userPhone"
            label="手机"
            :formatter="phoneFormatter"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="userSlogan"
            label="签名"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="isActive"
                label="激活状态"
                :filters="[{ text: '已激活', value: 1 }, { text: '未激活', value: 0 }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag
                        v-if="scope.row.isActive == 1"
                        :type="scope.row.isActive === 0 ? 'primary' : 'success'"
                        close-transition>已激活
                    </el-tag>
                    <el-tag
                        v-if="scope.row.isActive == 0"
                        :type="scope.row.isActive === 0 ? 'primary' : 'success'"
                        close-transition>未激活
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
        title="编辑用户"
        @close="editDialogClose"
        :visible.sync="dialogTableVisible"
        :close-on-click-modal="false"
        :width="dialogWidth"
        >
        <!-- 更新用户的表单 -->
        <el-form ref="addFormRef" label-position="right" :rules="rulesEditUser" :model="editUser" label-width="100px" v-if="editUser != null">

            <h4>上传头像<span style="color:red;text-decoration: none;font-weight:normal"> 建议比例1：1</span></h4>
            <!--  action="http://juapi.qiangssvip.com/api/uploadheadpicture" -->
            <!-- action="http://localhost:8080/api/uploadheadpicture" -->
            <!-- 文件上传组件 -->
            <el-upload
                action="http://juapi.qiangssvip.com/api/uploadheadpicture"
                ref="upload"
                name="userPicture"
                list-type="picture-card"
                :limit="1"
                :file-list="fileList"
                :on-exceed="onExceed"
                :before-upload="beforeUpload"
                :on-preview="handlePreview"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                v-if="fileList.length > 0"
                >
                
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                    <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                    >
                    <span class="el-upload-list__item-actions">
                    <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                    >
                        <i class="el-icon-delete"></i>
                    </span>
                    </span>
                </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" v-if="fileList.length > 0">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>


            <el-form-item label="激活状态">
                <el-radio-group v-model="editUser.isActive">
                <el-radio :label="0">未激活</el-radio>
                <el-radio :label="1">已激活</el-radio>
                </el-radio-group>
            </el-form-item>


            <el-form-item prop="userId" label="用户Id">
                <el-input v-model="editUser.userId" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item prop="userPassword" label="用户密码">
                <el-input v-model="editUser.userPassword"></el-input>
            </el-form-item>

            <el-form-item label="注册日期">
                <el-input :disabled="true" :value="setDate(editUser.createDate)"></el-input>
            </el-form-item>

            <el-form-item label="姓名">
                <el-input v-model="editUser.userName"></el-input>
            </el-form-item>

            <el-form-item label="性别">
                <el-radio-group v-model="editUser.userSex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            
            <el-form-item prop="userPhone" label="手机号">
                <el-input v-model="editUser.userPhone"></el-input>
            </el-form-item>

            <el-form-item label="邮箱">
                <el-input v-model="editUser.userEmail"></el-input>
            </el-form-item>

            <el-form-item label="签名">
                <el-input v-model="editUser.userSlogan"></el-input>
            </el-form-item>

            <el-form-item label="简介">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="editUser.userProfile">
                </el-input>
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
    name: "user",
    props: {
        msg: String
    },
    data() {
        
        // 自定义一个手机号验证规则
        var checkMoblie = (rule, value, callback) => {
        if (!value.trim()) {
            return callback(new Error('请输入手机号'))
        }
        if (!/^1[34578]\d{9}$/.test(value)) {
            return callback(new Error('手机号有误！请重填'))
        } else {
            callback()
        }
        }
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
            // 头像
            // fileList: function(){
                
            //     if(this.editUser == null){
            //         return [{name: '', url: ''}];
            //     }else{
            //         return [{name: this.editUser.userPicture, url: this.$global.globalPictureUrl + this.editUser.userPicture}];
            //     }
                
            // },
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
                userId: [
                { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                userPassword: [
                { required: true, message: '请输入用户密码', trigger: 'blur' }
                ],
                userEmail: [
                { message: '请输入邮箱', trigger: 'blur' },
                {
                    type: 'email',
                    message: '请输入正确的邮箱地址',
                    trigger: ['blur', 'change']
                }
                ],
                userPhone: [
                { message: '请输入手机号', trigger: 'blur' },
                { validator: checkMoblie, trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        // 获取所有用户
        // this.getUserList();
        this.getData();
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
        // 获取用户表
        getData:function(){
            this.loading = true;
            this.$http.post("/api/adminsearchusers?key="+ this.serch +"&pageNum="+ this.pageReqinfo.pageNum +"&pageSize=" + this.pageReqinfo.pageSize,).then(response => {
                // 响应成功回调
                this.userList = response.data.list;
                this.setPageInfo(response.data);
                this.loading = false;
            }),
            function(response) {
                // 响应错误回调
                this.loading = false;
                alert("服务器开小差了");
            };
        },
        // 搜索用户
        toSearchUsers:function(){
            this.pageReqinfo.pageNum = 1;
            // 获取搜索结果
            this.getData();
            
        },
        // 打开删除确认对话框
        open(index,row) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
        // 打开批量删除确认对话框
        open2(index,row) {
            this.$confirm('此操作将永久删除选中用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                // 执行删除多个用户
                this.loading = true;
                this.handleDeleteSome();

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 删除单个用户
        handleDelete:function(index,row){
            this.loading = true;
            console.log(row);
            this.$http.post("/api/admindeloneuser",row,{
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
        // 批量删除多个用户
        handleDeleteSome:function(){
            this.loading = true;
            this.$http.post("/api/admindelsomeuser",this.multipleSelection,{
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
                    // this.getUserList();
                    this.getData();

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
                

                if(this.batch.do == 'yesActive'){
                    console.log("选项不为空");
                    console.log(typeof this.batch.do);
                    console.log(this.batch.do);
                    if(this.multipleSelection.length == 0){
                        alert("未选中操作对象");
                        console.log(this.multipleSelection);
                    }else{
                        console.log("操作对象不为空");
                        console.log(this.multipleSelection);

                        this.setUserYesActive();
                        this.postWidthSetActive();

                    }
                }else if(this.batch.do == 'noActive'){
                    console.log("选项不为空");
                    console.log(typeof this.batch.do);
                    console.log(this.batch.do);
                    if(this.multipleSelection.length == 0){
                        alert("未选中操作对象");
                        console.log(this.multipleSelection);
                    }else{
                        console.log("操作对象不为空");
                        console.log(this.multipleSelection);
                        this.setUserNoActive();
                        this.postWidthSetActive();
                    }
                }else if(this.batch.do == 'delUser'){
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
                this.$http.post("/api/edituser", this.editUser, {
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
            this.loading = true;
            // this.getUserList();
            this.getData();
        },
        // 页数发生改变
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pageReqinfo.pageNum = val;
            this.loading = true;
            // this.getUserList();
            this.getData();
        },
        // formatter(row, column) {
        //     return row.address;
        // },
        filterTag(value, row) {
            return row.isActive === value;
        },
        getUserList:function(){

            this.$http.post("/api/admingetuserlist",this.pageReqinfo,{
            headers: {
                'Content-Type':'application/json;charset=UTF-8'
            }
            }).then(response => {
                this.loading = false;
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
        // 姓名格式化
        nameFormatter(row, column){
            if(row.userName == null){
                return '未设置';
            }else{
                return row.userName;
            }
        },
        // 手机号格式化
        phoneFormatter(row, column){
            if(row.userPhone == null){
                return '未设置';
            }else{
                return row.userPhone;
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

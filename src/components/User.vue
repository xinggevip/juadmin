<template>
    <div class="user">
        <h1>用户管理</h1>
        <hr>
        <!-- 搜索筛选 -->
        
        <el-input v-model="serch" placeholder="请输入id" size="medium" style="width:200px;margin-right:15px;"></el-input>
        <el-button type="primary" icon="el-icon-search" size="medium" style="margin-right:30px;">搜索</el-button>
        <el-checkbox v-model="checked">未激活</el-checkbox>

        <el-table
            ref="multipleTable"
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
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <div style="margin-top: 20px;float:left">
            <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
            <el-button @click="toggleSelection()">取消选择</el-button>
        </div>

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
        >
        <!-- 更新用户的表单 -->
        <el-form ref="addFormRef" :rules="rulesEditUser" :model="editUser" label-width="100px" v-if="editUser != null">
            <el-form-item prop="userId" label="用户名">
            <el-input v-model="editUser.userId"></el-input>
            </el-form-item>
            <el-form-item prop="userPassword" label="用户密码">
            <el-input v-model="editUser.userPassword"></el-input>
            </el-form-item>
            <el-form-item prop="userEmail" label="用户邮箱">
            <el-input v-model="editUser.userEmail"></el-input>
            </el-form-item>
            <el-form-item prop="userPhone" label="用户手机号">
            <el-input v-model="editUser.userPhone"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" @click="onEditUser">提交更新</el-button>
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
            // 默认不显示修改对话框
            dialogTableVisible:false,
            // 待修改
            editUser:null,
            checked: false,
            serch:'',
            input5:'',
            select:'',
            currentPage: 1,
            userList:[],
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
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                {
                    type: 'email',
                    message: '请输入正确的邮箱地址',
                    trigger: ['blur', 'change']
                }
                ],
                userPhone: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: checkMoblie, trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getUserList();
    },
    methods:{
        // 提交更新
        onEditUser:function(){
            alert("提交更新用户信息");
            this.editDialogClose();
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


    }
};
</script>

<style scoped lang="less">
</style>

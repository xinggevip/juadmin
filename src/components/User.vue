<template>
    <div class="user">
        <h1>用户管理</h1>
        <hr>
        <!-- 搜索筛选 -->
        <!-- <b>筛选：</b>
        <span>激活状态</span>
        <el-select v-model="select" slot="prepend" placeholder="激活状态">
            <el-option label="全部" value="2"></el-option>
            <el-option label="未激活" value="0"></el-option>
            <el-option label="已激活" value="1"></el-option>
        </el-select> -->
        
        <el-input v-model="serch" placeholder="请输入姓名" size="medium" style="width:200px;margin-right:15px;"></el-input>
        <el-button type="primary" icon="el-icon-search" size="medium" style="margin-right:30px;">搜索</el-button>
        <el-checkbox v-model="checked">未激活</el-checkbox>

        <el-table
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            label="注册日期">
            <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="用户ID"
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
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="userSlogan"
            label="签名"
            width="320"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="isActive"
                label="激活状态"
                :filters="[{ text: '已激活', value: '已激活' }, { text: '未激活', value: '未激活' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.isActive === '未激活' ? 'primary' : 'success'"
                    close-transition>{{scope.row.isActive}}</el-tag>
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
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
            </el-pagination>
        </div>


    </div>
</template>

<script>
export default {
    name: "user",
    props: {
        msg: String
    },
    data() {
        return {
            checked: false,
            serch:'',
            input5:'',
            select:'',
            currentPage1: 5,
            currentPage2: 5,
            currentPage3: 5,
            currentPage4: 4,
            tableData3: [{
                date: '2016-05-03',
                name: '王小虎',
                userSex:"男",
                userPhone:"15937067033",
                userSlogan:"又是元气满满的一天",
                address: '上海市普陀区金沙江路 1518 弄',
                isActive:"已激活"
                }, {
                date: '2016-05-02',
                name: '王小虎',
                userSex:"男",
                userPhone:"15937067033",
                userSlogan:"又是元气满满的一天",
                address: '上海市普陀区金沙江路 1518 弄',
                isActive:"未激活"
                }, {
                date: '2016-05-04',
                name: '王小虎',
                userSex:"男",
                userPhone:"15937067033",
                userSlogan:"又是元气满满的一天",
                address: '上海市普陀区金沙江路 1518 弄',
                isActive:"已激活"
                }, {
                date: '2016-05-01',
                name: '王小虎',
                userSex:"男",
                userPhone:"15937067033",
                userSlogan:"又是元气满满的一天",
                address: '上海市普陀区金沙江路 1518 弄',
                isActive:"已激活"
                }, {
                date: '2016-05-08',
                name: '王小虎',
                userSex:"男",
                userPhone:"15937067033",
                userSlogan:"又是元气满满的一天",
                address: '上海市普陀区金沙江路 1518 弄',
                isActive:"未激活"
                }, {
                date: '2016-05-06',
                name: '王小虎',
                userSex:"男",
                userPhone:"15937067033",
                userSlogan:"又是元气满满的一天",
                address: '上海市普陀区金沙江路 1518 弄',
                isActive:"已激活"
                }, {
                date: '2016-05-07',
                name: '王小虎',
                userSex:"男",
                userPhone:"15937067033",
                userSlogan:"又是元气满满的一天",
                address: '上海市普陀区金沙江路 1518 弄',
                isActive:"未激活"
            }],
            multipleSelection: []
        }
    },
    methods:{
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
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        formatter(row, column) {
        return row.address;
        },
        filterTag(value, row) {
            return row.isActive === value;
        }
    }
};
</script>

<style scoped lang="less">
</style>

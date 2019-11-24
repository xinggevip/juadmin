<template>
    <div class="index">
        <h1>首页</h1>
        <hr>

        <el-row :gutter="40" class="panel-group" v-if="countInfo != null">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                    <div class="card-panel-text">
                        总用户
                    </div>
                    <count-to :start-val="0" :end-val="countInfo.allUsers" :duration="2600" class="card-panel-num" />
                    </div>
                </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-message">
                    <svg-icon icon-class="user" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                    <div class="card-panel-text">
                        新用户
                    </div>
                    <count-to :start-val="0" :end-val="countInfo.todayRegUsers" :duration="3000" class="card-panel-num" />
                    </div>
                </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-money">
                    <svg-icon icon-class="wechat" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                    <div class="card-panel-text">
                        总句子
                    </div>
                    <count-to :start-val="0" :end-val="countInfo.allSens" :duration="3200" class="card-panel-num" />
                    </div>
                </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-shopping">
                <svg-icon icon-class="message" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                <div class="card-panel-text">
                    新句子
                </div>
                <count-to :start-val="0" :end-val="countInfo.todayPushSens" :duration="3600" class="card-panel-num" />
                </div>
            </div>
            </el-col>
        </el-row>
    
        <ve-histogram
            :data="chartData"
            :colors="chartColor"
            :legend-visible="true"
            :loading="loading"
            :data-empty="dataEmpty"
            :extend="extend"
            :settings="chartSettings">
        </ve-histogram>

        <!-- <ve-line :data="chartData"></ve-line> -->

        


    </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
    name: "index",
    props: {
        msg: String
    },
    data() {
        return {
            // 统计信息
            countInfo:null,
            chartSettings: {
                xAxisType: 'time',
                area: true,
                yAxisName: ['新增用户', '新增句子'],
                axisSite: {right: ['sensCount']},
                labelMap: {'usersCount': '新增用户', 'sensCount': '新增句子'}
            },
            chartData: {
                columns: ['date', 'usersCount', 'sensCount'],
                rows: []
            },
            extend: {
                series: {
                symbolSize: 10,
                label: {
                    normal: {
                    show: true
                    }
                }
                }
            },
            chartColor: ['#89dd47', '#3cabf4'],
            loading: false,
            dataEmpty: false
        }

    },
    components: {
        CountTo
    },
    created(){
        // 获取统计数据
        this.getCount();
        // 获取可视化数据
        this.getData()
    },
    mounted(){
        // this.drawLine();
    },
    methods:{
        //获取统计数据
        getCount:function(){
            this.$http.post("/api/admingetcount",).then(response => {
                // 响应成功回调
                this.countInfo = response.data;
            }),
            function(response) {
                // 响应错误回调
                alert("未知错误");
            };
        },
        // 日期格式化
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
        // 获取可视化数据
        async getData () {
            
            this.$http.post("/api/admingetcountlist?num=10",).then(response => {
                // 响应成功回调
                // 日期格式化
                (response.data).forEach((item, index) => {
                  //在这 改日期  
                  // console.log(item);
                  item.date = this.setDate(item.date)
                  this.chartData.rows.push(item);
                  this.dataEmpty = false
                })

            }),
            function(response) {
                // 响应错误回调
                alert("未知错误");
            };
        },
    }
};
</script>

<style scoped lang="less">
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>

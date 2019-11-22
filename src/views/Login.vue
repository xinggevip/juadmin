<template>
  <div class="login_page login">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer">
			     <div class='titleArea rflex'>
					<!-- <img class="logo" :src="logo" alt="小爱admin"> -->
					<span class='title'>句子迷<i>Admin</i></span>
				</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
					<el-form-item prop="username" class="login-item">
					    <!-- <span class="loginTips"><icon-svg icon-class="iconuser" /></span> -->
						<el-input @keyup.enter.native ="submitForm('loginForm')"  class="area" type="text" placeholder="用户名" v-model="loginForm.adminId" ></el-input>
					</el-form-item>
					<el-form-item prop="password" class="login-item"> 
					    <!-- <span class="loginTips"><icon-svg icon-class="iconLock" /></span> -->
						<el-input @keyup.enter.native ="submitForm('loginForm')" class="area" type="password" placeholder="密码" v-model="loginForm.adminPassword"></el-input>
					</el-form-item>
					<el-form-item>
				    	<el-button type="primary"  @click="submitForm('loginForm')" class="submit_btn">SIGN IN</el-button>
				  	</el-form-item>
					
					
				</el-form>
	  		</section>
	  	</transition>
  	
  </div>
</template>
<script>


export default {
  name: 'login',
  components: {

  },
  data() {
    return {
      isCollapse: true,
      loginForm: {
					adminId: '',
					adminPassword: ''
				},
				rules: {
					adminId: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
			        ],
					adminPassword: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
				},
      logo:"http://www.qiangssvip.com/usr/uploads/2019/05/281426999.jpg"
    };
  },
  methods: {
    loginByWechat(){
			},
			showMessage(type,message){
                this.$message({
                    type: type,
                    message: message
                });
            },
		    submitForm(loginForm) {
				this.$refs[loginForm].validate((valid) => {
					if (valid) {
            // alert("去登陆");
            this.login();
            /* 输入验证成功则执行 */

						// let userinfo = this.loginForm;
						// login(userinfo).then(res => {
						// 	let userList = res.data.userList;
						// 	setToken("Token",userList.token)
						// 	this.$router.push({ path: '/' })
						// 	this.$store.dispatch('initLeftMenu'); //设置左边菜单始终为展开状态
						// })
					}
				});
      },
      login:function(){
        console.log(this.loginForm);

        this.$http.post("/api/adminlogin",this.loginForm,{
          headers: {
              'Content-Type':'application/json;charset=UTF-8'
          }

        }).then(response => {
          console.log(typeof response.data);
          console.log(response.data);
          if(response.data != ''){
            let objStr = JSON.stringify(response.data);
            this.$store.commit('SET_TOKEN', true);
            this.$store.commit('GET_USER', objStr);
            this.$message.success('登陆成功');
            setTimeout(()=>{
              // window.location.href=this.$global.wwwUrl;
              this.$router.push("/");
            }, 1000);
          }else{
            this.$message.error('登陆失败,请重新登录');
          }
          
        }),
          function(response) {
            // 响应错误回调
            alert("服务器开小差了！");
          };

    }

  }
}
</script>


<style lang="less" scoped>
	.login_page{
		position: absolute;
		width: 100%;
		height: 100%;
		background: url(../assets/img/bg9.jpg) no-repeat center center;
    background-size: 100% 100%;
    // margin-top:-8px;
    // margin-left: -8px;
	}
	.form_contianer{
		position: absolute;
		top: 50%;
        left: 50%;
		transform: translate(-50%,-50%);
		background: #fff;
		width:370px;
		border-radius: 5px;
		padding: 25px;
		text-align: center;
		.titleArea{
			justify-content: center;
   			align-items: center;
			text-transform: uppercase;
			font-size: 22px;
			width: 100%;
			padding-bottom: 20px;
			.logo{
				width: 40px;
    			margin-right: 10px;
			}
			.title{
				i{
				   color: #FF6C60;
				}
			}
		}
	
		.loginForm{
			.submit_btn{
				width: 100%;
				padding:13px 0;
				font-size: 16px;
			}
			.loginTips{
				position: absolute;
				left: 10px;
				z-index: 20;
				// color: #FF7C1A;
				font-size: 18px;
				top: 50%;
				transform: translateY(-50%);
			}
	    }
	}

	.manage_tip{
		margin-bottom:20px;
		.title{
			font-family: cursive;
			font-weight: bold;
			font-size: 26px;
			color:#fff;
		}
		.logo{
			width:60px;
			height:60px;
		}
	}
	
	.tiparea{
		text-align:left;
		font-size: 12px;
		color: #4cbb15;
		padding: 10px 0;
		.tip{
			margin-left: 54px;
		}
	}
	
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
	.loginForm{
		.el-button--primary{
			background-color:#FF7C1A;
			border:1px solid #FF7C1A;
		}
	}
	.sanFangArea{
		border-top: 1px solid #DCDFE6;
		padding: 10px 0;
		display: none;
		.title{
			font-size: 14px;
			color: #8b9196;
			margin-bottom: 10px;
		}
		ul{
			li{
				flex:1;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				.svg-icon{
					font-size: 24px;
				}
			}
		}
	}
</style>

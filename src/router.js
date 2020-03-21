import Vue from 'vue'
import Router from 'vue-router'

//首页
const Home = () => import('./components/HelloWorld.vue')
//登录
const Login = () => import('./views/Login.vue')
//组织管理
const OrgManageIndex  = () => import("./views/orgManage/Index.vue");
const OrgList         = () => import("./views/orgManage/OrgList.vue");
const OrgDetail         = () => import("./views/orgManage/OrgDetail.vue");
//人员管理
const PersonManageIndex  = () => import("./views/personManage/Index.vue");
const PersonSearch         = () => import("./views/personManage/PersonSearch.vue");
const BackstagePerson         = () => import("./views/personManage/BackstagePerson.vue");
const BacktageRole         = () => import("./views/personManage/BacktageRole.vue");
//应用管理
const AppManageIndex  = () => import("./views/appManage/Index.vue");
const SystemApp         = () => import("./views/appManage/SystemApp.vue");
const MyApp         = () => import("./views/appManage/MyApp.vue");
const CreateApp         = () => import("./views/appManage/CreateApp.vue");
const AppDetail         = () => import("./views/appManage/AppDetail.vue");
//系统设置
const SystemSetIndex  = () => import("./views/systemSet/Index.vue");
const ParamSet         = () => import("./views/systemSet/ParamSet.vue");
const OperationLog         = () => import("./views/systemSet/OperationLog.vue");
const AbnormalLog         = () => import("./views/systemSet/AbnormalLog.vue");
//流程设置
const ProcessSetIndex  = () => import("./views/processSet/Index.vue");
const MenuManage         = () => import("./views/processSet/MenuManage.vue");
const ProcessManage         = () => import("./views/processSet/ProcessManage.vue");
const FormManage         = () => import("./views/processSet/FormManage.vue");
const FillInForm         = () => import("./views/processSet/FillInForm.vue");

//维护系统
const MaintenanceSystemIndex  = () => import("./views/maintenanceSystem/Index.vue");
const FeedbackPage            = () => import("./views/maintenanceSystem/Feedback.vue");
const InstructionsPage        = () => import("./views/maintenanceSystem/Instructions.vue");
//websoket
const SoketChat = () => import('./components/SoketChat.vue')
const HttpChat = () => import('./components/HttpChat.vue')

Vue.use(Router)

//showNav: 是否展示导航
//hiddenPage:是否隐藏该页面（该属性只能用二级页面）
export default new Router({
  mode: "hash",// mode: "history",
  base: "/web/",
  routes: [
    {
      path: '/maintenance',
      name: 'MaintenanceSystemIndex',
      component: MaintenanceSystemIndex,
      navName: '维护系统',
      meta: {
        showNav: false,//是否展示在导航条上
        keepAlive:true,//是否缓存
      },
      children: [
        {path: "feedback", name: "FeedbackPage", navName: '反馈', component: FeedbackPage, meta: { showNav: false,keepAlive:true,hiddenPage: false ,/*是否隐藏本页面*/}},
        {path: "instructions", name: "InstructionsPage", navName: '说明书', component: InstructionsPage, meta: { showNav: false,keepAlive:true, hiddenPage: false ,}},
      ],
    },
    {
      path: '/soket_chat',
      name: 'SoketChat',
      component: SoketChat,
      navName: 'Soket聊天室',
      meta: {
        showNav: false, 
        keepAlive:false,
      }
    },
    {
      path: '/http_chat',
      name: 'HttpChat',
      component: HttpChat,
      navName: 'Http聊天室',
      meta: {
        showNav: false,
        keepAlive:false,
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      navName: '首页',
      meta: {
        showNav: true,
        keepAlive:false,
      }
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
      navName: '登录',
      meta: {
        showNav: false,
        keepAlive:false,
      }
    },
    {
      path: '/org',
      name: 'OrgManageIndex',
      component: OrgManageIndex,
      navName: '组织管理',
      meta: {
        showNav: true,
        keepAlive:true,
      },
      children: [
        {path: "orgList", name: "OrgList", navName: '组织列表', component: OrgList, meta: { showNav: true,hiddenPage: false ,keepAlive:true,}},
        {path: "orgDetail", name: "OrgDetail", navName: '组织详情', component: OrgDetail, meta: { showNav: true,hiddenPage: false ,keepAlive:true,}},
      ]
    },
    {
      path: '/person',
      name: 'PersonManageIndex',
      component: PersonManageIndex,
      navName: '人员管理',
      meta: {
        showNav: true,
        keepAlive:true,
      },
      children: [
        {path: "personSearch", name: "PersonSearch", navName: '人员检索', component: PersonSearch, meta: { showNav: true,hiddenPage: false,keepAlive:true, }},
        {path: "backstagePerson", name: "BackstagePerson", navName: '后台人员', component: BackstagePerson, meta: { showNav: true,hiddenPage: false,keepAlive:true, }},
        {path: "backtageRole", name: "BacktageRole", navName: '后台角色', component: BacktageRole, meta: { showNav: true,hiddenPage: false,keepAlive:true, }},
      ]
    },
    {
      path: '/app',
      name: 'AppManageIndex',
      component: AppManageIndex,
      navName: '应用管理',
      meta: {
        showNav: true,
        keepAlive:true,
      },
      children: [
        {path: "systemApp", name: "SystemApp", navName: '系统应用', component: SystemApp, meta: { showNav: true,hiddenPage: false,keepAlive:true, }},
        {path: "myApp", name: "MyApp", navName: '我的应用', component: MyApp, meta: { showNav: true,hiddenPage: false,keepAlive:true,}},
        {path: "createApp", name: "CreateApp", navName: '创建应用', component: CreateApp, meta: { showNav: true,hiddenPage: false ,keepAlive:true,}},
        {path: "appDetail", name: "AppDetail", navName: '应用详情', component: AppDetail, meta: { showNav: true,hiddenPage: false,keepAlive:true,}},
      ]
    },
    {
      path: '/set',
      name: 'SystemSetIndex',
      component: SystemSetIndex,
      navName: '系统设置',
      meta: {
        showNav: true,
        keepAlive:true,
      },
      children: [
        {path: "paramSet", name: "ParamSet", navName: '参数设置', component: ParamSet, meta: { showNav: true,hiddenPage: false ,keepAlive:true,}},
        {path: "operationLog", name: "OperationLog", navName: '操作日志', component: OperationLog, meta: { showNav: true,hiddenPage: false,keepAlive:true, }},
        {path: "abnormalLog", name: "AbnormalLog", navName: '异常日志', component: AbnormalLog, meta: { showNav: true,hiddenPage: false,keepAlive:true, }},
      ]
    },
		{
		  path: '/process',
		  name: 'ProcessSetIndex',
		  component: ProcessSetIndex,
		  navName: '流程设置',
		  meta: {
		    showNav: true,
		    keepAlive:true,
		  },
		  children: [
		    {path: "menuManage", name: "MenuManage", navName: '菜单管理', component: MenuManage, meta: { showNav: true,hiddenPage: false ,keepAlive:true,}},
		    {path: "processManage", name: "ProcessManage", navName: '流程图管理', component: ProcessManage, meta: { showNav: true,hiddenPage: false,keepAlive:true, }},
		    {path: "formManage", name: "FormManage", navName: '表单管理', component: FormManage, meta: { showNav: true,hiddenPage: false,keepAlive:true, }},
        {path: "fillInForm", name: "FillInForm", navName: '填写表单', component: FillInForm, meta: { showNav: true,hiddenPage: false,keepAlive:true, }}
		  ]
		},
  ]
})

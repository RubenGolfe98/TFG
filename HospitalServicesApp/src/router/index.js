import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import Login from '@/components/Login'
import DoctorHome from '@/components/DoctorHome'
import PacienteHome from '@/components/PacienteHome'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/doctorHome',
      name: 'DoctorHome',
      component: DoctorHome
      
    },{
      path: '/pacienteHome',
      name: 'PacienteHome',
      component: PacienteHome
      
    },
    {
      path: '*',
      redirect: "/"
    }
  ]
})

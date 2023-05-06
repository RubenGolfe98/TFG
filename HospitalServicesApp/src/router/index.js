import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SanitarioHome from '@/components/SanitarioHome'
import PacienteHome from '@/components/PacienteHome'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/SanitarioHome',
      name: 'SanitarioHome',
      component: SanitarioHome
    },
    {
      path: '/PacienteHome',
      name: 'PacienteHome',
      component: PacienteHome
    },
    {
      path: '*',
      redirect: "/"
    }
  ]
})

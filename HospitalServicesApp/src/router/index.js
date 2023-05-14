import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import App from '@/App'
import SanitarioHome from '@/components/SanitarioHome'
import PacienteHome from '@/components/PacienteHome'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/sanitarioHome',
      name: 'SanitarioHome',
      component: SanitarioHome
    },
    {
      path: '*',
      name: "*",
      component: Home
    }
  ]
})

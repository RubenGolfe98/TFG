import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SanitarioHome from '@/components/SanitarioHome'
import PacienteHome from '@/components/PacienteHome'
import Pacientes from '@/components/Pacientes'
import NuevoServicio from '@/components/NuevoServicio'
import Servicio from '@/components/Servicio'
import User from '@/components/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: "Home",
      component: Home
    },
    {
      path: '/sanitario/pacientes',
      name: 'Pacientes',
      component: Pacientes
    },
    {
      path: '/sanitarioHome',
      name: 'SanitarioHome',
      component: SanitarioHome
    },
    {
      path: '/pacienteHome',
      name: 'PacienteHome',
      component: PacienteHome
    },
    {
      path: '/sanitario/servicios',
      name: "Servicios",
      component: NuevoServicio
    },
    {
      path: '/sanitario/servicios/asignados/:idServicioAsignado',
      name: "Servicio",
      component: Servicio
    },
    {
      path: '/sanitario',
      name: 'Sanitario',
      component: User
    },
    {
      path: '/paciente',
      name: 'Paciente',
      component: User
    },
    {
      path: '*',
      name: "*",
      component: Home
    }
  ]
})

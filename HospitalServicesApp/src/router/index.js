import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SanitarioHome from '@/components/SanitarioHome'
import PacienteHome from '@/components/PacienteHome'
import Pacientes from '@/components/Pacientes'
import NuevoServicio from '@/components/NuevoServicio'
import Servicio from '@/components/Servicio'
import User from '@/components/User'
import HistoricoPaciente from '@/components/HistoricoPaciente'
import ServicioAsignadoInfo from '@/components/ServicioAsignadoInfo'
import MedicionesServicio from '@/components/MedicionesServicio'
import Alarmas from '@/components/Alarmas'

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
      path: '/sanitario/alarmas',
      name: 'Alarmas',
      component: Alarmas
    },
    {
      path: '/sanitario/pacientes/:dniPaciente',
      name: 'HistoricoPaciente',
      component: HistoricoPaciente
    },
    {
      path: '/sanitario/pacientes/:dniPaciente/:idServicioAsignado',
      name: 'ServicioAsignadoInfo',
      component: ServicioAsignadoInfo
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
      path: '/paciente/servicios/:idServicio',
      name: 'MedicionesServicio',
      component: MedicionesServicio
    },
    {
      path: '*',
      name: "*",
      component: Home
    }
  ]
})

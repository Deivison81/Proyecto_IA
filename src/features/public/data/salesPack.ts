export interface ServiceLine {
  key: string
  title: string
  subtitle: string
  description: string
  outcomes: string[]
  images: string[]
}

export const serviceLines: ServiceLine[] = [
  {
    key: 'soporte-ti',
    title: 'Soporte TI',
    subtitle: 'Equipos rapidos y operacion estable',
    description:
      'Atendemos lentitud, bloqueos, errores operativos y mejoras de rendimiento para mantener la productividad.',
    outcomes: [
      'Diagnostico tecnico de equipos y software',
      'Correccion de cuellos de botella en estaciones de trabajo',
      'Mantenimiento preventivo y soporte continuo',
    ],
    images: [
      '/pack de ventas/soporte TI/soporte1.png',
      '/pack de ventas/soporte TI/soporte2.png',
      '/pack de ventas/soporte TI/soporte3.png',
      '/pack de ventas/soporte TI/soporte4.png',
      '/pack de ventas/soporte TI/soportecierre.png',
    ],
  },
  {
    key: 'servidores',
    title: 'Manejo de servidores',
    subtitle: 'Infraestructura estable y segura para operar',
    description:
      'Administramos servidores y plataformas base para reducir riesgos, prevenir interrupciones y sostener la continuidad.',
    outcomes: [
      'Configuracion y mantenimiento preventivo',
      'Monitoreo de estado, capacidad y disponibilidad',
      'Planes de respaldo y recuperacion',
    ],
    images: [],
  },
  {
    key: 'redes',
    title: 'Instalacion y soporte de redes',
    subtitle: 'Conectividad profesional para la empresa',
    description:
      'Disenamos, ordenamos y optimizamos redes para eliminar caidas de internet y problemas de configuracion.',
    outcomes: [
      'Ordenamiento y etiquetado de cableado',
      'Configuracion de switches, routers y Wi-Fi',
      'Mejora de estabilidad y velocidad de red',
    ],
    images: [
      '/pack de ventas/Redes/Redes1.png',
      '/pack de ventas/Redes/Redes2.png',
      '/pack de ventas/Redes/Redes4.png',
      '/pack de ventas/Redes/redes5.png',
      '/pack de ventas/Redes/redes6.png',
    ],
  },
  {
    key: 'desarrollo',
    title: 'Desarrollo y presencia digital',
    subtitle: 'De hojas de calculo a procesos escalables',
    description:
      'Convertimos procesos manuales en soluciones digitales para vender mas y operar con menos friccion.',
    outcomes: [
      'Automatizacion de procesos repetitivos',
      'Implementacion de presencia digital',
      'Flujos integrados para datos y seguimiento',
    ],
    images: [
      '/pack de ventas/Desarrollo/desarroll01.png',
      '/pack de ventas/Desarrollo/desarroll02.png',
      '/pack de ventas/Desarrollo/desarroll03.png',
      '/pack de ventas/Desarrollo/desarroll04.png',
    ],
  },
  {
    key: 'camaras',
    title: 'Instalacion de camaras',
    subtitle: 'Visibilidad y control para proteger la operacion',
    description:
      'Implementamos sistemas de videovigilancia para controlar areas criticas y facilitar seguimiento de eventos.',
    outcomes: [
      'Diseno de cobertura por zonas y puntos ciegos',
      'Configuracion de visualizacion y grabacion',
      'Soporte tecnico para continuidad del sistema',
    ],
    images: [],
  },
  {
    key: 'plan-global',
    title: 'Plan global de crecimiento IT',
    subtitle: 'Acompanamiento estrategico de tecnologia',
    description:
      'Pasamos de soporte reactivo a una ruta de crecimiento con diagnostico, prioridades y ejecucion por etapas.',
    outcomes: [
      'Plan de trabajo con objetivos claros',
      'Priorizacion de iniciativas de alto impacto',
      'Acompanamiento tecnico continuo',
    ],
    images: [
      '/pack de ventas/Plan Global/Automatizacion.png',
      '/pack de ventas/Plan Global/Automatizacion2.png',
      '/pack de ventas/Plan Global/Automatizacion3.png',
      '/pack de ventas/Plan Global/Automatizacion4.png',
    ],
  },
]

export const corporateServices = [
  'Soporte TI',
  'Manejo de servidores',
  'Soporte al desarrollo',
  'Instalacion de redes',
  'Soporte de redes',
  'Instalacion de camaras',
]

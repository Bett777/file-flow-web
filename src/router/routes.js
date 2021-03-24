import Layout from '../layout'

/**
 * hidden: true                  如果设置为 true，该项菜单将不会显示在菜单栏中(默认为 false)
 * meta : {
    title: 'title'               菜单名
    icon: 'icon-name'            图标名
    fixed: true                  如果设置为 true，该项 tag 将一直存在 tag 栏中(默认为 false)
  }
 * */

export const asyncRoutes = [
  {
    path: '/documents',
    name: 'documents',
    component: Layout,
    redirect: '/documents/project',
    meta: {
      title: '文档管理',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: 'project',
        name: 'Project',
        component: () => import('../views/form-table/TableClassic'),
        meta: {
          title: '项目文档管理',
          docType: 1
        }
      },
      {
        path: 'public',
        name: 'Public',
        component: () => import('../views/form-table/PublicDocument'),
        meta: {
          title: '公共文档',
          docType: 2
        }
      },
      {
        path: 'add-doc',
        name: 'AddDoc',
        hidden: true,
        component: () => import('../views/tools/ImageUpload'),
        meta: {
          title: '添加文档'
        }
      },
      {
        path: 'project-doc',
        name: 'ProjectDoc',
        hidden: true,
        component: () => import('../views/tools/CountToPage'),
        meta: {
          title: '文档列表'
        }
      }
    ]
  }
]

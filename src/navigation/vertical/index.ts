// ** Icon imports
import Table from 'mdi-material-ui/Table'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
 
    {
      title: 'Posts',
      icon: Table,
      path: '/posts',
    },
    {
      title: 'User',
      icon: AccountPlusOutline,
      path: '/user',
    },
  ]
}

export default navigation

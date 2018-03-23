import React from 'react'
import _ from 'lodash'

import NavLinksItem from './NavLinksItem'

export const NavLinks = ({ onChange }) => {
  const links = [
    {
      icon: 'coin',
      label: 'Pay',
      id: 'pay',
    },
    {
      icon: 'coin',
      label: 'Request',
      id: 'request',
    },
    {
      icon: 'coin',
      label: 'Add Funds',
      id: 'fund',
    },
    {
      icon: 'wallet',
      label: 'Channels',
      id: 'accounts',
    }, {
      icon: 'swap-horizontal',
      label: 'Transactions',
      id: 'transactions',
    }, {
      icon: 'settings',
      label: 'Settings',
      id: 'settings',
    },
  ]

  return (
    <div>
      { _.map(links, link => (
        <NavLinksItem
          key={ link.id }
          { ...link }
          onClick={ onChange }
        />
      )) }
    </div>
  )
}

export default NavLinks

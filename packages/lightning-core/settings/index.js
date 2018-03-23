import React from 'react'
import _ from 'lodash'
import reactCSS from 'reactcss'
import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { remote } from 'electron'
import { Box, Text } from 'lightning-components'
import { Head, Page } from '../common'
import { InfiniteScroll } from '../common'

const { Menu, MenuItem } = remote

const SettingsLogs = ({ logs }) => {
  const insideStyles = {
    padding: 15,
    overflowX: 'scroll',
  }
  return (
    <InfiniteScroll startAtBottom insideStyles={ insideStyles } updateOn={ logs }>
      { _.map(logs, (log, i) => {
        return (
          <div key={ i } style={{ whiteSpace: 'nowrap' }}>
            <Text size="small" color="gray" fontFamily="monospace">{ log }</Text>
          </div>
        )
      }) }
    </InfiniteScroll>
  )
}

export const SettingsPage = ({ logs, pubkey }) => {
  const styles = reactCSS({
    'default': {
      page: {
        padding: 30, 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, 
        width: '90%',
      },
      pubkeyandlog: {
        boxSizing: 'border-box',
        padding: 'large',
        direction: 'column',
        minWidth: 0,
        flex: 1,
      },
      title: {
        size: 'medium',
        paddingBottom: 'medium',
        color: 'gray',
      },
      account: {
        paddingBottom: 'large',
      },
      logs: {
        flex: 1,
        display: 'flex',
        zDepth: 1,
        width: '100%',
        height: '70%',
        boxSizing: 'border-box',
        background: 'white',
        marginBottom: 'medium',
        overflowX: 'scroll',
      },
    },
  })
  
  const menu = new Menu()
  menu.append(new MenuItem({ label: 'Copy', role: 'copy' }))
  menu.append(new MenuItem({ label: 'Select All', role: 'selectall' }))
  const handleMenu = () => menu.popup(remote.getCurrentWindow())
  
  return (
    <div style={ styles.page }>
      <Head
        title="Settings"
        body="Settings and logs for your wallet and the Lightning app" />
      <div style={ styles.pubkeyandlog } onContextMenu={ handleMenu }>
        { pubkey ? (
          <Box style={ styles.account }>
            <Text size="medium" display="block" ellipsis><Text bold>Pubkey: </Text>{ pubkey }</Text>
          </Box>
        ) : null }
        <Text { ...styles.title }>Logs</Text>
        <Box style={ styles.logs }>
          <SettingsLogs logs={ logs } />
        </Box>
      </div>
	</div>
  )
}

export default connect(
  state => ({
    logs: store.getRecentLogs(state),
    pubkey: store.getAccountPubkey(state),
  }),
)(SettingsPage)

export { default as reducer, actions, selectors } from './reducer'

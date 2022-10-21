/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex } from '@ape.swap/uikit'
import { dexStyles } from '../../styles'
import MigrateProgress from './components/MigrateProgress'
import Steps from './components/Steps'
import { MigrateProvider } from './provider'
import { useSetFarms } from 'state/farms/hooks'
import { usePollVaultUserData, useSetVaults } from 'state/vaults/hooks'

const MigrateAll: React.FC = () => {
  // Fetch farms to filter lps on steps
  useSetFarms()
  useSetVaults()
  usePollVaultUserData()
  return (
    <Flex sx={{ ...dexStyles.pageContainer }}>
      <Flex sx={{ flexDirection: 'column', border: '1px solid red', width: '1200px' }}>
        <MigrateProvider>
          <MigrateProgress activeLineMargin={8.25}>
            <Steps />
          </MigrateProgress>
        </MigrateProvider>
      </Flex>
    </Flex>
  )
}

export default MigrateAll

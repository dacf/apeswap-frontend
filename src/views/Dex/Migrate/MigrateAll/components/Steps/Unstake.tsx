/** @jsxImportSource theme-ui */
import { Button, Flex, Svg, Text, TooltipBubble } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { wrappedToNative } from 'utils'
import { MigrateStatus, useMigrateAll } from '../../provider'
import useUnstakeAll from '../../hooks/useUnstakeAll'
import StatusIcons from '../StatusIcons'

const Unstake: React.FC<{ migrateList: MigrateResult[] }> = ({ migrateList }) => {
  const { t } = useTranslation()
  const { migrateLpStatus, handleUpdateMigrateLp } = useMigrateAll()
  const handleUnstakeAll = useUnstakeAll()
  const listView = migrateList?.map((migrate) => {
    const { token0, token1, lpAddress, stakedBalance, walletBalance } = migrate
    const status = migrateLpStatus.find((status) => status.lpAddress === lpAddress)
    return {
      beforeTokenContent: <StatusIcons lpAddress={lpAddress} />,
      tokens: { token1: token0.symbol, token2: token1.symbol },
      stakeLp: true,
      backgroundColor: 'white3',
      title: `${wrappedToNative(token0.symbol)} - ${wrappedToNative(token1.symbol)}`,
      noEarnToken: true,
      id: lpAddress,
      cardContent: (
        <>
          <ListViewContent title={t('Staked')} value={stakedBalance || '0'} ml={20} />
          <ListViewContent title={t('Wallet')} value={walletBalance || '0'} ml={20} />
          <ListViewContent title={t('Status')} value={status?.statusText || ''} ml={20} />
          <Button onClick={() => handleUpdateMigrateLp(lpAddress, 'unstake', MigrateStatus.PENDING)}>yeehah</Button>
        </>
      ),
    } as ExtendedListViewProps
  })

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Text size="22px" weight={700} mb="15px">
        {t('Unstake All LPs')}
      </Text>
      <Text size="12px" weight={500} mb="15px">
        {t('Unstake all your current LPs to migrate')}
      </Text>
      <Button mb="20px" onClick={() => handleUnstakeAll(migrateList)}>
        Unstake All
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default Unstake

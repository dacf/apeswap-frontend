/** @jsxImportSource theme-ui */
import { Button, Flex, Svg, Text, TooltipBubble } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { wrappedToNative } from 'utils'
import React from 'react'
import { Pair, TokenAmount } from '@ape.swap/sdk'
import StatusIcons from '../StatusIcons'
import { useMigrateAll } from '../../provider'
import useMigrateAllLps from '../../hooks/useMigrateAll'

const Migrate: React.FC<{ migrateList: MigrateResult[]; apeswapWalletLps: { pair: Pair; balance: TokenAmount }[] }> = ({
  migrateList,
  apeswapWalletLps,
}) => {
  const { t } = useTranslation()
  const { migrateLpStatus } = useMigrateAll()
  const handleMigrateAll = useMigrateAllLps()
  const listView = migrateList?.map((migrate) => {
    const { token0, token1, lpAddress, stakedBalance, walletBalance } = migrate
    const status = migrateLpStatus.find((status) => status.lpAddress === lpAddress)
    const matchedApeLps = apeswapWalletLps?.find(
      ({ pair }) => pair.token0.address === token0.address && pair.token1.address === token1.address,
    )
    return {
      beforeTokenContent: <StatusIcons lpAddress={lpAddress} />,
      tokens: { token1: token0.symbol, token2: token1.symbol },
      backgroundColor: 'white3',
      stakeLp: true,
      title: `${wrappedToNative(token0.symbol)} - ${wrappedToNative(token1.symbol)}`,
      noEarnToken: true,
      id: lpAddress,
      cardContent: (
        <>
          <ListViewContent title={t('LP To Maigrate')} value={walletBalance} ml={20} />
          <ListViewContent title={t('Ape LP')} value={matchedApeLps?.balance?.toSignificant(6) || '0'} ml={20} />
          <ListViewContent title={t('Status')} value={status?.statusText || ''} ml={20} />
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
      <Button mb="20px" onClick={() => handleMigrateAll(migrateList)}>
        Migrate All
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default React.memo(Migrate)

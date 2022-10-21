/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { wrappedToNative } from 'utils'
import React from 'react'
import StatusIcons from '../StatusIcons'
import { MigrateStatus, useMigrateAll } from '../../provider'
import useMigrateApproveAll from '../../hooks/useMigrateApproveAll'

const ApproveMigrate: React.FC<{
  migrateList: MigrateResult[]
}> = ({ migrateList }) => {
  const { t } = useTranslation()
  const { migrateLpStatus } = useMigrateAll()
  const handleApproveAll = useMigrateApproveAll()
  const filteredLps = migrateList?.filter(
    (lp) =>
      migrateLpStatus?.find((status) => status.lpAddress === lp.lpAddress)?.status.approveMigrate !==
      MigrateStatus.COMPLETE,
  )
  const listView = filteredLps?.map((migrate) => {
    const { token0, token1, lpAddress, walletBalance } = migrate
    const status = migrateLpStatus?.find((status) => status.lpAddress === lpAddress)
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
          {/* <ListViewContent title={t('Ape LP')} value={matchedApeLps?.balance?.toSignificant(6) || '0'} ml={20} /> */}
          <ListViewContent title={t('Status')} value={status?.statusText || ''} ml={20} />
        </>
      ),
    } as ExtendedListViewProps
  })

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Text size="22px" weight={700} mb="15px">
        {t('Approve All LPs to Migrate')}
      </Text>
      <Text size="12px" weight={500} mb="15px">
        {t('Approve all your current LPs to migrate')}
      </Text>
      <Button mb="20px" onClick={() => handleApproveAll(filteredLps)}>
        Approve All
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default React.memo(ApproveMigrate)

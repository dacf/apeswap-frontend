/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { wrappedToNative } from 'utils'
import React from 'react'
import { Pair, TokenAmount } from '@ape.swap/sdk'
import { useFarms } from 'state/farms/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Switch } from 'theme-ui'
import StatusIcons from '../StatusIcons'
import { MigrateStatus, useMigrateAll } from '../../provider'
import useStakeApproveAll from '../../hooks/useStakeApproveAll'

const ApproveStake: React.FC<{ apeswapWalletLps: { pair: Pair; balance: TokenAmount }[] }> = ({ apeswapWalletLps }) => {
  const { chainId, account } = useActiveWeb3React()
  const farms = useFarms(account)
  const { t } = useTranslation()
  const { migrateLpStatus, migrateMaximizers, setMigrateMaximizersCallback } = useMigrateAll()
  const handleApproveAll = useStakeApproveAll()
  // Since each vault needs a farm we can filter by just farms
  const filteredLps = apeswapWalletLps.filter(({ pair }) =>
    farms.find((farm) => pair.liquidityToken.address.toLowerCase() === farm.lpAddresses[chainId].toLowerCase()),
  )
  // Filter LPs that have been approved
  const filteredLpsForStake = filteredLps?.filter(
    ({ pair }) =>
      migrateLpStatus?.find((status) => status.lpAddress.toLowerCase() === pair.liquidityToken.address.toLowerCase())
        ?.status.approveStake !== MigrateStatus.COMPLETE,
  )

  const listView = filteredLpsForStake?.map((apeLp) => {
    const { pair, balance } = apeLp
    const { token0, token1, liquidityToken } = pair
    const { address: lpAddress } = liquidityToken
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
          <ListViewContent title={t('Wallet')} value={balance?.toSignificant(6) || '0'} ml={20} />
          <ListViewContent title={t('Staked')} value="0" ml={20} />
          <ListViewContent title={t('Status')} value={status?.statusText || ''} ml={20} width={300} />
        </>
      ),
    } as ExtendedListViewProps
  })

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Text size="22px" weight={700} mb="15px">
        {t('Approve All LPs')}
      </Text>
      <Text size="12px" weight={500} mb="15px">
        {t('Unstake all your current LPs to migrate')}
      </Text>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'space-around',
          mb: '15px',
          width: 'fit-content',
        }}
      >
        <Text size="14px" weight={500} mr="10px">
          {t('Migrate to maximizers?')}
        </Text>
        <Flex>
          <Switch
            sx={{
              borderRadius: '8px',
              backgroundColor: 'white4',
              'input:checked ~ &': {
                backgroundColor: 'yellow',
              },
            }}
            checked={migrateMaximizers}
            onChange={() => setMigrateMaximizersCallback(!migrateMaximizers)}
          />
        </Flex>
      </Flex>
      <Button mb="20px" onClick={() => handleApproveAll(filteredLpsForStake)}>
        Approve All
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default React.memo(ApproveStake)

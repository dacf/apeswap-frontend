/** @jsxImportSource theme-ui */
import { Button, Flex, Svg, Text, TooltipBubble } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { wrappedToNative } from 'utils'
import React from 'react'
import { Pair, TokenAmount } from '@ape.swap/sdk'
import { useFarms } from 'state/farms/hooks'
import { useVaults } from 'state/vaults/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import StatusIcons from '../StatusIcons'
import { useMigrateAll } from '../../provider'
import useStakeAll from '../../hooks/useStakeAll'
const Stake: React.FC<{ apeswapWalletLps: { pair: Pair; balance: TokenAmount }[] }> = ({ apeswapWalletLps }) => {
  const { chainId, account } = useActiveWeb3React()
  const farms = useFarms(account)
  const { vaults } = useVaults()
  const { migrateLpStatus } = useMigrateAll()
  const handleStakeAll = useStakeAll()
  const { t } = useTranslation()
  // Since each vault needs a farm we can filter by just farms
  const filteredLpsForStake = apeswapWalletLps.filter(({ pair }) =>
    farms.find((farm) => pair.liquidityToken.address.toLowerCase() === farm.lpAddresses[chainId].toLowerCase()),
  )

  const listView = filteredLpsForStake?.map((apeLp) => {
    const { pair, balance } = apeLp
    const { token0, token1, liquidityToken } = pair
    const { address: lpAddress } = liquidityToken
    const farm = farms.find((farm) => farm.lpAddresses[chainId].toLowerCase() === lpAddress.toLowerCase())
    const vault = vaults.find((vault) => vault.stakeToken.address[chainId].toLowerCase() === lpAddress.toLowerCase())
    const status = migrateLpStatus.find((status) => status.lpAddress === lpAddress)
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
      <Button mb="20px" onClick={() => handleStakeAll(filteredLpsForStake)}>
        Stake All
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default React.memo(Stake)

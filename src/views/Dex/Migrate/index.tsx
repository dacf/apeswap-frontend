/** @jsxImportSource theme-ui */
import React from 'react'
import { Text, Flex, Spinner } from '@ape.swap/uikit'
import UnlockButton from 'components/UnlockButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import FullPositionCard from './components/PositionCard'
import { useUserRecentTransactions } from '../../../state/user/hooks'
import { dexStyles } from '../styles'
import DexNav from '../components/DexNav'
import { styles } from '../AddLiquidity/styles'
import RecentTransactions from '../components/RecentTransactions'
import LiquiditySubNav from '../components/LiquiditySubNav'
import { useMigratorBalances } from 'state/zapMigrator/hooks'
import { useFarms, usePollFarms, useSetFarms } from 'state/farms/hooks'
import { useFetchFarmLpAprs } from 'state/hooks'
import MonkeyImage from '../Orders/components/OrderHistoryPanel/MonkeyImage'

export default function Migrate() {
  // Since we need to display corresponding farm data for an lp we need to pull the farm fata
  useSetFarms()
  usePollFarms()
  const { account, chainId } = useActiveWeb3React()
  useFetchFarmLpAprs(chainId)
  const farms = useFarms(null)
  const [recentTransactions] = useUserRecentTransactions()
  const { t } = useTranslation()

  const { loading, valid, results } = useMigratorBalances()
  const filterResultsByFarms = valid
    ? results.filter((res) => {
        const { token0, token1 } = res
        return farms.find(
          (farm) =>
            (farm.tokenAddresses[chainId].toLowerCase() === token0.address.toLowerCase() ||
              farm.tokenAddresses[chainId].toLowerCase() === token1.address.toLowerCase()) &&
            (farm.quoteTokenAdresses[chainId].toLowerCase() === token0.address.toLowerCase() ||
              farm.quoteTokenAdresses[chainId].toLowerCase() === token1.address.toLowerCase()),
        )
      })
    : []
  const walletBalances = valid ? filterResultsByFarms.filter((bal) => parseFloat(bal.walletBalance) > 0.0) : []
  const stakedBalances = valid ? filterResultsByFarms.filter((bal) => parseFloat(bal.stakedBalance) > 0.0) : []

  return (
    <Flex sx={{ ...dexStyles.pageContainer }}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ ...dexStyles.dexContainer }}>
          <DexNav />
          <LiquiditySubNav />
          <Flex sx={{ flexDirection: 'column', maxWidth: '100%', width: '420px' }}>
            <Flex sx={{ ...styles.topContainer }}>{!account && <UnlockButton fullWidth />}</Flex>
            {(loading || !valid) && account ? (
              <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <Spinner size={100} />
              </Flex>
            ) : account ? (
              walletBalances?.length > 0 || stakedBalances?.length > 0 ? (
                <Flex sx={{ flexDirection: 'column' }}>
                  {walletBalances && (
                    <Text mb="15px" ml="1px">
                      {t('Wallet')} ({walletBalances.length})
                    </Text>
                  )}
                  {walletBalances.map((bal) => (
                    <FullPositionCard {...bal} inWallet key={bal.lpAddress} />
                  ))}
                  {stakedBalances && (
                    <Text margin="15px 0px" ml="1px">
                      {t('Staked')} ({stakedBalances.length})
                    </Text>
                  )}
                  {stakedBalances.map((bal) => (
                    <FullPositionCard {...bal} key={bal.lpAddress} />
                  ))}
                </Flex>
              ) : (
                <Flex
                  sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 0px' }}
                >
                  <MonkeyImage />
                  <Text size="14px" sx={{ margin: '10px 0px 5px 0px', opacity: '.5' }}>
                    {t('No Other LPs Found!')}
                  </Text>
                </Flex>
              )
            ) : (
              <></>
            )}
          </Flex>
        </Flex>
        {recentTransactions && <RecentTransactions />}
      </Flex>
    </Flex>
  )
}

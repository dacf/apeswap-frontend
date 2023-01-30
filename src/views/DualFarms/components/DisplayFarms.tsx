/** @jsxImportSource theme-ui */
import React from 'react'
import { Svg } from '@apeswapfinance/uikit'
import { Svg as Icon, Flex, ListTagVariants, Button } from '@ape.swap/uikit'
import { DualFarm, Tag } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import CalcButton from 'components/RoiCalculator/CalcButton'
import CardActions from './CardActions'
import { NextArrow, styles } from './styles'
import HarvestAction from './CardActions/HarvestAction'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import useAddLiquidityModal from 'components/DualAddLiquidity/hooks/useAddLiquidityModal'
import { ZapType } from '@ape.swap/sdk'
import Tooltip from 'components/Tooltip/Tooltip'
import ListView from 'components/ListViewV2'
import ListViewContent from 'components/ListViewV2/ListViewContent'

const DisplayFarms: React.FC<{ farms: DualFarm[]; openPid?: number; dualFarmTags: Tag[] }> = ({
  farms,
  openPid,
  dualFarmTags,
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const onAddLiquidityModal = useAddLiquidityModal(ZapType.ZAP_MINI_APE)

  const farmsListView = farms.map((farm, i) => {
    const userEarningsMiniChef = getBalanceNumber(farm?.userData?.miniChefEarnings || new BigNumber(0)).toFixed(2)
    const userEarningsRewarder = getBalanceNumber(farm?.userData?.rewarderEarnings || new BigNumber(0)).toFixed(2)
    const userEarningsUsd = `$${(
      getBalanceNumber(farm?.userData?.miniChefEarnings || new BigNumber(0)) * farm?.rewardToken0Price +
      getBalanceNumber(farm?.userData?.rewarderEarnings || new BigNumber(0)) * farm?.rewardToken1Price
    ).toFixed(2)}`
    const userTokenBalance = `${getBalanceNumber(farm?.userData?.tokenBalance || new BigNumber(0))?.toFixed(6)} LP`

    const lpValueUsd = farm?.stakeTokenPrice

    const userTokenBalanceUsd = `$${(
      getBalanceNumber(farm?.userData?.tokenBalance || new BigNumber(0)) * lpValueUsd
    ).toFixed(2)}`

    const fTag = dualFarmTags?.find((tag) => tag.pid === farm.pid)

    // Changing tooltip placement conditionaly until zindex solution
    return {
      tokenDisplayProps: {
        token1: farm.pid === 11 ? 'NFTY2' : farm?.stakeTokens?.token1?.symbol,
        token2: farm?.stakeTokens?.token0?.symbol,
        token3: farm?.rewardTokens?.token0?.symbol,
        token4: farm?.dualImage !== false ? (farm.pid === 11 ? 'NFTY2' : farm?.rewardTokens?.token1?.symbol) : null,
        stakeLp: true,
      },
      listProps: {
        id: farm.pid,
        open: farm.pid === openPid,
        title: (
          <ListViewContent
            tag={fTag?.pid === farm.pid ? (fTag?.text.toLowerCase() as ListTagVariants) : null}
            value={`${farm?.stakeTokens?.token1?.symbol}-${farm?.stakeTokens?.token0?.symbol}`}
            style={{ maxWidth: '170px' }}
          />
        ),
        infoContent: (
          <Tooltip
            valueTitle={t('Multiplier')}
            valueContent={farm?.multiplier}
            tokenContract={farm?.stakeTokenAddress}
          />
        ),
        cardContent: (
          <Flex
            sx={{
              flexDirection: 'column',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Flex sx={styles.onlyMobile}>
              <ListViewContent
                title={t('APY')}
                value={parseFloat(farm?.apy) > 1000000 ? `>1,000,000%` : `${farm?.apy}%`}
                toolTip={t(
                  'APY includes annualized BANANA rewards and rewards for providing liquidity (DEX swap fees), compounded daily.',
                )}
                toolTipPlacement="bottomLeft"
                toolTipTransform="translate(8%, 0%)"
                aprCalculator={
                  <CalcButton
                    label={`${farm?.stakeTokens?.token1?.symbol}-${farm?.stakeTokens?.token0?.symbol}`}
                    rewardTokenName="BANANA"
                    rewardTokenPrice={farm.rewardToken0Price}
                    apr={farm?.apr}
                    lpApr={parseFloat(farm?.lpApr)}
                    apy={parseFloat(farm?.apy)}
                    lpAddress={farm.stakeTokenAddress}
                    isLp
                    tokenAddress={farm?.stakeTokens?.token1?.address[chainId]}
                    quoteTokenAddress={
                      farm?.stakeTokens?.token0?.symbol === 'MATIC'
                        ? 'ETH'
                        : farm?.stakeTokens?.token0?.address[chainId]
                    }
                    lpPrice={farm.stakeTokenPrice}
                    lpCurr1={farm.stakeTokens.token1.address[chainId]}
                    lpCurr2={farm.stakeTokens.token0.address[chainId]}
                  />
                }
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  flexDirection: 'row',
                }}
              />
              <ListViewContent
                title={t('Earned')}
                value={userEarningsUsd}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  flexDirection: 'row',
                }}
              />
            </Flex>
            <Flex sx={styles.onlyDesktop}>
              <ListViewContent
                title={t('APY')}
                value={parseFloat(farm?.apy) > 1000000 ? `>1,000,000%` : `${farm?.apy}%`}
                toolTip={t(
                  'APY includes annualized BANANA rewards and rewards for providing liquidity (DEX swap fees), compounded daily.',
                )}
                toolTipPlacement="bottomLeft"
                toolTipTransform="translate(8%, 0%)"
                aprCalculator={
                  <CalcButton
                    label={`${farm?.stakeTokens?.token1?.symbol}-${farm?.stakeTokens?.token0?.symbol}`}
                    rewardTokenName="BANANA"
                    rewardTokenPrice={farm.rewardToken0Price}
                    apr={farm?.apr}
                    lpApr={parseFloat(farm?.lpApr)}
                    apy={parseFloat(farm?.apy)}
                    lpAddress={farm.stakeTokenAddress}
                    isLp
                    tokenAddress={farm?.stakeTokens?.token1?.address[chainId]}
                    quoteTokenAddress={
                      farm?.stakeTokens?.token0?.symbol === 'MATIC'
                        ? 'ETH'
                        : farm?.stakeTokens?.token0?.address[chainId]
                    }
                    lpPrice={farm.stakeTokenPrice}
                    lpCurr1={farm.stakeTokens.token1.address[chainId]}
                    lpCurr2={farm.stakeTokens.token0.address[chainId]}
                  />
                }
                style={{
                  width: '100%',
                  maxWidth: '85px',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              />
              <ListViewContent
                title={t('APR')}
                value={`${farm?.apr ? farm?.apr.toFixed(2) : 0}%`}
                value2={`${parseFloat(farm?.lpApr).toFixed(2)}%`}
                value2Direction="column"
                value2Icon={
                  <span style={{ marginRight: '7px' }}>
                    <Svg icon="swap" width={13} color="text" />
                  </span>
                }
                valueIcon={
                  <span style={{ marginRight: '5px' }}>
                    <Svg icon="banana_token" width={15} color="text" />
                  </span>
                }
                toolTip={t(
                  'BANANA reward APRs are calculated in real time. DEX swap fee APRs are calculated based on previous 24 hours of trading volume. Note: APRs are provided for your convenience. APRs are constantly changing and do not represent guaranteed returns.',
                )}
                toolTipPlacement={i === farms.length - 1 && i !== 0 ? 'topLeft' : 'bottomLeft'}
                toolTipTransform={i === farms.length - 1 && i !== 0 ? 'translate(-8%, 0%)' : 'translate(8%, 0%)'}
                style={{
                  width: '100%',
                  maxWidth: '85px',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              />
              <ListViewContent
                title={t('Liquidity')}
                value={`$${Number(farm?.totalStaked).toLocaleString(undefined)}`}
                toolTip={t('The total value of the LP tokens currently staked in this farm.')}
                toolTipPlacement="bottomLeft"
                toolTipTransform="translate(23%, 0%)"
                style={{
                  width: '100%',
                  maxWidth: '85px',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              />
              <ListViewContent
                title={t('Earned')}
                value={userEarningsMiniChef}
                valueIcon={
                  <Flex sx={{ height: '20px', alignItems: 'center', mr: '3px' }}>
                    <ServiceTokenDisplay token1={farm?.rewardTokens.token0.symbol} size={13} />
                  </Flex>
                }
                value2={farm?.dualImage !== false ? `${userEarningsRewarder}` : ''}
                value2Direction="column"
                value2Icon={
                  farm?.dualImage !== false ? (
                    <Flex sx={{ height: '20px', alignItems: 'center', mr: '3px' }}>
                      <ServiceTokenDisplay
                        token1={farm.pid === 11 ? 'NFTY2' : farm?.rewardTokens.token1.symbol}
                        size={13}
                      />
                    </Flex>
                  ) : null
                }
                style={{
                  width: '100%',
                  maxWidth: '110px',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  lineHeight: '20px',
                }}
              />
            </Flex>
          </Flex>
        ),
        expandedContent: (
          <>
            <Flex sx={styles.expandedContent}>
              <Flex sx={{ ...styles.onlyMobile, width: '100%' }}>
                <ListViewContent
                  title={t('Liquidity')}
                  value={`$${Number(farm?.totalStaked).toLocaleString(undefined)}`}
                  toolTip={t('The total value of the LP tokens currently staked in this farm.')}
                  toolTipPlacement="bottomRight"
                  toolTipTransform="translate(13%, 0%)"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    flexDirection: 'row',
                    marginTop: '3px',
                  }}
                />
                <Flex sx={{ justifyContent: 'space-between', width: '100%', mt: '10px' }}>
                  <ListViewContent
                    title={t('Available LP')}
                    value={userTokenBalance}
                    value2={userTokenBalanceUsd}
                    value2Secondary
                    value2Direction="column"
                    style={{ maxWidth: '50%', flexDirection: 'column' }}
                  />
                  <Flex sx={{ width: '50%', maxWidth: '130px' }}>
                    <Button
                      onClick={() =>
                        onAddLiquidityModal(
                          farm?.stakeTokens?.token1,
                          farm?.stakeTokens?.token0,
                          null,
                          farm.pid.toString(),
                          true,
                        )
                      }
                      sx={styles.styledBtn}
                    >
                      {t('GET LP')}
                      <Flex sx={{ ml: '5px' }}>
                        <Icon icon="ZapIcon" color="primaryBright" />
                      </Flex>
                    </Button>
                  </Flex>
                </Flex>
                <Flex sx={{ justifyContent: 'space-between', width: '100%', mt: '10px' }}>
                  <CardActions lpValueUsd={lpValueUsd} farm={farm} />
                </Flex>
                <HarvestAction
                  pid={farm.pid}
                  disabled={userEarningsMiniChef === '0.00' && userEarningsRewarder === '0.00'}
                  farm={farm}
                />
              </Flex>
              <Flex sx={{ ...styles.onlyDesktop, width: '100%' }}>
                <Button
                  onClick={() =>
                    onAddLiquidityModal(
                      farm?.stakeTokens?.token1,
                      farm?.stakeTokens?.token0,
                      null,
                      farm.pid.toString(),
                      true,
                    )
                  }
                  sx={styles.styledBtn}
                >
                  {t('GET LP')}
                  <Flex sx={{ ml: '5px' }}>
                    <Icon icon="ZapIcon" color="primaryBright" />
                  </Flex>
                </Button>
                <ListViewContent
                  title={t('Available LP')}
                  value={userTokenBalance}
                  value2={userTokenBalanceUsd}
                  value2Secondary
                  value2Direction="column"
                  style={{ flexDirection: 'column', maxWidth: '120px' }}
                />
                <NextArrow />
                <CardActions lpValueUsd={lpValueUsd} farm={farm} />
                <NextArrow />
                <HarvestAction
                  pid={farm.pid}
                  disabled={userEarningsMiniChef === '0.00' && userEarningsRewarder === '0.00'}
                  farm={farm}
                />
              </Flex>
            </Flex>
          </>
        ),
      },
    }
  })

  return <ListView listViews={farmsListView} />
}

export default React.memo(DisplayFarms)

/** @jsxImportSource theme-ui */
import { Svg, Text, useModal } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useLocation } from 'react-router-dom'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Box } from 'theme-ui'
import useIsMobile from 'hooks/useIsMobile'
import { useAppDispatch } from 'state'
import { Field, selectCurrency } from 'state/swap/actions'
import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Vault } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { NextArrow } from 'views/Farms/components/styles'
import { Container, StyledButton, ActionContainer } from './styles'
import { vaultTokenDisplay } from '../helpers'
import Actions from './Actions'
import HarvestAction from './Actions/HarvestAction'
import DualLiquidityModal from 'components/DualAddLiquidity/DualLiquidityModal'
import { selectOutputCurrency } from '../../../state/zap/actions'
import StyledTag from 'components/ListViewV2/components/StyledTag'
import Tooltip from 'components/Tooltip/Tooltip'
import { BLOCK_EXPLORER } from '../../../config/constants/chains'
import { VaultVersion } from '@ape.swap/apeswap-lists'

const DisplayVaults: React.FC<{ vaults: Vault[]; openId?: number }> = ({ vaults, openId }) => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  const isActive = !pathname.includes('history')
  const { t } = useTranslation()

  const [onPresentAddLiquidityWidgetModal] = useModal(<DualLiquidityModal />, true, true, 'dualLiquidityModal')

  const showLiquidity = (token, quoteToken, vault) => {
    dispatch(
      selectCurrency({
        field: Field.INPUT,
        currencyId: token,
      }),
    )
    dispatch(
      selectCurrency({
        field: Field.OUTPUT,
        currencyId: quoteToken,
      }),
    )
    dispatch(
      selectOutputCurrency({
        currency1: vault.token.address[chainId],
        currency2: vault.quoteToken.address[chainId],
      }),
    )
    onPresentAddLiquidityWidgetModal()
  }

  const vaultsListView = vaults.map((vault) => {
    const totalDollarAmountStaked = Math.round(parseFloat(vault?.totalStaked) * vault?.stakeTokenPrice * 100) / 100
    const liquidityUrl = `https://apeswap.finance/swap/`
    const userAllowance = vault?.userData?.allowance
    const userEarnings = getBalanceNumber(new BigNumber(vault?.userData?.pendingRewards) || new BigNumber(0))
    const userEarningsUsd = `$${(
      (getBalanceNumber(new BigNumber(vault?.userData?.pendingRewards)) || 0) * vault.rewardTokenPrice
    ).toFixed(2)}`
    const userTokenBalance = (getBalanceNumber(new BigNumber(vault?.userData?.tokenBalance)) || 0).toFixed(4)
    const userTokenBalanceUsd = `$${(parseFloat(userTokenBalance || '0') * vault?.stakeTokenPrice).toFixed(2)}`
    const userStakedBalance = getBalanceNumber(new BigNumber(vault?.userData?.stakedBalance))
    const userStakedBalanceUsd = `$${((userStakedBalance || 0) * vault?.stakeTokenPrice).toFixed(2)}`
    const userStakedAndRewardBalance = getBalanceNumber(
      new BigNumber(vault?.userData?.stakedBalance).plus(new BigNumber(vault?.userData?.pendingRewards)),
    )
    const userStakedAndRewardBalanceUsd = `$${((userStakedAndRewardBalance || 0) * vault?.stakeTokenPrice).toFixed(2)}`

    const { tokenDisplay, stakeLp, earnLp } = vaultTokenDisplay(vault.stakeToken, vault.rewardToken)
    const explorerLink = BLOCK_EXPLORER[chainId]
    const vaultContractURL = `${explorerLink}/address/${vault?.stratAddress[chainId]}`

    return {
      tokens: tokenDisplay,
      alignServiceTokens: true,
      stakeLp,
      earnLp,
      tag: (
        <Box sx={{ marginRight: '5px', mt: '1px' }}>
          <StyledTag
            variant={vault.type === 'AUTO' || vault.pid === 0 ? 'error' : 'success'}
            text={vault.pid === 0 ? 'AUTO' : t(vault?.type)}
          />
        </Box>
      ),
      title: <Text style={{ fontSize: isMobile ? '14px' : '16px' }}>{vault.stakeToken.symbol}</Text>,
      titleContainerWidth: 400,
      id: vault.id,
      infoContent: (
        <Tooltip
          valueTitle={t('Withdrawal Fee')}
          valueContent={`${vault?.withdrawFee}%`}
          value2Title={t('Performance Fee')}
          value2Content={`${vault?.keeperFee}%`}
          secondURL={vaultContractURL}
          secondURLTitle={t('View Vault Contract')}
          tokenContract={vault?.stakeToken?.address[chainId]}
        />
      ),
      infoContentPosition: 'translate(8%, 0%)',
      toolTipIconWidth: isMobile && '20px',
      toolTipStyle: isMobile && { marginTop: '10px', marginRight: '10px' },
      expandedContentJustified: (vault.version === VaultVersion.V1 || vault.pid === 0) && 'center',
      open: openId === vault.id,
      cardContent: (
        <>
          <ListViewContent
            title={t('Daily APY')}
            value={`${isActive ? vault?.apy?.daily?.toFixed(2) : '0.00'}%`}
            width={isMobile ? 90 : 140}
            toolTip={t(
              'Daily APY includes BANANA rewards (calculated based on token value, reward rate, and percentage of vault owned) and DEX swap fees, compounded daily.',
            )}
            toolTipPlacement="bottomLeft"
            toolTipTransform="translate(25%, 0%)"
            height={50}
          />
          <ListViewContent
            title={t('Yearly APY')}
            value={`${isActive ? vault?.apy?.yearly?.toFixed(2) : '0.00'}%`}
            width={isMobile ? 95 : 155}
            toolTip={t(
              'Annual APY includes annualized BANANA rewards (calculated based on token value, reward rate, and percentage of vault owned) and DEX swap fees, compounded daily.',
            )}
            toolTipPlacement="bottomLeft"
            toolTipTransform="translate(28%, 0%)"
            height={50}
          />
          <ListViewContent
            title={t('Total Staked')}
            value={`$${totalDollarAmountStaked.toLocaleString(undefined)}`}
            width={isMobile ? 100 : 170}
            toolTip={t('The total value of the tokens currently staked in this vault.')}
            toolTipPlacement="bottomRight"
            toolTipTransform="translate(13%, 0%)"
            height={50}
          />
          <ListViewContent
            title={vault.version === VaultVersion.V1 || vault.pid === 0 ? t('Staked') : t('Earned')}
            value={
              vault.version === VaultVersion.V1
                ? userStakedBalanceUsd
                : vault.version === VaultVersion.V3 && vault.pid === 0
                ? userStakedAndRewardBalanceUsd
                : userEarningsUsd
            }
            width={isMobile ? 50 : 115}
            height={50}
          />
        </>
      ),
      expandedContent: (
        <>
          <ActionContainer>
            {isMobile && (
              <ListViewContent
                title={t('Available %stakeTokenSymbol%', {
                  stakeTokenSymbol: vault.stakeToken.lpToken ? 'LP' : vault?.stakeToken?.symbol,
                })}
                value={userTokenBalance}
                value2={userTokenBalanceUsd}
                value2Secondary
                width={190}
                height={50}
                lineHeight={15}
                ml={10}
              />
            )}
            {vault.stakeToken?.lpToken ? (
              <StyledButton
                sx={{ width: '150px' }}
                onClick={() =>
                  showLiquidity(
                    vault.token.symbol === 'BNB' ? 'ETH' : vault.token.address[chainId],
                    vault.quoteToken.symbol === 'BNB' ? 'ETH' : vault.quoteToken.address[chainId],
                    vault,
                  )
                }
              >
                {t('GET LP')} <Svg icon="ZapIcon" color="primaryBright" />
              </StyledButton>
            ) : (
              <a href={liquidityUrl} target="_blank" rel="noopener noreferrer">
                <StyledButton sx={{ width: '150px' }}>GET {vault?.stakeToken?.symbol}</StyledButton>
              </a>
            )}
            {!isMobile && (
              <ListViewContent
                title={t('Available %stakeTokenSymbol%', {
                  stakeTokenSymbol: vault.stakeToken.lpToken ? 'LP' : vault?.stakeToken?.symbol,
                })}
                value={userTokenBalance}
                value2={userTokenBalanceUsd}
                value2Secondary
                width={190}
                height={50}
                lineHeight={15}
                ml={10}
              />
            )}
          </ActionContainer>
          {vault.version === VaultVersion.V1 || vault.pid === 0
            ? !isMobile && <NextArrow ml="30px" mr="50px" />
            : !isMobile && <NextArrow />}
          <Actions
            allowance={userAllowance?.toString()}
            stakedBalance={
              vault.pid === 0 && vault.version === VaultVersion.V3
                ? new BigNumber(vault?.userData?.stakedBalance)
                    .plus(new BigNumber(vault?.userData?.pendingRewards))
                    .toString()
                : vault?.userData?.stakedBalance?.toString()
            }
            stakedTokenSymbol={vault?.stakeToken?.symbol}
            stakingTokenBalance={vault?.userData?.tokenBalance?.toString()}
            stakeTokenAddress={vault?.stakeToken?.address[chainId]}
            stakeTokenValueUsd={vault?.stakeTokenPrice}
            withdrawFee={vault?.withdrawFee}
            pid={vault.pid}
            vaultVersion={vault.version}
          />
          {(vault.version === VaultVersion.V2 || vault.version === VaultVersion.V3) && vault.pid !== 0 && !isMobile && (
            <NextArrow />
          )}
          {(vault.version === VaultVersion.V2 || vault.version === VaultVersion.V3) && vault.pid !== 0 && (
            <HarvestAction
              pid={vault?.pid}
              disabled={userEarnings <= 0}
              userEarnings={userEarnings}
              earnTokenSymbol={vault?.rewardToken?.symbol}
            />
          )}
        </>
      ),
    } as ExtendedListViewProps
  })
  return (
    <Container>
      <ListView listViews={vaultsListView} />
    </Container>
  )
}

export default React.memo(DisplayVaults)

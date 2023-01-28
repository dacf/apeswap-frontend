/** @jsxImportSource theme-ui */
import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Flex } from '@apeswapfinance/uikit'
import orderBy from 'lodash/orderBy'
import { useTranslation } from 'contexts/Localization'
import Banner from 'components/Banner'
import ListViewLayout from 'components/layout/ListViewLayout'
import partition from 'lodash/partition'
import { useFetchFarmLpAprs } from 'state/hooks'
import { Vault } from 'state/types'
import DisplayVaults from './components/DisplayVaults'
import VaultMenu from './components/Menu'
import { useSetZapOutputList } from 'state/zap/hooks'
import { AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS, LIST_VIEW_PRODUCTS } from 'config/constants/chains'
import ListView404 from 'components/ListView404'
import { usePollVaultsV3Data, usePollVaultV3UserData, useVaultsV3 } from 'state/vaultsV3/hooks'
import LegacyVaults from './LegacyVaults'
import { Text } from '@ape.swap/uikit'
import DisplayDepsoitVaultsV2 from './components/DisplayDepsoitVaultsV2'
import { usePollVaultsData, usePollVaultUserData, useVaults } from 'state/vaults/hooks'
import MigrationRequiredPopup from 'components/MigrationRequiredPopup'
import { useFarmsV2, usePollFarmsV2 } from 'state/farmsV2/hooks'

const NUMBER_OF_VAULTS_VISIBLE = 12

const VaultsV3: React.FC = () => {
  const { chainId } = useActiveWeb3React()
  useFetchFarmLpAprs(chainId)
  usePollVaultsData()
  usePollVaultUserData()
  usePollVaultsV3Data()
  usePollVaultV3UserData()
  usePollFarmsV2()
  const { t } = useTranslation()
  const [stakedOnly, setStakedOnly] = useState(false)
  const [vaultType, setVaultType] = useState('allTypes')
  const [observerIsSet, setObserverIsSet] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const [numberOfVaultsVisible, setNumberOfVaultsVisible] = useState(NUMBER_OF_VAULTS_VISIBLE)
  const { pathname } = useLocation()
  const { search } = window.location
  const v2Farms = useFarmsV2(null)
  const { vaults: initVaults } = useVaultsV3()
  const { vaults: legacyVaults } = useVaults()

  const params = new URLSearchParams(search)
  const urlSearchedVault = parseInt(params.get('id'))
  const [allVaults, setAllVaults] = useState(initVaults)
  const isActive = !pathname.includes('history')
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  useEffect(() => {
    setAllVaults(initVaults)
  }, [initVaults])

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfVaultsVisible((vaultsCurrentlyVisible) => vaultsCurrentlyVisible + NUMBER_OF_VAULTS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const [inactiveVaults, activeVaults] = partition(allVaults, (vault) => vault.inactive)

  const vaultsWithLpBalance = allVaults?.filter((vault) =>
    new BigNumber(vault?.userData?.tokenBalance).isGreaterThan(0),
  )

  const stakedOnlyVaults = activeVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )

  const vaultsHasRewards = stakedOnlyVaults.filter((vault) =>
    new BigNumber(vault.userData.pendingRewards).isGreaterThan(0),
  )

  const stakedInactiveVaults = inactiveVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )

  const sortVaults = (vaultsToSort: Vault[]) => {
    switch (sortOption) {
      case 'apy':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(vaultsToSort, (vault: Vault) => vault?.apy?.daily, 'desc')
      case 'totalStaked':
        return orderBy(vaultsToSort, (vault: Vault) => parseInt(vault?.totalStaked) * vault?.stakeTokenPrice, 'desc')
      default:
        return orderBy(vaultsToSort, (vault: Vault) => vault.platform, 'asc')
    }
  }

  const renderVaults = (): Vault[] => {
    let chosenVaults = isActive ? activeVaults : inactiveVaults

    if (urlSearchedVault) {
      const vaultCheck =
        activeVaults?.find((vault) => {
          return vault.id === urlSearchedVault
        }) !== undefined
      if (vaultCheck) {
        chosenVaults = [
          activeVaults?.find((vault) => {
            return vault.id === urlSearchedVault
          }),
          ...activeVaults?.filter((vault) => {
            return vault.id !== urlSearchedVault
          }),
        ]
      }
    }

    if (stakedOnly) {
      chosenVaults = isActive ? stakedOnlyVaults : stakedInactiveVaults
    }

    if (vaultType !== 'allTypes') {
      chosenVaults = chosenVaults.filter((vault) => vault.type === vaultType.toUpperCase())
    }

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      chosenVaults = chosenVaults.filter((vault) =>
        `${vault?.stakeToken?.symbol.toLowerCase()}-${vault?.rewardToken?.symbol.toLowerCase()}`.includes(
          lowercaseQuery,
        ),
      )
    }
    return sortVaults(chosenVaults).slice(0, numberOfVaultsVisible)
  }

  const renderLegacyVaults = (): Vault[] => {
    let chosenVaults = legacyVaults

    if (stakedOnly) {
      chosenVaults = chosenVaults.filter(
        (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
      )
    }

    if (vaultType !== 'allTypes') {
      chosenVaults = chosenVaults.filter((vault) => vault.type === vaultType.toUpperCase())
    }

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      chosenVaults = chosenVaults.filter((vault) =>
        `${vault?.stakeToken?.symbol.toLowerCase()}-${vault?.rewardToken?.symbol.toLowerCase()}`.includes(
          lowercaseQuery,
        ),
      )
    }
    return chosenVaults.slice(0, numberOfVaultsVisible)
  }

  useSetZapOutputList(
    activeVaults?.slice(1).map((vault) => {
      return { currencyIdA: vault?.token?.address[chainId], currencyIdB: vault?.quoteToken?.address[chainId] }
    }),
  )

  return (
    <>
      <MigrationRequiredPopup v2Farms={v2Farms} farms={[]} vaults={legacyVaults} />
      <Flex
        flexDirection="column"
        justifyContent="center"
        mb="100px"
        style={{ position: 'relative', top: '30px', width: '100%' }}
      >
        <ListViewLayout>
          <Banner
            title={t('BANANA Maximizers')}
            banner="banana-maximizers"
            link="?modal=tutorial"
            titleColor="primaryBright"
            maxWidth={1130}
          />
          <VaultMenu
            onHandleQueryChange={handleChangeQuery}
            onSetSortOption={setSortOption}
            onSetStake={setStakedOnly}
            onSetVaultType={setVaultType}
            vaults={vaultsHasRewards}
            activeOption={sortOption}
            activeVaultType={vaultType}
            stakedOnly={stakedOnly}
            query={searchQuery}
          />
          {!AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS.maximizers.includes(chainId) ? (
            <ListView404 product={LIST_VIEW_PRODUCTS.MAXIMIZERS} />
          ) : (
            <>
              {isActive && (
                <>
                  <LegacyVaults />
                  {vaultsWithLpBalance.length > 0 && (
                    <Flex
                      sx={{
                        background: 'gradient',
                        padding: '5px',
                        borderRadius: '10px 0px 10px 10px',
                        mt: '40px',
                        mb: '20px',
                        position: 'relative',
                      }}
                    >
                      <Flex
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          padding: '2.5px 10px',
                          borderRadius: '10px 10px 0px 0px',
                          background: 'rgb(221,174,66)',
                          transform: 'translate(0px, -24px)',
                          zIndex: 10,
                        }}
                      >
                        <Text size="12px" color="primaryBright">
                          NEW Vaults V2
                        </Text>
                      </Flex>
                      <DisplayDepsoitVaultsV2 vaults={vaultsWithLpBalance} />
                    </Flex>
                  )}
                </>
              )}
              <DisplayVaults vaults={renderVaults()} openId={urlSearchedVault} />
              {!isActive && <DisplayVaults vaults={renderLegacyVaults()} openId={urlSearchedVault} />}
            </>
          )}
        </ListViewLayout>
        <div ref={loadMoreRef} />
      </Flex>
    </>
  )
}

export default VaultsV3

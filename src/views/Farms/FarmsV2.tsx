/** @jsxImportSource theme-ui */
import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Flex, Text } from '@ape.swap/uikit'
import { useFetchFarmLpAprs } from 'state/hooks'
import ListViewMenu from 'components/ListViewMenu'
import { orderBy } from 'lodash'
import ListViewLayout from 'components/layout/ListViewLayout'
import Banner from 'components/Banner'
import { useTranslation } from 'contexts/Localization'
import { Farm } from 'state/types'
import { useFarmTags, useFarmOrderings, useFarms, usePollFarms } from 'state/farms/hooks'
import DisplayFarms from './components/DisplayFarms'
import { BLUE_CHIPS, NUMBER_OF_FARMS_VISIBLE, STABLES } from './constants'
import HarvestAllAction from './components/CardActions/HarvestAllAction'
import { useSetZapOutputList } from 'state/zap/hooks'
import ListView404 from 'components/ListView404'
import { AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS, LIST_VIEW_PRODUCTS } from 'config/constants/chains'
import { useFarmsV2, usePollFarmsV2 } from 'state/farmsV2/hooks'
import LegacyFarms from './LegacyFarms'
import DisplayDepositV2Farms from './components/DisplayDepositV2Farms'
import MigrationRequiredPopup from 'components/MigrationRequiredPopup'

const FarmsV2: React.FC = () => {
  const { account, chainId } = useActiveWeb3React()
  useFetchFarmLpAprs(chainId)
  usePollFarms()
  usePollFarmsV2()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [observerIsSet, setObserverIsSet] = useState(false)
  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const farmsLP = useFarmsV2(account)
  const legacyFarms = useFarms(account)
  const { search } = window.location
  const params = new URLSearchParams(search)
  const urlSearchedFarm = parseInt(params.get('pid'))
  const [query, setQuery] = useState('')
  const [sortOption, setSortOption] = useState('all')
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { farmTags } = useFarmTags(chainId)
  const { farmOrderings } = useFarmOrderings(chainId)

  useEffect(() => {
    const showMoreFarms = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfFarmsVisible((farmsCurrentlyVisible) => farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreFarms, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const [stakedOnly, setStakedOnly] = useState(false)
  const isActive = !pathname.includes('history')

  const activeFarms = farmsLP?.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP?.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')

  const farmsWithLpBalance = farmsLP?.filter(
    (farm) => farm.pid !== 0 && new BigNumber(farm?.userData?.tokenBalance).isGreaterThan(0),
  )

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedOnlyInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const hasHarvestPids = [...activeFarms, ...inactiveFarms]
    .filter((farm) => farm.userData && new BigNumber(farm.userData.earnings).isGreaterThan(0))
    .map((filteredFarm) => {
      return filteredFarm.pid
    })

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const renderFarms = () => {
    let farms = isActive ? activeFarms : inactiveFarms

    if (urlSearchedFarm) {
      const farmCheck =
        activeFarms?.find((farm) => {
          return farm.pid === urlSearchedFarm
        }) !== undefined
      if (farmCheck) {
        farms = [
          activeFarms?.find((farm) => {
            return farm.pid === urlSearchedFarm
          }),
          ...activeFarms?.filter((farm) => {
            return farm.pid !== urlSearchedFarm
          }),
        ]
      }
    }

    if (stakedOnly) {
      farms = isActive ? stakedOnlyFarms : stakedOnlyInactiveFarms
    }

    if (query) {
      farms = farms.filter((farm) => {
        return farm.lpSymbol.toUpperCase().includes(query.toUpperCase())
      })
    }

    // TODO: Refactor this to be a helper function outside of this file
    switch (sortOption) {
      case 'all':
        return farmOrderings
          ? orderBy(
              farms,
              (farm: Farm) => farmOrderings.find((ordering) => ordering.pid === farm.pid)?.order,
              'asc',
            ).slice(0, numberOfFarmsVisible)
          : farms.slice(0, numberOfFarmsVisible)
      case 'stables':
        return farms
          .filter((farm) => STABLES.includes(farm.tokenSymbol) && STABLES.includes(farm.quoteTokenSymbol))
          .slice(0, numberOfFarmsVisible)
      case 'apr':
        return orderBy(farms, (farm) => parseFloat(farm.apy), 'desc').slice(0, numberOfFarmsVisible)
      case 'blueChips':
        return farms
          .filter((farm) => BLUE_CHIPS.includes(farm.tokenSymbol) || BLUE_CHIPS.includes(farm.quoteTokenSymbol))
          .slice(0, numberOfFarmsVisible)
      case 'liquidity':
        return orderBy(farms, (farm: Farm) => parseFloat(farm.totalLpStakedUsd), 'desc').slice(0, numberOfFarmsVisible)
      case 'hot':
        return farmTags
          ? orderBy(
              farms,
              (farm: Farm) => farmTags?.find((tag) => tag.pid === farm.pid && tag.text.toLowerCase() === 'hot'),
              'asc',
            ).slice(0, numberOfFarmsVisible)
          : farms.slice(0, numberOfFarmsVisible)
      case 'new':
        return farmTags
          ? orderBy(
              farms,
              (farm: Farm) => farmTags?.find((tag) => tag.pid === farm.pid && tag.text.toLowerCase() === 'new'),
              'asc',
            ).slice(0, numberOfFarmsVisible)
          : farms.slice(0, numberOfFarmsVisible)
      default:
        return farmOrderings
          ? orderBy(
              farms,
              (farm: Farm) => farmOrderings.find((ordering) => ordering.pid === farm.pid)?.order,
              'asc',
            ).slice(0, numberOfFarmsVisible)
          : farms.slice(0, numberOfFarmsVisible)
    }
  }

  const renderLegacyFarms = () => {
    let farms = legacyFarms

    if (stakedOnly) {
      farms = legacyFarms.filter((farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0))
    }

    if (query) {
      farms = legacyFarms.filter((farm) => {
        return farm.lpSymbol.toUpperCase().includes(query.toUpperCase())
      })
    }
    return farms.slice(0, numberOfFarmsVisible)
  }

  // Set zap output list to match farms
  useSetZapOutputList(
    activeFarms?.map((farm) => {
      return { currencyIdA: farm?.tokenAddresses[chainId], currencyIdB: farm?.quoteTokenAdresses[chainId] }
    }),
  )

  return (
    <>
      <MigrationRequiredPopup v2Farms={farmsLP} farms={legacyFarms} vaults={[]} />
      <Flex
        sx={{
          position: 'relative',
          top: '30px',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          mb: '100px',
        }}
      >
        <ListViewLayout>
          <Banner
            banner="banana-farms"
            link="?modal=tutorial"
            title={t('Banana Farms')}
            listViewBreak
            maxWidth={1130}
          />
          <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: '20px' }}>
            <ListViewMenu
              onHandleQueryChange={handleChangeQuery}
              onSetSortOption={setSortOption}
              onSetStake={setStakedOnly}
              harvestAll={
                <HarvestAllAction pids={hasHarvestPids} disabled={hasHarvestPids.length === 0} v2Flag={true} />
              }
              stakedOnly={stakedOnly}
              query={query}
              activeOption={sortOption}
              showMonkeyImage
            />
          </Flex>
          {!AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[LIST_VIEW_PRODUCTS.FARMS].includes(chainId) ? (
            <Flex mt="20px">
              <ListView404 product={LIST_VIEW_PRODUCTS.FARMS} />
            </Flex>
          ) : (
            <>
              {isActive && (
                <>
                  <LegacyFarms />
                  {farmsWithLpBalance.length > 0 && (
                    <Flex
                      sx={{
                        background: 'gradient',
                        padding: '5px',
                        borderRadius: '10px 0px 10px 10px',
                        mt: '40px',
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
                          NEW Master Ape V2
                        </Text>
                      </Flex>
                      <DisplayDepositV2Farms farms={farmsWithLpBalance} openPid={null} farmTags={null} v2Flag={true} />
                    </Flex>
                  )}
                </>
              )}
              <Flex sx={{ mt: '20px' }}>
                <DisplayFarms farms={renderFarms()} openPid={urlSearchedFarm} farmTags={null} v2Flag={true} />
              </Flex>
              {!isActive && (
                <DisplayFarms farms={renderLegacyFarms()} openPid={urlSearchedFarm} farmTags={null} v2Flag={false} />
              )}
            </>
          )}
        </ListViewLayout>
      </Flex>
      <div ref={loadMoreRef} />
    </>
  )
}

export default React.memo(FarmsV2)

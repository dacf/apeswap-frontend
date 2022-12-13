import { Skeleton, Text, useMatchBreakpoints } from '@apeswapfinance/uikit'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import useCurrentTime from 'hooks/useTimer'
import React from 'react'
import getTimePeriods from 'utils/getTimePeriods'
import { StyledHeadingText } from './Modals/styles'
import ListViewContentMobile from '../../../components/ListViewV2/ListViewContentMobile'

const VestedTimer: React.FC<{
  lastBlockTimestamp: string
  vesting: string
  userModalFlag?: boolean
  transferModalFlag?: boolean
  mobileFlag?: boolean
}> = ({ lastBlockTimestamp, vesting, userModalFlag, transferModalFlag, mobileFlag }) => {
  const { isXl, isLg, isXxl } = useMatchBreakpoints()
  const { t } = useTranslation()
  const isMobile = !isLg && !isXl && !isXxl
  const currentTime = useCurrentTime() / 1000
  const vestingTime = getTimePeriods(parseInt(lastBlockTimestamp) + parseInt(vesting) - currentTime, true)

  return transferModalFlag ? (
    <Text bold>
      {vestingTime.days}d, {vestingTime.hours}h, {vestingTime.minutes}m
    </Text>
  ) : userModalFlag ? (
    <StyledHeadingText bold>
      {vestingTime ? (
        `${vestingTime.days}d, ${vestingTime.hours}h, ${vestingTime.minutes}m`
      ) : (
        <Skeleton width="150px" height="32.5px" animation="waves" />
      )}
    </StyledHeadingText>
  ) : mobileFlag ? (
    <ListViewContentMobile
      title={'Fully Vested'}
      value={`${vestingTime.days}d, ${vestingTime.hours}h, ${vestingTime.minutes}m`}
      toolTip={`This is the time remaining until all tokens from the bill are available to claim.`}
      toolTipPlacement={'bottomLeft'}
      toolTipTransform={'translate(34%, 0%)'}
    />
  ) : (
    <ListViewContent
      title={t('Fully Vested')}
      value={`${vestingTime.days}d, ${vestingTime.hours}h, ${vestingTime.minutes}m`}
      width={isMobile ? 200 : 180}
      height={52.5}
      toolTip={t('This is the time remaining until all tokens from the bill are available to claim.')}
      toolTipPlacement={isMobile ? 'bottomRight' : 'bottomLeft'}
      toolTipTransform={isMobile ? 'translate(-75%, 65%)' : 'translate(34%, -4%)'}
    />
  )
}

export default React.memo(VestedTimer)

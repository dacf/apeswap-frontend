/** @jsxImportSource theme-ui */
import { Flex, Svg, Text } from '@ape.swap/uikit'
import React, { ReactNode } from 'react'
import { useMigrateAll } from '../../provider'
import { MIGRATION_STEPS } from '../../provider/constants'
import { MigrateStatus } from '../../provider/types'
import { styles } from './styles'

interface MigrateProcessBarInterface {
  activeLineMargin?: number
  children: ReactNode
}

const MigrateProgress: React.FC<MigrateProcessBarInterface> = ({ children }) => {
  const { activeIndex, migrateLpStatus, migrationLoading, handleActiveIndexCallback } = useMigrateAll()
  const isComplete = migrateLpStatus?.map((item) =>
    Object.entries(item.status).map((each) => each[1] === MigrateStatus.COMPLETE),
  )
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
        {MIGRATION_STEPS.map(({ title }, i) => {
          const isIndexComplete = isComplete.filter((loFlag) => !loFlag[i]).length === 0
          return (
            <>
              <Flex key={title} onClick={() => handleActiveIndexCallback(i)} sx={styles.mobileContainer}>
                <Flex sx={{ width: '30px', background: 'primaryBright', borderRadius: '15px' }}>
                  {isIndexComplete && !migrationLoading ? (
                    <Svg icon="success" width="100%" />
                  ) : (
                    <Flex sx={styles.mobileProgressCircleContainer}>
                      <Text size="18px" color="primaryBright" weight={700} sx={{ transform: 'translate(-.5px, 1px)' }}>
                        {i + 1}
                      </Text>
                    </Flex>
                  )}
                </Flex>
                <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="10px" weight={500}>
                    {title}
                  </Text>
                </Flex>
              </Flex>
              {i !== MIGRATION_STEPS.length - 1 && (
                <Flex
                  sx={{
                    background: activeIndex > i ? 'gradient' : 'white2',
                    zIndex: 1,
                    width: `${30 - MIGRATION_STEPS.length}%`,
                    height: '6px',
                    alignSelf: 'flex-start',
                    mt: '12px',
                  }}
                />
              )}
            </>
          )
        })}
      </Flex>
      <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: '10px' }}>
        <Text weight={500} size="14px">
          {MIGRATION_STEPS[activeIndex].description}
        </Text>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={styles.mobileChildContainer}>
          <Flex
            sx={{ height: '100%', width: '100%', background: 'white2', borderRadius: '10px', padding: '20px 10px' }}
          >
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(MigrateProgress)

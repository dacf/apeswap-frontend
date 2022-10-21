/** @jsxImportSource theme-ui */
import { Flex, Svg, Text, TooltipBubble } from '@ape.swap/uikit'
import React, { ReactNode } from 'react'
import { MigrateStatus, MIGRATION_STEPS, useMigrateAll } from '../provider'

interface MigrateProcessBarInterface {
  activeLineMargin?: number
  children: ReactNode
}

const MigrateProgress: React.FC<MigrateProcessBarInterface> = ({ activeLineMargin, children }) => {
  const { activeIndex, migrateLpStatus, setActiveIndexCallback } = useMigrateAll()
  const isComplete = migrateLpStatus?.map((item) =>
    Object.entries(item.status).map((each) => each[1] === MigrateStatus.COMPLETE),
  )
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center' }}>
        {MIGRATION_STEPS.map(({ title, description }, i) => {
          const isIndexComplete = isComplete.filter((loFlag) => !loFlag[i]).length === 0
          return (
            <>
              <Flex
                key={title}
                onClick={() => setActiveIndexCallback(i)}
                sx={{
                  background: activeIndex >= i ? 'gradient' : 'white2',
                  height: '100px',
                  width: '100%',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                <Flex
                  sx={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '30px',
                    background: 'white3',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: '15px',
                    ml: '5px',
                  }}
                >
                  {isIndexComplete ? (
                    <Svg icon="success" width="100%" />
                  ) : (
                    <Text
                      size="35px"
                      color={activeIndex === i ? 'smartGradient' : 'text'}
                      weight={700}
                      sx={{
                        lineHeight: '2.5px',
                        width: '100%',
                        height: '0px',
                        textAlign: 'center',
                        opacity: '.6',
                      }}
                    >
                      {i + 1}
                    </Text>
                  )}
                </Flex>
                <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="20px" weight={700} mr="5px" color={activeIndex >= i ? 'primaryBright' : 'text'}>
                    {title}
                  </Text>
                  <Flex sx={{ mt: '2.5px' }}>
                    <TooltipBubble
                      placement="bottomRight"
                      body={description}
                      transformTip="translate(10%, 0%)"
                      width="200px"
                    >
                      <Svg icon="info" width="16.5px" color={activeIndex >= i ? 'primaryBright' : 'text'} />
                    </TooltipBubble>
                  </Flex>
                </Flex>
              </Flex>
              {i !== MIGRATION_STEPS.length - 1 && (
                <Flex
                  sx={{
                    background: activeIndex >= i ? 'gradient' : 'white2',
                    width: `${10 - MIGRATION_STEPS.length}%`,
                    height: '10px',
                  }}
                />
              )}
            </>
          )
        })}
      </Flex>
      <Flex sx={{ width: '100%', position: 'relative', flexDirection: 'column' }}>
        <Flex
          sx={{
            background: 'gradient',
            height: '75px',
            width: '10px',
            left: `${(activeIndex / MIGRATION_STEPS.length) * 100 + activeIndex + activeLineMargin || 15}%`,
            position: 'absolute',
            zindex: -1,
          }}
        />
        <Flex
          sx={{
            width: '100%',
            height: 'fit-content',
            padding: '10px',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            background: 'gradient',
            borderRadius: '10px',
            mt: '70px',
          }}
        >
          <Flex sx={{ height: '100%', width: '100%', background: 'white2', borderRadius: '10px', padding: '50px' }}>
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(MigrateProgress)

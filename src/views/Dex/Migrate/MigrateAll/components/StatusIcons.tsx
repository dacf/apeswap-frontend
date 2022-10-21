/** @jsxImportSource theme-ui */
import { Flex, Svg, Text } from '@ape.swap/uikit'
import React from 'react'
import { Spinner } from 'theme-ui'
import { MigrateStatus, useMigrateAll } from '../provider'

const StatusIcons: React.FC<{ lpAddress: string }> = ({ lpAddress }) => {
  const { migrateLpStatus } = useMigrateAll()
  const status = migrateLpStatus.find((status) => status.lpAddress === lpAddress)
  return (
    <Flex sx={{ width: '100px', transform: 'translate(-15px, 0px)' }}>
      {status &&
        Object.values(status.status).map((val, i) =>
          val === MigrateStatus.COMPLETE ? (
            <Flex sx={{ width: '25px', mr: '3px' }}>
              <Svg icon="success" width="100%" />
            </Flex>
          ) : val === MigrateStatus.INCOMPLETE ? (
            <Flex
              sx={{
                width: '25px',
                mr: '3px',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white4',
                borderRadius: '15px',
              }}
            >
              <Text size="14px">{i + 1}</Text>
            </Flex>
          ) : val === MigrateStatus.PENDING ? (
            <Flex sx={{ width: '25px', mr: '3px' }}>
              <Spinner width="25px" height="25px" />
            </Flex>
          ) : (
            <Flex sx={{ width: '25px', mr: '3px' }}>
              <Svg icon="error" width="100%" />
            </Flex>
          ),
        )}
    </Flex>
  )
}

export default StatusIcons

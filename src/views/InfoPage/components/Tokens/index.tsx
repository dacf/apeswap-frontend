/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import { orderBy } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { useFetchActiveChains, useFetchInfoNativePrice, useFetchInfoTokensData } from 'state/info/hooks'
import ReactPaginate from 'react-paginate'
import Rows from './Rows'
import styled from 'styled-components'
import useIsMobile from '../../../../hooks/useIsMobile'

const ROWS_PER_PAGE = 10

const Tokens = () => {
  const mobile = useIsMobile()
  const [activeChains] = useFetchActiveChains()

  const [pageCount, setPageCount] = useState(0)
  const [dataOffset, setDataOffset] = useState(0)
  const tokens = useFetchInfoTokensData(20, true)
  const nativePrice = useFetchInfoNativePrice()

  const flattenedTokens = Object.values(tokens).flatMap((row) => (row.initialized ? row.data : []))
  const sortedTokens = useMemo(
    () =>
      orderBy(
        flattenedTokens.filter((x) => activeChains === null || activeChains.includes(x.chainId)),
        ({ totalLiquidity, chainId, derivedETH }) =>
          parseFloat(totalLiquidity) * (parseFloat(nativePrice[chainId]?.data?.ethPrice) || 0) * parseFloat(derivedETH),
        'desc',
      ),
    [flattenedTokens, nativePrice, activeChains],
  )
  const handlePageClick = (event) => {
    const newOffset = (event.selected * ROWS_PER_PAGE) % sortedTokens.length
    setDataOffset(newOffset)
  }
  useEffect(() => {
    setPageCount(Math.ceil(sortedTokens.length / ROWS_PER_PAGE))
  }, [sortedTokens.length, dataOffset])

  return (
    <Flex sx={{ flexDirection: 'column', width: `${mobile ? '95vw' : '100%'}`, mt: '20px' }}>
      <Text size="18px" weight={700}>
        Top Tokens
      </Text>

      <Flex
        sx={{
          width: '100%',
          height: '550px',
          background: 'white2',
          flexDirection: 'column',
          padding: '30px 10px 20px 10px',
          borderRadius: '10px',
          mt: '20px',
        }}
      >
        <Rows tokens={sortedTokens.slice(dataOffset, dataOffset + ROWS_PER_PAGE)} activeIndex={dataOffset} />
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Pagination
            previousLabel="<"
            nextLabel=">"
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            onPageChange={handlePageClick}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Tokens

const Pagination = styled(ReactPaginate).attrs({
  activeClassName: 'active',
})`
  display: flex;
  flex-direction: row;
  list-style-type: none;
  padding: 0.75rem 0;
  li {
    height: 32px;
    width: 32px;
    border-radius: 7px;
    border: gray 1px solid;
    cursor: pointer;
    margin-right: 0.5rem;
  }
  li.previous,
  li.next,
  li.break {
    border-color: transparent;
  }
  li.active {
    background-color: #ffb300;
    border-color: transparent;
    color: white;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }

  li a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
`

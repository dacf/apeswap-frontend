import styled from 'styled-components'

const NftGrid = styled.div`
  padding-bottom: 24px;
  padding-top: 24px;

  & > div {
    grid-column: 2 / 6;

    ${({ theme }) => theme.mediaQueries.sm} {
      grid-column: span 4;
    }
  }
`

export default NftGrid

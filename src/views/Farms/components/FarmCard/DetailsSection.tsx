import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, LinkExternal, Skeleton, Link } from '@pancakeswap/uikit'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  removed?: boolean
  totalValueFormatted?: string
  lpLabel?: string
  addLiquidityUrl?: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  infoAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{t('Total MRT-BNB Staked')}:</Text>
        {totalValueFormatted ? <Text>{totalValueFormatted}</Text> : <Skeleton width={75} height={25} />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text>{t('Total Liquidity')}:</Text>
        {totalValueFormatted ? <Text>{totalValueFormatted}</Text> : <Skeleton width={75} height={25} />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text>{t('Deposit Fee')}:</Text>
        {totalValueFormatted ? <Text>-</Text> : <Skeleton width={75} height={25} />}
      </Flex>
      {!removed && (
        <Flex mb="2px" justifyContent="flex-end">
          <StyledLinkExternal href={addLiquidityUrl}>{t('Get MRT-BNB', { symbol: lpLabel })}</StyledLinkExternal>
        </Flex>
      )}
      <Flex mb="2px" justifyContent="flex-end">
        <StyledLinkExternal href={bscScanAddress}>{t('View Contract')}</StyledLinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <StyledLinkExternal href={infoAddress}>{t('See Pair Info')}</StyledLinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <Link href="localhost:3000/farms" bold={false} color="red">
          {t('Emergency Withdrawal')}
        </Link>
      </Flex>
    </Wrapper>
  )
}

export default DetailsSection

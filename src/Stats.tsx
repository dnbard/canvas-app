import React, { HTMLAttributes, FunctionComponent } from 'react'
import styled from 'styled-components'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'

import { Document } from './utils/store'

interface StatsProps extends HTMLAttributes<HTMLDivElement> {
  document: Document
}

const OneStat = styled.div`
  width: 16px;
  height: 16px;
  background: ${({ color }) => color};
  border-radius: 4px;
  border: 1px solid white;
  margin: 8px;
  box-shadow: 1px 1px 1px 0px black;
`

const StatContainer = styled.div`
  display: flex;
  align-items: center;
  color: black;
`

const Stats: FunctionComponent<StatsProps> = ({ document, ...props }) => {
  const { paths } = document
  const groups = groupBy(paths, 'color')

  console.log(groups)

  return (
    <div {...props}>
      {map(groups, (g, color) => {
        return <StatContainer key={color}>
          <OneStat color={color} />
          Objects: {g.length}; Points: {g.map(g => g.elements.length).reduce((a, b) => a + b, 0)}
          </StatContainer>
      })}
    </div>
  )
}

export default styled(Stats)`
  display: flex;
  justify-content: center;
  margin: 32px 0;
  flex-direction: column;
  align-items: center;
`


import React, { useReducer } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import Canvas from './Canvas'
import Stats from './Stats'
import mockDocument from './utils/mock'
import { beginPath, continuePath, endPath, undo } from './utils/store'

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0px;
  }

  .chrome-picker {
    box-shadow: none !important;
    border-radius: 0 !important;
  }
`

let document

try {
  document = JSON.parse(localStorage.getItem('document') as string)
} catch (e) {
  document = mockDocument
}

if (!document) {
  document = mockDocument
}

const initialState = { document }

function reducer(state, action) {
  if (action.type === 'document-set') {
    return { ...state, document: action.document }
  } else if (action.type === 'path-begin') {
    beginPath(action.context, state.document, action)
    return { ...state }
  } else if (action.type === 'path-continue') {
    continuePath(action.context, state.document, action)
    return { ...state }
  } else if (action.type === 'path-end') {
    endPath(action.context, state.document)
    return { ...state }
  } else if (action.type === 'undo') {
    undo(action.context, state.document)
    return { ...state }
  }

  return state
}

const App = ({ ...props }) => {
  const [{ document }, dispatch] = useReducer(reducer, initialState)

  return (
    <div {...props}>
      <GlobalStyles />
      <header>
        Hasty.ai canvas editor
      </header>
      <section>
        <Canvas document={document} dispatch={dispatch} />
        <Stats document={document} />
      </section>
    </div>
  );
}

export default styled(App)`
  color: lavender;

  header {
    background: #005c6b;
    padding: 8px 32px;
    height: 48px;
    font-size: 24pt;
    display: flex;
    justify-content: center;
    text-transform: capitalize;
  }

  section {
    height: calc(100vh - 64px);
    background: darkgrey;
  }
`

import React, { useCallback, useRef, useEffect, HTMLAttributes, FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import { ChromePicker, ColorResult } from 'react-color'

import { Document, refreshDocument } from './utils/store'
import Button from './Button'

interface CanvasProps extends HTMLAttributes<HTMLDivElement> {
  document: Document
  dispatch: any
}

const ButtonsContainer = styled.div`
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  > button {
    margin: 8px 0
  }
`

const decimalToHex = (alpha: number) => alpha === 0 ? '00' : Math.round(255 * alpha).toString(16)

const Canvas: FunctionComponent<CanvasProps> = ({ document, dispatch, ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [color, setColor] = useState<any>('#000')
  const [firstLoad, setFirstLoad] = useState(true)

  const handleColorChange = (c: ColorResult) => {
    const hexCode = `${c.hex}${decimalToHex(c.rgb.a)}`
    setColor(hexCode)
  }

  const clearDocument = useCallback(() => {
    dispatch({ type: 'document-set', document: { paths: [] } })
    const canvas = canvasRef?.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    context.clearRect(0, 0, canvas.width, canvas.height)
  }, [dispatch])

  const saveDocument = useCallback(() => {
    window.localStorage.setItem('document', JSON.stringify(document))
    window.location.reload()
  }, [document])

  const undoAction = useCallback(() => {
    const canvas = canvasRef?.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    context.clearRect(0, 0, canvas.width, canvas.height)
    dispatch({ type: 'undo', context })
  }, [dispatch])

  useEffect(() => {
    const canvas = canvasRef?.current

    if (!canvas) {
      return
    }

    let context: CanvasRenderingContext2D
    let boundings = { left: 0, top: 0 }
    let isDrawing = false

    context = canvas.getContext('2d') as CanvasRenderingContext2D
    boundings = canvas.getBoundingClientRect()

    if (firstLoad && document.paths.length > 0) {
      refreshDocument(context, document)
      context.strokeStyle = color
      setFirstLoad(false)
    }

    const getMouseCoordinates = (event: MouseEvent) => {
      const x = event.clientX - boundings.left
      const y = event.clientY - boundings.top
  
      return { x, y }
    }

    const onMouseDown = (event: MouseEvent) => {
      const { x, y } = getMouseCoordinates(event)
      isDrawing = true
      context.strokeStyle = color

      dispatch({ type: 'path-begin', x, y, color: color, context })
    }

    const onMouseMove = (event: MouseEvent) => {
      const { x, y } = getMouseCoordinates(event)

      if(isDrawing){
        dispatch({ type: 'path-continue', x, y, context })
      }
    }

    const onMouseUp = () => {
      isDrawing = false
      dispatch({ type: 'path-end', context })
    }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
    }
  }, [firstLoad, document, dispatch, color])

  return (
    <div {...props}>
      <canvas ref={canvasRef} width="640" height="400" />
      <ChromePicker color={color} onChangeComplete={handleColorChange} />
      <ButtonsContainer>
        <Button onClick={clearDocument} $background="darkred">⌧ Clear</Button>
        <Button onClick={saveDocument} $background="#006b8b">💾 Save</Button>
        <Button onClick={undoAction} $background="#6511c1">⮎ Undo</Button>
      </ButtonsContainer>
    </div>
  )
}

export default styled(Canvas)`
  display: flex;
  justify-content: center;

  canvas {
    background: white;
  }
`

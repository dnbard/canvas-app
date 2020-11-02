import debounce from 'lodash/debounce'

export interface PathElement {
  x: number
  y: number
  color?: string
}

export interface Path {
  elements: PathElement[]
  color: string
}

export interface Document {
  paths: Path[]
}

export const refreshDocument = (context: CanvasRenderingContext2D, document: Document) => {
  document.paths.forEach(path  => {
    const { elements, color } = path
    elements.forEach((el: PathElement, index: number) => {
      const { x, y } = el

      if (index === 0) {
        context.strokeStyle = color
        context.beginPath()
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    })
    context.stroke()
    context.closePath()
  })
}

export const beginPath = debounce((context: CanvasRenderingContext2D, document: Document, { x, y, color }: PathElement) => {
  context.beginPath()
  context.moveTo(x, y)

  console.log('+')

  document.paths.push({
    elements: [{ x, y }],
    color: color || '#000',
  })
}, 100, { leading: true, trailing: false })

export const continuePath = (context: CanvasRenderingContext2D, document: Document, { x, y }: PathElement) => {
  context.clearRect(0, 0, 640, 400)
  refreshDocument(context, document as Document)
  document.paths[document.paths.length - 1].elements.push({ x, y })
}

export const endPath = (context: CanvasRenderingContext2D, document: Document) => {
  context.closePath()
}

export const undo = (context: CanvasRenderingContext2D, document: Document) => {
  if (document.paths.length > 0) {
    document.paths.splice(-1,1)
    console.log(document)
    setTimeout(() => refreshDocument(context, document as Document), 1)
  }
}

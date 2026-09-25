import { createJapanScene } from './japanScene'
import { createPixelArtMode } from './pixelArtScene'

export const createJapanMode = () => createPixelArtMode(createJapanScene)

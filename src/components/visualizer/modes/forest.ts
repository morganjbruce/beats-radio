import { createForestScene } from './forestScene'
import { createPixelArtMode } from './pixelArtScene'

export const createForestMode = () => createPixelArtMode(createForestScene)

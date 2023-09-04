import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

import type { FaceLandmarkerResult } from '@mediapipe/tasks-vision'

import * as PathDef from './path-definitions'

type Source =
  | HTMLCanvasElement
  | HTMLVideoElement
  | HTMLImageElement
  | ImageData
  | ImageBitmap
type RunningMode = 'IMAGE' | 'VIDEO'

interface DetectionResult {
  sourceObject: FaceLandmarkerResult
}

export class FaceLandmarkDetector {
  protected faceLandmarker: FaceLandmarker | null = null
  protected runningMode: RunningMode = 'IMAGE'
  protected source: Source | null = null

  async load(): Promise<void> {
    await this.createFaceLandmarker()
  }

  protected async createFaceLandmarker(): Promise<void> {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      PathDef.runtime.vision
    )
    this.faceLandmarker = await FaceLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath: PathDef.models.faceLandmarker,
          delegate: 'GPU'
        },
        outputFaceBlendshapes: true,
        runningMode: this.runningMode,
        numFaces: 1
      }
    )
  }

  setSource(source: Source): void {
    this.source = source
  }

  detect(): DetectionResult | null {
    if (this.faceLandmarker === null || this.source === null) {
      return null
    }

    const sourceObject = this.faceLandmarker.detect(this.source)
    return { sourceObject }
  }
}

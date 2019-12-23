import { Pipe, PipeTransform } from '@angular/core';
import { Directions, StepSegment, WaypointSegment } from '~shared';

@Pipe({
  name: 'directionStepsExtractor'
})
export class DirectionStepsExtractorPipe implements PipeTransform {

  transform(directions: Directions, segmentIdx?: number): string[] {
    const directionSteps: string[] = [];
    if (directions) {
      const targetDirSegs: WaypointSegment[] = (segmentIdx != null)
        ? directions.waypointSegments.slice(segmentIdx, segmentIdx + 1)
        : directions.waypointSegments;
      targetDirSegs.forEach((directionSeg: WaypointSegment) =>
        directionSeg.steps.forEach((step: StepSegment) => {
          directionSteps.push(step.htmlInstructions)
        })
      );
    }
    return directionSteps;
  }

}

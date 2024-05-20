export function rotateReset(active) {
  if (active) {
    if (active._objects && active._objects.length) {
      // Handling group objects
      const groupObjects = active.getObjects();
      const groupCenter = active.getCenterPoint();

      groupObjects.forEach((object) => {
        // Resetting individual object's angle
        const currCoordinate = object.getCenterPoint();
        object.set('angle', 0);
        object.set('matrix', [1, 0, 0, 1, 0, 0]);
        object.set({
          originX: 'center',
          originY: 'center',
        });

        // Repositioning the object to its original center point
        object.setPositionByOrigin(
          new fabric.Point(currCoordinate.x, currCoordinate.y),
          'center',
          'center'
        );
      });

      // Resetting group's angle
      active.set('angle', 0);
      active.set('matrix', [1, 0, 0, 1, 0, 0]);
      active.set({
        originX: 'center',
        originY: 'center',
      });

      // Repositioning the group to its original center point
      active.setPositionByOrigin(
        new fabric.Point(groupCenter.x, groupCenter.y),
        'center',
        'center'
      );

      // Re-render canvas to apply changes
      active.canvas.renderAll();
    } else {
      // Handling single object
      const currCoordinate = active.getCenterPoint();
      active.set('angle', 0);
      active.set('matrix', [1, 0, 0, 1, 0, 0]);
      active.set({
        originX: 'center',
        originY: 'center',
      });
      active.setPositionByOrigin(
        new fabric.Point(currCoordinate.x, currCoordinate.y),
        'center',
        'center'
      );

      // Re-render canvas to apply changes
      active.canvas.renderAll();
    }
  }
}

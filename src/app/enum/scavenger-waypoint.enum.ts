/**
 * Enumerable types used for waypoint status and data configuration.
 */
export enum ScavengerWaypointStatus {
  NO_WAYPOINT = 0,
  INVALID = 1,
  START = 2,
  VALID = 3,
  OUT_OF_ORDER = 4,
  DUPLICATE = 5,
  FINISH = 6,
  WRONG_HUNT = 7,
  START_NEW_HUNT = 8,
}

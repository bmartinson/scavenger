/**
 * This enumerable type defines the various types of scavenger hunts that
 * can be played. At present, there are three different types of hunts.
 *
 * Ordered hunts are solo player scavenger hunts that run completely on
 * HTML5 local storage to track the progress of an individual as they
 * go on a scavenger hunt in which they are supposed to pass different
 * "levels" and find certain waypoints based on clues in a specific
 * order. Consider a walking trail where you are supposed to gather
 * every waypoint in order.
 *
 * Unordered hunts are solo player scavenger hunts that run completely
 * on HTML5 local storage to track the progress of an individual as
 * they go on a scavenger hunt in which they are supposed to collect
 * waypoints in any order.
 *
 * Race hunts are multi-player scavenger hunts that require game
 * synchronization across a sequence of players where waypoints can
 * only be gather a specified number of times. This type of hunt
 * is unordered in nature and simply require that a player find as
 * many of the waypoints as they can before their opponents.
 */

export enum ScavengerHuntType {
  ORDERED = 1,
  UNORDERED = 2,
  RACE = 3,
}

import { IScavengerModel } from './scavenger-model.interface';

export interface IScavengerWaypoint extends IScavengerModel {
  name: string;

  /**
   * Gathering a waypoint garners some number of points for the
   * user collecting it. Consider using negative values for
   * waypoints that are false "wrong answer" waypoints.
   */
  value: number;

  /**
   * If valid is true, then this waypoint is the correct waypoint
   * to have gathered during the hunt. If it is set to false, then
   * this is a waypoint placed as a false "wrong answer" waypoint.
   */
  valid: boolean;

  /**
   * An array of string messages that will be displayed to the
   * user for successfully capturing this waypoint. Each message
   * will be displayed to the user for some duration calculated
   * based on the length of each message.
   */
  dialog: string[];

  /**
   * The same concept as dialog, however these messages are
   * displayed for visiting this waypoint too soon.
   */
  outOfOrderDialog: string[];

  /**
   * Waypoints lead to other waypoints in certain types of scavenger
   * hunts.
   */
  waypoints: IScavengerWaypoint[];

  captured: boolean;

  description: string;
  clues: string[];
  cluesBackgroundColor?: string;
  cluesTextColor?: string;
  interactiveSrc?: string;
  interactiveType: 'none' | 'audio' | 'image' | 'video';

}

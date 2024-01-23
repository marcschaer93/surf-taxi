const asyncHandler = require("express-async-handler");

const db = require("../../db");
const {
  NotFoundError,
  ExpressError,
  BadRequestError,
} = require("../../helpers/expressError");

/** TRIP API
 *
 * Related functions for trips.
 **/
class TripApi {
  /** ALL TRIPS
   *
   * Retrieves all users from the database.
   * Returns an array of users.
   **/
  static async getAllTrips() {
    const result = await db.query(`SELECT * FROM trips`);
    const allTrips = result.rows;
    // No error, because i want to pass empty trip_list if no trips
    return allTrips;
  }

  /** SINGLE TRIP
   *
   * Retrieves a trip by trip_id from the database.
   * Throws NotFoundError if the trip doesn't exist.
   * @param {integer} id - id of the trip to retrieve.
   * @returns {object} - Trip object.
   **/
  static async getOneTrip(id) {
    const result = await db.query(
      `
    SELECT
      T.id,
      T.date,
      T.owner,
      T.start_location,
      T.destination,
      T.stops,
      T.travel_info,
      T.seats,
      T.costs,
      json_agg(jsonb_build_object('username', P.username, 'status', P.reservation_status) ORDER BY P.username) AS passengers
    FROM
      trips AS T
    LEFT JOIN
      passengers AS P ON T.id = P.trip_id
    WHERE
      T.id = $1
    GROUP BY
      T.id, T.date, T.owner, T.start_location, T.destination, T.stops, T.travel_info, T.seats, T.costs
    `,
      [id]
    );

    const tripDetails = result.rows[0];
    if (!tripDetails) {
      throw new NotFoundError(`No tripDetails found with ID: ${id}`);
    }

    return tripDetails;
  }

  /** NEW TRIP
   *
   * Creates a new trip in the database.
   *
   * @param {object} data - Trip data to create a new trip.
   * @param {string} username - The username of the trip creator.
   * @returns {object} - The newly created trip object.
   **/

  static async createNewTrip(tripData, loggedInUser) {
    // Part 1: Insert a new trip to 'trips' table
    const createNewTripResult = await db.query(
      `
        INSERT INTO trips 
          (
            date,
            owner,
            start_location,
            destination,
            stops,
            travel_info,
            seats,
            costs
          )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING 
          date, 
          owner, 
          start_location AS 'startLocation', 
          destination, 
          stops, 
          travel_info AS 'travelInfo', 
          seats, 
          costs
        `,
      [
        tripData.date,
        loggedInUser,
        tripData.start_location,
        tripData.destination,
        tripData.stops,
        tripData.travel_info,
        tripData.seats,
        tripData.costs,
      ]
    );

    const newTrip = createNewTripResult.rows[0];
    if (!newTrip) {
      throw new ExpressError(
        "Failed to create a new trip in the trips table",
        500
      );
    }

    return newTrip;
  }

  /** UPDATE TRIP
   *
   * Updates a trip in the database.
   *
   * @param {object} data - Trip data to update.
   * @returns {object} - Success message and the newly updated trip object.
   **/
  static async updateOneTrip(tripId, updateData, currentUser) {
    const keys = Object.keys(updateData);
    const updateValues = [...Object.values(updateData), tripId];

    const updateQuery = `
      UPDATE trips
      SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(",")}
      WHERE id = $${keys.length + 1}
      RETURNING 
        date, 
        owner, 
        start_location AS 'startLocation', 
        destination, 
        stops, 
        travel_info AS 'travelInfo', 
        seats, 
        costs
  `;

    const result = await db.query(updateQuery, updateValues);
    const updatedTrip = result.rows[0];

    if (!updatedTrip) throw new ExpressError("Failed to update trip", 500);

    if (updatedTrip.owner !== currentUser)
      throw new BadRequestError("Not trip owner. Can't update trip.");

    return updatedTrip;
  }

  /** DELETE TRIP
   *
   *  Delete given trip from database; returns undefined.
   *
   * Throws NotFoundError if trip not found.
   **/
  static async deleteOneTrip(tripId) {
    const result = await db.query(
      `DELETE
             FROM trips
             WHERE id = $1
             RETURNING id`,
      [tripId]
    );
    const removedTrip = result.rows[0];

    if (!removedTrip)
      throw new NotFoundError(
        `Could not remove trip. No trip with id: ${id} found.`
      );

    return;
  }
}

module.exports = TripApi;

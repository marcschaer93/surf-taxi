const asyncHandler = require("express-async-handler");

const db = require("../../db");
const { NotFoundError, ExpressError } = require("../../helpers/expressError");

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
    const trips = result.rows;
    // No error, because i want to pass empty trip_list if no trips
    return trips;
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
      T.start_location,
      T.destination,
      T.stops,
      T.travel_info,
      T.seats,
      T.costs,
      T.seats - COUNT(CASE WHEN TM.username IS NOT NULL AND TM.member_status IN ('approved', 'owner') THEN TM.username END) AS available_seats,
      json_agg(jsonb_build_object('username', TM.username, 'status', TM.member_status) ORDER BY TM.username) AS trip_members
    FROM
      trips AS T
    LEFT JOIN
      trip_members AS TM ON T.id = TM.trip_id
    WHERE
      T.id = $1
    GROUP BY
      T.id, T.date, T.start_location, T.destination, T.stops, T.travel_info, T.seats, T.costs
    `,
      [id]
    );

    const trip = result.rows[0];
    if (!trip) throw new NotFoundError(`No trip found with ID: ${id}`);
    return trip;
  }

  /** NEW TRIP
   *
   * Creates a new trip in the database.
   *
   * @param {object} data - Trip data to create a new trip.
   * @param {string} username - The username of the trip creator.
   * @returns {object} - The newly created trip object.
   **/
  // static async createNewTrip(data, creatorUsername) {
  //   // Part 1: Insert a new trip to 'trips' table
  //   const createNewTripResult = await db.query(
  //     `
  //     INSERT INTO trips
  //       (
  //         date,
  //         start_location,
  //         destination,
  //         stops,
  //         travel_info,
  //         seats,
  //         costs
  //       )
  //     VALUES ($1, $2, $3, $4, $5, $6, $7)
  //     RETURNING *
  //     `,
  //     [
  //       data.date,
  //       data.start_location,
  //       data.destination,
  //       data.stops,
  //       data.travel_info,
  //       data.seats,
  //       data.costs,
  //     ]
  //   );

  //   const newTrip = createNewTripResult.rows[0];
  //   if (!newTrip) {
  //     throw new ExpressError(
  //       "Failed to create a new trip in the trips table",
  //       500
  //     );
  //   }

  //   // Part 2: Insert a new trip_member to 'trip_members' table with the new created trip data
  //   const createNewTripMemberResult = await db.query(
  //     `
  //     INSERT INTO trip_members
  //       (
  //         username,
  //         trip_id,
  //         member_status,
  //         status_timestamp
  //       )
  //     VALUES ($1, $2, $3, CURRENT_TIMESTAMP )
  //     RETURNING *
  //     `,
  //     [creatorUsername, newTrip.id, "owner"]
  //   );

  //   const newTripMember = createNewTripMemberResult.rows[0];

  //   if (!newTripMember) {
  //     // await db.query(
  //     //   `DELETE
  //     // FROM trips
  //     // WHERE id = $1
  //     // RETURNING id`,
  //     //   [newTrip.id]
  //     // );
  //     this.deleteOneTrip(newTrip.id);
  //     throw new ExpressError(
  //       "Failed to create new trip member. Newly created trip will also be deleted",
  //       500
  //     );
  //   }

  //   return newTrip;
  // }
  static async createNewTrip(data, ownerUsername) {
    try {
      // Start a transaction
      await db.query("BEGIN");

      // Part 1: Insert a new trip to 'trips' table
      const createNewTripResult = await db.query(
        `
        INSERT INTO trips 
          (
            date,
            start_location,
            destination,
            stops,
            travel_info,
            seats,
            costs
          )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
          data.date,
          data.start_location,
          data.destination,
          data.stops,
          data.travel_info,
          data.seats,
          data.costs,
        ]
      );

      const newTrip = createNewTripResult.rows[0];
      if (!newTrip) {
        throw new ExpressError(
          "Failed to create a new trip in the trips table",
          500
        );
      }

      // Part 2: Insert a new trip_member to 'trip_members' table with the new created trip data
      const createNewTripMemberResult = await db.query(
        `
        INSERT INTO trip_members 
          (
            username,
            trip_id,
            member_status,
            status_timestamp
          )
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP )
        RETURNING *
        `,
        [ownerUsername, newTrip.id, "owner"]
      );

      const newTripMember = createNewTripMemberResult.rows[0];
      if (!newTripMember) {
        throw new ExpressError("Failed to create new trip member", 500);
      }

      // Commit the transaction
      await db.query("COMMIT");

      return newTrip;
    } catch (error) {
      // Rollback the transaction in case of an error
      await db.query("ROLLBACK");
      throw error;
    }
  }

  /** UPDATE TRIP
   *
   * Updates a trip in the database.
   *
   * @param {object} data - Trip data to update.
   * @returns {object} - Success message and the newly updated trip object.
   **/
  static async updateOneTrip(id, data) {
    const keys = Object.keys(data);
    const updateValues = [...Object.values(data), id];

    const updateQuery = `
      UPDATE trips
      SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(",")}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;

    const result = await db.query(updateQuery, updateValues);
    const updatedTrip = result.rows[0];

    if (!updatedTrip) {
      throw new ExpressError("Failed to update trip", 500);
    }

    return updatedTrip;
  }

  /** DELETE TRIP
   *
   *  Delete given trip from database; returns undefined.
   *
   * Throws NotFoundError if trip not found.
   **/
  static async deleteOneTrip(id) {
    const result = await db.query(
      `DELETE
             FROM trips
             WHERE id = $1
             RETURNING id`,
      [id]
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

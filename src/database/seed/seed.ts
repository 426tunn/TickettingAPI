// To seed data for project development
import { faker } from "@faker-js/faker";
import { EventModel } from "../../Models/EventModel";
import mongoose, { Types } from "mongoose";
import { connectToDB } from "database";
import { events as eventToSeed, ISeedEvent } from "./data/events";
import { EventTicketTypeModel } from "../../Models/EventTicketTypeModel";
import { UserRole } from "../../Enums/UserRole";
import { IUser, UserModel } from "../../Models/UserModel";

const noOfUsers = 5;
const users = [] as Partial<IUser>[];
for (let i = 0; i < noOfUsers; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push({
        _id: new Types.ObjectId(faker.database.mongodbObjectId()),
        username: faker.word.verb(),
        firstname: firstName,
        lastname: lastName,
        email: faker.internet.email({ firstName, lastName }),
        password: faker.internet.password(),
        isVerified: faker.datatype.boolean(),
        role: faker.helpers.enumValue(UserRole),
    });
}

const events = eventToSeed as ISeedEvent[];
const ticketTypes: Array<{
    name: string;
    quantity: number;
    price: number;
    eventId?: string;
}> = [];
for (const event of events) {
    event._id = new Types.ObjectId(faker.database.mongodbObjectId());
    event.organizerId = users[
        Math.floor(Math.random() * 100) % noOfUsers
    ] as IUser;

    for (const ticketType of event.ticketTypes) {
        ticketType.eventId = event._id;
        ticketTypes.push(ticketType);
    }
}

(async () => {
    try {
        connectToDB();

        // await UserModel.deleteMany({});
        // await EventModel.deleteMany({});
        // await EventTicketTypeModel.deleteMany({});

        await UserModel.create(users);
        await EventModel.create(events);
        await EventTicketTypeModel.create(ticketTypes);
        console.log("Data Seeded Successfully.");
        mongoose.disconnect();
    } catch (error) {
        process.exit();
    }
})();

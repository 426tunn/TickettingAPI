// To seed data for project development
import { faker } from "@faker-js/faker";
import { EventStatus } from "../../Enums/EventStatus";
import { EventTypes } from "../../Enums/EventTypes";
import { EventVisibility } from "../../Enums/EventVisibility";
import { EventModel, IEvent } from "../../Models/EventModel";
import { IUser, UserModel } from "../../Models/UserModel";
import { UserRole } from "../../Enums/UserRole";
import mongoose, { Types } from "mongoose";
import {
    EventTicketTypeModel,
    IEventTicketType,
} from "Models/EventTicketTypeModel";
import { TicketTypes } from "Enums/TicketTypes";
import { connectToDB } from "database";
import { LocationTypes } from "Enums/LocationTypes";

const users = [] as Partial<IUser>[];
for (let i = 0; i < 5; i++) {
    users.push({
        _id: new Types.ObjectId(faker.database.mongodbObjectId()),
        username: faker.word.verb(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        isVerified: faker.datatype.boolean(),
        role: faker.helpers.enumValue(UserRole),
    });
}

const eventTicketTypes = [] as Partial<IEventTicketType>[];
for (let i = 0; i < 10; i++) {
    eventTicketTypes.push({
        _id: new Types.ObjectId(faker.database.mongodbObjectId()),
        name: faker.helpers.enumValue(TicketTypes),
        price: faker.number.int({ min: 1, max: 10000 }),
        noOfTickets: faker.number.int({ min: 1, max: 10000 }),
    });
}

const events = [] as Partial<IEvent>[];
for (let i = 0; i < 50; i++) {
    events.push({
        name: faker.word.words({ count: { min: 2, max: 10 } }),
        description: faker.word.words({ count: { min: 20, max: 200 } }),
        status: faker.helpers.enumValue(EventStatus),
        visibility: faker.helpers.enumValue(EventVisibility),
        type: faker.helpers.enumValue(EventTypes),
        venue: faker.location.streetAddress(),
        location: faker.helpers.enumValue(LocationTypes),
        organizerId: faker.helpers.arrayElement(users) as IUser,
        startDate: faker.date.soon(),
        endDate: faker.date.future(),
        bannerImageUrl: faker.image.url(),
        totalTickets: faker.number.int({ min: 1, max: 10000 }),
        verified: faker.datatype.boolean(),
    });
}

(async () => {
    connectToDB();
    await UserModel.create(users);
    await EventTicketTypeModel.create(eventTicketTypes);
    await EventModel.create(events);
    console.log("Database seeded with:");
    console.log(eventTicketTypes.length, "Event Ticket Types");
    console.log(events.length, "Events");
    await mongoose.disconnect();
})();

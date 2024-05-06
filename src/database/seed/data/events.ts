import { faker } from "@faker-js/faker";
import { EventCategory } from "../../../Enums/EventCategory";
import { EventStatus } from "../../../Enums/EventStatus";
import { EventType } from "../../../Enums/EventType";
import { VenueType } from "../../../Enums/VenueType";
import { IEvent } from "../../../Models/EventModel";
import { EventVisibility } from "../../../Enums/EventVisibility";

export interface ISeedEvent extends IEvent {
    ticketTypes: {
        name: string;
        quantity: number;
        price: number;
        eventId?: string;
    }[];
}

export const events = [
    {
        name: "Nigerian Music Festival",
        description:
            "Welcome to the Nigerian Music Festival, a celebration of the vibrant and diverse musical heritage of our great nation. Join us for a three-day extravaganza that will take you on a journey through the captivating rhythms, melodies, and cultural richness that define Nigerian music.\n\nFrom the soulful [Highlife](https://en.wikipedia.org/wiki/Highlife_music) melodies that have enchanted generations to the infectious beats of [Afrobeats](https://en.wikipedia.org/wiki/Afrobeats) that have taken the world by storm, this festival promises to be a musical odyssey like no other. Immerse yourself in the pulsating energy of [Fuji](https://en.wikipedia.org/wiki/Fuji_music), the soulful renditions of [Jùjú](https://en.wikipedia.org/wiki/Jùjú_music), and the captivating rhythms of [Afro-juju](https://en.wikipedia.org/wiki/Afro_juju).\n\nExperience the vibrant tapestry of Nigerian music as it unfolds on multiple stages, featuring legendary artists and rising stars from across the nation. Whether you're a die-hard music enthusiast or simply seeking an unforgettable cultural experience, the Nigerian Music Festival promises to be a captivating and immersive celebration of our rich musical heritage.\n\nPrepare to be mesmerized by the electrifying performances, the pulsating beats, and the infectious energy that will fill the air. Join us in this melodic odyssey and let the rhythms of Nigeria ignite your soul!",
        category: EventCategory.Music,
        visibility: EventVisibility.Public,
        status: faker.helpers.enumValue(EventStatus),
        type: faker.helpers.enumValue(EventType),
        venueType: faker.helpers.enumValue(VenueType),
        tags: ["music", "nigerian", "festival", "concert"],
        startDate: new Date("2024-12-01T10:00:00.000Z"),
        endDate: new Date("2024-12-03T22:00:00.000Z"),
        location: {
            venue: "Tafawa Balewa Square",
            city: "Lagos",
            state: "Lagos",
            address: "Broad Street, Lagos Island, Lagos",
        },
        media: {
            bannerImage: {
                imgType: "image/jpeg",
                src: "https://raw.githubusercontent.com/black-whole/blackhole-frontend/dev/public/images/carousel/img-1.webp?token=GHSAT0AAAAAACP3573A2O6IBUBLLGVAFJZEZRWZY5Q",
            },
            mobilePreviewImage: {
                imgType: "image/png",
                src: "https://blackhole-ticket.vercel.app/_next/image?url=%2Fimages%2Fdavid.jpg&w=1920&q=75",
            },
        },
        ticketTypes: [
            {
                name: "General Admission",
                quantity: 5000,
                price: 10000,
            },
            {
                name: "VIP",
                quantity: 1000,
                price: 25000,
            },
            {
                name: "Premium",
                quantity: 500,
                price: 50000,
            },
            {
                name: "Student",
                quantity: 2000,
                price: 5000,
            },
        ],
    },
    {
        name: "Holi Festival of Colors",
        description:
            "Prepare to be drenched in a kaleidoscope of vibrant hues as you immerse yourself in the Holi Festival of Colors, a joyous celebration of love, unity, and the arrival of spring.\n\nJoin us in this [ancient Hindu festival](https://en.wikipedia.org/wiki/Holi), where the air is filled with a rainbow of powdered colors, and the spirit of togetherness reigns supreme. Embrace the infectious energy as you dance to the rhythms of pulsating music and joyful chants.\n\nLet the vibrant hues of [gulal](https://en.wikipedia.org/wiki/Gulal) (colored powder) paint your world in a tapestry of celebration, as you embrace the spirit of unity, love, and renewal that lies at the heart of this festival.",
        category: EventCategory.CulturalTour,
        visibility: EventVisibility.Public,
        type: faker.helpers.enumValue(EventType),
        status: faker.helpers.enumValue(EventStatus),
        venueType: faker.helpers.enumValue(VenueType),
        tags: ["holi", "festival", "colors", "indian", "cultural"],
        startDate: new Date("2024-03-30T14:00:00.000Z"),
        endDate: new Date("2024-03-30T20:00:00.000Z"),
        location: {
            venue: "Spanish Village Art Center",
            city: "San Diego",
            state: "California",
            address: "1770 Village Pl, San Diego, CA 92101, USA",
        },
        ticketTypes: [
            { name: "General Admission", quantity: 10000, price: 20 },
            { name: "VIP", quantity: 1000, price: 50 },
            { name: "Family Pack (4 tickets)", quantity: 500, price: 70 },
        ],
    },
    {
        name: "Carnival in Rio de Janeiro",
        description:
            "Get ready to samba your way into the ultimate celebration of life at the Carnival in Rio de Janeiro, a vibrant and electrifying festival that captures the essence of Brazilian culture.\n\nImmerse yourself in the [world-famous spectacle](https://en.wikipedia.org/wiki/Rio_Carnival), where dazzling costumes, pulsating rhythms, and infectious energy come together in a mesmerizing display of color and movement.\n\nWitness the breathtaking samba parade, where elaborately decorated floats and jaw-dropping performances take center stage, captivating audiences from around the globe.",
        category: EventCategory.CulturalTour,
        visibility: EventVisibility.Public,
        status: faker.helpers.enumValue(EventStatus),
        type: faker.helpers.enumValue(EventType),
        venueType: faker.helpers.enumValue(VenueType),
        tags: ["carnival", "festival", "rio", "brazilian", "cultural"],
        startDate: new Date("2024-02-16T00:00:00.000Z"),
        endDate: new Date("2024-02-25T23:59:59.000Z"),
        location: {
            venue: "Sambadrome Marquês de Sapucaí",
            city: "Rio de Janeiro",
            state: "Rio de Janeiro",
            address: "Rua Marquês de Sapucaí, Rio de Janeiro, Brazil",
        },
        ticketTypes: [
            { name: "Grandstand Sector 1", quantity: 2000, price: 500 },
            { name: "Grandstand Sector 2", quantity: 3000, price: 400 },
            { name: "Grandstand Sector 3", quantity: 4000, price: 300 },
            { name: "Standing Room", quantity: 10000, price: 100 },
        ],
    },
    {
        name: "Coachella Valley Music and Arts Festival",
        category: EventCategory.Music,
        status: EventStatus.Approved,
        visibility: EventVisibility.Public,
        type: faker.helpers.enumValue(EventType),
        venueType: faker.helpers.enumValue(VenueType),
        description:
            "Get ready to experience the ultimate music and arts extravaganza at the Coachella Valley Music and Arts Festival! This iconic event promises to be a mind-blowing celebration of music, art, and culture.\n\nImmerse yourself in a [world-class lineup](https://en.wikipedia.org/wiki/Coachella_Valley_Music_and_Arts_Festival) of renowned artists and rising stars, spanning genres from rock to hip-hop, electronic to indie.\n\nBeyond the music, prepare to be dazzled by breathtaking art installations and immersive experiences that will ignite your senses and inspire your soul.",
        tags: ["coachella", "music", "festival", "arts", "california"],
        startDate: new Date("2024-04-12T16:00:00.000Z"),
        endDate: new Date("2024-04-21T23:59:59.000Z"),
        location: {
            venue: "Empire Polo Club",
            city: "Indio",
            state: "California",
            address: "81-800 Ave 51, Indio, CA 92201, USA",
        },
        ticketTypes: [
            { name: "General Admission", quantity: 125000, price: 429 },
            { name: "VIP Village", quantity: 5000, price: 999 },
            { name: "Safari Camping", quantity: 2000, price: 1599 },
        ],
    },
    {
        name: "Corporate Gala Dinner",
        category: EventCategory.Corporate,
        status: EventStatus.Pending,
        visibility: EventVisibility.Private,
        type: faker.helpers.enumValue(EventType),
        venueType: faker.helpers.enumValue(VenueType),
        description:
            "Join us for an exclusive and elegant Corporate Gala Dinner, where we celebrate the achievements of our esteemed colleagues and partners. This prestigious event promises to be a night of sophistication and networking opportunities.\n\nEnjoy a sumptuous three-course meal prepared by our award-winning culinary team, complemented by exquisite wine pairings from renowned vineyards. The evening will be filled with entertainment, special guest speakers, and [commemorative ceremonies](https://en.wikipedia.org/wiki/Corporate_gala) honoring our outstanding achievers.",
        tags: ["corporate", "gala", "dinner", "exclusive"],
        startDate: new Date("2024-06-15T19:00:00.000Z"),
        endDate: new Date("2024-06-15T23:59:59.000Z"),
        location: {
            venue: "The Ritz-Carlton Ballroom",
            city: "Los Angeles",
            state: "California",
            address: "900 W Olympic Blvd, Los Angeles, CA 90015, USA",
        },
        ticketTypes: [
            { name: "Standard", quantity: 300, price: 250 },
            { name: "Premium", quantity: 100, price: 500 },
        ],
    },
    {
        name: "Comic-Con International",
        category: EventCategory.Entertainment,
        status: EventStatus.Approved,
        visibility: EventVisibility.Public,
        type: faker.helpers.enumValue(EventType),
        venueType: faker.helpers.enumValue(VenueType),
        description:
            "Calling all comic, movie, and pop culture enthusiasts! Get ready for the ultimate geek extravaganza at Comic-Con International, a massive celebration of everything nerdy and awesome.\n\nImmerse yourself in a [world of cosplay](https://en.wikipedia.org/wiki/Comic-Con_International), exclusive panels, and sneak peeks at the latest movies, TV shows, and comics. Connect with fellow fans and industry legends as you explore the massive exhibit floor, filled with exclusive merchandise and mind-blowing displays.",
        tags: ["comic-con", "comics", "movies", "entertainment", "pop culture"],
        startDate: new Date("2024-07-18T10:00:00.000Z"),
        endDate: new Date("2024-07-21T18:00:00.000Z"),
        location: {
            venue: "San Diego Convention Center",
            city: "San Diego",
            state: "California",
            address: "111 W Harbor Dr, San Diego, CA 92101, USA",
        },
        ticketTypes: [
            { name: "Single Day", quantity: 20000, price: 60 },
            { name: "Full Convention", quantity: 10000, price: 220 },
            { name: "VIP Package", quantity: 500, price: 800 },
        ],
    },
    {
        name: "New Year's Eve Celebration",
        category: EventCategory.Holiday,
        status: EventStatus.Suspended,
        visibility: EventVisibility.Public,
        type: faker.helpers.enumValue(EventType),
        venueType: faker.helpers.enumValue(VenueType),
        description:
            "Ring in the New Year with a spectacular celebration that promises to be an unforgettable night of glitz, glamour, and endless revelry!\n\nJoin us as we bid farewell to the old and welcome the new with a dazzling fireworks display, live entertainment, and a lavish open bar. [Toast to new beginnings](https://en.wikipedia.org/wiki/New_Year%27s_Eve) with your loved ones as we count down to midnight and usher in a year filled with endless possibilities.",
        tags: ["new year", "celebration", "party", "fireworks", "countdown"],
        startDate: new Date("2024-12-31T20:00:00.000Z"),
        endDate: new Date("2025-01-01T02:00:00.000Z"),
        location: {
            venue: "Times Square",
            city: "New York City",
            state: "New York",
            address: "Manhattan, NY 10036, USA",
        },
        ticketTypes: [
            { name: "General Admission", quantity: 10000, price: 150 },
            { name: "VIP Experience", quantity: 500, price: 500 },
            { name: "Platinum Package", quantity: 100, price: 1000 },
        ],
    },
    {
        name: "Company Annual Retreat",
        category: EventCategory.CorporateRetreat,
        status: EventStatus.Approved,
        visibility: EventVisibility.Private,
        type: faker.helpers.enumValue(EventType),
        venueType: faker.helpers.enumValue(VenueType),
        description:
            "It's time for our annual corporate retreat, where we gather to celebrate our achievements, forge stronger bonds, and ignite our collective passion for the year ahead. This exclusive event is a revitalizing escape from the daily grind, offering a perfect blend of relaxation and inspiration.\n\nImmerse yourself in a serene natural setting, where you'll engage in team-building activities, leadership workshops, and rejuvenating wellness experiences. [Connect with your colleagues](https://en.wikipedia.org/wiki/Corporate_retreat) on a deeper level, forge lasting memories, and reignite your passion for our shared vision and values.",
        tags: [
            "corporate",
            "retreat",
            "team building",
            "wellness",
            "exclusive",
        ],
        startDate: new Date("2024-09-10T09:00:00.000Z"),
        endDate: new Date("2024-09-14T17:00:00.000Z"),
        location: {
            venue: "Miraval Resort & Spa",
            city: "Tucson",
            state: "Arizona",
            address: "5000 E Via Estancia Miraval, Tucson, AZ 85739, USA",
        },
        ticketTypes: [
            { name: "Standard Retreat Pass", quantity: 200, price: 1500 },
            { name: "Executive Retreat Pass", quantity: 50, price: 3000 },
        ],
    },
];

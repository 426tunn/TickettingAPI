import mongoose, {Schema, Document} from "mongoose";

 interface IEventVenue extends Document {
    country: string
    location: string
    address: string
    city: string
    state: string
    street: string
    building: string
}

const eventVenueSchema = new Schema<IEventVenue>({
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    building: {
        type: String,
        required: true
    }    
}, { timestamps: true });    

const EventVenueModel = mongoose.model<IEventVenue>('EventVenue', eventVenueSchema)
export { IEventVenue, EventVenueModel }
import mongoose, { Schema, Document } from 'mongoose';
import { IShoplist } from './shoplist';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    shoplist: IShoplist['_id'];
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    shoplist: [{
        type: Schema.Types.ObjectId,
        ref: 'Shoplist'
    }]
});

export default mongoose.model<IUser>('User', userSchema);

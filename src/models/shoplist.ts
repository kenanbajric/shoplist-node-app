import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

export interface IShoplist extends Document {
    name: string;
    creator: IUser['_id'];
    items: [{
        name: string;
        quantity: number;
    }];
    createdAt: Date;
}

const shoplistSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model<IShoplist>('Shoplist', shoplistSchema);
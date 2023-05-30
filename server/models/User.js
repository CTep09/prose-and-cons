const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			validate: {
				validator: function (v) {
					return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
						v
					);
				},
				message: (props) => `${props.value} is not a valid email address!`,
			},
			required: [true, 'User email address required'],
		},
		library: [
			{
				book: { type: Schema.Types.ObjectId, ref: 'Book' },
				readStatus: {
					type: String,
					enum: ['Read', 'Want to Read', 'Not Interested'],
				},
				ratingStatus: { type: String, enum: ['Rated', 'Unrated'] },
				rating: { type: Schema.Types.ObjectId, ref: 'Rating' },
			},
		],
		friends: [
			{
				type: Schema.Types.ObjectId,
				ref: 'user',
			},
		],
	},
	{
		// Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
		// Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
		toJSON: {
			virtuals: true,
		},
		id: false,
	}
);

userSchema
	.virtual('friendCount')
	// Getter
	.get(function () {
		return this.friends.length;
	});

const User = model('user', userSchema);

module.exports = User;

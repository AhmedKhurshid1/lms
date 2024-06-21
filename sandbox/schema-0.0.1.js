const baseSchema = {
    timestamps: true, // createdAt, updatedAt
    __v: 1,
    isInActive: true,
    isDeleted: false,
}

const Subscription = {
    planType: String,
    validityDays: Number,
    startDate: Date,
    endDate: Date,
}

const customer = {
    emailAddress: String,
    username: String,
    isInActive: Boolean,
    firstName: String,
    lastName: String,
    company: String, // not required
    profession: String, // not required,
    subscription: Subscription,
    password: String,
    role: String,
};




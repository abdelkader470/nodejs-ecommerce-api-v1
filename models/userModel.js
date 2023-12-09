const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email required"],
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      minLength: [6, "Too short pssword"],
      required: [true, "password required"],
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const setImageUrl = (doc) => {
  if (doc.profileImg) {
    if (process.env.NODE_ENV === "development") {
      const imageUrl = `${process.env.DEV_URL}/users/${doc.profileImg}`;
      doc.profileImg = imageUrl;
    }
  }
};
userSchema.post("init", (doc) => {
  setImageUrl(doc);
});
userSchema.post("save", (doc) => {
  setImageUrl(doc);
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;

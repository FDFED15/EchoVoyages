/** @format */

import mongoose from "mongoose";

const guideSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: false,
      min: 0,
    },
    languages: {
      type: [String],
      required: false,
    },
    location: {
      type: String,
      required: false,
    },

    phno: {
      type: String,
      required: true,
    },
    gmail: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "guide",
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    ratings: {
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      numberOfReviews: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "customers" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    availability: {
      type: Boolean,
      default: false,
    },
    availableDates: [
      {
        startDate: {
          type: Date,
          required: false,
        },
        endDate: {
          type: Date,
          required: false,
        },
      },
    ],
    assignedPackages: [
      {
        packageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "packages",
        },
        packageName: {
          type: String,
          required: false,
        },
        price: {
          type: Number,
          required: false,
        },
        startDate: {
          type: Date,
          required: false,
        },
        endDate: {
          type: Date,
          required: false,
        },
        status: {
          type: String,
          enum: ["pending", "confirmed", "completed", "canceled"],
          default: "pending",
        },
      },
    ],
    specialization: {
      type: String,
      required: true,
      enum: [
        "luxury",
        "adventure",
        "business",
        "family",
        "budget-friendly",
        "other",
      ],
    },
    verificationCode: {
      type: String,
      default: "",
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    earnings: {
      total: {
        type: Number,
        default: 0,
      },
      pending: {
        type: Number,
        default: 0,
      },
      received: {
        type: Number,
        default: 0,
      },
      monthly: [
        {
          month: Number,
          year: Number,
          amount: Number,
        },
      ],
      history: [
        {
          bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bookings",
          },
          packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "packages",
          },
          packageName: String,
          customerName: String,
          amount: Number,
          date: {
            type: Date,
            default: Date.now,
          },
          status: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);
// Add strategic indexes for frequently queried fields
guideSchema.index({ location: 1 });
guideSchema.index({ specialization: 1 });
guideSchema.index({ "ratings.averageRating": -1 });
guideSchema.index({ languages: 1 });

// Add compound indexes for multi-criteria searches
guideSchema.index({ location: 1, "ratings.averageRating": -1 });
guideSchema.index({ specialization: 1, "ratings.averageRating": -1 });
guideSchema.index({ location: 1, specialization: 1 });
guideSchema.index({ availability: 1, location: 1 });
export const Guide = mongoose.model("Guide", guideSchema);

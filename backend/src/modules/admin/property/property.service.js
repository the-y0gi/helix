const Vendor = require("../../vendors/vendor.model");
const User = require("../../auth/auth.model");
const VendorBank = require("../../vendorBank/bank.model");
const Hotel = require("../../hotels/hotel.model");
const mongoose = require("mongoose");

exports.getAllProperties = async (query) => {
  try {
    const { page = 1, limit = 10, status, search } = query;

    const skip = (page - 1) * limit;

    const matchStage = {};

    if (status) {
      matchStage.status = status;
    }

    //Aggregation Pipeline
    const pipeline = [
      {
        $match: matchStage,
      },

      // Join User (Vendor Owner)
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // Join Hotel
      {
        $lookup: {
          from: "hotels",
          localField: "_id",
          foreignField: "vendorId",
          as: "hotel",
        },
      },
      {
        $unwind: {
          path: "$hotel",
          preserveNullAndEmptyArrays: true,
        },
      },

      //Search filter
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "hotel.name": { $regex: search, $options: "i" } },
                  { "hotel.city": { $regex: search, $options: "i" } },
                  { "user.firstName": { $regex: search, $options: "i" } },
                  { "user.lastName": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      {
        $project: {
          _id: 1,

          propertyName: {
            $ifNull: ["$hotel.name", "N/A"],
          },

          city: {
            $ifNull: ["$hotel.city", "N/A"],
          },

          vendorName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$user.firstName", ""] },
                  " ",
                  { $ifNull: ["$user.lastName", ""] },
                ],
              },
            },
          },

          status: 1,
          submittedAt: 1,
        },
      },
      {
        $sort: { submittedAt: -1 },
      },

      // Pagination
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Vendor.aggregate(pipeline);

    const properties = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

    return {
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getPropertyDetail = async (vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");

    const user = await User.findById(vendor.userId);

    const bank = await VendorBank.findOne({ vendorId });

    const hotel = await Hotel.findOne({ vendorId });

    return {
      vendor: {
        _id: vendor._id,
        status: vendor.status,
        submittedAt: vendor.submittedAt,
        serviceType: vendor.serviceType,
      },

      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phoneNumber,
      },

      businessDetails: {
        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,
        businessPhone: vendor.businessPhone,
        address: vendor.businessAddress,
        city: vendor.city,
        state: vendor.state,
        country: vendor.country,
        panNumber: vendor.panNumber,
        aadhaarNumber: vendor.aadhaarNumber,
      },

      documents: vendor.verificationDocs || [],

      bankDetails: bank
        ? {
            accountHolderName: bank.accountHolderName,
            bankName: bank.bankName,
            accountNumber: bank.accountNumber,
            ifscCode: bank.ifscCode,
            branchName: bank.branchName,
            upiId: bank.upiId,
            proof: bank.bankProof,
            verificationStatus: bank.verificationStatus,
          }
        : null,

      hotelDetails: hotel
        ? {
            name: hotel.name,
            description: hotel.description,
            address: hotel.address,
            city: hotel.city,
            images: hotel.images,
            documents: hotel.documents,
            amenities: hotel.amenities,
            accessibility: hotel.accessibility,
            verificationStatus: hotel.verificationStatus,
          }
        : null,
    };
  } catch (error) {
    throw error;
  }
};

exports.markIssue = async (vendorId, step, reason, adminId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    if (![2, 3, 4].includes(step)) {
      throw new Error("Invalid step");
    }

    if (!reason) {
      throw new Error("Reason is required");
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) throw new Error("Vendor not found");

    //INIT ARRAYS IF NOT EXISTS
    if (!vendor.rejectedSteps) vendor.rejectedSteps = [];
    if (!vendor.rejectionReasons) vendor.rejectionReasons = {};

    // ADD STEP (avoid duplicate)
    if (!vendor.rejectedSteps.includes(step)) {
      vendor.rejectedSteps.push(step);
    }

    // ADD / UPDATE REASON
    vendor.rejectionReasons = {
      ...(vendor.rejectionReasons || {}),
      [step]: reason,
    };
    vendor.status = "under_review";

    await vendor.save();

    return vendor;
  } catch (error) {
    throw error;
  }
};

exports.verifySection = async (vendorId, step) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    if (![2, 3, 4].includes(step)) {
      throw new Error("Invalid step");
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");

    if (vendor.rejectedSteps?.includes(step)) {
      vendor.rejectedSteps = vendor.rejectedSteps.filter((s) => s !== step);

      if (vendor.rejectionReasons) {
        delete vendor.rejectionReasons[step];
      }
    }


    //Step 2 → vendor docs verify
    if (step === 2) {
      vendor.verificationDocs = vendor.verificationDocs.map((doc) => ({
        ...doc.toObject(),
        isVerified: true,
      }));
    }

    //Step 3 → bank verify
    if (step === 3) {
      await VendorBank.findOneAndUpdate(
        { vendorId },
        { verificationStatus: "verified" },
      );
    }

    //Step 4 → hotel verify
    if (step === 4) {
      await Hotel.findOneAndUpdate(
        { vendorId },
        { verificationStatus: "verified" },
      );
    }

    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      vendor.status = "pending"; // ready for approval
    }

    await vendor.save();

    return vendor;
  } catch (error) {
    throw error;
  }
};

exports.rejectVendor = async (vendorId, body) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");

    if (body.rejectedSteps && body.reasons) {
      vendor.rejectedSteps = body.rejectedSteps;
      vendor.rejectionReasons = body.reasons;
    }

    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      throw new Error("No issues found to reject");
    }

    vendor.status = "rejected";
    vendor.rejectedAt = new Date();

    await vendor.save();

    return vendor;
  } catch (error) {
    throw error;
  }
};

exports.approveVendor = async (vendorId, adminId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");

    //if still issues exist
    if (vendor.rejectedSteps && vendor.rejectedSteps.length > 0) {
      throw new Error("Resolve all issues before approval");
    }

    if (!vendor.isSubmitted) {
      throw new Error("Vendor has not submitted onboarding");
    }


    vendor.status = "approved";
    vendor.approvedAt = new Date();
    vendor.approvedBy = adminId;

    await vendor.save();

    await Hotel.findOneAndUpdate({ vendorId }, { isActive: true });

    return vendor;
  } catch (error) {
    throw error;
  }
};

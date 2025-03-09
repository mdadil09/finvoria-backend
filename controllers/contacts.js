const Contacts = require("../models/add-contact-schema");

const addContacts = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const image = req.file.path;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Please fill required fields." });
    }

    const existingUser = await Contacts.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newContacts = await Contacts.create({
      name: name,
      email: email,
      phone: phone,
      image: image,
      createdBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Contact added successfully.",
      user: newContacts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getContacts = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const userid = req.params.id;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  const totalNumber = await Contacts.countDocuments();

  if (endIndex < (await Contacts.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
      totalNumber: totalNumber,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
      totalNumber: totalNumber,
    };
  }
  try {
    results.results = await Contacts.find({ createdBy: userid })
      .limit(limit)
      .skip(startIndex)
      .exec();
    res.paginatedResults = results;

    res.status(200).json({
      success: true,
      message: "Contact fetched successfully.",
      contacts: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addContacts, getContacts };

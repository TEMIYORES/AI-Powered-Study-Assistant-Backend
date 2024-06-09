import Account from "../model/Account.js";
import bcrypt from "bcrypt";

const registerAccount = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  //   Check for duplicate users in the database
  const duplicate = await Account.findOne({ email }).exec(); //findOne method need exec() if there is no callback

  if (duplicate) {
    return res.status(409).json({ message: "email already exists!" });
  }

  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await Account.create({
      ...req.body,
      password: hashedPassword,
    });
    console.log({ response });
    res.status(201).json({ message: `${email} registered successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateAccount = async (req, res) => {
  const { email, phoneNumber, emailVerified, photoURL } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  try {
    const account = await Account.findOne({ email }).exec();
    if (phoneNumber && account.phoneNumber === "")
      account.phoneNumber = phoneNumber;
    if (emailVerified) account.emailVerified = emailVerified;
    if (photoURL && account.photoURL === "") account.photoURL = photoURL;
    await account.save();
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error updating info:", error);
    return res.sendStatus(400);
  }
};
const loginAccount = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  try {
    const account = await Account.findOne({ email }).exec();
    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }
    if (account.emailVerified) {
      return res.status(200).json(account);
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error finding account:", error);
    return res.sendStatus(400);
  }
};
const getAccount = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  try {
    const account = await Account.findOne({ email }).exec();
    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }
    if (account.emailVerified) {
      return res.status(200).json({
        fullName: account.fullName,
        email: account.email,
        phoneNumber: account.phoneNumber,
        photoURL: account.photoURL,
      });
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error finding account:", error);
    return res.sendStatus(400);
  }
};

export { registerAccount, updateAccount, loginAccount, getAccount };

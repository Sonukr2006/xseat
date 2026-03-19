const { connectDb } = require("../config/db");
const User = require("../models/User");
const Ticket = require("../models/Ticket");
const ExchangeRequest = require("../models/ExchangeRequest");
const Match = require("../models/Match");
const ChatMessage = require("../models/ChatMessage");
const Notification = require("../models/Notification");

const run = async () => {
  await connectDb();
  await Promise.all([
    User.deleteMany({ role: "user" }),
    Ticket.deleteMany({}),
    ExchangeRequest.deleteMany({}),
    Match.deleteMany({}),
    ChatMessage.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const [userA, userB] = await User.create([
    { name: "Arjun Sharma", phone: "9000000001", age: 28, gender: "male", preferredBerth: "LB" },
    { name: "Meera Iyer", phone: "9000000002", age: 34, gender: "female", preferredBerth: "UB" },
  ]);

  const travelDate = new Date();
  travelDate.setDate(travelDate.getDate() + 3);

  const [ticketA, ticketB] = await Ticket.create([
    {
      userId: userA._id,
      trainNumber: "12951",
      trainName: "Mumbai Rajdhani",
      travelDate,
      sourceStation: "Mumbai Central",
      destinationStation: "New Delhi",
      coachNumber: "B2",
      seatNumber: "24",
      seatType: "UB",
      ticketStatus: "CNF",
    },
    {
      userId: userB._id,
      trainNumber: "12951",
      trainName: "Mumbai Rajdhani",
      travelDate,
      sourceStation: "Mumbai Central",
      destinationStation: "New Delhi",
      coachNumber: "B3",
      seatNumber: "18",
      seatType: "LB",
      ticketStatus: "CNF",
    },
  ]);

  const [reqA, reqB] = await ExchangeRequest.create([
    {
      userId: userA._id,
      ticketId: ticketA._id,
      trainNumber: ticketA.trainNumber,
      travelDate: ticketA.travelDate,
      haveSeatType: "UB",
      wantSeatType: "LB",
      coachPreference: "B2",
      routeSegment: { from: "Mumbai Central", to: "New Delhi" },
    },
    {
      userId: userB._id,
      ticketId: ticketB._id,
      trainNumber: ticketB.trainNumber,
      travelDate: ticketB.travelDate,
      haveSeatType: "LB",
      wantSeatType: "UB",
      coachPreference: "B3",
      routeSegment: { from: "Mumbai Central", to: "New Delhi" },
    },
  ]);

  const match = await Match.create({
    requestA: reqA._id,
    requestB: reqB._id,
    trainNumber: ticketA.trainNumber,
    travelDate: ticketA.travelDate,
    coachDistance: 1,
  });

  await ChatMessage.create({
    matchId: match._id,
    senderId: userA._id,
    message: "Hi! Interested in swapping seats?",
  });

  await Notification.create({
    userId: userA._id,
    title: "Demo notification",
    body: "Seat exchange match found.",
  });

  console.log("Demo data seeded");
  process.exit(0);
};

run();

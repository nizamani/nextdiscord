import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Simulating an async database call with a Promise (can be replaced with actual DB call)
      const messages = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              { messageId: 1, channelId: 1, text: "Hello everyone!", time: "10:30 AM", userId: 1 },
              { messageId: 2, channelId: 1, text: "How's it going?", time: "10:41 AM", userId: 2 },
              { messageId: 3, channelId: 2, text: "Anyone up for a match?", time: "01:30 PM", userId: 1 },
              { messageId: 4, channelId: 3, text: "Does anyone know Redux well?", time: "02:30 PM", userId: 2 },
              { messageId: 5, channelId: 3, text: "Yes, I can help!", time: "02:32 PM", userId: 1 },
              { messageId: 6, channelId: 4, text: "Does anyone know good movies?", time: "02:30 PM", userId: 2 },
              { messageId: 7, channelId: 4, text: "Yes, Batman Dark Knight!", time: "02:32 PM", userId: 1 },
              { messageId: 8, channelId: 5, text: "Your favorite song?", time: "02:30 PM", userId: 1 },
              { messageId: 9, channelId: 5, text: "I don't have any!", time: "02:32 PM", userId: 2 },
              { messageId: 10, channelId: 6, text: "Anyone fan of Xbox here?", time: "02:30 PM", userId: 2 },
              { messageId: 11, channelId: 6, text: "That's me!", time: "02:32 PM", userId: 1 },
              { messageId: 12, channelId: 7, text: "Pakistan's performance in the Champion's Trophy was bad", time: "02:30 PM", userId: 1 },
              { messageId: 13, channelId: 7, text: "Our national game is hockey anyway", time: "02:32 PM", userId: 2 },
            ]),
          200 // Simulate delay of 200ms
        )
      );

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

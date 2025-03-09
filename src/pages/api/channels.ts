import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Simulating an async database call with a Promise (can be replaced with actual DB call)
      const channels = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              { id: 1, name: "General", icon: "🏠", isFavorite: false },
              { id: 2, name: "Gaming", icon: "🎲", isFavorite: false },
              { id: 3, name: "Coding", icon: "#", isFavorite: false },
              { id: 4, name: "Movies", icon: "#", isFavorite: false },
              { id: 5, name: "Music", icon: "🎸", isFavorite: false },
              { id: 6, name: "Tech Talk", icon: "🧑🏻‍💻", isFavorite: true },
              { id: 7, name: "Sports", icon: "🥎", isFavorite: true },
            ]),
            200 // Simulate delay of 200ms
        )
      );

      res.status(200).json(channels);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching channels" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

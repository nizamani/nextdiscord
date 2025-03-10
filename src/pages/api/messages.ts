import { db } from "@/app/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { action } = req.query; // Determine which API call to make

      console.log('here');
      // get messages from database
      if (action === 'getmessages') {
        const messages = await getMessages();
        res.status(200).json(messages);

        // if request is not known, return an error
      } else {
        res.status(500).json({ message: "Invalid request" });
      }

      // get unread messages from database
      if (action === 'getunreadmessages') {
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching channels" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

// get messages from database
async function getMessages() {
    const q = query(collection(db, "messages"), orderBy("id", "asc")); // Order by latest first
    const querySnapshot = await getDocs(q);
  
    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return messages;
}

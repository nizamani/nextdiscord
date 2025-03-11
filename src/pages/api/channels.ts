import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../app/firebase/firebase"; // Import your Firestore instance
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // get all of the channels from database
      const q = query(collection(db, "channels"), orderBy("order", "asc")); // Order by oldest channel first
      const querySnapshot = await getDocs(q);
    
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Returns an array of messages as  200 response
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error });
    }

  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

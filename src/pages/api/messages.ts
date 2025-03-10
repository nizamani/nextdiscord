import { db } from "@/app/firebase/firebase";
import { collection, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    console.log('Here');
    try {
      const { action } = req.query; // Determine which API call to make

      // get messages from database
      if (action === 'getmessages') {
        const messages = await getMessages();
        res.status(200).json(messages);

        // request is to get unread messages from database
      } else if (action === 'getunreadmessages') {
        const { userId } = req.query;

        // make sure that userId passed is and userId is of type string when making this API call
        if (!userId || typeof userId !== 'string') {
          return res.status(400).json({ error: "User ID is required" });
        }

        // get and return user unread messages
        const messages = await getUnreadMessages(userId);
        res.status(200).json(messages);

        // if request is not known, return an error
      } else if (action === 'updatereadmsgid') {
        const { userId, channelId, mostRecentMessageId } = req.query;

        // make sure that userId passed is and userId is of type string when making this API call
        if (!channelId || typeof channelId !== 'string' || !userId || typeof userId !== 'string'
          || !mostRecentMessageId || typeof mostRecentMessageId !== 'string'
        ) {
          return res.status(400).json({ error: "Required data is missing" });
        }

        await updatereadmsgid(channelId, userId, mostRecentMessageId);
      } else {
        res.status(500).json({ message: "Invalid request" });
      }

    } catch (error) {
      res.status(500).json({ error });
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

// get unread messages as snapshot, meaning we will get real time updates when unread messages data changes
async function getUnreadMessages(userId: string) {
  const userIdInt = parseInt(userId, 10);

    // query read messages table for a user id
    const q = query(
      collection(db, "unreadmessages"),
      where("userId", "==", userIdInt), // Filter by user ID
    );

    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return messages;
}

async function updatereadmsgid(channelId: string, userId: string, mostRecentMessageId: string) {
  const userIdInt = parseInt(userId, 10);
  const mostRecentMessageIdInt = parseInt(mostRecentMessageId, 10);

  // Query Firestore for the document that matches both `channelId` and `userId`
  const unreadMessagesRef = collection(db, "unreadmessages");
  const q = query(
    unreadMessagesRef,
    where("channelId", "==", channelId),
    where("userId", "==", userIdInt)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.error("No matching document found.");
    return;
  }

  // Update all matching documents (if there are multiple)
  querySnapshot.forEach(async (docSnap) => {
    await updateDoc(docSnap.ref, { readMsgId: mostRecentMessageIdInt });
  });
}
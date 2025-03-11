import { db } from "@/app/firebase/firebase";
// import { Message } from "@/app/types";
import { addDoc, collection, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * this handles all of the incoming API calls to /api/messages endpoint. Even though we have broken down each
 * AP call to it's own sub-functions but still main API calls go through this handler
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
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
        // API call is save message
      } else if (action === 'savemessage') {
        const { userId, channelId, messageId, text, time } = req.query;

        // make sure that userId passed is and userId is of type string when making this API call
        if (!channelId || typeof channelId !== 'string' || !userId || typeof userId !== 'string'
          || !messageId || typeof messageId !== 'string' || !time || typeof time !== 'string'
           || !text || typeof text !== 'string'
        ) {
          return res.status(400).json({ error: "Required data is missing" });
        }

        // save msg API call needs to be moved inside here instead of directly calling function from thunk
        await saveMessage(messageId, channelId, text, userId, time);

        // return success
        res.status(200).json({success: true});
        // API call is unknown, then don't process it
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

/** 
 * get 25 most recent messages from database, this is so that we don't fetch all of the messages hence overloading
 * our frontend with lot of information that it doesn't need to know on page load. If we want we can lazyload older
 * messages
 */
async function getMessages() {
    const q = query(collection(db, "messages"), orderBy("id", "desc"), limit(25)); // Order by latest first
    const querySnapshot = await getDocs(q);
  
    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return messages;
}

/** 
 * get unread messages as snapshot, meaning we will get real time updates when unread messages data changes
 */
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

/**
 * update most recent read message id into firestore
 */
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

/** Save a new message to Firestore
 */
async function saveMessage(messageId: string, channelId: string, text: string, userIdInput:string, time: string) {
  const id = parseInt(messageId, 10);
  const userId = parseInt(userIdInput, 10);

  try {
    // Store message in Firebase Firestore
    await addDoc(collection(db, "messages"), {
      channelId,
      id,
      text,
      time,
      userId,
    });

    console.log("Message successfully stored:", id);
  } catch (error) {
    console.error("Error storing message: ", error);
    throw error;
  }
};

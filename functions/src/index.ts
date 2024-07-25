import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { firestore } from 'firebase-admin'; // or 'firebase' if you are using Firebase client-side SDK
import cors from 'cors';

admin.initializeApp();

const db = admin.firestore();
const corsHandler = cors({ origin: true });

type quizResultData = {
  user_uid: string;
  quiz_id: string;
  answers: {
    [question_id: string]: {
      is_correct: boolean;
      question_text: string;
      user_choice: number;
    };
  };
  scored_points: number;
  time_taken: number;
  completed_at: any;
  percentage: number;
  total_points: number;
  xp: number;
};

export const getCourseTitle = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    const courseId = request.query.courseId as string;
    if (!courseId) {
      response.status(400).send('Course ID parameter is required');
      return;
    }
    try {
      const courseDoc = await db.collection('courses').doc(courseId).get();
      if (!courseDoc.exists) {
        response.status(404).send('Course not found');
        return;
      }
      const courseData = courseDoc.data();
      response.status(200).json(courseData);
    } catch (error) {
      response.status(500).send(error);
    }
  });
});

export const getQuizzesByCourse = functions.https.onRequest(
  (request, response) => {
    corsHandler(request, response, async () => {
      const courseId = request.query.courseId as string;
      if (!courseId) {
        response.status(400).send('Course ID parameter is required');
        return;
      }
      try {
        const quizzesSnapshot = await db
          .collection('quiz')
          .where('course', '==', courseId)
          .where('is_active', '==', true)
          .where('is_deleted', '==', false)
          .get();
        const quizzes = quizzesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        response.status(200).json(quizzes);
      } catch (error) {
        response.status(500).send(error);
      }
    });
  }
);

export const getAllQuizResultsfForUser = functions.https.onRequest(
  (request, response) => {
    corsHandler(request, response, async () => {
      const userId = request.query.userId as string;
      if (!userId) {
        response.status(400).send('User ID parameter is required');
        return;
      }
      try {
        const resultsSnapshot = await db
          .collection('quiz_result')
          .where('user_uid', '==', userId)
          .get();
        const results = resultsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        response.status(200).json(results);
      } catch (error) {
        response.status(500).send(error);
      }
    });
  }
);

export const getQuizResultForUser = functions.https.onRequest(
  (request, response) => {
    corsHandler(request, response, async () => {
      const { userId, quizId } = request.query;
      if (!userId || !quizId) {
        response.status(400).send('User ID and Quiz ID are required');
        return;
      }
      try {
        const resultsSnapshot = await db
          .collection('quiz_result')
          .where('user_uid', '==', userId)
          .where('quiz_id', '==', quizId)
          .get();

        if (resultsSnapshot.empty) {
          response.status(404).send('No results found');
          return;
        }

        const results = resultsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        response.status(200).json(results);
      } catch (error) {
        response.status(500).send(error);
      }
    });
  }
);

export const getQuizById = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      // Get the quizId from the URL query parameters
      const quizId = request.query.quizId as string;

      if (!quizId) {
        response.status(400).send('Missing quizId parameter');
        return;
      }

      // Get a reference to the Firestore database
      const db = admin.firestore();

      // Get the document from the 'quiz' collection with the specified quizId
      const quizDoc = await db.collection('quiz').doc(quizId).get();

      if (!quizDoc.exists) {
        response.status(404).send('Quiz not found');
        return;
      }

      // Send the quiz data as the response
      response.status(200).json(quizDoc.data());
    } catch (error) {
      console.error('Error fetching quiz:', error);
      response.status(500).send('Internal server error');
    }
  });
});

//Postman raw JSON body to test addQuizResult:
// {
//   "answers":{
//       "1":{
//           "is_correct": true,
//           "question_text":"how much is a penny worth?",
//           "selected_choice":"1 cent"
//       }
//   },
//   "percentage":0,
//   "quiz_id":"Xj5chNF0vQFTuTpDDB0C", // needs to be different to add into array
//   "scored_points": 8,
//   "time_taken": 14,
//   "total_points": 12,
//   "user_uid":"This Guy 2",
//   "xp": 150,
//   "completed_at":""
// }

export const addQuizResult = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const quizResultData = request.body as quizResultData;

      // Submit document
      const docRef = await db.collection('quiz_result').add(quizResultData);

      // Construct payload for personal metrics
      const user_details: UserDetails = {
        xp: quizResultData.xp,
        time_taken: quizResultData.time_taken,
        user_uid: quizResultData.user_uid,
      };
      const payload: PersonalMetricPayload = {
        user: user_details,
        quiz_id: quizResultData.quiz_id,
        quiz_result_id: docRef.id,
        completed_at: quizResultData.completed_at,
      };

      // Add personal metrics to leaderboard
      const addToLeaderboardResult =
        await addPersonalMetricsToLeaderboard(payload);

      if (!addToLeaderboardResult.success) {
        return response
          .status(500)
          .json({ error: addToLeaderboardResult.message });
      }

      return response.status(200).json({
        id: docRef.id,
        data: quizResultData,
      });
    } catch (error) {
      console.error('Error adding quiz result:', error);
      return response
        .status(500)
        .json({ error: 'An error occurred while processing the quiz result.' });
    }
  });
});

//Personal Metrics Leaderboard
type UserDetails = {
  xp: number;
  time_taken: number;
  user_uid: string;
};
interface BaseMetrics {
  user: UserDetails;
  course: string;
  quiz_id: FirebaseFirestore.DocumentReference;
  quiz_result_id: string;
  quiz_title: string;
  timestamp: FirebaseFirestore.Timestamp;
}

type PersonalMetricPayload = {
  user: UserDetails;
  quiz_id: string;
  quiz_result_id: string;
  completed_at: Date;
};
type generalUsers = {
  badges_earned: number;
  completion_time_sec: number;
  totalXP: number;
  total_quizzes: number;
  user_uid: string;
};
type generalLeaderBoardPayload = {
  course: string;
  quizId: string[];
  quizTitle: string[];
  users: generalUsers[];
};
type courseDetails = { id: string };
type leaderboardDetails = { id: string };

async function addPersonalMetricsToLeaderboard(payload: PersonalMetricPayload) {
  try {
    //get quiz title
    const quizSnapshot = await db.collection('quiz').doc(payload.quiz_id).get();
    if (!quizSnapshot.exists) {
      console.error('Quiz document not found');
      return { success: false, message: 'Quiz document not found' };
    }

    const quizData = quizSnapshot.data();
    if (!quizData) {
      console.error('Quiz data not available');
      return { success: false, message: 'Quiz data not available' };
    }

    const quizTitle = quizData.quiz_title;

    //get quiz course
    const quizCourse = quizData.course;

    const courseTitle = await db.collection('courses').doc(quizCourse).get();

    if (!courseTitle.exists) {
      console.error('Course document not found');
      return { success: false, message: 'Course document not found' };
    }
    const courseData = courseTitle.data();
    if (!courseData) {
      console.error('Course data not available');
      return { success: false, message: 'Course data not available' };
    }

    // Prepare data for leaderboard_quiz collection
    const leaderboardData = {
      user: {
        xp: payload.user.xp,
        time_taken: payload.user.time_taken,
        user_uid: payload.user.user_uid,
      },
      quiz_title: quizTitle,
      course: courseData.title,
      quiz_id: payload.quiz_id,
      quiz_result_id: payload.quiz_result_id,
      completed_at: payload.completed_at,
    };

    // Add to leaderboard_quiz collection
    const docRef = await db.collection('leaderboard_quiz').add(leaderboardData);

    // shape payload for leaderboard general
    const generalLeaderBoardPayload: generalLeaderBoardPayload = {
      course: leaderboardData.course,
      quizId: [leaderboardData.quiz_id],
      quizTitle: [leaderboardData.quiz_title],
      users: [
        {
          badges_earned: 0,
          completion_time_sec: leaderboardData.user.time_taken,
          totalXP: leaderboardData.user.xp,
          total_quizzes: 1,
          user_uid: leaderboardData.user.user_uid,
        },
      ],
    };

    //     //send payload to addgeneral leaderboard function
    addGeneralLeaderboard(generalLeaderBoardPayload);

    return {
      success: true,
      message: 'Personal Metrics added successfully',
      docRefId: docRef.id,
    };
  } catch (error) {
    console.error('Error adding personal metrics:', error);
    return { success: false, message: 'Error adding personal metrics' };
  }
}

/**
 * the following cloud functions are specific to the user
 */
// create user id doesn't exist on login else return existing user
export const createUser = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { uid, role, name, email, photoURL, job_title, bio } = request.body;
      if (!uid) {
        response.status(400).json({ message: 'Bad Request - user uid needed' });
        return;
      }

      const userRef = db.collection('users');

      const userDoc = await userRef.doc(uid).get();

      if (!userDoc.exists) {
        // create user in database
        await db
          .collection('users')
          .doc(uid)
          .set({ uid, role, name, email, photoURL, job_title, bio });

        response.status(201).json({
          user: { uid, role, name, email, photoURL, job_title, bio },
          message: 'created',
        });
        return;
      }
      // check role
      const user = userDoc.data();

      if (user?.role !== role) {
        const updatedUser = await db
          .collection('users')
          .doc(uid)
          .set({ ...user, role: role });
        console.log(updatedUser);

        response.status(201).json({
          user: { ...user, role: role },
          message: 'updated',
        });
        return;
      }
      // if user exist and role matches return user
      response.status(201).json({ user, message: 'login successfully' });
    } catch (error) {
      response.status(500).json({ error, message: 'login failed' });
    }
  });
});

// Get user by uid - uid can be accessed from
export const getUserByUid = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const uid = request.query.uid as string;

      if (!uid) {
        response.status(400).json({ message: 'Bad Request - no uid provide' });
        return;
      }

      const userSnapShot = await db
        .collection('users')
        .where('uid', '==', uid)
        .get();

      const results = userSnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      response.status(200).json(results[0]);
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  });
});

// edit user profile
export const editUserProfile = functions.https.onRequest(
  (request, response) => {
    corsHandler(request, response, async () => {
      try {
        const id = request.query.id as string;

        if (!id) {
          response
            .status(400)
            .json({ message: 'Bad Request - no uid provide' });
          return;
        }

        const { job_title, bio, name, email, photoURL, uid, role } =
          request.body;

        const update = await db
          .collection('users')
          .doc(id)
          .update({ job_title, bio, name, email, photoURL, uid, role });
        console.log(update);

        const updatedSnapShot = await db.collection('users').doc(id).get();
        console.log(updatedSnapShot);

        const results = {
          ...updatedSnapShot.data(),
        };
        console.log(results);

        // return the updated user
        response.status(200).json(results);
      } catch (error) {
        console.log(error);
        response.status(500).json(error);
      }
    });
  }
);

async function addGeneralLeaderboard(payload: generalLeaderBoardPayload) {
  try {
    const collectionRef = firestore().collection('leaderboard');

    const { course, quizId, quizTitle, users } = payload;

    const query = collectionRef.where('course', '==', payload.course);
    const snapshot = await query.get();

    if (snapshot.empty) {
      // Create new document if not found
      const ID = users.map((user) => user.user_uid); // Initialize with all user uids

      await collectionRef.add({
        course,
        quizId: quizId,
        quizTitle: quizTitle,
        users,
        ID,
      });

      return {
        success: false,
        message: 'Document not found, creating new document',
      };
    } else {
      // Update existing document
      const doc = snapshot.docs[0];
      const docRef = doc.ref;
      const docData = doc.data();

      if (!Array.isArray(docData.quizId)) {
        docData.quizId = [];
      }
      if (!Array.isArray(docData.quizTitle)) {
        docData.quizTitle = [];
      }
      if (!Array.isArray(docData.users)) {
        docData.users = [];
      }
      if (!Array.isArray(docData.ID)) {
        docData.ID = [];
      }

      const quizIdToAdd = String(quizId);
      const quizTitleToAdd = String(quizTitle);

      if (!docData.quizId.includes(quizIdToAdd)) {
        docData.quizId.push(quizIdToAdd);
      }
      if (!docData.quizTitle.includes(quizTitleToAdd)) {
        docData.quizTitle.push(quizTitleToAdd);
      }

      users.forEach((newUser) => {
        const newUserUid = newUser.user_uid;
        if (!docData.ID.includes(newUserUid)) {
          docData.ID.push(newUserUid);
        }

        const existingUserIndex = docData.users.findIndex(
          (u: any) => u.user_uid === newUserUid
        );
        if (existingUserIndex !== -1) {
          const existingUser = docData.users[existingUserIndex];
          existingUser.badges_earned += newUser.badges_earned;
          existingUser.completion_time_sec += newUser.completion_time_sec;
          existingUser.totalXP += newUser.totalXP;
          existingUser.total_quizzes += newUser.total_quizzes;
        } else {
          docData.users.push(newUser);
        }
      });

      await docRef.update({
        quizId: docData.quizId,
        quizTitle: docData.quizTitle,
        users: docData.users,
        ID: docData.ID,
      });

      return {
        success: true,
        message: 'Document updated successfully',
      };
    }
  } catch (error) {
    console.error('Error adding/updating document:', error);
    return {
      success: false,
      message: 'Error adding/updating document',
    };
  }
}

export const getPersonalMetricsById = functions.https.onRequest(
  async (request, response) => {
    corsHandler(request, response, async () => {
      try {
        // Extract user ID from request parameters or query string
        const userUid = request.query.userUid as string;
        if (!userUid) {
          response.status(400).send('User UID parameter is missing' + userUid);
          return;
        }

        const querySnapshot = await db
          .collection('leaderboard_quiz')
          .where('user.user_uid', '==', userUid)
          .get();

        if (querySnapshot.empty) {
          response.status(404).send('User not found in leaderboard' + userUid);
          return;
        }
        const userData: BaseMetrics[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as BaseMetrics;
          return data;
        });

        response.status(200).json(userData);
      } catch (error) {
        console.error('Error getting documents:', error);
        response.status(500).send('Error getting documents');
      }
    });
  }
);

export const getLeaderboardByUserAndCourse = functions.https.onRequest(
  async (request, response) => {
    corsHandler(request, response, async () => {
      try {
        const { user_uid, course } = request.query;
        console.log(user_uid, course);
        if (!user_uid || !course) {
          response
            .status(400)
            .send('Missing parameters: user_uid and course are required.');
          return;
        }

        const leaderboardRef = firestore().collection('leaderboard');
        const query = leaderboardRef
          .where('user.user_uid', '==', user_uid)
          .where('course', '==', course)
          .limit(1);

        const snapshot = await query.get();

        if (snapshot.empty) {
          console.log('No matching documents.');
          response.status(404).send('No matching documents.');
          return;
        }

        const leaderboardData = snapshot.docs[0].data();
        const leaderboard = {
          id: snapshot.docs[0].id,
          ...leaderboardData,
        };

        response.status(200).json(leaderboard);
      } catch (error) {
        console.error('Error retrieving leaderboard data:', error);
        response.status(500).send('Error retrieving leaderboard data.');
      }
    });
  }
);

export const getAllGeneralLeaderboardByUser = functions.https.onRequest(
  async (request, response) => {
    corsHandler(request, response, async () => {
      try {
        // Check if user_uid exists in request query
        if (!request.query || !request.query.user_uid) {
          response.status(400).send('Missing parameter: user_uid is required.');
          return;
        }

        // Extract user_uid from request query and convert to string
        const user_uid = request.query.user_uid.toString();
        console.log('User UID:', user_uid);

        // Query Firestore collection
        const leaderboardRef = await db
          .collection('leaderboard')
          .where('ID', 'array-contains', user_uid)
          .get();

        // Check if no documents matched the query
        if (leaderboardRef.empty) {
          console.log('No matching documents.');
          response.status(404).send('No matching documents.');
          return;
        }

        // Prepare array to hold leaderboard data
        const leaderboards: any[] = [];

        // Process each document in the snapshot
        leaderboardRef.forEach((doc) => {
          const leaderboardData = doc.data();
          leaderboards.push({
            id: doc.id,
            ...leaderboardData,
          });
        });

        // Send response with JSON data
        response.status(200).json(leaderboards);
      } catch (error) {
        console.error('Error retrieving leaderboard data:', error);
        response.status(500).send('Error retrieving leaderboard data.');
      }
    });
  }
);

export const getAllCourses = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const snapshot = await db.collection('courses').get();
      if (snapshot.empty) {
        response.status(404).send('No courses found');
        return;
      }
      let coursesList: courseDetails[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        coursesList.push({
          id: doc.id,
          ...data,
        });
      });
      response.status(200).json(coursesList);
    } catch (error) {
      console.error('Error getting courses: ', error);
      response.status(500).send('Error retrieving courses');
    }
  });
});

export const getAllLeaderboards = functions.https.onRequest(
  (request, response) => {
    corsHandler(request, response, async () => {
      try {
        const snapshot = await db.collection('leaderboard').get();
        if (snapshot.empty) {
          response.status(404).send('No leaderboards found');
          return;
        }
        let leaderboardList: leaderboardDetails[] = [];

        snapshot.forEach((doc) => {
          const leaderboardData = doc.data();
          console.log(leaderboardData, 'data');
          leaderboardList.push({
            id: doc.id,
            ...leaderboardData,
          });
        });
        response.status(200).json(leaderboardList);
      } catch (error) {
        console.error('Error getting leaderboards: ', error);
        response.status(500).send('Error retrieving leaderboards');
      }
    });
  }
);

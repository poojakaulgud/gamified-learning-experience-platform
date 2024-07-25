const FUNCTIONS_URL = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL;

export const loginUser = async ({
  name,
  email,
  photoURL,
  uid,
  role,
  job_title,
  bio,
}: {
  name: string;
  email: string;
  photoURL: string;
  uid: string;
  role: string;
  job_title: string;
  bio: string;
}) => {
  // console.log(`${FUNCTIONS_URL}/createUser`);
  const response = await fetch(`${FUNCTIONS_URL}/createUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, photoURL, uid, role, job_title, bio }),
  });
  if (!response.ok) {
    throw new Error(`Error creating new user`);
  }
  return response.json();
};

// get user by uid
export const userByUid = async (uid: string) => {
  const encodedUid = encodeURIComponent(uid);
  const response = await fetch(
    `${FUNCTIONS_URL}/getUserByUid?uid=${encodedUid}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

// edit user profile
export const editUserProfile = async ({
  job_title,
  bio,
  name,
  email,
  photoURL,
  uid,
  role,
}: {
  job_title: string;
  bio: string;
  name: string;
  email: string;
  photoURL: string;
  uid: string;
  role: string;
}) => {
  console.log({ uid, role, name, email, bio, job_title, photoURL });

  const encodedId = encodeURIComponent(uid);
  const url = `${FUNCTIONS_URL}/editUserProfile?id=${encodedId}`;
  console.log(url);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      job_title,
      bio,
      name,
      email,
      photoURL,
      uid,
      role,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

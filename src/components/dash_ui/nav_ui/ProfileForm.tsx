import React, { useState } from 'react';
import { UserAuth } from '@/context/AuthContext';
import { editUserProfile } from '@/services/userServices';
interface FormInterface {
  // formData: {
  //   job_title: string;
  //   bio: string;
  // };
  // handleSubmit: () => void;
  // handleChange: () => void;
  handleClose: () => void;
}

interface FormData {
  job_title: string;
  bio: string;
}

export default function ProfileForm({ handleClose }: FormInterface) {
  const { userData } = UserAuth();

  const [formData, setFormData] = useState<FormData>({
    job_title: '',
    bio: '',
  });
  // onchange for an input
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { name, value },
    } = e;
    setFormData({ ...formData, [name]: value });
  };
  // onchange for a textarea
  const handleTextChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const {
      currentTarget: { name, value },
    } = e;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // console.log({ ...userData, ...formData });
      // add edit call here
      const response = await editUserProfile({ ...userData, ...formData });

      console.log(response);

      // after edit in db update user auth
      // handleUserData({})

      handleClose();
      setFormData({
        job_title: '',
        bio: '',
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 content-center gap-2 pt-2 text-[#737373]"
    >
      <div className="grid grid-cols-1 gap-1">
        <label className="text-xs" htmlFor="job_title">
          Job Title
        </label>
        <input
          type="text"
          name="job_title"
          value={formData.job_title}
          onChange={handleChange}
          className="rounded text-sm"
        />
      </div>
      <div className="grid grid-cols-1 gap-1">
        <label className="text-left text-xs" htmlFor="bio">
          Bio
        </label>
        <textarea
          name="bio"
          rows={2}
          cols={19}
          value={formData.bio}
          onChange={handleTextChange}
          className="rounded text-sm"
        ></textarea>
      </div>
      <button
        className="mb-2 mt-2 w-full rounded-md bg-[#4442E3] p-1 text-sm text-white"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}

import Image from 'next/image';
import { UserAuth } from '@/context/AuthContext';
// import { ArrayItem } from '@/types/component/FilterButton';

interface UserData {
  badges_earned: number;
  user_uid: string;
  totalXP: number;
  completion_time_sec: number;
  total_quizzes: number;
  xp: number;
  time_taken: number;
}

// reusable table for course leaderboards
// needs to accept array of users & possible table headers
export function CourseTable({ users = [] }: { users: UserData[] | undefined }) {
  const { user, userData } = UserAuth();
  return (
    <div className="mt-3 h-64 w-full overflow-x-auto overflow-y-auto">
      <table className="w-full table-fixed overflow-x-auto">
        <thead className="rounded-lg bg-[#F5F5F5] p-4 text-left">
          <tr className="overflow-x-auto">
            <th className="w-20 rounded-l-lg py-3 pl-3">Rank</th>
            <th className="w-52 py-3">User</th>
            <th className="w-24 py-3">Total XP</th>
            <th className="w-28 py-3">Total Quizzes</th>
            <th className="w-24 rounded-r-lg py-3 pr-3">Badges</th>
          </tr>
        </thead>
        <tbody className="">
          {users?.map((u, index) => (
            <tr
              className={`${u.user_uid === user.uid ? `bg-[#DAD9F9]` : ``}`}
              key={index}
            >
              <td className="rounded-s-lg py-3 pl-3">{index + 1}</td>
              <td className="flex items-center py-3">
                <Image
                  width={30}
                  height={30}
                  src={
                    u?.user_uid === user.uid
                      ? userData.photoURL
                      : '/userimagedefault.png'
                  }
                  alt={'default user'}
                  className="mr-2 rounded-full"
                />
                {u.user_uid === user.uid ? user.displayName : 'Anonymous'}
              </td>
              <td className="py-3">{u.totalXP}</td>
              <td className="py-3">{u.total_quizzes}</td>
              <td className="rounded-e-lg py-3 pr-3">{u.badges_earned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

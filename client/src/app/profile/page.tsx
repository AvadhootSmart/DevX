'use client'
import React, { useEffect } from 'react'
import useUser from '../../../store/user.store'
import { getUserData, getUserFromEmail } from '@/api/profile'
import { Separator } from '@/components/ui/separator'

const page = () => {
  const { user, token, setUser } = useUser()

  const fetchUserData = async () => {
    if (!token) {
      console.error("No token found")
      return;
    };
    const response = await getUserData(token)
    const user = await getUserFromEmail(response)

    setUser({
      username: user.username,
      email: user.email,
    })
  }

  useEffect(() => {
    fetchUserData()
  }, [token])
  return (
    <div className="px-10">
      <h1 className="mt-10 text-4xl font-semibold">Hi, {user ? user.username : "Guest"}</h1>
      <h3 className="mt-2 text-md text-zinc-500">
        View all your problem submissions
      </h3>

      <Separator orientation='horizontal' className='my-6' />
      <h2 className="mt-6 text-2xl font-semibold">Submissions</h2>

      {/* <div className="space-y-2 my-6">
        {problems &&
          problems.map((problem, idx) => (
            <Card key={problem.problem_name} className="p-3 rounded-md border-border">
              <CardContent className="flex justify-between items-center">
                <Link
                  className="font-medium text-lg hover:underline"
                  href={`/problem/${problem.path}`}
                >{`${idx + 1}.${problem.problem_name}`}</Link>
                <DifficultyBadge difficulty={problem.difficulty} />
              </CardContent>
            </Card>
          ))}
      </div> */}
    </div>
  )
}

export default page
import KanbanBoard  from "../components/KanbanBoard";
import Banner from "../components/Banner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type RepoData = {
  name: string
  description: string
  subscribers_count: number
  stargazers_count: number
  forks_count: number
}

function fetchData() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      axios.get('https://localhost:5000').then(
        (res) => console.log(res)
      ),
  })

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="h-100 w-100">
      <Banner/>
      <KanbanBoard/>
    </div>
  )
}

export default Dashboard
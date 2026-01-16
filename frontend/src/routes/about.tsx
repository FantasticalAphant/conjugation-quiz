import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const { isPending, error, data } = useQuery({
    queryKey: ['aboutData'],
    queryFn: () =>
      fetch('/api/about').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="p-2">
      <h3>About Page</h3>
      <p>{data.message}</p>
    </div>
  )
}

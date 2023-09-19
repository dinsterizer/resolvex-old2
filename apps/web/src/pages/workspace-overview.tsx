import { Card, Text, Metric, Title, LineChart } from '@tremor/react'
import { useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { CustomerInfiniteList } from '~/components/customer-infinite-list'
import { QueryError } from '~/components/query-error'
import { Skeleton } from '~/components/ui/skeleton'
import { trpc } from '~/utils/trpc'

export function WorkspaceOverviewPage() {
  const { workspaceId } = useParams() as { workspaceId: string }
  const workspaceOverviewQuery = trpc.workspace.overview.useQuery({ workspaceId })

  return (
    <div>
      <h1 className="font-title text-xl font-medium p-4">Overview</h1>

      <div className="p-4 flex gap-8 flex-wrap">
        {match(workspaceOverviewQuery)
          .with({ status: 'error' }, () => <QueryError />)
          .with({ status: 'loading' }, () => (
            <>
              <Card className="md:max-w-xs">
                <Text>
                  <Skeleton className="h-5 w-24" />
                </Text>
                <Metric>
                  <Skeleton className="h-8 w-44 mt-1" />
                </Metric>
              </Card>
              <Card className="md:max-w-xs">
                <Text>
                  <Skeleton className="h-5 w-24" />
                </Text>
                <Metric>
                  <Skeleton className="h-8 w-44 mt-1" />
                </Metric>
              </Card>
            </>
          ))
          .with({ status: 'success' }, (query) => (
            <>
              <Card className="md:max-w-xs">
                <Text>Total customers</Text>
                <Metric>{new Intl.NumberFormat('en-US', {}).format(query.data.totalCustomersCount)}</Metric>
              </Card>
              <Card className="md:max-w-xs">
                <Text>Active customers</Text>
                <Metric>{new Intl.NumberFormat('en-US', {}).format(query.data.activeCustomersCount)}</Metric>
              </Card>
            </>
          ))
          .exhaustive()}
      </div>

      <div className="p-4">
        <Card>
          <Title>Metrics for the last 7 days</Title>
          <LineChart
            className="mt-6"
            data={
              workspaceOverviewQuery.data?.newCustomersPerDayInLast7Days.map((data) => ({
                day: data.day,
                'Count of new customers': data.count,
              })) ?? []
            }
            valueFormatter={(value) => new Intl.NumberFormat('en-US', {}).format(value)}
            index="day"
            categories={['Count of new customers']}
            colors={['green']}
            curveType="monotone"
          />
        </Card>
      </div>

      <div className="p-4">
        <h2 className="font-title font-medium text-lg">Waiting customers</h2>

        <CustomerInfiniteList className="space-y-4 mt-4" status="waiting" limit={6} workspaceId={workspaceId} />
      </div>
    </div>
  )
}

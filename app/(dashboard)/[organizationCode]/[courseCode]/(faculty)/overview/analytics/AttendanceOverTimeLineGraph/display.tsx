import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export interface CoupledData {
  attendanceRate: number;
  currentLectureDate: Date;
  movingAverage: number;
}

export interface AttendanceOverTimeLineGraphDisplayProps {
  data: CoupledData[];
}

const AttendanceOverTimeLineGraphDisplay: React.FC<
  AttendanceOverTimeLineGraphDisplayProps
> = ({ data }) => {
  const formattedData = data.map((point) => {
    return {
      ...point,
      currentLectureDate: point.currentLectureDate.toLocaleDateString()
    };
  });

  const attendanceRate = formattedData.map((point) => {
    return point.attendanceRate;
  });

  const averageAttendanceRate =
    attendanceRate.reduce((acc, curr) => {
      return acc + curr;
    }) / attendanceRate.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Attendance</CardTitle>
        <CardDescription>
          Your average attendance rate is: {averageAttendanceRate.toFixed(2)}%
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0
              }}
            >
              <XAxis
                dataKey="currentLectureDate"
                padding={{ left: 50, right: 50 }}
              />
              <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
              <Legend />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Lecture Date
                            </span>
                            <span className="font-bold">
                              {payload[0].payload.currentLectureDate}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Attendance Rate
                            </span>
                            <span className="font-bold">
                              {payload[0].payload.attendanceRate.toFixed(2) +
                                '%'}
                            </span>
                          </div>
                          <div className="flex flex-col col-span-2">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Moving Average
                            </span>
                            <span className="font-bold">
                              {payload[0].payload.movingAverage.toFixed(2) +
                                '%'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="attendanceRate"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                  className: 'fill-secondary'
                }}
                stroke="hsl(var(--primary)"
              />
              <Line
                type="monotone"
                dataKey="movingAverage"
                strokeWidth={2}
                activeDot={{
                  r: 4,
                  className: 'fill-muted'
                }}
                stroke="hsl(var(--muted-foreground)"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceOverTimeLineGraphDisplay;

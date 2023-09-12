import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
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
                            <span className="font-bold text-muted-foreground">
                              {payload[0].payload.attendanceRate + '%'}
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
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceOverTimeLineGraphDisplay;

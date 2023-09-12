interface AttendanceOverTimeLineGraphProps {
  data: {
    test: string;
  };
}

const AttendanceOverTimeLineGraph: React.FC<
  AttendanceOverTimeLineGraphProps
> = ({ data }) => {
  return <>{JSON.stringify(data)}</>;
};

export default AttendanceOverTimeLineGraph;

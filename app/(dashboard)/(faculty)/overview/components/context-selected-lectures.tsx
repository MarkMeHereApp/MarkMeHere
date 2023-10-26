import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react';
import { lecturesType, useLecturesContext } from '@/app/context-lecture';
import { DateRange } from 'react-day-picker';

// Define the shape of the context data
interface SelectedLecturesContextProps {
  selectedLectures: lecturesType;
  setSelectedLectures: React.Dispatch<React.SetStateAction<lecturesType>>;
  selectedDateRange: DateRange;
  setSelectedDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

// Step 1: Create the context
const SelectedLecturesContext = createContext<
  SelectedLecturesContextProps | undefined
>(undefined);

interface SelectedLecturesProviderProps {
  children: ReactNode;
}

// Step 2: Create a Provider component
export const SelectedLecturesProvider: React.FC<
  SelectedLecturesProviderProps
> = ({ children }) => {
  const { lectures } = useLecturesContext();
  lectures?.sort((a, b) => a.lectureDate.getTime() - b.lectureDate.getTime());
  const [selectedLectures, setSelectedLectures] = useState(lectures);

  const defaultFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const defaultTo = new Date();
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(() => {
    if (lectures && lectures.length > 0) {
      return {
        from: new Date(lectures[0].lectureDate),
        to: new Date(lectures[lectures.length - 1].lectureDate)
      };
    }
    return { from: defaultFrom, to: defaultTo };
  });

  useEffect(() => {
    if (!lectures || lectures.length === 0) {
      return;
    }

    const newSelectedLectures = lectures.filter((lecture) => {
      const fromDate = selectedDateRange?.from?.getTime() ?? new Date();
      const toDate = selectedDateRange?.to?.getTime() ?? new Date();
      return lecture.lectureDate >= fromDate && lecture.lectureDate <= toDate;
    });
    setSelectedLectures(newSelectedLectures);
  }, [selectedDateRange]);

  useEffect(() => {
    setSelectedLectures(lectures);
  }, [lectures]);

  // Value that will be provided
  const contextValue: SelectedLecturesContextProps = {
    selectedLectures,
    setSelectedLectures,
    selectedDateRange,
    setSelectedDateRange
  };

  return (
    <SelectedLecturesContext.Provider value={contextValue}>
      {children}
    </SelectedLecturesContext.Provider>
  );
};

// Step 3: Create a custom hook to use this context
export const useSelectedLectureContext = (): SelectedLecturesContextProps => {
  const context = useContext(SelectedLecturesContext);
  if (!context) {
    throw new Error(
      'useSelectedLectureContext must be used within a SelectedLecturesProvider'
    );
  }
  return context;
};

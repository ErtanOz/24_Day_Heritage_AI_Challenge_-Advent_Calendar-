export interface CalendarDay {
  day: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export interface DayWindowProps {
  dayData: CalendarDay;
  isEditMode: boolean;
  onEdit: (day: CalendarDay) => void;
}
import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../../service/assignment.service';
import { QuizService } from '../../service/quiz.service';

interface CalendarDay {
  type: 'day';  // Literal type
  date: Date;
  formattedDate: string;
  dayName: string;
  isCurrentMonth?: boolean;
}

interface CalendarMonth {
  type: 'month';  // Literal type
  name: string;
  number: number;
  events: number;
}

interface EventDetail {
  type: 'assignment' | 'quiz' | 'day';  // Add 'day' as a valid type
  title: string;
  date: string;
  time?: string;
  description?: string;
}

interface EventSummary {
  assignments: any[];
  quizzes: any[];
  total: number;
}

type CalendarItem = CalendarDay | CalendarMonth;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  assignments: any[] = [];
  quizzes: any[] = [];
  weekDays: CalendarItem[] = [];
  currentDate = new Date();
  viewMode: 'week' | 'month' | 'year' = 'week';
  calendarDays: any[] = [];
  selectedDate = new Date();
  displayDate = new Date();
  selectedEvent: EventDetail | null = null;
  hoverPosition = { x: 0, y: 0 };

  constructor(
    private assignmentService: AssignmentService,
    private quizService: QuizService,
     
  ) {}

  ngOnInit(): void {
    this.loadAssignments();
    this.loadQuizzes();
    this.updateCalendarView();
  }

  loadAssignments(): void {
    this.assignmentService.getAssignments().subscribe((data: any) => {
      this.assignments = data;
    });
  }

  loadQuizzes(): void {
   this.quizService.quizzes().subscribe((data: any) => {
      this.quizzes = data;
      console.log("quizzes",this.quizzes)
    });
  }

  updateCalendarView(): void {
    switch (this.viewMode) {
      case 'week':
        this.generateWeekDays();
        break;
      case 'month':
        this.generateMonthDays();
        break;
      case 'year':
        this.generateYearView();
        break;
    }
  }

  setViewMode(mode: 'week' | 'month' | 'year'): void {
    this.viewMode = mode;
    this.updateCalendarView();
  }

  navigateCalendar(direction: 'prev' | 'next'): void {
    const newDate = new Date(this.displayDate);
    
    switch (this.viewMode) {
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    this.displayDate = newDate;
    this.updateCalendarView();
  }

  generateWeekDays(): void {
    const curr = new Date(this.displayDate);
    const week: CalendarDay[] = [];

    // Get to the start of the week
    curr.setDate(curr.getDate() - curr.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(curr);
      week.push({
        type: 'day' as const,
        date: new Date(date),
        formattedDate: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isCurrentMonth: date.getMonth() === this.displayDate.getMonth()
      });
      curr.setDate(curr.getDate() + 1);
    }
    this.weekDays = week;
  }

  generateMonthDays(): void {
    const year = this.displayDate.getFullYear();
    const month = this.displayDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the days from previous month to fill the first week
    const daysFromPrevMonth = firstDay.getDay();
    const daysFromNextMonth = 6 - lastDay.getDay();
    
    const days: CalendarDay[] = [];

    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        type: 'day' as const,
        date,
        formattedDate: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isCurrentMonth: false
      });
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        type: 'day' as const,
        date,
        formattedDate: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isCurrentMonth: true
      });
    }

    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        type: 'day' as const,
        date,
        formattedDate: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isCurrentMonth: false
      });
    }

    this.weekDays = days;
  }

  generateYearView(): void {
    const year = this.currentDate.getFullYear();
    const months: CalendarMonth[] = [];
    
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);
      months.push({
        type: 'month' as const,
        name: date.toLocaleDateString('en-US', { month: 'long' }),
        number: month,
        events: this.getEventsForMonth(month)
      });
    }
    this.weekDays = months;
  }

  getEventsForMonth(month: number): number {
    return this.assignments.filter(assignment => 
      new Date(assignment.dueDateTime).getMonth() === month
    ).length + this.quizzes.filter(quiz => 
      new Date(quiz.start_time).getMonth() === month
    ).length;
  }

  getMonthEvents(month: number): EventSummary {
    const assignments = this.assignments.filter(assignment => 
      new Date(assignment.dueDateTime).getMonth() === month
    );
    const quizzes = this.quizzes.filter(quiz => 
      new Date(quiz.start_time).getMonth() === month
    );
    return {
      assignments,
      quizzes,
      total: assignments.length + quizzes.length
    };
  }

  hasEventsOnDay(date: string): boolean {
    return this.getAssignmentsForDay(date).length > 0 || this.getQuizzesForDay(date).length > 0;
  }

  getDaysInMonth(): any[] {
    // Implement logic to get all days in the current month
    return [];
  }

  getAssignmentsForDay(date: string): any[] {
    return this.assignments.filter(assignment => 
      new Date(assignment.dueDateTime).toISOString().split('T')[0] === date
    );
  }

  getQuizzesForDay(date: string): any[] {
    return this.quizzes.filter(quiz => {
      const quizDate = quiz.start_time ? new Date(quiz.start_time.replace(' ', 'T')) : new Date();
      return quizDate.toISOString().split('T')[0] === date;
    });
  }

  getCurrentViewLabel(): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };
    if (this.viewMode === 'week') {
      return `Week of ${this.displayDate.toLocaleDateString('en-US', options)}`;
    }
    return this.displayDate.toLocaleDateString('en-US', options);
  }

  resetToToday(): void {
    this.selectedDate = new Date();
    this.displayDate = new Date();
    this.updateCalendarView();
  }

  showEventDetail(event: MouseEvent, item: any, type: 'assignment' | 'quiz' | 'day'): void {
    this.hoverPosition = {
      x: event.clientX,
      y: event.clientY
    };
    
    if (type === 'day') {
      const assignments = this.getAssignmentsForDay(item.formattedDate);
      const quizzes = this.getQuizzesForDay(item.formattedDate);
      this.selectedEvent = {
        type: 'day',
        title: `Events on ${new Date(item.formattedDate).toLocaleDateString()}`,
        date: `${assignments.length} Assignments, ${quizzes.length} Quizzes`,
        description: this.formatDayEventDetails({ assignments, quizzes })
      };
    } else {
      this.selectedEvent = {
        type,
        title: item.title,
        date: new Date(type === 'assignment' ? item.dueDateTime : item.date).toLocaleDateString(),
        time: new Date(type === 'assignment' ? item.dueDateTime : item.date).toLocaleTimeString(),
        description: item.description || 'No description available'
      };
    }
  }

  private formatDayEventDetails(events: { assignments: any[], quizzes: any[] }): string {
    let details = '';
    if (events.assignments.length) {
      details += 'Assignments:\n' + events.assignments.map(a => `- ${a.title}`).join('\n');
    }
    if (events.quizzes.length) {
      if (details) details += '\n\n';
      details += 'Quizzes:\n' + events.quizzes.map(q => `- ${q.title}`).join('\n');
    }
    return details || 'No events scheduled';
  }

  showMonthEventDetail(event: MouseEvent, month: number): void {
    const events = this.getMonthEvents(month);
    this.hoverPosition = {
      x: event.clientX,
      y: event.clientY
    };
    
    this.selectedEvent = {
      type: 'assignment', // Default type, won't affect styling much
      title: `Events for ${new Date(this.currentDate.getFullYear(), month, 1).toLocaleDateString('en-US', { month: 'long' })}`,
      date: `${events.assignments.length} Assignments, ${events.quizzes.length} Quizzes`,
      description: this.formatMonthEventDetails(events)
    };
  }

  private formatMonthEventDetails(events: EventSummary): string {
    let details = '';
    if (events.assignments.length) {
      details += 'Assignments:\n' + events.assignments.map(a => `- ${a.title}`).join('\n');
    }
    if (events.quizzes.length) {
      if (details) details += '\n\n';
      details += 'Quizzes:\n' + events.quizzes.map(q => `- ${q.title}`).join('\n');
    }
    return details || 'No events scheduled';
  }

  hideEventDetail(): void {
    this.selectedEvent = null;
  }
}

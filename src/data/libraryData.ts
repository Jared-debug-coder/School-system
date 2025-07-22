export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  condition: 'excellent' | 'good' | 'fair' | 'damaged' | 'lost';
  status: 'available' | 'borrowed' | 'overdue';
  location: string;
  dateAdded: string;
  borrowedBy?: string;
  borrowedDate?: string;
  dueDate?: string;
  borrowCount: number;
}

export interface BorrowingRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerId: string;
  borrowerName: string;
  borrowerType: 'student' | 'teacher' | 'staff';
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  condition: string;
  fine?: number;
  status: 'active' | 'returned' | 'overdue';
}

export const booksData: Book[] = [
  {
    id: 'B001',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    genre: 'Fiction',
    condition: 'good',
    status: 'available',
    location: 'Section A, Shelf 3',
    dateAdded: '2024-01-15',
    borrowCount: 12
  },
  {
    id: 'B002',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    genre: 'Fiction',
    condition: 'excellent',
    status: 'borrowed',
    location: 'Section A, Shelf 2',
    dateAdded: '2024-01-10',
    borrowedBy: 'John Doe (NA2024001)',
    borrowedDate: '2024-01-20',
    dueDate: '2024-02-05',
    borrowCount: 8
  },
  {
    id: 'B003',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0-14-143951-8',
    genre: 'Romance',
    condition: 'good',
    status: 'overdue',
    location: 'Section A, Shelf 1',
    dateAdded: '2024-01-08',
    borrowedBy: 'Mary Johnson (NA2024002)',
    borrowedDate: '2024-01-10',
    dueDate: '2024-01-25',
    borrowCount: 15
  },
  {
    id: 'B004',
    title: 'Advanced Mathematics',
    author: 'Dr. Robert Smith',
    isbn: '978-0-321-95738-5',
    genre: 'Education',
    condition: 'excellent',
    status: 'available',
    location: 'Section B, Shelf 1',
    dateAdded: '2024-01-12',
    borrowCount: 25
  },
  {
    id: 'B005',
    title: 'Biology Textbook Form 4',
    author: 'Kenya Institute of Education',
    isbn: '978-9966-25-123-4',
    genre: 'Science',
    condition: 'good',
    status: 'borrowed',
    location: 'Section B, Shelf 2',
    dateAdded: '2024-01-05',
    borrowedBy: 'Teacher Sarah Wilson',
    borrowedDate: '2024-01-18',
    dueDate: '2024-02-15',
    borrowCount: 30
  },
  {
    id: 'B006',
    title: 'Chemistry Practical Guide',
    author: 'Prof. David Lee',
    isbn: '978-0-470-12345-6',
    genre: 'Science',
    condition: 'fair',
    status: 'available',
    location: 'Section B, Shelf 3',
    dateAdded: '2023-12-20',
    borrowCount: 18
  },
  {
    id: 'B007',
    title: 'Kenyan History',
    author: 'Dr. Margaret Wanjiku',
    isbn: '978-9966-46-789-0',
    genre: 'History',
    condition: 'good',
    status: 'overdue',
    location: 'Section C, Shelf 1',
    dateAdded: '2024-01-03',
    borrowedBy: 'Peter Kamau (NA2024005)',
    borrowedDate: '2024-01-08',
    dueDate: '2024-01-23',
    borrowCount: 9
  },
  {
    id: 'B008',
    title: 'Computer Programming Basics',
    author: 'Tech Publishers',
    isbn: '978-1-234-56789-0',
    genre: 'Technology',
    condition: 'excellent',
    status: 'available',
    location: 'Section D, Shelf 1',
    dateAdded: '2024-01-20',
    borrowCount: 5
  }
];

export const borrowingRecords: BorrowingRecord[] = [
  {
    id: 'BR001',
    bookId: 'B002',
    bookTitle: 'The Great Gatsby',
    borrowerId: 'NA2024001',
    borrowerName: 'John Doe',
    borrowerType: 'student',
    borrowDate: '2024-01-20',
    dueDate: '2024-02-05',
    condition: 'excellent',
    status: 'active'
  },
  {
    id: 'BR002',
    bookId: 'B003',
    bookTitle: 'Pride and Prejudice',
    borrowerId: 'NA2024002',
    borrowerName: 'Mary Johnson',
    borrowerType: 'student',
    borrowDate: '2024-01-10',
    dueDate: '2024-01-25',
    condition: 'good',
    fine: 50,
    status: 'overdue'
  },
  {
    id: 'BR003',
    bookId: 'B005',
    bookTitle: 'Biology Textbook Form 4',
    borrowerId: 'T001',
    borrowerName: 'Sarah Wilson',
    borrowerType: 'teacher',
    borrowDate: '2024-01-18',
    dueDate: '2024-02-15',
    condition: 'good',
    status: 'active'
  },
  {
    id: 'BR004',
    bookId: 'B007',
    bookTitle: 'Kenyan History',
    borrowerId: 'NA2024005',
    borrowerName: 'Peter Kamau',
    borrowerType: 'student',
    borrowDate: '2024-01-08',
    dueDate: '2024-01-23',
    condition: 'good',
    fine: 75,
    status: 'overdue'
  },
  {
    id: 'BR005',
    bookId: 'B001',
    bookTitle: 'To Kill a Mockingbird',
    borrowerId: 'NA2024003',
    borrowerName: 'Alice Brown',
    borrowerType: 'student',
    borrowDate: '2024-01-05',
    dueDate: '2024-01-20',
    returnDate: '2024-01-18',
    condition: 'good',
    status: 'returned'
  }
];

export const libraryStats = {
  totalBooks: booksData.length,
  availableBooks: booksData.filter(book => book.status === 'available').length,
  borrowedBooks: booksData.filter(book => book.status === 'borrowed').length,
  overdueBooks: booksData.filter(book => book.status === 'overdue').length,
  totalBorrowingRecords: borrowingRecords.length,
  activeBorrowings: borrowingRecords.filter(record => record.status === 'active').length,
  overdueRecords: borrowingRecords.filter(record => record.status === 'overdue').length,
  totalFinesCollected: borrowingRecords.reduce((sum, record) => sum + (record.fine || 0), 0),
  popularBooks: booksData.sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 5)
};
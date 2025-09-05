// Library Data Management System

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  edition: string;
  subject: string;
  category: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4' | 'Reference' | 'General';
  yearOfPublication: number;
  language: 'English' | 'Kiswahili' | 'Other';
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
  quantity: number;
  availableQuantity: number;
  barcode?: string;
  qrCode?: string;
  acquisitionType: 'Purchase' | 'Donation';
  acquisitionDate: string;
  location: string;
  price?: number;
  description?: string;
  coverImage?: string;
  status: 'Available' | 'Borrowed' | 'Reserved' | 'Lost' | 'Damaged' | 'Maintenance';
}

export interface Borrower {
  id: string;
  name: string;
  type: 'Student' | 'Teacher' | 'Administrator';
  studentId?: string;
  teacherId?: string;
  class?: string;
  email: string;
  phone: string;
  borrowingLimit: number;
  currentlyBorrowed: number;
  totalBorrowed: number;
  finesOwed: number;
  status: 'Active' | 'Suspended' | 'Blocked';
  registrationDate: string;
  lastActivity: string;
}

export interface BorrowTransaction {
  id: string;
  bookId: string;
  borrowerId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Borrowed' | 'Returned' | 'Overdue' | 'Lost' | 'Renewed';
  renewalCount: number;
  maxRenewals: number;
  fineAmount: number;
  notes?: string;
  issuedBy: string;
  returnedTo?: string;
}

export interface Reservation {
  id: string;
  bookId: string;
  borrowerId: string;
  reservationDate: string;
  expiryDate: string;
  status: 'Active' | 'Fulfilled' | 'Expired' | 'Cancelled';
  priority: number;
  notificationSent: boolean;
}

export interface Fine {
  id: string;
  borrowerId: string;
  transactionId: string;
  amount: number;
  reason: 'Overdue' | 'Lost' | 'Damaged';
  dateIncurred: string;
  datePaid?: string;
  status: 'Pending' | 'Paid' | 'Waived';
  description: string;
}

export interface LibraryReport {
  id: string;
  type: 'Circulation' | 'Overdue' | 'Fines' | 'Popular Books' | 'User Activity';
  title: string;
  generatedBy: string;
  dateGenerated: string;
  period: {
    from: string;
    to: string;
  };
  data: any;
  summary: {
    totalBooks?: number;
    totalBorrowers?: number;
    totalTransactions?: number;
    totalFines?: number;
    [key: string]: any;
  };
}

// Mock Data
const mockBooks: Book[] = [
  {
    id: 'book-001',
    title: 'Chemistry Form 3 Student\'s Book',
    author: 'Kenya Institute of Education',
    isbn: '978-9966-25-123-4',
    edition: '2nd Edition',
    subject: 'Chemistry',
    category: 'Form 3',
    yearOfPublication: 2022,
    language: 'English',
    condition: 'New',
    quantity: 50,
    availableQuantity: 35,
    barcode: 'CHE001234567',
    acquisitionType: 'Purchase',
    acquisitionDate: '2023-01-15',
    location: 'Science Section - Shelf A3',
    price: 850,
    status: 'Available'
  },
  {
    id: 'book-002',
    title: 'Mathematics Form 4',
    author: 'Longhorn Publishers',
    isbn: '978-9966-56-789-0',
    edition: '3rd Edition',
    subject: 'Mathematics',
    category: 'Form 4',
    yearOfPublication: 2023,
    language: 'English',
    condition: 'New',
    quantity: 40,
    availableQuantity: 28,
    barcode: 'MAT001234567',
    acquisitionType: 'Purchase',
    acquisitionDate: '2023-02-10',
    location: 'Mathematics Section - Shelf B2',
    price: 920,
    status: 'Available'
  },
  {
    id: 'book-003',
    title: 'Kiswahili Fasihi Form 2',
    author: 'Oxford University Press',
    isbn: '978-9966-78-456-1',
    edition: '1st Edition',
    subject: 'Kiswahili',
    category: 'Form 2',
    yearOfPublication: 2021,
    language: 'Kiswahili',
    condition: 'Good',
    quantity: 30,
    availableQuantity: 22,
    barcode: 'KIS001234567',
    acquisitionType: 'Donation',
    acquisitionDate: '2023-03-05',
    location: 'Languages Section - Shelf C1',
    status: 'Available'
  }
];

const mockBorrowers: Borrower[] = [
  {
    id: 'bor-001',
    name: 'John Kamau',
    type: 'Student',
    studentId: 'STU2023001',
    class: 'Form 3A',
    email: 'john.kamau@school.ac.ke',
    phone: '+254712345678',
    borrowingLimit: 5,
    currentlyBorrowed: 2,
    totalBorrowed: 15,
    finesOwed: 0,
    status: 'Active',
    registrationDate: '2023-01-10',
    lastActivity: '2024-01-15'
  },
  {
    id: 'bor-002',
    name: 'Mary Wanjiku',
    type: 'Teacher',
    teacherId: 'TCH2020005',
    email: 'mary.wanjiku@school.ac.ke',
    phone: '+254723456789',
    borrowingLimit: 10,
    currentlyBorrowed: 3,
    totalBorrowed: 45,
    finesOwed: 150,
    status: 'Active',
    registrationDate: '2020-09-01',
    lastActivity: '2024-01-18'
  }
];

const mockTransactions: BorrowTransaction[] = [
  {
    id: 'trans-001',
    bookId: 'book-001',
    borrowerId: 'bor-001',
    borrowDate: '2024-01-10',
    dueDate: '2024-01-24',
    status: 'Borrowed',
    renewalCount: 0,
    maxRenewals: 2,
    fineAmount: 0,
    issuedBy: 'librarian-001'
  },
  {
    id: 'trans-002',
    bookId: 'book-002',
    borrowerId: 'bor-002',
    borrowDate: '2024-01-05',
    dueDate: '2024-01-19',
    returnDate: '2024-01-20',
    status: 'Returned',
    renewalCount: 1,
    maxRenewals: 3,
    fineAmount: 50,
    issuedBy: 'librarian-001',
    returnedTo: 'librarian-001'
  }
];

const mockReservations: Reservation[] = [
  {
    id: 'res-001',
    bookId: 'book-001',
    borrowerId: 'bor-002',
    reservationDate: '2024-01-18',
    expiryDate: '2024-01-25',
    status: 'Active',
    priority: 1,
    notificationSent: false
  }
];

const mockFines: Fine[] = [
  {
    id: 'fine-001',
    borrowerId: 'bor-002',
    transactionId: 'trans-002',
    amount: 50,
    reason: 'Overdue',
    dateIncurred: '2024-01-20',
    status: 'Pending',
    description: 'Book returned 1 day late'
  }
];

// Utility Functions
export const calculateFine = (dueDate: string, returnDate: string = new Date().toISOString()): number => {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  const daysOverdue = Math.floor((returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysOverdue * 10); // KES 10 per day
};

export const canBorrow = (borrower: Borrower): boolean => {
  return borrower.status === 'Active' && 
         borrower.currentlyBorrowed < borrower.borrowingLimit && 
         borrower.finesOwed === 0;
};

export const getDaysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const today = new Date();
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const isOverdue = (dueDate: string): boolean => {
  return getDaysUntilDue(dueDate) < 0;
};

// Data Access Functions
export const getBooks = (): Book[] => mockBooks;
export const getBorrowers = (): Borrower[] => mockBorrowers;
export const getTransactions = (): BorrowTransaction[] => mockTransactions;
export const getReservations = (): Reservation[] => mockReservations;
export const getFines = (): Fine[] => mockFines;

export const getBookById = (id: string): Book | undefined => {
  return mockBooks.find(book => book.id === id);
};

export const getBorrowerById = (id: string): Borrower | undefined => {
  return mockBorrowers.find(borrower => borrower.id === id);
};

export const getTransactionsByBorrower = (borrowerId: string): BorrowTransaction[] => {
  return mockTransactions.filter(transaction => transaction.borrowerId === borrowerId);
};

export const getOverdueTransactions = (): BorrowTransaction[] => {
  return mockTransactions.filter(transaction => 
    transaction.status === 'Borrowed' && isOverdue(transaction.dueDate)
  );
};

export const searchBooks = (query: string): Book[] => {
  const searchTerm = query.toLowerCase();
  return mockBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm) ||
    book.subject.toLowerCase().includes(searchTerm) ||
    book.isbn.includes(searchTerm)
  );
};

export const getBooksByCategory = (category: string): Book[] => {
  return mockBooks.filter(book => book.category === category);
};

export const getBooksBySubject = (subject: string): Book[] => {
  return mockBooks.filter(book => book.subject === subject);
};

export const getMostBorrowedBooks = (limit: number = 10): Book[] => {
  // This would typically be calculated from transaction data
  return mockBooks.slice(0, limit);
};

// CRUD Operations
export const addBook = (book: Omit<Book, 'id'>): Book => {
  const newBook: Book = {
    ...book,
    id: `book-${Date.now()}`
  };
  mockBooks.push(newBook);
  return newBook;
};

export const updateBook = (id: string, updates: Partial<Book>): Book | null => {
  const index = mockBooks.findIndex(book => book.id === id);
  if (index === -1) return null;
  
  mockBooks[index] = { ...mockBooks[index], ...updates };
  return mockBooks[index];
};

export const borrowBook = (bookId: string, borrowerId: string, issuedBy: string): BorrowTransaction | null => {
  const book = getBookById(bookId);
  const borrower = getBorrowerById(borrowerId);
  
  if (!book || !borrower || book.availableQuantity <= 0 || !canBorrow(borrower)) {
    return null;
  }
  
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 2 weeks borrowing period
  
  const transaction: BorrowTransaction = {
    id: `trans-${Date.now()}`,
    bookId,
    borrowerId,
    borrowDate: new Date().toISOString(),
    dueDate: dueDate.toISOString(),
    status: 'Borrowed',
    renewalCount: 0,
    maxRenewals: borrower.type === 'Student' ? 2 : 3,
    fineAmount: 0,
    issuedBy
  };
  
  // Update book availability
  book.availableQuantity--;
  
  // Update borrower stats
  borrower.currentlyBorrowed++;
  borrower.totalBorrowed++;
  borrower.lastActivity = new Date().toISOString();
  
  mockTransactions.push(transaction);
  return transaction;
};

export const returnBook = (transactionId: string, returnedTo: string): BorrowTransaction | null => {
  const transaction = mockTransactions.find(t => t.id === transactionId);
  if (!transaction || transaction.status !== 'Borrowed') return null;
  
  const book = getBookById(transaction.bookId);
  const borrower = getBorrowerById(transaction.borrowerId);
  
  if (!book || !borrower) return null;
  
  const returnDate = new Date().toISOString();
  transaction.returnDate = returnDate;
  transaction.status = 'Returned';
  transaction.returnedTo = returnedTo;
  
  // Calculate fine if overdue
  const fine = calculateFine(transaction.dueDate, returnDate);
  if (fine > 0) {
    transaction.fineAmount = fine;
    borrower.finesOwed += fine;
    
    // Create fine record
    const fineRecord: Fine = {
      id: `fine-${Date.now()}`,
      borrowerId: transaction.borrowerId,
      transactionId: transaction.id,
      amount: fine,
      reason: 'Overdue',
      dateIncurred: returnDate,
      status: 'Pending',
      description: `Book returned ${Math.floor(fine / 10)} day(s) late`
    };
    mockFines.push(fineRecord);
  }
  
  // Update book availability
  book.availableQuantity++;
  
  // Update borrower stats
  borrower.currentlyBorrowed--;
  borrower.lastActivity = new Date().toISOString();
  
  return transaction;
};

export const renewBook = (transactionId: string): BorrowTransaction | null => {
  const transaction = mockTransactions.find(t => t.id === transactionId);
  if (!transaction || transaction.status !== 'Borrowed' || transaction.renewalCount >= transaction.maxRenewals) {
    return null;
  }
  
  // Extend due date by 14 days
  const newDueDate = new Date(transaction.dueDate);
  newDueDate.setDate(newDueDate.getDate() + 14);
  
  transaction.dueDate = newDueDate.toISOString();
  transaction.renewalCount++;
  
  return transaction;
};

export const reserveBook = (bookId: string, borrowerId: string): Reservation | null => {
  const book = getBookById(bookId);
  const borrower = getBorrowerById(borrowerId);
  
  if (!book || !borrower || book.availableQuantity > 0) return null;
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // 1 week reservation
  
  const reservation: Reservation = {
    id: `res-${Date.now()}`,
    bookId,
    borrowerId,
    reservationDate: new Date().toISOString(),
    expiryDate: expiryDate.toISOString(),
    status: 'Active',
    priority: mockReservations.filter(r => r.bookId === bookId && r.status === 'Active').length + 1,
    notificationSent: false
  };
  
  mockReservations.push(reservation);
  return reservation;
};

export const payFine = (fineId: string): Fine | null => {
  const fine = mockFines.find(f => f.id === fineId);
  if (!fine || fine.status !== 'Pending') return null;
  
  const borrower = getBorrowerById(fine.borrowerId);
  if (!borrower) return null;
  
  fine.status = 'Paid';
  fine.datePaid = new Date().toISOString();
  borrower.finesOwed = Math.max(0, borrower.finesOwed - fine.amount);
  
  return fine;
};

// Report Generation
export const generateCirculationReport = (fromDate: string, toDate: string): LibraryReport => {
  const transactions = mockTransactions.filter(t => 
    new Date(t.borrowDate) >= new Date(fromDate) && 
    new Date(t.borrowDate) <= new Date(toDate)
  );
  
  return {
    id: `report-${Date.now()}`,
    type: 'Circulation',
    title: 'Circulation Report',
    generatedBy: 'system',
    dateGenerated: new Date().toISOString(),
    period: { from: fromDate, to: toDate },
    data: transactions,
    summary: {
      totalTransactions: transactions.length,
      booksIssued: transactions.filter(t => t.status !== 'Returned').length,
      booksReturned: transactions.filter(t => t.status === 'Returned').length
    }
  };
};

export const generateOverdueReport = (): LibraryReport => {
  const overdueTransactions = getOverdueTransactions();
  
  return {
    id: `report-${Date.now()}`,
    type: 'Overdue',
    title: 'Overdue Books Report',
    generatedBy: 'system',
    dateGenerated: new Date().toISOString(),
    period: { from: '', to: '' },
    data: overdueTransactions,
    summary: {
      totalOverdue: overdueTransactions.length,
      totalFinesExpected: overdueTransactions.reduce((sum, t) => sum + calculateFine(t.dueDate), 0)
    }
  };
};

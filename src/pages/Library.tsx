import React, { useState } from 'react';
import { Search, Plus, BarChart3, AlertCircle, Book, Users, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { booksData, borrowingRecords, libraryStats } from '@/data/libraryData';
import { useToast } from '@/hooks/use-toast';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const { toast } = useToast();

  const genres = ['All', ...Array.from(new Set(booksData.map(book => book.genre)))];
  
  const filteredBooks = booksData.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const overdueBooks = booksData.filter(book => book.status === 'overdue');
  const overdueRecords = borrowingRecords.filter(record => record.status === 'overdue');

  const handleCheckOut = (bookId: string) => {
    toast({
      title: "Check Out",
      description: "Book check-out dialog would open here",
    });
  };

  const handleCheckIn = (bookId: string) => {
    toast({
      title: "Check In", 
      description: "Book check-in dialog would open here",
    });
  };

  const handleAddBook = () => {
    toast({
      title: "Add Book",
      description: "Add new book dialog would open here",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Library data exported to CSV successfully!",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: 'default',
      borrowed: 'secondary', 
      overdue: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getConditionBadge = (condition: string) => {
    const variants = {
      excellent: 'default',
      good: 'secondary',
      fair: 'outline',
      damaged: 'destructive',
      lost: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[condition as keyof typeof variants] || 'outline'}>
        {condition.charAt(0).toUpperCase() + condition.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600">Manage books, track borrowings, and monitor overdue items</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={handleAddBook}>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraryStats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">In library inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{libraryStats.availableBooks}</div>
            <p className="text-xs text-muted-foreground">Ready for borrowing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{libraryStats.borrowedBooks}</div>
            <p className="text-xs text-muted-foreground">Currently on loan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{libraryStats.overdueBooks}</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">Book Inventory</TabsTrigger>
          <TabsTrigger value="borrowings">Active Borrowings</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Items</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search books by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Books Table */}
          <Card>
            <CardHeader>
              <CardTitle>Book Inventory ({filteredBooks.length} books)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Details</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{book.title}</div>
                          <div className="text-sm text-gray-500">by {book.author}</div>
                          <div className="text-xs text-gray-400">ISBN: {book.isbn}</div>
                        </div>
                      </TableCell>
                      <TableCell>{book.genre}</TableCell>
                      <TableCell>{book.location}</TableCell>
                      <TableCell>{getConditionBadge(book.condition)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(book.status)}
                          {book.borrowedBy && (
                            <div className="text-xs text-gray-500">
                              Borrowed by: {book.borrowedBy}
                            </div>
                          )}
                          {book.dueDate && (
                            <div className="text-xs text-gray-500">
                              Due: {new Date(book.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {book.status === 'available' ? (
                            <Button size="sm" onClick={() => handleCheckOut(book.id)}>
                              Check Out
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleCheckIn(book.id)}>
                              Check In
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="borrowings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Borrowings ({libraryStats.activeBorrowings})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowingRecords.filter(record => record.status === 'active').map((record) => {
                    const daysLeft = Math.ceil((new Date(record.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.bookTitle}</TableCell>
                        <TableCell>
                          <div>
                            <div>{record.borrowerName}</div>
                            <div className="text-sm text-gray-500 capitalize">{record.borrowerType}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(record.borrowDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(record.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={daysLeft < 0 ? 'destructive' : daysLeft < 3 ? 'outline' : 'default'}>
                            {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleCheckIn(record.bookId)}>
                            Process Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Overdue Items ({overdueRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Fine Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueRecords.map((record) => {
                    const daysOverdue = Math.ceil((new Date().getTime() - new Date(record.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.bookTitle}</TableCell>
                        <TableCell>
                          <div>
                            <div>{record.borrowerName}</div>
                            <div className="text-sm text-gray-500 capitalize">{record.borrowerType}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(record.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{daysOverdue} days</Badge>
                        </TableCell>
                        <TableCell>KSh {record.fine || 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Send Reminder
                            </Button>
                            <Button size="sm" onClick={() => handleCheckIn(record.bookId)}>
                              Process Return
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {libraryStats.popularBooks.map((book, index) => (
                    <div key={book.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-gray-500">by {book.author}</div>
                      </div>
                      <Badge variant="outline">{book.borrowCount} times</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Fines Collected:</span>
                    <span className="font-medium">KSh {libraryStats.totalFinesCollected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Borrowings:</span>
                    <span className="font-medium">{libraryStats.activeBorrowings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Books in Good Condition:</span>
                    <span className="font-medium">
                      {booksData.filter(book => ['excellent', 'good'].includes(book.condition)).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Borrow Rate:</span>
                    <span className="font-medium">
                      {Math.round(booksData.reduce((sum, book) => sum + book.borrowCount, 0) / booksData.length)} per book
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
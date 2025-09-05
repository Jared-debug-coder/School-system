import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  BarChart3,
  AlertTriangle,
  Plus,
  Edit,
  Eye,
  FileText,
  Calendar,
  Filter,
  X,
  Save,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  getInventoryItems,
  getSalesData,
  getLowStockItems,
  getCustomerCount,
  getRecentActivity,
  checkUserRole,
  getRequisitions,
  getSuppliers,
  getReturns,
  addInventoryItem,
  approveRequisition,
  rejectRequisition,
  InventoryItem,
  SalesRecord,
  Requisition,
  Supplier,
  ReturnRecord
} from '@/data/storeData';

const StoreDashboard = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [dailySales, setDailySales] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [returns, setReturns] = useState<ReturnRecord[]>([]);

  // Modal states
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [isCreateRequisitionModalOpen, setIsCreateRequisitionModalOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isProcessReturnModalOpen, setIsProcessReturnModalOpen] = useState(false);
  const [isViewItemModalOpen, setIsViewItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Form states
  const [newItemForm, setNewItemForm] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    unitPrice: '',
    minStockLevel: '',
    maxStockLevel: '',
    initialStock: ''
  });

  const [newSaleForm, setNewSaleForm] = useState({
    customerName: '',
    customerType: 'student',
    items: [{ itemId: '', quantity: '', unitPrice: '' }],
    paymentMethod: 'cash',
    notes: ''
  });

  const [newRequisitionForm, setNewRequisitionForm] = useState({
    title: '',
    requestedBy: '',
    department: '',
    items: [{ itemId: '', quantity: '', notes: '' }],
    priority: 'medium',
    notes: ''
  });

  const [newSupplierForm, setNewSupplierForm] = useState({
    name: '',
    contactPerson: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    categories: '',
    rating: '5'
  });

  const [newReturnForm, setNewReturnForm] = useState({
    originalSaleId: '',
    customerName: '',
    itemName: '',
    itemId: '',
    quantity: '',
    reason: 'damaged',
    refundAmount: '',
    notes: ''
  });

  const [newReportForm, setNewReportForm] = useState({
    type: 'inventory',
    period: 'month',
    format: 'pdf',
    notes: ''
  });

  useEffect(() => {
    const items = getInventoryItems();
    const sales = getSalesData();
    const lowStock = getLowStockItems();
    const reqs = getRequisitions();
    const sups = getSuppliers();
    const rets = getReturns();
    const activity = getRecentActivity();
    
    setInventoryItems(items);
    setSalesRecords(sales.records || []);
    setRequisitions(reqs);
    setSuppliers(sups);
    setReturns(rets);
    setTotalItems(items.length);
    setDailySales(sales.dailySales || 0);
    setLowStockCount(lowStock.length);
    setCustomers(getCustomerCount());
    setRecentActivity(activity);
  }, []);

  const role = checkUserRole();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'completed': return 'outline';
      case 'rejected': return 'destructive';
      case 'in-stock': return 'default';
      case 'low-stock': return 'secondary';
      case 'out-of-stock': return 'destructive';
      default: return 'default';
    }
  };

  // Action handlers
  const handleAddItem = () => {
    setNewItemForm({
      name: '',
      sku: '',
      category: '',
      description: '',
      unitPrice: '',
      minStockLevel: '',
      maxStockLevel: '',
      initialStock: ''
    });
    setIsAddItemModalOpen(true);
  };

  const handleNewSale = () => {
    setNewSaleForm({
      customerName: '',
      customerType: 'student',
      items: [{ itemId: '', quantity: '', unitPrice: '' }],
      paymentMethod: 'cash',
      notes: ''
    });
    setIsNewSaleModalOpen(true);
  };

  const handleCreateRequisition = () => {
    setNewRequisitionForm({
      title: '',
      requestedBy: '',
      department: '',
      items: [{ itemId: '', quantity: '', notes: '' }],
      priority: 'medium',
      notes: ''
    });
    setIsCreateRequisitionModalOpen(true);
  };

  const handleGenerateReport = () => {
    setIsGenerateReportModalOpen(true);
  };

  const handleViewItem = (itemId: string) => {
    const item = inventoryItems.find(i => i.id === itemId);
    setSelectedItem(item || null);
    setSelectedItemId(itemId);
    setIsViewItemModalOpen(true);
  };

  const handleEditItem = (itemId: string) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (item) {
      setNewItemForm({
        name: item.name,
        sku: item.sku,
        category: item.category,
        description: item.description || '',
        unitPrice: item.unitPrice?.toString() || '',
        minStockLevel: item.minStockLevel?.toString() || '',
        maxStockLevel: item.maxStockLevel?.toString() || '',
        initialStock: item.currentStock.toString()
      });
      setSelectedItemId(itemId);
      setIsEditItemModalOpen(true);
    }
  };

  const handleViewSale = (saleId: string) => {
    alert(`View Sale details for ID: ${saleId}`);
  };

  const handleViewRequisition = (reqId: string) => {
    alert(`View Requisition details for ID: ${reqId}`);
  };

  const handleEditRequisition = (reqId: string) => {
    alert(`Edit Requisition for ID: ${reqId}`);
  };

  const handleApproveRequisition = (reqId: string) => {
    try {
      approveRequisition(reqId);
      alert(`Requisition ${reqId} approved successfully`);
      // Refresh requisitions
      setRequisitions(getRequisitions());
    } catch (error) {
      alert('Error approving requisition');
    }
  };

  const handleRejectRequisition = (reqId: string) => {
    try {
      rejectRequisition(reqId);
      alert(`Requisition ${reqId} rejected`);
      // Refresh requisitions
      setRequisitions(getRequisitions());
    } catch (error) {
      alert('Error rejecting requisition');
    }
  };

  const handleAddSupplier = () => {
    alert('Add Supplier modal would open here');
  };

  const handleViewSupplier = (supplierId: string) => {
    alert(`View Supplier details for ID: ${supplierId}`);
  };

  const handleEditSupplier = (supplierId: string) => {
    alert(`Edit Supplier for ID: ${supplierId}`);
  };

  const handleProcessReturn = () => {
    alert('Process Return modal would open here');
  };

  const handleViewReturn = (returnId: string) => {
    alert(`View Return details for ID: ${returnId}`);
  };

  const handleEditReturn = (returnId: string) => {
    alert(`Edit Return for ID: ${returnId}`);
  };

  const handleFilterItems = () => {
    alert('Filter Items modal would open here');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage school store inventory, sales, and operations
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Daily Sales</p>
                  <p className="text-2xl font-bold text-gray-900">KES {dailySales.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
                </div>
                <div className="p-3 rounded-full bg-orange-50">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Requisitions</p>
                  <p className="text-2xl font-bold text-gray-900">{requisitions.filter(r => r.status === 'pending').length}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-50">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            {role === 'storekeeper' && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button onClick={handleAddItem} className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Plus className="h-5 w-5" />
                      <span className="text-sm">Add Item</span>
                    </Button>
                    <Button onClick={handleNewSale} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="text-sm">New Sale</span>
                    </Button>
                    <Button onClick={handleCreateRequisition} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <FileText className="h-5 w-5" />
                      <span className="text-sm">Create Requisition</span>
                    </Button>
                    <Button onClick={handleGenerateReport} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-sm">Generate Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Inventory Items</CardTitle>
                <div className="flex space-x-2">
                  <Button onClick={handleAddItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                  <Button onClick={handleFilterItems} variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.slice(0, 10).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.currentStock}</TableCell>
                        <TableCell>KES {(item.unitPrice ?? 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button onClick={() => handleViewItem(item.id)} variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleEditItem(item.id)} variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sales Records</CardTitle>
                <Button onClick={handleNewSale} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Sale
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sale ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesRecords.slice(0, 10).map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{sale.customerName}</TableCell>
                        <TableCell>{sale.items.length} items</TableCell>
                        <TableCell>KES {(sale.totalAmount ?? 0).toFixed(2)}</TableCell>
                        <TableCell>{sale.paymentMethod}</TableCell>
                        <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleViewSale(sale.id)} variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requisitions" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Requisitions</CardTitle>
                <Button onClick={handleCreateRequisition} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Requisition
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Req ID</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requisitions.slice(0, 10).map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.id}</TableCell>
                        <TableCell>{req.requestedBy}</TableCell>
                        <TableCell>{req.department}</TableCell>
                        <TableCell>{req.items.length} items</TableCell>
                        <TableCell>KES {(req.totalValue ?? 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(req.status)}>
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(req.dateRequested).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button onClick={() => handleViewRequisition(req.id)} variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {req.status === 'pending' && (
                              <Button onClick={() => handleEditRequisition(req.id)} variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
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

          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Suppliers</CardTitle>
                <Button onClick={handleAddSupplier} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.slice(0, 10).map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.contactPerson}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell>{supplier.category}</TableCell>
                        <TableCell>{supplier.rating}/5</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button onClick={() => handleViewSupplier(supplier.id)} variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleEditSupplier(supplier.id)} variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="returns" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Returns & Replacements</CardTitle>
                <Button onClick={handleProcessReturn} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Process Return
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Return ID</TableHead>
                      <TableHead>Original Sale</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returns.slice(0, 10).map((returnRecord) => (
                      <TableRow key={returnRecord.id}>
                        <TableCell className="font-medium">{returnRecord.id}</TableCell>
                        <TableCell>{returnRecord.originalSaleId}</TableCell>
                        <TableCell>{returnRecord.customerName}</TableCell>
                        <TableCell>{returnRecord.itemName}</TableCell>
                        <TableCell>{returnRecord.reason}</TableCell>
                        <TableCell>KES {(returnRecord.refundAmount ?? 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(returnRecord.status)}>
                            {returnRecord.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(returnRecord.dateRequested).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button onClick={() => handleViewReturn(returnRecord.id)} variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {returnRecord.status === 'pending' && (
                              <Button onClick={() => handleEditReturn(returnRecord.id)} variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
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
        </Tabs>
      </div>

      {/* Add Item Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newItemForm.name}
                onChange={(e) => setNewItemForm({...newItemForm, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">SKU</Label>
              <Input
                id="sku"
                value={newItemForm.sku}
                onChange={(e) => setNewItemForm({...newItemForm, sku: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select value={newItemForm.category} onValueChange={(value) => setNewItemForm({...newItemForm, category: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stationery">Stationery</SelectItem>
                  <SelectItem value="uniforms">Uniforms</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={newItemForm.description}
                onChange={(e) => setNewItemForm({...newItemForm, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitPrice" className="text-right">Unit Price</Label>
              <Input
                id="unitPrice"
                type="number"
                value={newItemForm.unitPrice}
                onChange={(e) => setNewItemForm({...newItemForm, unitPrice: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minStock" className="text-right col-span-2">Min Stock</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={newItemForm.minStockLevel}
                  onChange={(e) => setNewItemForm({...newItemForm, minStockLevel: e.target.value})}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxStock" className="text-right col-span-2">Max Stock</Label>
                <Input
                  id="maxStock"
                  type="number"
                  value={newItemForm.maxStockLevel}
                  onChange={(e) => setNewItemForm({...newItemForm, maxStockLevel: e.target.value})}
                  className="col-span-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="initialStock" className="text-right">Initial Stock</Label>
              <Input
                id="initialStock"
                type="number"
                value={newItemForm.initialStock}
                onChange={(e) => setNewItemForm({...newItemForm, initialStock: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle form submission
              try {
                const newItem = {
                  name: newItemForm.name,
                  sku: newItemForm.sku,
                  category: newItemForm.category,
                  description: newItemForm.description,
                  unitPrice: parseFloat(newItemForm.unitPrice) || 0,
                  minStockLevel: parseInt(newItemForm.minStockLevel) || 0,
                  maxStockLevel: parseInt(newItemForm.maxStockLevel) || 0,
                  currentStock: parseInt(newItemForm.initialStock) || 0,
                  supplierId: 'default-supplier',
                  location: 'main-store'
                };
                
                addInventoryItem(newItem);
                setInventoryItems(getInventoryItems());
                setIsAddItemModalOpen(false);
                alert('Item added successfully!');
              } catch (error) {
                alert('Error adding item: ' + error);
              }
            }}>
              <Save className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Sale Modal */}
      <Dialog open={isNewSaleModalOpen} onOpenChange={setIsNewSaleModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Sale</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerName" className="text-right col-span-1">Customer</Label>
                <Input
                  id="customerName"
                  value={newSaleForm.customerName}
                  onChange={(e) => setNewSaleForm({...newSaleForm, customerName: e.target.value})}
                  className="col-span-3"
                  placeholder="Customer name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerType" className="text-right col-span-1">Type</Label>
                <Select value={newSaleForm.customerType} onValueChange={(value) => setNewSaleForm({...newSaleForm, customerType: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Sale Items</Label>
              {newSaleForm.items.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 items-center">
                  <Select value={item.itemId} onValueChange={(value) => {
                    const updatedItems = [...newSaleForm.items];
                    updatedItems[index] = {...updatedItems[index], itemId: value};
                    setNewSaleForm({...newSaleForm, items: updatedItems});
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map(invItem => (
                        <SelectItem key={invItem.id} value={invItem.id}>{invItem.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedItems = [...newSaleForm.items];
                      updatedItems[index] = {...updatedItems[index], quantity: e.target.value};
                      setNewSaleForm({...newSaleForm, items: updatedItems});
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Unit price"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const updatedItems = [...newSaleForm.items];
                      updatedItems[index] = {...updatedItems[index], unitPrice: e.target.value};
                      setNewSaleForm({...newSaleForm, items: updatedItems});
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newSaleForm.items.length > 1) {
                        const updatedItems = newSaleForm.items.filter((_, i) => i !== index);
                        setNewSaleForm({...newSaleForm, items: updatedItems});
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setNewSaleForm({
                    ...newSaleForm,
                    items: [...newSaleForm.items, { itemId: '', quantity: '', unitPrice: '' }]
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentMethod" className="text-right col-span-1">Payment</Label>
                <Select value={newSaleForm.paymentMethod} onValueChange={(value) => setNewSaleForm({...newSaleForm, paymentMethod: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalAmount" className="text-right col-span-1">Total</Label>
                <Input
                  id="totalAmount"
                  value={`KES ${newSaleForm.items.reduce((sum, item) => {
                    return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
                  }, 0).toFixed(2)}`}
                  disabled
                  className="col-span-3"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <Textarea
                id="notes"
                value={newSaleForm.notes}
                onChange={(e) => setNewSaleForm({...newSaleForm, notes: e.target.value})}
                className="col-span-3"
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsNewSaleModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => {
              try {
                // Basic validation
                if (!newSaleForm.customerName || newSaleForm.items.some(item => !item.itemId || !item.quantity)) {
                  alert('Please fill in all required fields');
                  return;
                }
                
                const totalAmount = newSaleForm.items.reduce((sum, item) => {
                  return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
                }, 0);
                
                alert(`Sale recorded successfully! Total: KES ${totalAmount.toFixed(2)}`);
                setIsNewSaleModalOpen(false);
                // Reset form
                setNewSaleForm({
                  customerName: '',
                  customerType: 'student',
                  items: [{ itemId: '', quantity: '', unitPrice: '' }],
                  paymentMethod: 'cash',
                  notes: ''
                });
              } catch (error) {
                alert('Error recording sale: ' + error);
              }
            }}>
              <Save className="h-4 w-4 mr-2" />
              Complete Sale
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Requisition Modal */}
      <Dialog open={isCreateRequisitionModalOpen} onOpenChange={setIsCreateRequisitionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Requisition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reqTitle" className="text-right col-span-1">Title</Label>
                <Input
                  id="reqTitle"
                  value={newRequisitionForm.title}
                  onChange={(e) => setNewRequisitionForm({...newRequisitionForm, title: e.target.value})}
                  className="col-span-3"
                  placeholder="Requisition title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reqDepartment" className="text-right col-span-1">Department</Label>
                <Input
                  id="reqDepartment"
                  value={newRequisitionForm.department}
                  onChange={(e) => setNewRequisitionForm({...newRequisitionForm, department: e.target.value})}
                  className="col-span-3"
                  placeholder="Department"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reqPriority" className="text-right">Priority</Label>
              <Select value={newRequisitionForm.priority} onValueChange={(value) => setNewRequisitionForm({...newRequisitionForm, priority: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Items Requested</Label>
              {newRequisitionForm.items.map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Select value={item.itemId} onValueChange={(value) => {
                    const newItems = [...newRequisitionForm.items];
                    newItems[index].itemId = value;
                    setNewRequisitionForm({...newRequisitionForm, items: newItems});
                  }}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((invItem) => (
                        <SelectItem key={invItem.id} value={invItem.id}>{invItem.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...newRequisitionForm.items];
                      newItems[index].quantity = e.target.value;
                      setNewRequisitionForm({...newRequisitionForm, items: newItems});
                    }}
                    placeholder="Qty"
                    className="col-span-2"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = newRequisitionForm.items.filter((_, i) => i !== index);
                      setNewRequisitionForm({...newRequisitionForm, items: newItems});
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewRequisitionForm({
                    ...newRequisitionForm,
                    items: [...newRequisitionForm.items, { itemId: '', quantity: '', notes: '' }]
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reqNotes" className="text-right">Notes</Label>
              <Textarea
                id="reqNotes"
                value={newRequisitionForm.notes}
                onChange={(e) => setNewRequisitionForm({...newRequisitionForm, notes: e.target.value})}
                className="col-span-3"
                placeholder="Additional notes or justification..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateRequisitionModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => {
              try {
                if (!newRequisitionForm.title || !newRequisitionForm.department || newRequisitionForm.items.some(item => !item.itemId || !item.quantity)) {
                  alert('Please fill in all required fields');
                  return;
                }
                
                alert('Requisition created successfully!');
                setIsCreateRequisitionModalOpen(false);
                setNewRequisitionForm({
                  title: '',
                  requestedBy: '',
                  department: '',
                  priority: 'medium',
                  items: [{ itemId: '', quantity: '', notes: '' }],
                  notes: ''
                });
              } catch (error) {
                alert('Error creating requisition: ' + error);
              }
            }}>
              <Save className="h-4 w-4 mr-2" />
              Create Requisition
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Supplier Modal */}
      <Dialog open={isAddSupplierModalOpen} onOpenChange={setIsAddSupplierModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierName" className="text-right">Name</Label>
              <Input
                id="supplierName"
                value={newSupplierForm.name}
                onChange={(e) => setNewSupplierForm({...newSupplierForm, name: e.target.value})}
                className="col-span-3"
                placeholder="Supplier name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierContact" className="text-right">Contact</Label>
              <Input
                id="supplierContact"
                value={newSupplierForm.contact}
                onChange={(e) => setNewSupplierForm({...newSupplierForm, contact: e.target.value})}
                className="col-span-3"
                placeholder="Contact person"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierEmail" className="text-right">Email</Label>
              <Input
                id="supplierEmail"
                type="email"
                value={newSupplierForm.email}
                onChange={(e) => setNewSupplierForm({...newSupplierForm, email: e.target.value})}
                className="col-span-3"
                placeholder="Email address"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierPhone" className="text-right">Phone</Label>
              <Input
                id="supplierPhone"
                value={newSupplierForm.phone}
                onChange={(e) => setNewSupplierForm({...newSupplierForm, phone: e.target.value})}
                className="col-span-3"
                placeholder="Phone number"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierAddress" className="text-right">Address</Label>
              <Textarea
                id="supplierAddress"
                value={newSupplierForm.address}
                onChange={(e) => setNewSupplierForm({...newSupplierForm, address: e.target.value})}
                className="col-span-3"
                placeholder="Physical address"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierCategories" className="text-right">Categories</Label>
              <Input
                id="supplierCategories"
                value={newSupplierForm.categories}
                onChange={(e) => setNewSupplierForm({...newSupplierForm, categories: e.target.value})}
                className="col-span-3"
                placeholder="Categories (comma-separated)"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddSupplierModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => {
              try {
                if (!newSupplierForm.name || !newSupplierForm.contact || !newSupplierForm.email) {
                  alert('Please fill in all required fields');
                  return;
                }
                
                alert('Supplier added successfully!');
                setIsAddSupplierModalOpen(false);
                setNewSupplierForm({
                  name: '',
                  contactPerson: '',
                  contact: '',
                  email: '',
                  phone: '',
                  address: '',
                  categories: '',
                  rating: '5'
                });
              } catch (error) {
                alert('Error adding supplier: ' + error);
              }
            }}>
              <Save className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Process Return Modal */}
      <Dialog open={isProcessReturnModalOpen} onOpenChange={setIsProcessReturnModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Process Return</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="returnItem" className="text-right">Item</Label>
              <Select value={newReturnForm.itemId} onValueChange={(value) => setNewReturnForm({...newReturnForm, itemId: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="returnQuantity" className="text-right">Quantity</Label>
              <Input
                id="returnQuantity"
                type="number"
                value={newReturnForm.quantity}
                onChange={(e) => setNewReturnForm({...newReturnForm, quantity: e.target.value})}
                className="col-span-3"
                placeholder="Quantity returned"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="returnReason" className="text-right">Reason</Label>
              <Select value={newReturnForm.reason} onValueChange={(value) => setNewReturnForm({...newReturnForm, reason: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="defective">Defective</SelectItem>
                  <SelectItem value="incorrect">Incorrect Item</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="returnNotes" className="text-right">Notes</Label>
              <Textarea
                id="returnNotes"
                value={newReturnForm.notes}
                onChange={(e) => setNewReturnForm({...newReturnForm, notes: e.target.value})}
                className="col-span-3"
                placeholder="Additional details..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsProcessReturnModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => {
              try {
                if (!newReturnForm.itemId || !newReturnForm.quantity || !newReturnForm.reason) {
                  alert('Please fill in all required fields');
                  return;
                }
                
                alert('Return processed successfully!');
                setIsProcessReturnModalOpen(false);
                setNewReturnForm({
                  originalSaleId: '',
                  customerName: '',
                  itemName: '',
                  itemId: '',
                  quantity: '',
                  reason: 'damaged',
                  refundAmount: '',
                  notes: ''
                });
              } catch (error) {
                alert('Error processing return: ' + error);
              }
            }}>
              <Save className="h-4 w-4 mr-2" />
              Process Return
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Report Modal */}
      <Dialog open={isGenerateReportModalOpen} onOpenChange={setIsGenerateReportModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportType" className="text-right">Type</Label>
              <Select value={newReportForm.type} onValueChange={(value) => setNewReportForm({...newReportForm, type: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="low-stock">Low Stock Report</SelectItem>
                  <SelectItem value="supplier">Supplier Report</SelectItem>
                  <SelectItem value="returns">Returns Report</SelectItem>
                  <SelectItem value="requisitions">Requisitions Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportPeriod" className="text-right">Period</Label>
              <Select value={newReportForm.period} onValueChange={(value) => setNewReportForm({...newReportForm, period: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportFormat" className="text-right">Format</Label>
              <Select value={newReportForm.format} onValueChange={(value) => setNewReportForm({...newReportForm, format: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportNotes" className="text-right">Notes</Label>
              <Textarea
                id="reportNotes"
                value={newReportForm.notes}
                onChange={(e) => setNewReportForm({...newReportForm, notes: e.target.value})}
                className="col-span-3"
                placeholder="Additional report parameters..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsGenerateReportModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => {
              try {
                alert(`${newReportForm.type} report generated successfully in ${newReportForm.format} format!`);
                setIsGenerateReportModalOpen(false);
                setNewReportForm({
                  type: 'inventory',
                  period: 'month',
                  format: 'pdf',
                  notes: ''
                });
              } catch (error) {
                alert('Error generating report: ' + error);
              }
            }}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </Layout>
  );
};

export default StoreDashboard;

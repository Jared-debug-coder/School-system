// Store Management Data Module
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  sku: string;
  barcode?: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  costPrice: number;
  unit: string; // e.g., "pieces", "kg", "liters"
  supplier: string;
  location: string; // store location/shelf
  expiryDate?: Date;
  dateAdded: Date;
  lastUpdated: Date;
  isActive: boolean;
  imageUrl?: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  reference?: string; // invoice, requisition, or order number
  performedBy: string;
  timestamp: Date;
  notes?: string;
  costPerUnit?: number;
  totalCost?: number;
}

export interface Requisition {
  id: string;
  requestedBy: string;
  requestedByRole: 'teacher' | 'principal' | 'admin';
  requestedFor: string; // department, class, etc.
  items: RequisitionItem[];
  status: 'pending' | 'approved' | 'rejected' | 'partially_approved' | 'issued' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  issuedBy?: string;
  issuedDate?: Date;
  rejectionReason?: string;
  notes?: string;
  totalEstimatedCost: number;
}

export interface RequisitionItem {
  itemId: string;
  itemName: string;
  requestedQuantity: number;
  approvedQuantity?: number;
  issuedQuantity?: number;
  unitPrice: number;
  totalCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'issued';
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  category: string[];
  paymentTerms: string;
  isActive: boolean;
  rating: number;
  lastOrderDate?: Date;
  totalOrders: number;
  totalValue: number;
}

export interface StockReturn {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  reason: string;
  condition: 'damaged' | 'expired' | 'defective' | 'wrong_item' | 'excess';
  returnedBy: string;
  returnDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'replaced' | 'refunded';
  notes?: string;
  replacementItemId?: string;
  refundAmount?: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  customerId?: string;
  customerName?: string;
  customerType: 'student' | 'teacher' | 'parent' | 'visitor';
  totalAmount: number;
  paymentMethod: 'cash' | 'mpesa' | 'bank' | 'credit';
  salesPerson: string;
  timestamp: Date;
  receiptNumber: string;
  notes?: string;
}

export interface SaleItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}

export interface StoreUserRole {
  userId: string;
  role: 'storekeeper' | 'teacher' | 'principal' | 'admin' | 'auditor';
  permissions: StorePermission[];
}

export interface StorePermission {
  action: 'view_inventory' | 'add_item' | 'edit_item' | 'delete_item' | 
          'view_stock' | 'receive_stock' | 'issue_stock' | 'adjust_stock' |
          'create_requisition' | 'approve_requisition' | 'reject_requisition' |
          'view_sales' | 'process_sale' | 'view_reports' | 'export_data' |
          'manage_suppliers' | 'view_returns' | 'process_returns';
  allowed: boolean;
}

// Sample data
export const categoriesData = [
  'Stationery', 'Textbooks', 'Uniforms', 'Sports Equipment', 
  'Cleaning Supplies', 'Food & Beverages', 'Electronics', 'Furniture',
  'Laboratory Equipment', 'Art Supplies', 'Medical Supplies'
];

export const inventoryData: InventoryItem[] = [
  {
    id: 'INV001',
    name: 'Exercise Books - 200 Pages',
    category: 'Stationery',
    description: 'A4 size exercise books with 200 pages',
    sku: 'EXB-200-A4',
    barcode: '1234567890123',
    currentStock: 450,
    minimumStock: 100,
    maximumStock: 1000,
    unitPrice: 150,
    costPrice: 120,
    unit: 'pieces',
    supplier: 'SUP001',
    location: 'Shelf A1',
    dateAdded: new Date('2024-01-15'),
    lastUpdated: new Date('2024-01-20'),
    isActive: true
  },
  {
    id: 'INV002',
    name: 'School Uniform - Blue Shirt',
    category: 'Uniforms',
    description: 'Official school uniform blue shirt, sizes available',
    sku: 'UNI-BSH-VAR',
    currentStock: 15,
    minimumStock: 25,
    maximumStock: 200,
    unitPrice: 800,
    costPrice: 600,
    unit: 'pieces',
    supplier: 'SUP002',
    location: 'Shelf B2',
    dateAdded: new Date('2024-01-10'),
    lastUpdated: new Date('2024-01-20'),
    isActive: true
  },
  {
    id: 'INV003',
    name: 'Mathematics Textbook - Grade 8',
    category: 'Textbooks',
    description: 'Official mathematics textbook for grade 8 students',
    sku: 'TXT-MTH-G8',
    currentStock: 85,
    minimumStock: 50,
    maximumStock: 300,
    unitPrice: 950,
    costPrice: 750,
    unit: 'pieces',
    supplier: 'SUP003',
    location: 'Shelf C1',
    dateAdded: new Date('2024-01-05'),
    lastUpdated: new Date('2024-01-18'),
    isActive: true
  },
  {
    id: 'INV004',
    name: 'Football',
    category: 'Sports Equipment',
    description: 'Professional football for school sports activities',
    sku: 'SPT-FTB-PRO',
    currentStock: 8,
    minimumStock: 10,
    maximumStock: 50,
    unitPrice: 2500,
    costPrice: 2000,
    unit: 'pieces',
    supplier: 'SUP004',
    location: 'Sports Store',
    dateAdded: new Date('2024-01-12'),
    lastUpdated: new Date('2024-01-19'),
    isActive: true
  },
  {
    id: 'INV005',
    name: 'Cleaning Detergent - 5L',
    category: 'Cleaning Supplies',
    description: 'Multi-purpose cleaning detergent 5 liter container',
    sku: 'CLN-DET-5L',
    currentStock: 12,
    minimumStock: 15,
    maximumStock: 100,
    unitPrice: 450,
    costPrice: 350,
    unit: 'pieces',
    supplier: 'SUP005',
    location: 'Storage Room',
    dateAdded: new Date('2024-01-08'),
    lastUpdated: new Date('2024-01-17'),
    isActive: true
  }
];

export const stockTransactionsData: StockTransaction[] = [
  {
    id: 'STX001',
    itemId: 'INV001',
    type: 'IN',
    quantity: 200,
    reason: 'Stock received from supplier',
    reference: 'INV-2024-001',
    performedBy: 'storekeeper1',
    timestamp: new Date('2024-01-20T09:00:00'),
    notes: 'New shipment received',
    costPerUnit: 120,
    totalCost: 24000
  },
  {
    id: 'STX002',
    itemId: 'INV001',
    type: 'OUT',
    quantity: 50,
    reason: 'Issued to Grade 7 students',
    reference: 'REQ-2024-001',
    performedBy: 'storekeeper1',
    timestamp: new Date('2024-01-20T14:30:00'),
    notes: 'Requisition approved by principal'
  },
  {
    id: 'STX003',
    itemId: 'INV002',
    type: 'OUT',
    quantity: 10,
    reason: 'Sale to parents',
    reference: 'SAL-2024-001',
    performedBy: 'storekeeper1',
    timestamp: new Date('2024-01-20T16:45:00')
  }
];

export const requisitionsData: Requisition[] = [
  {
    id: 'REQ001',
    requestedBy: 'teacher1',
    requestedByRole: 'teacher',
    requestedFor: 'Grade 7 Mathematics',
    items: [
      {
        itemId: 'INV001',
        itemName: 'Exercise Books - 200 Pages',
        requestedQuantity: 50,
        approvedQuantity: 50,
        issuedQuantity: 50,
        unitPrice: 150,
        totalCost: 7500,
        status: 'issued'
      }
    ],
    status: 'completed',
    priority: 'medium',
    requestDate: new Date('2024-01-18'),
    approvedBy: 'principal1',
    approvedDate: new Date('2024-01-19'),
    issuedBy: 'storekeeper1',
    issuedDate: new Date('2024-01-20'),
    totalEstimatedCost: 7500
  },
  {
    id: 'REQ002',
    requestedBy: 'teacher2',
    requestedByRole: 'teacher',
    requestedFor: 'Grade 8 Science Lab',
    items: [
      {
        itemId: 'INV004',
        itemName: 'Football',
        requestedQuantity: 2,
        unitPrice: 2500,
        totalCost: 5000,
        status: 'pending'
      }
    ],
    status: 'pending',
    priority: 'low',
    requestDate: new Date('2024-01-21'),
    totalEstimatedCost: 5000
  }
];

export const suppliersData: Supplier[] = [
  {
    id: 'SUP001',
    name: 'Stationery Plus Ltd',
    contactPerson: 'John Kamau',
    phone: '+254712345678',
    email: 'john@stationeryplus.com',
    address: 'Nairobi, Kenya',
    category: ['Stationery', 'Art Supplies'],
    paymentTerms: '30 days',
    isActive: true,
    rating: 4.5,
    lastOrderDate: new Date('2024-01-15'),
    totalOrders: 25,
    totalValue: 450000
  },
  {
    id: 'SUP002',
    name: 'School Uniforms Kenya',
    contactPerson: 'Mary Wanjiku',
    phone: '+254723456789',
    email: 'mary@uniformskenya.com',
    address: 'Mombasa, Kenya',
    category: ['Uniforms'],
    paymentTerms: '15 days',
    isActive: true,
    rating: 4.2,
    lastOrderDate: new Date('2024-01-10'),
    totalOrders: 15,
    totalValue: 320000
  },
  {
    id: 'SUP003',
    name: 'Educational Books Publishers',
    contactPerson: 'Peter Mbugua',
    phone: '+254734567890',
    email: 'peter@edubooks.com',
    address: 'Kisumu, Kenya',
    category: ['Textbooks'],
    paymentTerms: '45 days',
    isActive: true,
    rating: 4.8,
    lastOrderDate: new Date('2024-01-05'),
    totalOrders: 12,
    totalValue: 680000
  }
];

export const salesData: Sale[] = [
  {
    id: 'SAL001',
    items: [
      {
        itemId: 'INV002',
        itemName: 'School Uniform - Blue Shirt',
        quantity: 2,
        unitPrice: 800,
        totalPrice: 1600
      }
    ],
    customerName: 'Grace Muthoni',
    customerType: 'parent',
    totalAmount: 1600,
    paymentMethod: 'mpesa',
    salesPerson: 'storekeeper1',
    timestamp: new Date('2024-01-20T16:45:00'),
    receiptNumber: 'RCP-2024-001',
    notes: 'Parent purchase for student uniform'
  },
  {
    id: 'SAL002',
    items: [
      {
        itemId: 'INV001',
        itemName: 'Exercise Books - 200 Pages',
        quantity: 10,
        unitPrice: 150,
        totalPrice: 1500
      }
    ],
    customerName: 'James Kiprotich',
    customerType: 'teacher',
    totalAmount: 1500,
    paymentMethod: 'cash',
    salesPerson: 'storekeeper1',
    timestamp: new Date('2024-01-21T10:30:00'),
    receiptNumber: 'RCP-2024-002',
    notes: 'Teacher purchase for class materials'
  }
];

export const returnsData: StockReturn[] = [
  {
    id: 'RET001',
    itemId: 'INV003',
    itemName: 'Mathematics Textbook - Grade 8',
    quantity: 2,
    reason: 'Wrong edition delivered',
    condition: 'wrong_item',
    returnedBy: 'teacher1',
    returnDate: new Date('2024-01-19'),
    status: 'approved',
    notes: 'Need current edition textbooks'
  }
];

// Role-based permissions
export const storeRoles: StoreUserRole[] = [
  {
    userId: 'storekeeper1',
    role: 'storekeeper',
    permissions: [
      { action: 'view_inventory', allowed: true },
      { action: 'add_item', allowed: true },
      { action: 'edit_item', allowed: true },
      { action: 'delete_item', allowed: false },
      { action: 'view_stock', allowed: true },
      { action: 'receive_stock', allowed: true },
      { action: 'issue_stock', allowed: true },
      { action: 'adjust_stock', allowed: true },
      { action: 'create_requisition', allowed: true },
      { action: 'approve_requisition', allowed: false },
      { action: 'reject_requisition', allowed: false },
      { action: 'view_sales', allowed: true },
      { action: 'process_sale', allowed: true },
      { action: 'view_reports', allowed: true },
      { action: 'export_data', allowed: true },
      { action: 'manage_suppliers', allowed: true },
      { action: 'view_returns', allowed: true },
      { action: 'process_returns', allowed: true }
    ]
  },
  {
    userId: 'teacher1',
    role: 'teacher',
    permissions: [
      { action: 'view_inventory', allowed: true },
      { action: 'add_item', allowed: false },
      { action: 'edit_item', allowed: false },
      { action: 'delete_item', allowed: false },
      { action: 'view_stock', allowed: true },
      { action: 'receive_stock', allowed: false },
      { action: 'issue_stock', allowed: false },
      { action: 'adjust_stock', allowed: false },
      { action: 'create_requisition', allowed: true },
      { action: 'approve_requisition', allowed: false },
      { action: 'reject_requisition', allowed: false },
      { action: 'view_sales', allowed: false },
      { action: 'process_sale', allowed: false },
      { action: 'view_reports', allowed: false },
      { action: 'export_data', allowed: false },
      { action: 'manage_suppliers', allowed: false },
      { action: 'view_returns', allowed: true },
      { action: 'process_returns', allowed: true }
    ]
  },
  {
    userId: 'principal1',
    role: 'principal',
    permissions: [
      { action: 'view_inventory', allowed: true },
      { action: 'add_item', allowed: true },
      { action: 'edit_item', allowed: true },
      { action: 'delete_item', allowed: true },
      { action: 'view_stock', allowed: true },
      { action: 'receive_stock', allowed: true },
      { action: 'issue_stock', allowed: true },
      { action: 'adjust_stock', allowed: true },
      { action: 'create_requisition', allowed: true },
      { action: 'approve_requisition', allowed: true },
      { action: 'reject_requisition', allowed: true },
      { action: 'view_sales', allowed: true },
      { action: 'process_sale', allowed: true },
      { action: 'view_reports', allowed: true },
      { action: 'export_data', allowed: true },
      { action: 'manage_suppliers', allowed: true },
      { action: 'view_returns', allowed: true },
      { action: 'process_returns', allowed: true }
    ]
  }
];

// Helper functions
export const getInventoryItems = (): InventoryItem[] => inventoryData;

export const getItemById = (id: string): InventoryItem | undefined => {
  return inventoryData.find(item => item.id === id);
};

export const getLowStockItems = (): InventoryItem[] => {
  return inventoryData.filter(item => item.currentStock <= item.minimumStock);
};

export const getItemsByCategory = (category: string): InventoryItem[] => {
  return inventoryData.filter(item => item.category === category);
};

export const getStockTransactions = (itemId?: string): StockTransaction[] => {
  return itemId 
    ? stockTransactionsData.filter(txn => txn.itemId === itemId)
    : stockTransactionsData;
};

export const getRequisitions = (status?: string): Requisition[] => {
  return status 
    ? requisitionsData.filter(req => req.status === status)
    : requisitionsData;
};

export const getRequisitionsByUser = (userId: string): Requisition[] => {
  return requisitionsData.filter(req => req.requestedBy === userId);
};

export const getSalesData = (fromDate?: Date, toDate?: Date): Sale[] => {
  if (!fromDate && !toDate) return salesData;
  
  return salesData.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    if (fromDate && saleDate < fromDate) return false;
    if (toDate && saleDate > toDate) return false;
    return true;
  });
};

export const getSuppliers = (): Supplier[] => suppliersData;

export const getSupplierById = (id: string): Supplier | undefined => {
  return suppliersData.find(supplier => supplier.id === id);
};

export const getReturns = (status?: string): StockReturn[] => {
  return status 
    ? returnsData.filter(ret => ret.status === status)
    : returnsData;
};

export const getUserPermissions = (userId: string): StorePermission[] => {
  const userRole = storeRoles.find(role => role.userId === userId);
  return userRole ? userRole.permissions : [];
};

export const hasPermission = (userId: string, action: string): boolean => {
  const permissions = getUserPermissions(userId);
  const permission = permissions.find(p => p.action === action);
  return permission ? permission.allowed : false;
};

export const getTotalInventoryValue = (): number => {
  return inventoryData.reduce((total, item) => 
    total + (item.currentStock * item.costPrice), 0);
};

export const getDailySales = (date: Date = new Date()): number => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return salesData
    .filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= startOfDay && saleDate <= endOfDay;
    })
    .reduce((total, sale) => total + sale.totalAmount, 0);
};

export const getCustomerCount = (date: Date = new Date()): number => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const uniqueCustomers = new Set();
  salesData
    .filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= startOfDay && saleDate <= endOfDay;
    })
    .forEach(sale => {
      if (sale.customerName) {
        uniqueCustomers.add(sale.customerName);
      }
    });
  
  return uniqueCustomers.size;
};

// Stock management functions
export const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'dateAdded' | 'lastUpdated'>): InventoryItem => {
  const newItem: InventoryItem = {
    ...item,
    id: `INV${String(inventoryData.length + 1).padStart(3, '0')}`,
    dateAdded: new Date(),
    lastUpdated: new Date()
  };
  inventoryData.push(newItem);
  return newItem;
};

export const updateInventoryItem = (id: string, updates: Partial<InventoryItem>): InventoryItem | null => {
  const index = inventoryData.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  inventoryData[index] = {
    ...inventoryData[index],
    ...updates,
    lastUpdated: new Date()
  };
  return inventoryData[index];
};

export const adjustStock = (itemId: string, quantity: number, reason: string, userId: string): boolean => {
  const item = getItemById(itemId);
  if (!item) return false;
  
  const newStock = item.currentStock + quantity;
  if (newStock < 0) return false;
  
  // Update stock
  updateInventoryItem(itemId, { currentStock: newStock });
  
  // Record transaction
  const transaction: StockTransaction = {
    id: `STX${String(stockTransactionsData.length + 1).padStart(3, '0')}`,
    itemId,
    type: quantity > 0 ? 'IN' : 'OUT',
    quantity: Math.abs(quantity),
    reason,
    performedBy: userId,
    timestamp: new Date(),
    notes: `Stock adjustment: ${reason}`
  };
  stockTransactionsData.push(transaction);
  
  return true;
};

export const createRequisition = (requisition: Omit<Requisition, 'id' | 'status' | 'requestDate'>): Requisition => {
  const newRequisition: Requisition = {
    ...requisition,
    id: `REQ${String(requisitionsData.length + 1).padStart(3, '0')}`,
    status: 'pending',
    requestDate: new Date()
  };
  requisitionsData.push(newRequisition);
  return newRequisition;
};

export const approveRequisition = (id: string, approverId: string, approvedItems: RequisitionItem[]): boolean => {
  const index = requisitionsData.findIndex(req => req.id === id);
  if (index === -1) return false;
  
  requisitionsData[index].status = 'approved';
  requisitionsData[index].approvedBy = approverId;
  requisitionsData[index].approvedDate = new Date();
  requisitionsData[index].items = approvedItems;
  
  return true;
};

export const processVoidRequisition = (id: string, reason: string): boolean => {
  const index = requisitionsData.findIndex(req => req.id === id);
  if (index === -1) return false;
  
  requisitionsData[index].status = 'rejected';
  requisitionsData[index].rejectionReason = reason;
  
  return true;
};

export const rejectRequisition = (id: string, rejectionReason: string): boolean => {
  const index = requisitionsData.findIndex(req => req.id === id);
  if (index === -1) return false;
  
  requisitionsData[index].status = 'rejected';
  requisitionsData[index].rejectionReason = rejectionReason;
  
  return true;
};

// Current user simulation (in a real app, this would come from authentication)
let currentUserId = 'storekeeper1'; // Default user for demo

export const setCurrentUser = (userId: string): void => {
  currentUserId = userId;
};

export const getCurrentUserId = (): string => {
  return currentUserId;
};

export const checkUserRole = (userId: string = currentUserId): string => {
  const userRole = storeRoles.find(role => role.userId === userId);
  return userRole ? userRole.role : 'guest';
};

export const getCurrentUserRole = (): string => {
  return checkUserRole(currentUserId);
};

// Recent activity interface
export interface RecentActivity {
  id: string;
  type: 'stock_in' | 'stock_out' | 'sale' | 'requisition' | 'return';
  description: string;
  timestamp: Date;
  user: string;
  amount?: number;
}

export const getRecentActivity = (limit: number = 10): RecentActivity[] => {
  const activities: RecentActivity[] = [];
  
  // Add stock transactions
  stockTransactionsData.forEach(txn => {
    const item = getItemById(txn.itemId);
    activities.push({
      id: txn.id,
      type: txn.type === 'IN' ? 'stock_in' : 'stock_out',
      description: `${txn.type === 'IN' ? 'Received' : 'Issued'} ${txn.quantity} ${item?.name || 'Unknown Item'}`,
      timestamp: txn.timestamp,
      user: txn.performedBy,
      amount: txn.totalCost
    });
  });
  
  // Add sales
  salesData.forEach(sale => {
    activities.push({
      id: sale.id,
      type: 'sale',
      description: `Sale to ${sale.customerName || 'Customer'} - ${sale.items.length} items`,
      timestamp: sale.timestamp,
      user: sale.salesPerson,
      amount: sale.totalAmount
    });
  });
  
  // Add requisitions
  requisitionsData.forEach(req => {
    activities.push({
      id: req.id,
      type: 'requisition',
      description: `Requisition ${req.status} for ${req.requestedFor}`,
      timestamp: req.requestDate,
      user: req.requestedBy,
      amount: req.totalEstimatedCost
    });
  });
  
  // Add returns
  returnsData.forEach(ret => {
    activities.push({
      id: ret.id,
      type: 'return',
      description: `Return: ${ret.quantity} ${ret.itemName} - ${ret.reason}`,
      timestamp: ret.returnDate,
      user: ret.returnedBy
    });
  });
  
  // Sort by timestamp (most recent first) and limit
  return activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};

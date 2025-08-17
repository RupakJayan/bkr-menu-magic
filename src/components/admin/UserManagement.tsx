import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Star
} from 'lucide-react';

interface UserManagementProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  joinDate: string;
  avatar?: string;
  department: string;
  permissions: string[];
  lastActive: string;
  rating: number;
}

const UserManagement: React.FC<UserManagementProps> = ({ language, isDark }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock users data
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockUsers: User[] = [
          {
            id: 1,
            name: 'Rajesh Kumar',
            email: 'rajesh@catering.com',
            phone: '+91 98765 43210',
            role: 'admin',
            status: 'active',
            joinDate: '2023-01-15',
            avatar: '/api/avatars/rajesh.jpg',
            department: 'Management',
            permissions: ['all'],
            lastActive: '2024-01-20 14:30',
            rating: 4.8
          },
          {
            id: 2,
            name: 'Priya Sharma',
            email: 'priya@catering.com',
            phone: '+91 87654 32109',
            role: 'manager',
            status: 'active',
            joinDate: '2023-03-20',
            avatar: '/api/avatars/priya.jpg',
            department: 'Operations',
            permissions: ['events', 'staff', 'reports'],
            lastActive: '2024-01-20 13:45',
            rating: 4.6
          },
          {
            id: 3,
            name: 'Arun Singh',
            email: 'arun@catering.com',
            phone: '+91 76543 21098',
            role: 'chef',
            status: 'active',
            joinDate: '2023-06-10',
            avatar: '/api/avatars/arun.jpg',
            department: 'Kitchen',
            permissions: ['menu', 'inventory'],
            lastActive: '2024-01-20 12:15',
            rating: 4.9
          },
          {
            id: 4,
            name: 'Meera Patel',
            email: 'meera@catering.com',
            phone: '+91 65432 10987',
            role: 'staff',
            status: 'inactive',
            joinDate: '2023-08-05',
            avatar: '/api/avatars/meera.jpg',
            department: 'Service',
            permissions: ['events'],
            lastActive: '2024-01-15 09:20',
            rating: 4.2
          }
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter and search users
  useEffect(() => {
    let filtered = users;

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'chef': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'staff': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return language === 'en' ? 'Administrator' : 'நிர்வாகி';
      case 'manager': return language === 'en' ? 'Manager' : 'மேலாளர்';
      case 'chef': return language === 'en' ? 'Chef' : 'சமையல்காரர்';
      case 'staff': return language === 'en' ? 'Staff' : 'ஊழியர்';
      default: return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return language === 'en' ? 'Active' : 'செயலில்';
      case 'inactive': return language === 'en' ? 'Inactive' : 'செயலற்ற';
      case 'pending': return language === 'en' ? 'Pending' : 'நிலுவையில்';
      default: return status;
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    // TODO: Implement user editing
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(language === 'en' ? 'Are you sure you want to delete this user?' : 'இந்த பயனரை நீக்க விரும்புகிறீர்களா?')) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  if (isLoading) {
    return (
      <Card className="card-chapa rounded-none shadow-subtle">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chapa-gold mx-auto mb-4"></div>
            <p className={isDark ? 'text-white/60' : 'text-chapa-medium-gray'}>
              {language === 'en' ? 'Loading users...' : 'பயனர்களை ஏற்றுகிறது...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-chapa rounded-none shadow-subtle">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-xl font-display font-semibold ${
              isDark ? 'text-white' : 'text-chapa-charcoal'
            }`}>
              {language === 'en' ? 'User Management' : 'பயனர் நிர்வாகம்'}
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="btn-chapa-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Filters' : 'வடிப்பான்கள்'}
              </Button>
              <Button 
                className="btn-chapa-primary"
                size="sm"
                onClick={() => setShowAddUser(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Add User' : 'பயனரைச் சேர்'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={language === 'en' ? 'Search users...' : 'பயனர்களைத் தேடுங்கள்...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-chapa-light-gray rounded-none">
                <div>
                  <label className={`text-sm font-medium mb-2 block ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {language === 'en' ? 'Role' : 'பங்கு'}
                  </label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'en' ? 'All Roles' : 'அனைத்து பங்குகளும்'}</SelectItem>
                      <SelectItem value="admin">{language === 'en' ? 'Administrator' : 'நிர்வாகி'}</SelectItem>
                      <SelectItem value="manager">{language === 'en' ? 'Manager' : 'மேலாளர்'}</SelectItem>
                      <SelectItem value="chef">{language === 'en' ? 'Chef' : 'சமையல்காரர்'}</SelectItem>
                      <SelectItem value="staff">{language === 'en' ? 'Staff' : 'ஊழியர்'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={`text-sm font-medium mb-2 block ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {language === 'en' ? 'Status' : 'நிலை'}
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'en' ? 'All Statuses' : 'அனைத்து நிலைகளும்'}</SelectItem>
                      <SelectItem value="active">{language === 'en' ? 'Active' : 'செயலில்'}</SelectItem>
                      <SelectItem value="inactive">{language === 'en' ? 'Inactive' : 'செயலற்ற'}</SelectItem>
                      <SelectItem value="pending">{language === 'en' ? 'Pending' : 'நிலுவையில்'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    {language === 'en' ? 'Clear Filters' : 'வடிப்பான்களை அழி'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Users Table */}
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'User' : 'பயனர்'}
                    </TableHead>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Contact' : 'தொடர்பு'}
                    </TableHead>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Role & Status' : 'பங்கு & நிலை'}
                    </TableHead>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Department' : 'துறை'}
                    </TableHead>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Performance' : 'செயல்திறன்'}
                    </TableHead>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Actions' : 'செயல்கள்'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-chapa-light-gray">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className={`font-medium ${
                              isDark ? 'text-white' : 'text-chapa-charcoal'
                            }`}>
                              {user.name}
                            </div>
                            <div className={`text-sm ${
                              isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                            }`}>
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`text-sm ${
                          isDark ? 'text-white/80' : 'text-chapa-charcoal'
                        }`}>
                          <div className="flex items-center space-x-1 mb-1">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                            {getStatusLabel(user.status)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`text-sm ${
                          isDark ? 'text-white/80' : 'text-chapa-charcoal'
                        }`}>
                          {user.department}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className={`text-sm ${
                              isDark ? 'text-white/80' : 'text-chapa-charcoal'
                            }`}>
                              {user.rating}/5.0
                            </span>
                          </div>
                          <div className={`text-xs ${
                            isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                          }`}>
                            {language === 'en' ? 'Joined' : 'சேர்ந்தது'}: {user.joinDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-chapa-medium-gray" />
              <h3 className={`text-lg font-display font-medium mb-2 ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {language === 'en' ? 'No users found' : 'பயனர்கள் எதுவும் கிடைக்கவில்லை'}
              </h3>
              <p className={`font-body ${
                isDark ? 'text-white/60' : 'text-chapa-medium-gray'
              }`}>
                {language === 'en' 
                  ? 'Try adjusting your search or filters'
                  : 'உங்கள் தேடல் அல்லது வடிப்பான்களை சரிசெய்ய முயற்சிக்கவும்'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
              {language === 'en' ? 'User Details' : 'பயனர் விவரங்கள்'}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-center space-x-4 p-4 bg-chapa-light-gray rounded-none">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="bg-chapa-light-gray text-lg">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className={`text-xl font-display font-semibold ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {selectedUser.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getRoleColor(selectedUser.role)}>
                      {getRoleLabel(selectedUser.role)}
                    </Badge>
                    <Badge className={getStatusColor(selectedUser.status)}>
                      {getStatusLabel(selectedUser.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Email' : 'மின்னஞ்சல்'}
                  </Label>
                  <div className={`p-2 bg-chapa-light-gray rounded-none ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {selectedUser.email}
                  </div>
                </div>
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Phone' : 'தொலைபேசி'}
                  </Label>
                  <div className={`p-2 bg-chapa-light-gray rounded-none ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {selectedUser.phone}
                  </div>
                </div>
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Department' : 'துறை'}
                  </Label>
                  <div className={`p-2 bg-chapa-light-gray rounded-none ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {selectedUser.department}
                  </div>
                </div>
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Join Date' : 'சேர்ந்த தேதி'}
                  </Label>
                  <div className={`p-2 bg-chapa-light-gray rounded-none ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {selectedUser.joinDate}
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Permissions' : 'அனுமதிகள்'}
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUser.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div>
                <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Performance Rating' : 'செயல்திறன் மதிப்பீடு'}
                </Label>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(selectedUser.rating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {selectedUser.rating}/5.0
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
              {language === 'en' ? 'Add New User' : 'புதிய பயனரைச் சேர்'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Full Name' : 'முழு பெயர்'}
                </Label>
                <Input id="name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Email' : 'மின்னஞ்சல்'}
                </Label>
                <Input id="email" type="email" className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Phone' : 'தொலைபேசி'}
                </Label>
                <Input id="phone" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="role" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Role' : 'பங்கு'}
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={language === 'en' ? 'Select role' : 'பங்கைத் தேர்ந்தெடுக்கவும்'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{language === 'en' ? 'Administrator' : 'நிர்வாகி'}</SelectItem>
                    <SelectItem value="manager">{language === 'en' ? 'Manager' : 'மேலாளர்'}</SelectItem>
                    <SelectItem value="chef">{language === 'en' ? 'Chef' : 'சமையல்காரர்'}</SelectItem>
                    <SelectItem value="staff">{language === 'en' ? 'Staff' : 'ஊழியர்'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="department" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                {language === 'en' ? 'Department' : 'துறை'}
              </Label>
              <Input id="department" className="mt-1" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                {language === 'en' ? 'Cancel' : 'ரத்து'}
              </Button>
              <Button className="btn-chapa-primary">
                {language === 'en' ? 'Add User' : 'பயனரைச் சேர்'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;

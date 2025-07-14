import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Edit,
  Eye
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data
const suppliers = [
  {
    id: 1,
    name: "ABC Manufacturing Corp",
    email: "contact@abcmfg.com",
    phone: "+1-555-0101",
    risk: 25,
    performance: 92,
    status: "Active"
  },
  {
    id: 2,
    name: "Global Supplies Ltd",
    email: "info@globalsupplies.com",
    phone: "+1-555-0102",
    risk: 85,
    performance: 67,
    status: "Under Review"
  },
  {
    id: 3,
    name: "Premium Parts Inc",
    email: "sales@premiumparts.com",
    phone: "+1-555-0103",
    risk: 15,
    performance: 95,
    status: "Active"
  },
  {
    id: 4,
    name: "Quality Components Co",
    email: "orders@qualitycomp.com",
    phone: "+1-555-0104",
    risk: 45,
    performance: 78,
    status: "Active"
  }
]

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("")

  const getRiskBadge = (risk: number) => {
    if (risk >= 80) return { variant: "destructive" as const, label: "High Risk" }
    if (risk >= 50) return { variant: "secondary" as const, label: "Medium Risk" }
    return { variant: "default" as const, label: "Low Risk" }
  }

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 90) return { variant: "default" as const, label: "Excellent", icon: CheckCircle }
    if (performance >= 70) return { variant: "secondary" as const, label: "Good", icon: CheckCircle }
    return { variant: "destructive" as const, label: "Poor", icon: AlertTriangle }
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supplier Management</h1>
          <p className="text-muted-foreground">Manage your supplier relationships and evaluations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">124</div>
            <p className="text-sm text-muted-foreground">Total Suppliers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">98</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-sm text-muted-foreground">High Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">87%</div>
            <p className="text-sm text-muted-foreground">Avg Performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Suppliers</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => {
                const riskBadge = getRiskBadge(supplier.risk)
                const performanceBadge = getPerformanceBadge(supplier.performance)
                
                return (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {supplier.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{supplier.email}</div>
                        <div className="text-sm text-muted-foreground">{supplier.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={riskBadge.variant}>
                          {riskBadge.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">({supplier.risk}%)</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={performanceBadge.variant}>
                          <performanceBadge.icon className="h-3 w-3 mr-1" />
                          {performanceBadge.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{supplier.performance}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.status === "Active" ? "default" : "secondary"}>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            View History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}